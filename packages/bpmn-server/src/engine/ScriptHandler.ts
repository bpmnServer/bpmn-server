import { Execution } from './Execution.js';
import { Item } from './Item.js';
import { Token } from './Token.js';
import type { IScriptHandler } from '../interfaces/engine.js';
import { expressionScript, scriptOf, templateParts, evaluateTemplate, isFeel, conditionScript, freeNames } from './Expressions.js';
import { evaluate as feelEvaluate } from 'feelin';
import { actorElements, actorsOf, BUILT_IN_ACTORS, feelView, itemView, instanceView } from './DecisionContext.js';
import { spawn } from 'child_process';
import vm from 'node:vm';

    
/** What scripts see already: a context can not replace these. */
const RESERVED = new Set(['data', 'item', 'instance', 'input', 'output', 'appDelegate', 'appServices', 'appUtils', 'this']);

/** A variable scripts see besides their own: its value, from a copy of the data (so it can not change the process's). */
export type ScriptContext = Record<string, (scope: { data: any }) => any>;

class ScriptHandler implements IScriptHandler{
    /** Variables scripts and expressions see besides their own, by name. The application sets it; models can not. */
    context: ScriptContext = {};

    constructor(options: { context?: ScriptContext } = {}) {
        for (const name of Object.keys(options.context ?? {}))
            if (RESERVED.has(name) || !/^[A-Za-z_$][\w$]*$/.test(name))
                throw new Error(`The script context can not have a variable named '${name}'`);
        this.context = options.context ?? {};
    }

    /**
     * The names every expression sees besides the scope's own (docs/design/expressions.md): `actors` (who did what in
     * the instance, in the item's branch; worked out when read) and `user` (the operation's, by name). An
     * application's script context of the same name is used instead. `materialized`: plain values, for the sandbox.
     */
    standardValues(scope, materialized = false): Record<string, any> {
        const execution = ScriptHandler.executionOf(scope);
        if (!execution) return {};
        const token = scope?.token ?? (Object.prototype.hasOwnProperty.call(scope, 'startNodeId') ? scope : undefined);
        const elements = actorElements(execution.definition);
        let computed: Record<string, any>;
        const compute = () => computed ??= actorsOf({ instance: execution.instance,
            items: typeof execution.getItems === 'function' ? execution.getItems() : undefined, elements, scope: token ? token.dataPath ?? '' : null });
        let actors: Record<string, any> = {};
        if (materialized) actors = { ...compute() };
        else for (const name of new Set([...BUILT_IN_ACTORS, ...elements.values()]))
            Object.defineProperty(actors, name, { get: () => compute()[name], enumerable: true });
        const standard = { actors, user: { userName: execution.userName ?? null } };
        for (const name of Object.keys(this.context)) delete standard[name];
        return standard;
    }

    private static reads = new Map<string, Set<string>>();
    /** The names a script reads without declaring them (Expressions.freeNames), remembered by its text. */
    static namesRead(body: string): Set<string> {
        let names = ScriptHandler.reads.get(body);
        if (!names) {
            try { names = new Set(freeNames(body)); } catch { names = new Set(); }
            if (ScriptHandler.reads.size > 500) ScriptHandler.reads.delete(ScriptHandler.reads.keys().next().value);
            ScriptHandler.reads.set(body, names);
        }
        return names;
    }

    /** The execution a scope (an item, a token, an execution) is of. */
    static executionOf(scope): any {
        if (!scope || typeof scope !== 'object') return undefined;
        if (Object.prototype.hasOwnProperty.call(scope, 'tokens')) return scope;
        return scope.token?.execution ?? scope.execution;
    }

    /** The context's values for a scope. */
    contextValues(scope): Record<string, any> {
        const names = Object.keys(this.context);
        if (!names.length) return {};
        const data = scope?.data ?? scope?.instance?.data ?? {};
        return Object.fromEntries(names.map(name => [name, this.context[name]({ data: structuredClone(data) })]));
    }

    /**
     * A sequence flow's condition, in the language it says: FEEL when it says so, any other is JavaScript. A ${...}
     * around it is a wrapper, whatever the language.
     */
    async evaluateCondition(scope: Item|Token, expression, language?: string, label = 'condition') {
        if (isFeel(language))
            return this.evaluateFeel(scope, expression);
        return this.evaluateExpression(scope, conditionScript(expression, language), label);
    }

    /**
     * A FEEL expression, with the names every expression sees (docs/design/expressions.md): the data's fields by name,
     * `data`, `this` and `item`, `instance`, `input`, `output`, `actors`, `user`, `appServices`. A call to an async
     * service, as the whole expression, is awaited.
     */
    async evaluateFeel(scope, expression) {
        const execution = ScriptHandler.executionOf(scope);
        const data = scope?.data ?? execution?.instance?.data ?? {};
        const item = scope?.token ? scope : undefined;
        const seen = itemView(item, data);
        const context = {
            ...data, data, input: item?.input ?? {}, output: item?.output ?? {}, this: seen, item: seen,
            instance: instanceView(execution?.instance), appServices: feelView(execution?.servicesProvider) ?? {},
            ...this.standardValues(scope), ...this.contextValues(scope),
        };
        let { value } = feelEvaluate(scriptOf(String(expression).trim()), context);
        if (value instanceof Promise) value = await value;
        return value === undefined ? null : value;
    }


    /**
	**	these expression are strings with $
    * scenarios:
    *       String          =>as is
    *       $javaScript     =>evaulated ($js, $(js) or ${js})
    *       a ${js} b       =>the text, each ${js} evaluated in its place
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

        if (expressionScript(exp) !== null) {
            val =await this.evaluateExpression(item, exp);
        }
        else {
            const text = templateParts(exp) ? await evaluateTemplate(this, item, exp) : exp;
            val = text.includes(",") ? text.split(",") : text;
        }

        if (dateFormat)
            val = new Date(val);

        return val;
        //console.log('----setAttVal', attr, exp, val);
    }
    // old name :scopeEval(scope, script) {
    /**
     * execute JavaScript expression , no need for $
     *  
     * @param scope 
     * @param expression 
     * @returns 
     */
    async evaluateExpression(scope: Item|Token, expression, label = 'expression') {

        let script=expression;
        let result;
		let ret;

        if (!expression)
            return;
        script=scriptOf(expression);       // $js, $(js) or ${js}; any other text is the script itself

        try {
            var js = `return (${script});`;

            result = await this.compiled(scope, js, label);
			
			
			if (result instanceof Promise)
			{
				ret = await result;
			}
			else
				ret =result;
        }
        catch (exc) {
            console.log('error in script evaluation', ScriptHandler.scriptName(scope, label), script);
            console.log(exc);
            throw exc instanceof Error ? exc : new Error(exc);   // the error itself: its stack names the model's script (bpmn:///...)
        }
        return ret;
    }
	// used to be called scopeJS
    async executeScript(scope: Item|Execution, script, label = 'script') {

        let result;
		let ret;

		/* old
        try {
            let result;
            var js = this.getJSvars(scope) + `
                  ${script};`;
				  
			const func=new AsyncFunction(js);
            result = await func.bind(scope)();
        }
        catch (exc) {
            console.log('error in script execution', ScriptHandler.scriptName(scope, label), script);
            console.log(exc);
        }
		
        return result;
		*/
        try {
            if (script.startsWith('$py'))
            {
                 result=await this.runPython(scope,script.substring(3));
                 console.log('python result:',result)
                return result;
            }
           script = script.replace('#','')    //remove symbol '#'
	    //require return
            var js = `${script};`;
            result = await this.compiled(scope, js, label);
			
			if (result instanceof Promise)
			{
				ret = await result;
				//console.log(result,ret);
			}
			else
				ret =result;
        }
        catch (exc) {
            console.log('error in script execution', ScriptHandler.scriptName(scope, label), script);
            console.log(exc);
            throw exc instanceof Error ? exc : new Error(exc);   // the error itself: its stack names the model's script (bpmn:///...)
        }		

		return ret;
    }
    /**
     * A model's script or expression as a function of its scope, named after where it is in the model
     * (bpmn:///<model>/<element>/<label>.js) and numbered from its own first line: a debugger lists it by that
     * name and stops at its breakpoints and at `debugger;`, and an error's stack says where it is.
     */
    static compile(scope, body: string, label: string, names: string[] = []): Function {
        const prelude = ScriptHandler.getJSvars(scope) + '\n';
        return vm.compileFunction(prelude + body, names, {
            filename: ScriptHandler.scriptName(scope, label),
            lineOffset: -(prelude.split('\n').length - 1),
        });
    }
    /** Runs a script, with the context's variables as its parameters. */
    private compiled(scope, body: string, label: string) {
        // the standard names a script reads without declaring them (a script's own `const user` stays its own)
        const reads = ScriptHandler.namesRead(body);
        const standard = Object.fromEntries(Object.entries(this.standardValues(scope)).filter(([name]) => reads.has(name)));
        const context = { ...standard, ...this.contextValues(scope) };
        return ScriptHandler.compile(scope, body, label, Object.keys(context)).call(scope, ...Object.values(context));
    }
    /** bpmn:///<model>/<element>/<label>.js: the element is the item's; a process's own scripts are under 'process'. */
    static scriptName(scope, label: string): string {
        const execution = scope?.token?.execution ?? scope?.execution ?? scope;
        const element = scope?.elementId ?? scope?.currentNode?.id ?? 'process';
        return 'bpmn:///' + [execution?.name ?? 'model', element, label].map(part => encodeURIComponent(String(part))).join('/') + '.js';
    }
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
            var data=this.instance.data;      // a process's own script: the instance's data, at the top
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
 
 async  runPython(item,code: string, input: any={}): Promise<any> {
  return new Promise((resolve, reject) => {
    
    const pythonCmd = process.env.PYTHON_CMD||'python';
    item.data['a']=3;
    item.data['b']=4;
    const pyCode=`
import sys, json
input = json.loads(sys.stdin.read())
data =${JSON.stringify(item.data)}
item =${JSON.stringify({id:item.id,name:item.name,elementId:item.elementId})}
result = data["a"] + data["b"]
print(json.dumps({ "sum": result }), flush=True)
${code.trim()}`;
    const python = spawn(pythonCmd, ['-c', pyCode]);

    let output = '';
    let error = '';

    // Handle stdout
    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    // Handle stderr
    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    // Handle close
    python.on('close', (code) => {
      if (code !== 0 || error) {
        reject(new Error(`Python error: ${error || 'Exit code ' + code}`));
      } else {
        try {
          const parsed = JSON.parse(output);
          resolve(parsed);
        } catch (e) {
          resolve(output.trim()); // fallback: plain string
        }
      }
    });

    // Send input if provided
    if (input !== undefined) {
      python.stdin.write(JSON.stringify(input));
      python.stdin.end();
    }
  });
}
}

export {ScriptHandler}
