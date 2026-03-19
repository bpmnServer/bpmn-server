import { Item ,Execution,Token} from ".";
import { IScriptHandler } from "../interfaces";
import { spawn } from 'child_process';
import * as vm from 'vm';

    
/**
 * Handles JavaScript and Python script execution within BPMN processes.
 *
 * Provides expression evaluation (with $ prefix), input expression parsing
 * (strings, CSV arrays, dates), and full script execution with scope-appropriate
 * variable bindings.
 */
class ScriptHandler implements IScriptHandler{


    /**
	**	these expression are strings with $
    * scenarios:
    *       String          =>as is
    *       $javaScript     =>evaulated
    *       a , b , c       =>array
    *       dateString      =>convert to date
    * Examples:
    *         ['T', `user1`],
        ['T', `$(appServices.test1(100))`],
        ['T', `$(appServices.getSupervisorUser('user1'))`],
        ['T', `abc,xyz,user group`],
        ['TD', `2022-10-11`],
	**	
    * 
    *     appDelegate.scopeEval -->evaluateExpression
    *     appDelegate.scopeJS   -->executeScript
    *     
	*/
    async evaluateInputExpression(item, exp, dateFormat = false) {

        if (!exp)
            return;
        var val;
        
        if (exp.startsWith('$')) {
            val =await this.evaluateExpression(item, exp);
        }
        else if (exp.includes(",")) {
            const arr = exp.split(",");
            val = arr;
        }
        else
            val = exp;

        if (dateFormat)
            val = new Date(val);

        return val;
    }
    // old name :scopeEval(scope, script) {
    /**
     * execute JavaScript expression , no need for $
     *  
     * @param scope 
     * @param expression 
     * @returns 
     */
    async evaluateExpression(scope: Item|Token, expression) {

        let script=expression;

        if (!expression)
            return;
        if ((expression.startsWith('$')))
            script=expression.substring(1);

        try {
            const sandbox = ScriptHandler.buildSandbox(scope);
            const context = vm.createContext(sandbox);
            let result = vm.runInContext(script, context, {
                timeout: ScriptHandler.SCRIPT_TIMEOUT_MS,
            });

            if (result instanceof Promise) {
                result = await result;
            }
            return result;
        }
        catch (exc) {
            console.log('error in script evaluation', script);
            console.log(exc);
            throw new Error(exc);
        }
    }
    /**
     * Executes a full JavaScript (or Python with $py prefix) script in the given scope.
     *
     * @param scope		the Item or Execution to bind as `this`
     * @param script	the script body to execute
     */
    async executeScript(scope: Item|Execution, script) {

        try {
            if (script.startsWith('$py'))
            {
                const result = await this.runPython(scope, script.substring(3));
                return result;
            }
            script = script.replace('#','')    //remove symbol '#'

            const sandbox = ScriptHandler.buildSandbox(scope);
            const context = vm.createContext(sandbox);
            let result = vm.runInContext(script, context, {
                timeout: ScriptHandler.SCRIPT_TIMEOUT_MS,
            });

            if (result instanceof Promise) {
                result = await result;
            }
            return result;
        }
        catch (exc) {
            console.log('error in script execution', script);
            console.log(exc);
            throw new Error(exc);
        }
    }
    /**
     * Generates JavaScript variable declarations appropriate for the scope type.
     *
     * - Token scope: exposes data, instance, input, output, appDelegate, appServices, item
     * - Execution scope: exposes appDelegate, instance, appServices
     * - Item scope: exposes item, data, instance (via token.execution), appDelegate, appServices
     */
    static getJSvars(scope) {
        let isToken = scope.hasOwnProperty('startNodeId');
        let isExecution = scope.hasOwnProperty('tokens');

        if (isToken) {
            return `
            var data=this.data;
            var instance=this.execution.instance;
            var input=this.input;
            var output=this.output;
            var appDelegate=this.execution.appDelegate;
            var appServices=this.execution.servicesProvider;
            var appUtils=appDelegate.appUtils;
            var item=this;  // for backward support only
            `;

        }
        else if (isExecution) {
            return `
            var appDelegate=this.appDelegate;
            var instance=this.instance;
            var appServices=this.servicesProvider;
            var appUtils=appDelegate.appUtils;
            `;

        }
        else {
            return `
            var item=this;
            var data=this.data;
            var instance=this.token.execution.instance;
            var input=this.input;
            var output=this.output;
            var appDelegate=this.token.execution.appDelegate;
            var appServices=this.token.execution.servicesProvider;
            var appUtils=appDelegate.appUtils;
            `;

        }
    }
    /**
     * Builds a restricted VM context from the scope, exposing only the
     * variables that BPMN scripts need — no require, process, or filesystem.
     */
    static buildSandbox(scope): Record<string, any> {
        let isToken = scope.hasOwnProperty('startNodeId');
        let isExecution = scope.hasOwnProperty('tokens');

        const sandbox: Record<string, any> = {
            console: { log: console.log, warn: console.warn, error: console.error },
            JSON,
            Date,
            Math,
            parseInt,
            parseFloat,
            isNaN,
            isFinite,
            Promise,
        };

        if (isToken) {
            sandbox.data = scope.data;
            sandbox.instance = scope.execution?.instance;
            sandbox.input = scope.input;
            sandbox.output = scope.output;
            sandbox.appDelegate = scope.execution?.appDelegate;
            sandbox.appServices = scope.execution?.servicesProvider;
            sandbox.appUtils = scope.execution?.appDelegate?.appUtils;
            sandbox.item = scope;
        } else if (isExecution) {
            sandbox.appDelegate = scope.appDelegate;
            sandbox.instance = scope.instance;
            sandbox.appServices = scope.servicesProvider;
            sandbox.appUtils = scope.appDelegate?.appUtils;
        } else {
            sandbox.item = scope;
            sandbox.data = scope.data;
            sandbox.instance = scope.token?.execution?.instance;
            sandbox.input = scope.input;
            sandbox.output = scope.output;
            sandbox.appDelegate = scope.token?.execution?.appDelegate;
            sandbox.appServices = scope.token?.execution?.servicesProvider;
            sandbox.appUtils = scope.token?.execution?.appDelegate?.appUtils;
        }

        return sandbox;
    }

    static readonly SCRIPT_TIMEOUT_MS = parseInt(process.env.SCRIPT_TIMEOUT_MS || '5000', 10);

    /**
     * Spawns a Python subprocess to execute the given code.
     * Passes item data as JSON to the script and parses JSON output.
     *
     * @param item		the current item (provides data context)
     * @param code		Python code to execute
     * @param input		optional input data sent via stdin
     */
    static readonly PYTHON_TIMEOUT_MS = parseInt(process.env.PYTHON_TIMEOUT_MS || '10000', 10);

    async runPython(item, code: string, input: any = {}): Promise<any> {
        return new Promise((resolve, reject) => {

            const pythonCmd = process.env.PYTHON_CMD || 'python';

            // Safe bootstrap: data and item metadata are passed via stdin as JSON,
            // not interpolated into the Python source code.
            const pyCode = `
import sys, json
_stdin = json.loads(sys.stdin.read())
data = _stdin.get("data", {})
item = _stdin.get("item", {})
input = _stdin.get("input", {})
${code.trim()}`;

            const python = spawn(pythonCmd, ['-c', pyCode]);

            let output = '';
            let error = '';
            let killed = false;

            // Kill the process if it exceeds the timeout
            const timer = setTimeout(() => {
                killed = true;
                python.kill('SIGKILL');
            }, ScriptHandler.PYTHON_TIMEOUT_MS);

            python.stdout.on('data', (chunk) => {
                output += chunk.toString();
            });

            python.stderr.on('data', (chunk) => {
                error += chunk.toString();
            });

            python.on('close', (exitCode) => {
                clearTimeout(timer);
                if (killed) {
                    reject(new Error(`Python script timed out after ${ScriptHandler.PYTHON_TIMEOUT_MS}ms`));
                } else if (exitCode !== 0 || error) {
                    reject(new Error(`Python error: ${error || 'Exit code ' + exitCode}`));
                } else {
                    try {
                        const parsed = JSON.parse(output);
                        resolve(parsed);
                    } catch (e) {
                        resolve(output.trim());
                    }
                }
            });

            // Pass all data safely via stdin as JSON
            const stdinPayload = {
                data: item.data || {},
                item: { id: item.id, name: item.name, elementId: item.elementId },
                input: input,
            };
            python.stdin.write(JSON.stringify(stdinPayload));
            python.stdin.end();
        });
    }
}

export {ScriptHandler}
