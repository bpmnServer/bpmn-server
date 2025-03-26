import { Item ,Execution,Token} from ".";
import { IScriptHandler } from "../interfaces";
import { spawn } from 'child_process';

    
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
    async evaluateExpression(scope: Item|Token, expression) {

        let script=expression;
        let result;
		let ret;

        if (!expression)
            return;
        if ((expression.startsWith('$')))
            script=expression.substring(1);

        try {
            var js = ScriptHandler.getJSvars(scope) + `
                return (${script});`;

            result = await Function(js).bind(scope)();
			
			
			if (result instanceof Promise)
			{
				ret = await result;
			}
			else
				ret =result;
        }
        catch (exc) {
            console.log('error in script evaluation', js);
            console.log(exc);
            throw new Error(exc);
        }
        return ret;
    }
	// used to be called scopeJS
    async executeScript(scope: Item|Execution, script) {

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
            console.log('error in script execution', js);
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
            var js = ScriptHandler.getJSvars(scope) + `
                  ${script};`;
            result = await Function(js).bind(scope)();
			
			if (result instanceof Promise)
			{
				ret = await result;
				//console.log(result,ret);
			}
			else
				ret =result;
        }
        catch (exc) {
            console.log('error in script execution', js);
            console.log(exc);
            throw new Error(exc);            
        }		

		return ret;
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
