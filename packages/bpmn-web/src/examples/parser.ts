
/*
 * 
 * class structure
 *  Parser is the main class
 *  
 *  rootExpression=parser.compile(script)
 *  
 *  result =parser.process(script)
 *
 *  Expression          compiles string into expression
 *  
 */

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
var REGEX = /([a-zA-Z\u0080-\u00FF\.]+)|([0-9\.]+)|(,|!|\?|\)|\(|\"|\'|<|=|>|\+|-|\*|\/)|(\s)/g;

var OPERATORS = `<>=!+-*/`;
//var REGEX = /([a-zA-Z\u0080-\u00FF\.]+)|([0-9\.]+)|(!|\?|<|=|>|\+|-|\*|\/)|(,|\)|\(|\"|\')|(\s)/g;

var groups = ['alpha', 'number', 'symbol', 'space'];
enum TOKEN_GROUP {
    alpha = 'alpha',
    number = 'number',
    symbol = 'symbol',
    space = 'space',
}

class Token {
    index;
    group;
    entry;
    isOperator() {
        return (this.group == 'symbol' && OPERATORS.includes(this.entry));

    }
    isLiteral() {

    }
}

enum EXPRESSION_TYPE {
    Root= 'Root',
    Single = 'Single',
    Literal = 'Literal', // Literal	(quoted)
    Text = 'Text',
    Binary = 'Binary',
    Operator = 'Operator',
    Bracket = 'Bracket',
    Group = 'Group',
    Token = ''
}
export class Expression {
    type: EXPRESSION_TYPE;
    value;
    _children;
    /**
     * convert tokens to sub expressions
     * 
     * @param type
     * @param tokens
     */
    get children() {
        return this._children;
    }
    constructor(type) {
        this.type = type;
        this._children = [];
    }

    displayExpression(expr, level = 0) {

        if (!Parser.debugExpression)
            return;
        console.log(level + '-'.repeat(level + 1) + ">" + expr.type+ " " + expr.value);

        expr.children.forEach(child => {
            this.displayExpression(child, level + 1);
        });
    }
    static calcTypeFromToken(token) {

        let type;
        if (token.group == 'literal' || (!isNaN(token.entry)))
            return EXPRESSION_TYPE.Literal;
        else if (token.group == 'symbol')
            return EXPRESSION_TYPE.Operator;

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
    buildTree(tokens) {

        let ret;
        // check if first and last () place them in a group
        if (tokens.length == 0)
            return null;

        ret = this.buildTreeBirnary('and', tokens);
        if (ret) return ret;
        ret = this.buildTreeBirnary('or', tokens);
        if (ret) return ret;
        ret = this.buildTreeBirnary('not', tokens);
        if (ret) return ret;

        ret = this.buildTreeBracket(tokens);
        if (ret) return ret;
        ret = this.buildTreeOperators(tokens);
        if (ret) return ret;


        let i;
        let childExpr;
        for (i = 0; i < tokens.length; i++) {
            let children = [];
            let token = tokens[i];

            let type;

            if (token.group == 'literal' || (!isNaN(token.entry))) {
                type = EXPRESSION_TYPE.Literal;

                childExpr = new Expression(type);
                childExpr.value = token.entry;
                this.children.push(childExpr);

            }
            else if (token.group == 'symbol' && !(token.isOperator())) {
                type = '';
                // ignore;
            }
            else {
                type = EXPRESSION_TYPE.Text;

                childExpr = new Expression(type);
                childExpr.value = token.entry;
                this.children.push(childExpr);
//                this.createChildFromToken(token);

            }
                
        }
        return childExpr;
    }
    buildTreeOperators(tokens) {

        let ret;

        let i;
        for (i = 0; i < tokens.length; i++) {
            let children = [];
            let token = tokens[i];
            if (token.isOperator()) {

                const childExpr = new Expression(EXPRESSION_TYPE.Operator);
                childExpr.value = token.entry;
                this.children.push(childExpr);

                let left = tokens.slice(0, i);
                let right = tokens.slice(i + 1);

                this.createChildFromTokens(EXPRESSION_TYPE.Group, '', left, childExpr);
                this.createChildFromTokens(EXPRESSION_TYPE.Group, '', right, childExpr);
                return childExpr;

            }
        }
        return null;
    }
    buildTreeBracket(tokens) {

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
                        break;
                    }

                }
                // find the matching (
                let left = tokens.slice(0, i);
                let bracket = tokens.slice(i + 1, matchingBracket)
                let right = tokens.slice(j + 1);

                let leftExpr=this;
                
                if (left.length > 0)
                    leftExpr= this.buildTree(left);

                const childExpr = new Expression(EXPRESSION_TYPE.Bracket);
                childExpr.value = token.entry;
                leftExpr.children.push(childExpr);

                let bracketExpr= childExpr.createChildFromTokens(EXPRESSION_TYPE.Group, '', bracket, childExpr);

                childExpr.buildTree(right);

/*                debug('bracket - left', leftExpr);
                debug('bracket - brk', bracket);
                debug('bracket - this', this);
                debug('bracket - child', childExpr);
                */
                return childExpr;

            }
        }
    }
    buildTreeBirnary(operator,tokens) {

        let i;
        for (i = 0; i < tokens.length; i++) {
            let children = [];
            let token = tokens[i];

            if (token.entry == operator) {

                const childExpr = new Expression(EXPRESSION_TYPE.Binary);
                childExpr.value = token.entry;
                this.children.push(childExpr);

                let left = tokens.slice(0, i);
                let right = tokens.slice(i + 1);

                this.createChildFromTokens(EXPRESSION_TYPE.Group, '', left, childExpr);
                this.createChildFromTokens(EXPRESSION_TYPE.Group, '', right, childExpr);
                return childExpr;
            }
        }

        return null;
    }
    createChildFromTokens(type, value, tokens, parent) {
        let childExpr = parent;
        if (tokens.length > 1) {
            childExpr = new Expression(type);
            childExpr.value = value;
            parent.children.push(childExpr);

        }
        childExpr.buildTree(tokens);

        return childExpr;

    }
}
export class Parser {
    static debugTokens = false;
    static debugExpression = false;
    static debugExecution = false;
    type = 'Condition';

    compile(string) {
        let tokens = Parser.tokenize(string);
        tokens = Parser.preParse(tokens);

        const expr = new Expression(EXPRESSION_TYPE.Root);

        expr.value = `<${string}>`;

        expr.buildTree(tokens);

        expr.displayExpression(expr);

        return expr;

    }
    evaluateCondition(string, value) {

        console.log("procesing " + string + ' value:' + value)

        const expr = this.compile(string);

        const executor = new Executor();
        const result = executor.evaluateCondition(expr, value);
        console.log('result:' + result);
        return result;

    }

    execute(string) {

        console.log("procesing " + string);

        const expr = this.compile(string);

        const executor = new Executor();
        const result=executor.execute(expr);
        console.log('result:' + result);
        return result;

    }
    static tokenize(string) {
        /*
        Advanced Regex explanation:
        [a-zA-Z\u0080-\u00FF] instead of \w     Supports some Unicode letters instead of ASCII letters only. Find Unicode ranges here https://apps.timwhitlock.info/js/regex
        
        (\.\.\.|\.|,|!|\?)                      Identify ellipsis (...) and points as separate entities
        
        You can improve it by adding ranges for special punctuation and so on
        */
        //var advancedRegex = /([a-zA-Z\u0080-\u00FF]+)|([0-9]+)|(\.\.\.|\.|,|!|\?|\)|\(|\"|\'|<|>|-)|(\s)/g;

        var REGEX = /([a-zA-Z\u0080-\u00FF\.]+)|([0-9\.]+)|(,|!|\?|\)|\(|\"|\'|<|=|>|\+|-|\*|\/)|(\s)/g;

//        var groups = ['alpha', 'number', 'symbol', 'space'];
        console.log(string);
        console.log("-------------------------------------");
        var result = null;
        var seps = [];
        do {
            result =REGEX.exec(string)
            if (result) {
                let msg = '@' + result.index + " ";
                let g = 0;
                result.forEach(entry => {
                    if (entry && g > 0) {
                        msg += ' g#:' + g + groups[g - 1] + " " + entry;
                        const token= new Token();
                        token.index = result.index;
                        token.group = groups[g - 1];
                        token.entry = entry;
                        //seps.push({ index: result.index, group: groups[g - 1], entry });
                        seps.push(token);
                        //console.log(msg);
                    }
                    g++;
                })

                //            console.log(msg);

            }
        } while (result != null)
        if (Parser.debugTokens)
            console.log(seps);
        return seps;
    }
    /**
      * 1.  handles quotes  '/"
      * 2.  handles commas in numbers
      * 3.  spaces
      * 4.  double operators    >=  <=  ==
      * 
      * @param seps
      */
    static preParse(seps) {
        let i;
        let quote = null;
        let tokens = [];
        let textEntry;
        let prevEntry;
        for (i = 0; i < seps.length; i++) {
            let sep = seps[i];

            if (quote) {
                if (sep.entry == quote) {
                    textEntry.group = 'literal';
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
            else if (prevEntry && sep.group == 'symbol' && (sep.entry == ',') && prevEntry.group == 'number') {
                //   ignore , and merge next number to previous
                sep = seps[++i];
                prevEntry.entry += sep.entry;
                sep.entry = prevEntry.entry;
            }
            else if (prevEntry && sep.group == 'symbol' && (sep.entry == '=') &&
                prevEntry.group == 'symbol' &&
                        (prevEntry.entry == '<' || prevEntry.entry == '>' || prevEntry.entry=='=' )) {
                //   ignore , and merge next number to previous
                prevEntry.entry += sep.entry;
            }
            else {
                tokens.push(sep)

            }
            prevEntry = sep;
        }
        //console.log(tokens);
        if (Parser.debugTokens) {
            console.log(' after cleaning..');
            console.log(tokens);
        }
        return tokens;
    }
}

export class Executor {
    execute(expr) {

    }
    /**
 * values from bracket (1,2,3)
 * 
 * */

    getParameterValues(expr) {
        const bracket = expr.children[0];
        return this.getValues(bracket);
    }
    /**
     * values could be children nodes or group
     * */
    getValues(expr) {
        const values = [];
        let val;
        expr.children.forEach(child => {
            switch (child.type) {
                case EXPRESSION_TYPE.Group:
                    let res = this.getValues(child);
                    res.forEach(item => { values.push(item); });
                    break;
                case EXPRESSION_TYPE.Operator:
                    val= this.evaluateCondition(expr, null);
                    if (!isNaN(val))
                        val = Number(val);
                    values.push(val);
                    
                    break;
                default:
                    val = child.value;
                    if (!isNaN(val))
                        val = Number(val);
                    values.push(val);
            }
        });

        return values;

    }


    evaluateCondition(expr:Expression, value) {
        let ret;
        debug('execution','executing '+ expr.type +' '+expr.value);
        switch (expr.type) {
            case EXPRESSION_TYPE.Root:
            case EXPRESSION_TYPE.Group:
            case EXPRESSION_TYPE.Bracket:
                if (expr.children.length > 0) {
                    ret = this.evaluateCondition(expr.children[0], value);
                    if (typeof ret === "boolean") {
                    }
                    else {
                        ret = (ret == value);
                    }
                }
                break;
            case EXPRESSION_TYPE.Binary:
                switch (expr.value) {
                    case 'or':
                        ret = (this.evaluateCondition(expr.children[0], value) || this.evaluateCondition(expr.children[1], value));
                        break;
                    case 'and':
                        ret = (this.evaluateCondition(expr.children[0], value) && this.evaluateCondition(expr.children[1], value));
                        break;
                    case 'not':
                        ret = !(this.evaluateCondition(expr.children[0], value));
                        break;
                }
                break;
            case EXPRESSION_TYPE.Literal:
                debug('execution', "comparing " + expr.value + " to " + value);
                return (expr.value == value);
                break;
            case EXPRESSION_TYPE.Text:  // functions

                let params;
                let funct = expr.value;
                debug('execution', 'executing funct:' + funct);

                if (funct == '') {
                    console.log('No Function');
                    console.log(expr);
                }
                switch (funct) {
                    case 'in':
                        params = this.getParameterValues(expr);
                        debug('execution','parameters');
                        debug('execution',params);
                        if (params.indexOf(value) != -1)
                            ret = true;
                        else
                            ret = false;

                        break;
                    case 'startsWith':
                        params = this.getParameterValues(expr);
                        debug('execution', 'parameters');
                        debug('execution', params);

                        ret = value.startsWith(params[0]);
                        break;
                    case 'between':
                        params = this.getParameterValues(expr);
                        debug('execution', 'parameters');
                        debug('execution', params);
                        ret = (value >= params[0] && value <= params[1]);
                        break;
                }
                break;
            case EXPRESSION_TYPE.Operator:
                let values = this.getValues(expr);
                debug('execution', " Operator" + expr.value, values);
                switch (expr.value) {
                    case '<':
                        ret = (value < values[0]);
                        break;
                    case '<=':
                        ret = (value <= values[0]);
                        break;
                    case '>':
                        ret = (value > values[0]);
                        break;
                    case '>=':
                        ret = (value >= values[0]);
                        break;
                    case '==':
                        ret = (value == values[0]);
                        break;
                    case '-':
                        ret = - values[0];
                        break;
                     case '+':
                        ret = values[0] + values[1];
                        break;
                    case '*':
                        ret = values[0] * values[1];
                        break;

                    default:
                        console.log("*** Operator " + expr.value + " NOT SUPPORTED??");
                        console.log(expr);
                        break;
                  }
                break;
            default:
                console.log("*** Type NOT supported" + expr.type);
                break;
        }
        debug('execution'," executing " + expr.type ,  expr.value + " result: " + ret);
        return ret;
    }
    executeAnd(expr1, expr2, value) {
        return (this.evaluateCondition(expr1, value) && this.evaluateCondition(expr2, value));
    }
    executeNot(expr1, value) {

        return !(this.evaluateCondition(expr1, value));
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

function debug(type, title, obj = null) {

    if (type == 'execution' && !Parser.debugExecution)
        return;
    if (type == 'tokens' && !Parser.debugTokens)
        return;

    console.log('debug:'+title);
    if (obj)
    console.log(obj);
}

var conditionFunctions = [{
    name: 'in',
    function: function (expr,leftValue) {
        let params = expr.getParameterValues();
        if (params.indexOf(leftValue) != -1)
            return true;
        else
            return false;
    }
}];

function testVal(expr, value, res) {

    const parser = new Parser();
    const ret = parser.evaluateCondition(expr, value);
    if (ret !== res) {
        Parser.debugExecution = true;
        Parser.debugExpression = true;
        parser.evaluateCondition(expr, value);
        console.log("Error -" + expr + " failed for " + value);
        throw Error("Error -" + expr + " failed for " + value);

    }
    return;
}



Parser.debugTokens = false;
Parser.debugExpression = true;
Parser.debugExecution = false;

//testVal("in (abc,'xyz-abc','another entry', 9)", "abc", true);

//testVal("(2+3)", '5', true);    //  not , in, 'abc', 'xyz-abc'
testVal("2*4", '8', true);    //  not , in, 'abc', 'xyz-abc'

testVal("(2+3)*4", '20', true);    //  not , in, 'abc', 'xyz-abc'
/*
testVal("(in (abc,'xyz-abc') ) and startsWith('a')", 'abc', true);    //  not , in, 'abc', 'xyz-abc'
testVal("in (abc,'xyz-abc') and startsWith('a')", 'abc', true);    //  not , in, 'abc', 'xyz-abc'

testVal("75.25", '75', false);
//testVal("75.25", '75.25', true);    
testVal("2,075.25", '75', false);
testVal("2,075.25", '2075.25', true);
testVal("-20", '55', false);
testVal("-20", '-20', true);

testVal(">=75", '75', true);
testVal("<=55", '55', true);
testVal("==55", '55', true);

testVal("2 + 3", '5', true);

testVal("> 200 or < 500", 20, true);

testVal("object.fun('test')", '75', true);
testVal("5 + object.fun('test')", '75', true);

testVal("in (abc,'xyz-abc','another entry')", "abc", true);
testVal("not in (abc,'xyz-abc') ", 'abc', true);
testVal("in (abc,'xyz-abc') and startsWith('a') ", 'abc', true);    //  not , in, 'abc', 'xyz-abc'
testVal("in (abc,'xyz-abc') and not startsWith('a') ", 'abc', false);    //  not , in, 'abc', 'xyz-abc'
testVal("in (abc,'xyz-abc') and startsWith('a')  and 3 ", 'abc', false);    //  not , in, 'abc', 'xyz-abc'
testVal("75", 'not 75', false);
testVal("'High'", 'High', true);
testVal("in (abc,'xyz-abc','another entry')", "abc", true);
testVal("between ( 95 , 2,500.0 )", 200, true);

*/