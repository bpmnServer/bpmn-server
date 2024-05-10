import { Item ,Execution,Token} from ".";

    
class ScriptHandler {


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
    static async evaluateInputExpression(item, exp, dateFormat = false) {

        if (!exp)
            return;
        var val;
        
        if (exp.startsWith('$')) {
            val =await ScriptHandler.evaluateExpression(item, exp);
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
    static evaluateExpression(scope: Item|Token, expression) {

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

            result = Function(js).bind(scope)();
			
			
			if (result instanceof Promise)
			{
				ret = result;
				//console.log(result,ret);
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
    static async executeScript(scope: Item|Execution, script) {

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
           script = script.replace('#','')    //remove symbol '#'
	    //require return
            var js = ScriptHandler.getJSvars(scope) + `
                  ${script};`;
            result = Function(js).bind(scope)();
			
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
            var appServices=this.servicesProvider;
            var appUtils=appDelegate.appUtils;
            `;

        }
        else {
            return `
            var item=this;
            var data=this.data;
            var input=this.input;
            var output=this.output;
            var appDelegate=this.token.execution.appDelegate;
            var appServices=this.token.execution.servicesProvider;
            var appUtils=appDelegate.appUtils;
            `;

        }

    }
}

export {ScriptHandler}
