/* Todo:
 * 
    expression
    result-expression
    handle result expressions:

    constant
        'high'
        500

    operations
        500 * 1.5

    variables
        salary * 1.5



*/


export class Parser {
    debugTokens = false;
    debugExpression = true;

    process(string,value,type='Condition') {

        console.log("procesing " +string + ' value:' + value)
        const expr = this.compile(string,type);
        const result=this.executeExpression(expr,value);
        console.log('result:' + result);
        return result;
        

    }
    compile(string,type) {
        let tokens = this.tokenize(string);
        tokens = this.preParse(tokens);

        const expr = this.breakExpressions(tokens,type);
        this.analyzeExpression(expr);

        return expr;

    }
    executeExpression(expr,value) {
        let ret;
        switch (expr.group) {
            case 'and-expression':
                ret=this.executeAnd(expr.children[0], expr.children[1],value);
                break;
            case 'or-expression':
                ret =this.executeOr(expr.children[0], expr.children[1],value);
                break;
            case 'not-expression':
                ret =this.executeNot(expr.children[0],value);
                break;
            default:
                {
                    let params;
                    let funct = expr.children[0].entry;
                    let tokens = expr.children;
                    if (tokens.length == 1) {
                        return (tokens[0].entry == value);
                    }
                    console.log('executing funct:' + funct);
                    if (funct == '')
                        console.log(expr);
                    switch (funct) {
                        case 'in':
                            break;
                        case 'startsWith':
                            break;
                        case 'between':
                            params = this.getParameters(tokens, 1);
                            console.log('parameters');
                            ret = (value >= params[0] && value <= params[1]);
                            break;
                        case '<':
                            ret = (value < tokens[1].entry);
                            console.log(ret,value,tokens[1].entry);
                            break;
                        case '>':
                            ret = (value > tokens[1].entry);
                            break;
                    }
                }
                break;
        }
        return ret;
    }
    executeAnd(expr1, expr2,value) {
        return (this.executeExpression(expr1,value) && this.executeExpression(expr2,value));
    }
    executeOr(expr1, expr2,value) {

        return (this.executeExpression(expr1, value) || this.executeExpression(expr2, value));
    }
    executeNot(expr1,value) {

        return !(this.executeExpression(expr1,value));
    }

    analyzeExpression(expr, level = 0) {

        if (expr.group.endsWith('expression'))
            console.log(level + '-'.repeat(level + 1) + ">" + expr.group + " " + expr.entry);

        if (expr.children) {
            expr.children.forEach(child => {
                this.analyzeExpression(child, level + 1);
            });
        }
    }
    /*
     * 
     * handles:
     *      and/or/not
     *      ()
     *      
     *      returns a single expression of types:
     *                  expression
     *                  and-expression
     *                  or-expression
     *                  not-expression
     *                  paran-expression        ()
     *                  value-expression        comma delimited
     *                  
     *     format:  x and y
     *          and-expression
     *              expression    x
     *              expression    y
     * todo:    
     *      format: x and ( y or z )
     *          and-expression
     *              expression    x
     *              bracket-expression
     *                  expression    y
     *                  expression    z
     *
     *      format: ( a,b,c)
     *          bracket-expression
     *              value-expression    a
     *              value-expression    b
     *              value-expression    c

     *      format: fun ( a,b,c)
     *          expression  fun
     *              bracket-expression
     *                  value-expression    a
     *                  value-expression    b
     *                  value-expression    c
     *
     *
     *      format: x + y
     *          operation-expression    +
     *              value-expression    x
     *              value-expression    y
     */
    breakExpressions(tokens,type) {

        let i;
        for (i = 0; i < tokens.length; i++) {
            let children = [];
            let token = tokens[i];

            if (token.entry == '(') {
                let bracketLevel = 1;
                let matchingBracket;
                /*  left - to process later ??
                 *  bracket-expression
                 *      child tokens
                 */
                let j;
                for (j = i + 1; j < tokens.length; j++) {
                    if (tokens[j].entry == '(')
                        bracketLevel++;
                        
                    if (tokens[j].entry == ')')
                        bracketLevel--;

                    if (bracketLevel == 0) {
                        matchingBracket = j;
                    }

                }
                // find the matching (
                let left = tokens.slice(0, i);
                let right = tokens.slice(i, j);

                children.push({ group: 'expression', entry: '', children: left });
                children.push(this.breakExpressions(right, type));
                token.children = children;
                token.group = 'bracket-expression';
                return token;

            }
            else if (token.entry == 'and') {
                let left = tokens.slice(0, i);
                let right = tokens.slice(i + 1);

                children.push({ group: 'expression', entry: '', children: left });
                children.push(this.breakExpressions(right,type));
                token.children = children;
                token.group = 'and-expression';
                return token;

            }
            else if (token.entry == 'or') {
                let left = tokens.slice(0, i);
                let right = tokens.slice(i + 1);

                children.push({ group: 'expression', entry: '', children: left });
                children.push(this.breakExpressions(right,type));
                token.children = children;
                token.group = 'or-expression';
                return token;

            }
            else if (token.entry == 'not') {
                let left = tokens.slice(0, i);
                let right = tokens.slice(i + 1);

                children.push(this.breakExpressions(right,type));
                token.children = children;
                token.group = 'not-expression';
                return token;
            }
        }
        return { group: 'expression', entry: '', children: tokens };
    }

    /*
     *  parameters are :    (p1,p2,p3)
     */
    getParameters(tokens, seq) {
        let i;
        let expectComma = false;
        let params = [];
        if (tokens[seq].entry !== '(') {

        }
        for (i = seq + 1; i < tokens.length; i++) {
            let token = tokens[i];
            if (token.entry == ')') {
                return params;
            }
            else if (expectComma && token.entry !== ',') {

            }
            else if (expectComma) {
                expectComma = false;
            }
            else {
                params.push(token.entry);
                expectComma = true;
            }
        }

        return null;

    }
    /**
      * 1.  handles quotes  '/"
      * 2.  handles commas in numbers
      * 3.  spaces
      * @param seps
      */
    preParse(seps) {
        let i;
        let quote = null;
        let tokens = [];
        let textEntry;
        let prevEntry;
        for (i = 0; i < seps.length; i++) {
            let sep = seps[i];

            if (quote) {
                if (sep.entry == quote) {
                    tokens.push(textEntry);
                    quote = null;
                    textEntry = null;
                }
                else {
                    if (textEntry)
                        textEntry.entry += sep.entry;
                    else
                        textEntry = sep;

                }
            }
            else if (sep.group == 'symbol' && (sep.entry == '\'' || sep.entry == '"')) {
                quote = sep.entry;
            }
            else if (sep.group == 'space') {
                ; // ignore
            }
            else if (sep.group == 'symbol' && (sep.entry == ',') && prevEntry.group == 'number') {
                //   ignore , and merge next number to previous
                sep = seps[++i];
                prevEntry.entry += sep.entry;
                sep.entry = prevEntry.entry;
            }
            else if (sep.group == 'symbol' && (sep.entry == '.') && prevEntry.group == 'number') {
                //   ignore , and merge next number to previous
                sep = seps[++i];
                prevEntry.entry += '.' + sep.entry;
                sep.entry = prevEntry.entry;
            }
            else {
                tokens.push(sep)

            }
            prevEntry = sep;
        }
        //console.log(tokens);
        return tokens;
    }
    tokenize(string) {
        /*
        Advanced Regex explanation:
        [a-zA-Z\u0080-\u00FF] instead of \w     Supports some Unicode letters instead of ASCII letters only. Find Unicode ranges here https://apps.timwhitlock.info/js/regex
        
        (\.\.\.|\.|,|!|\?)                      Identify ellipsis (...) and points as separate entities
        
        You can improve it by adding ranges for special punctuation and so on
        */
        var advancedRegex = /([a-zA-Z\u0080-\u00FF]+)|([0-9]+)|(\.\.\.|\.|,|!|\?|\)|\(|\"|\'|<|>|-)|(\s)/g;

        var groups = ['alpha', 'number', 'symbol', 'space'];
        console.log("------------------");
        console.log(string);
        console.log("------------------");
        var result = null;
        var seps = [];
        do {
            result = advancedRegex.exec(string)
            if (result) {
                let msg = '@' + result.index + " ";
                let g = 0;
                result.forEach(entry => {
                    if (entry && g > 0) {
                        msg += ' g#:' + g + groups[g - 1] + " " + entry;
                        seps.push({ index: result.index, group: groups[g - 1], entry });
                    }
                    g++;
                })

                //            console.log(msg);

            }
        } while (result != null)
        return seps;
    }
}
function test3() {
    /*
        Basic Regex explanation:
    /                   Regex start
        (\w +)               First group, words     \w means ASCII letter with \w + means 1 or more letters
            | or
                (,| !)               Second group, punctuation
                    | or
                        (\s)                Third group, white spaces
                            / Regex end
    g                   "global", enables looping over the string to capture one element at a time

    Regex result:
    result[0] : default group: any match
    result[1] : group1: words
    result[2] : group2: punctuation, !
        result[3] : group3: whitespace
            */
    var basicRegex = /(\w+)|(,|!)|(\s)/g;

    /*
    Advanced Regex explanation:
    [a-zA-Z\u0080-\u00FF] instead of \w     Supports some Unicode letters instead of ASCII letters only. Find Unicode ranges here https://apps.timwhitlock.info/js/regex
    
    (\.\.\.|\.|,|!|\?)                      Identify ellipsis (...) and points as separate entities
    
    You can improve it by adding ranges for special punctuation and so on
    */
    var advancedRegex = /([a-zA-Z\u0080-\u00FF]+)|(\.\.\.|\.|,|!|\?)|(\s)/g;

    var basicString = "Hello, this is a random message!";
    var advancedString = "Et en français ? Avec des caractères spéciaux ... With one point at the end.";

    console.log("------------------");
    var result = null;
    do {
        result = basicRegex.exec(basicString)
        console.log(result);
    } while (result != null)

    var result = null;
    do {
        result = advancedRegex.exec(advancedString)
        console.log(result);
    } while (result != null)

}

class DecisionTable {

    variables;
    rules;
    constructor(variables, rules) {

        this.variables = variables;
        this.rules = rules;

    }
    evaluateData(values) {

        var r = 0;
        this.rules.forEach(row => {
            var allTrue = true;
            var c;
            for (c = 0; c < this.variables.conditions.length; c++) {
                const varName = this.variables.conditions[c]['name'];
                const equation = row[c];
                const val = values[varName];
                console.log(">" + varName + " " + equation + ":" + val);
                if (!this.evaluate(varName, equation, values)) {
                    console.log('row ' + r + ' not true');
                    allTrue = false;
                    break;
                }

            }
            if (allTrue)
                console.log('row ' + r + ' all true');
            r++;
        });

    }
    evaluate(varName, expr, values) {


        if (!expr)
            return true;

        const code = "values." + varName + expr;

        console.log("   >>" + code);
        const ret = eval(code);
        console.log(ret);
        return ret;

    }
}


function testDT() {

const dtVars =
{
    conditions:
        [
            { name: 'clientType', type: 'string' },
            { name: 'onDeposit', type: 'money' },
            { name: 'netWorth', type: 'money' },
        ],
    actions:
        [
            { name: 'category', type: 'string' }
        ]
};

const dt = [
    //  clientType, OnDeposit, NetWorth,    -> category
    [`"Business"`, ` < 100000 `, `"High"`, `"High Value Business"`],
    [`"Business"`, ` >= 100000 `, ` !("High")`, `"High Value Business"`],
    [`"Business"`, ` < 100000 `, ` !("High")`, `Business Standard"`],
    [`"Private"`, ` >= 20000 `, ` "High"`, `"Personal Wealth Management"`],
    [`"Private"`, ` >= 20000 `, ` !("High")`, `"Personal Wealth Management"`],
    [`"Private"`, ` < 20000 `, `-`, `"Personal Standard"`],
];


    const values = { clientType: 'Business', onDeposit: 50000, netWorth: 'High' };


    const decisionTable = new DecisionTable(dtVars, dt);

    decisionTable.evaluateData(values);

}

/* Syntax:
  Strings:
  -------  quotes are optional if no space
           () are optional
   value:
         'value'
         value
         "value"
   condition:
         value                   means == value  
         in (val1,val2,val3)
         not in (val1,val2,val3)
         startsWith('abc')
         endsWith('abc')
         contains('abc')
   
   <condition> and <condition>
   <condition> or <condition>

  numbers:
    value:
        numeric value
        , are ignored
        $ is ignored
    >   value
    <   value
    <=
    >=
    between value1, value2
    between value1 and value2

symbols
    
 */

function testExpression(string,value) {

    const parser = new Parser();
    parser.process(string,value);
    return;

}

testVal("in (abc,'xyz-abc','another entry')", "abc" , true);    
/*testVal("< 500", 20 , true);    
testVal("> 200 or < 500", 20,true);  
testVal("75", '75',true);    
//testVal("not in (abc,'xyz-abc') ",'abc');
//testVal("in (abc,'xyz-abc') and startsWith('a') ",'abc');    //  not , in, 'abc', 'xyz-abc'
//testVal("in (abc,'xyz-abc') and not startsWith('a') ",'abc');    //  not , in, 'abc', 'xyz-abc'
//testVal("in (abc,'xyz-abc') and startsWith('a')  and 3 ",'abc');    //  not , in, 'abc', 'xyz-abc'
testVal("75", '75',true); 
testVal("75", 'not 75', false); 
testVal("'High'", 'High',true);    
testVal("in (abc,'xyz-abc','another entry')", "abc",true);    
testVal("between ( 95 , 2,500.0 )", 200,true);    
*/
function testVal(expr, value, res) {

    const parser = new Parser();
    const ret = parser.process(expr, value);
    if (ret !== res) {
        console.log("Error ");

    }
    return;
}