import { Logger } from '..';

const logger = new Logger({ toConsole: false });

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
class TreeBuilder {
    tokens;
    pos;
    rootNode;
    nodes;
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
        this.rootNode = this.newNode(EXPRESSION_TYPE.Root, null, tokens[0]);
        this.buildBrackets(this.rootNode);
        this.BuildOperators('and');
        this.BuildOperators('or');
        this.BuildOperators('not');
    }
    newNode(type: EXPRESSION_TYPE, parent, token: Token) {

    }
    /* check for brackets
        * before: 
        * 
        *   t1
        *   t2
        *   (
        *   t3
        *   t4
        *   (
        *   t5
        *   t6
        *   )
        *   )
        * after:
        *
        *   t1
        *   t2
        *   (
        *       t3
        *       t4
        *       (
        *           t5
        *           t6
        *
        * 
        *   operand1
            * op
            * operand2
            * after: op
                * operand1
                * operand2
    */
    buildBrackets(parent, fromBracket = false) {
        while (this.pos < this.tokens.length - 1) {
            let token = this.tokens[this.pos];
            let type;
            let newNode;
            if (token.entry == '{') {    // start bracket
                newNode = this.newNode(type, parent, token);
                this.buildBrackets(newNode, true);

            }
            else if (token.entry == '}') { // end bracket
                return;
            }
            else {
                this.newNode(type, parent, token);

            }
            this.pos++;
        }
    }
    /**
     * check for operators and move 
     * before:   operand1
     *           op  
     *           operand2
     * after:    op
     *              operand1
     *              operand2
     * */
    BuildOperators(operator) {
        let i = 0;
        this.nodes.forEach(node => {
            if (node.type == EXPRESSION_TYPE.Operator && node.value == operator) {
                const opr1 = this.nodes[i - 1];
                const opr2 = this.nodes[i - 1];
                opr1.move(node);
                opr2.move(node);
            }
            i++;
        });
    }
}

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
    bracketEndToken;
    isOperator() {
        return (this.group == 'symbol' && OPERATORS.includes(this.entry));
    }
    isLiteral() {

    }
}
class TreeNode {
    parent;
    children;
    constructor(parent) {
        this.parent = parent;
    }
    addChild(node) {
        this.children.push(node);
    }
    root() {
        if (this.parent)
            return this.parent.root();
        else
            return this;
    }
    first(withinParent = false) {
    }
    next(withinParent=false) {
    }
    previous(withinParent = false) {

    }
    move(newParent) {
        const oldParent = this.parent;
        if (oldParent)
            removeFromArray(this.parent.children, this);
        newParent.children.push(this);
        this.parent = newParent;

        return oldParent;
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


function removeFromArray(array, item) {
    const index = array.indexOf(item, 0);
    if (index > -1) {
        array.splice(index, 1);
    }
}

export class Expression {
    type: EXPRESSION_TYPE;
    value;
    parent;
    children;
    result;

    constructor(type,parent,value) {
        this.type = type;
        this.parent = parent;
        this.value = value;
        if (parent)
            parent.children.push(this);

        this.children = [];
    }
    getState() {
        const children=[];
        this.children.forEach(child => { children.push(child.getState());});
        return { type: this.type, value: this.value, children };
    }
    // move an expression to another parent
    move(newParent) {
        const oldParent = this.parent;
        if (oldParent)
            removeFromArray(this.parent.children, this);
        newParent.children.push(this);
        this.parent = newParent;

        return oldParent;

    }
    displayExpression(level = 0) {

        if (!Parser.debugExpression)
            return;

        const msg = level + '-'.repeat(level + 1) + ">" + this.type + " " + this.value + "   " + (this.result ? ':' + this.result : '');

        debug('expression', msg);

        this.children.forEach(child => {
            if (child.parent !== this)
                console.log("ERROR parent is wrong"+child.parent)
            child.displayExpression( level + 1);
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

    buildTree(tokens,parent=null) {

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

        ret = this.buildTreeOperators(tokens);
        if (ret) return ret;


        if (tokens[0].group == 'symbol' && tokens[0].entry == '(') {
            this.buildTreeBracket(tokens);
        }

        /* 1)   (2+3) * 4 
         * 
         * 2)   4 * (2+3)
         */
        let i;
        let childExpr;
        for (i = 0; i < tokens.length; i++) {
            let children = [];
            let token = tokens[i];

            let type;

            if (token.group == 'literal' || (!isNaN(token.entry))) {
                type = EXPRESSION_TYPE.Literal;

                childExpr = new Expression(type,this,token.entry);

            }
            else if (token.group == 'symbol' && !(token.isOperator())) {
                type = '';
                // ignore;
            }
            // brackets
            else {
                type = EXPRESSION_TYPE.Text;

                childExpr = new Expression(type,this,token.entry);

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
                let newExpr;
                /*
                 * 1)   2*4 
                 *      Operator    *
                 *      -Literal    2       left
                 *      -Literal    4       right
                 * 2)  expression * 5
                 * 
                 *      Operator    *
                 *      -expression         leftExpr
                 *      -Literal    4
                 * 
                 * 
                 */
                let left = tokens.slice(0, i);
                let right = tokens.slice(i + 1);

                let leftExpr;
                if (left.length > 0) {
                /*  given:      token * token
                 *  after
                 *  EX  parent
                 *  .EX newExpr *
                 *  ..EX    left
                 *  ..EX   right
                 *
                 *
                 */
                    newExpr = new Expression(EXPRESSION_TYPE.Operator, this, token.entry);
                    this.createChildFromTokens(EXPRESSION_TYPE.Group, '', left, newExpr);
                    this.createChildFromTokens(EXPRESSION_TYPE.Group, '', right, newExpr);
                }
                else {
                    /*  given:      EX * token
                     *  before  
                     *  EX  parent  <-- this
                     *  .EX leftExpr
                     *  
                     *  after
                     *  EX  parent  <--this
                     *  .newExpr *
                     *  ..EX leftExpr
                     *  ..EX rightExpr
                     *
                     */
                    // change parent of this to newExpr
                    const leftExpr = this.children[this.children.length - 1];
                    newExpr = new Expression(EXPRESSION_TYPE.Operator, this, token.entry);
                    const oldParent = leftExpr.move(newExpr);
                    newExpr.createChildFromTokens(EXPRESSION_TYPE.Group, '', right, newExpr);
                }
                return newExpr;

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

                let leftExpr = this;

                if (left.length > 0)
                    leftExpr = this.buildTree(left);

                // if functionCall(parameters)
                //  
                let parent = this;
                const prevExpr = this.children[this.children.length - 1];
                if (prevExpr && prevExpr.type == EXPRESSION_TYPE.Text)
                    parent = prevExpr;

                let childExpr = parent.createChildFromTokens(EXPRESSION_TYPE.Bracket, '', bracket, parent);

                parent.buildTree(right);

                return childExpr;

            }
        }
    }
    buildTreeBracket2(tokens) {

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

                let leftExpr = this;

                if (left.length > 0)
                    leftExpr = this.buildTree(left);

                // if functionCall(parameters)
                //  
                let parent = this;
                const prevExpr = this.children[this.children.length - 1];
                if (prevExpr && prevExpr.type == EXPRESSION_TYPE.Text)
                    parent = prevExpr;

                let childExpr= parent.createChildFromTokens(EXPRESSION_TYPE.Bracket, '', bracket, parent);

                parent.buildTree(right);

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

                const childExpr = new Expression(EXPRESSION_TYPE.Binary,this,token.entry);

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
            childExpr = new Expression(type,parent,value);

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

        const expr = new Expression(EXPRESSION_TYPE.Root, null, `<${string}>`);

        expr.buildTree(tokens);

        expr.displayExpression();

        return expr;

    }
    evaluateCondition(string, value) {

        console.log("procesing " + string + ' value:' + value)
        logger.log('');
        logger.log('');
        logger.log("procesing " + string + ' value:' + value)
        logger.log('--------------------------------------');

        const expr = this.compile(string);

        const executor = new Executor();
        const result = executor.evaluateCondition(expr, value);
        expr.displayExpression();
        logger.log('result:' + result);
        console.log('result:' + result);
        return result;

    }

    evaluate(string) {

        console.log("procesing " + string)
        logger.log('');
        logger.log('');
        logger.log("procesing " + string)
        logger.log('------------------------------------');


        const expr = this.compile(string);

        const executor = new Executor();
        const result=executor.evaluateCondition(expr,null,false);
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
      * 5.  -number should be one token     like -20
      * 6.  mark  
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
            //  5.  -number should be one token     like -20
            else if (prevEntry && sep.group == 'number' && prevEntry.entry == '-') {
                //   ignore , and merge next number to previous
                prevEntry.entry += sep.entry;
            }
            else {
                tokens.push(sep)

            }
            prevEntry = sep;
        }
        for (i = 0; i < tokens.length - 1; i++) {
            const token = tokens[i];
            if (token.group == 'symbol' && token.entry == '{') {
                let j;
                let bracketLevel = 0;
                for (j = i + 1; j < tokens.length; j++) {
                    if (tokens[j].entry == '(')
                        bracketLevel++;

                    if (tokens[j].entry == ')')
                        bracketLevel--;

                    if (bracketLevel == 0) {
                        token.bracketEndToken = j;
                        break;
                    }

                }

            }
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
        if (!expr) {
            console.log("ERROR");
            return null;

        }
        expr.children.forEach(child => {
            switch (child.type) {
                case EXPRESSION_TYPE.Group:
                    let res = this.getValues(child);
                    res.forEach(item => { values.push(item); });
                    break;
                case EXPRESSION_TYPE.Operator:
                case EXPRESSION_TYPE.Bracket:
                    val= this.evaluateCondition(child, null,false);
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


    evaluateCondition(expr:Expression, value, isCondition=true) {
        let ret;
        debug('execution','executing '+ expr.type +' '+expr.value);
        switch (expr.type) {
            case EXPRESSION_TYPE.Root:
            case EXPRESSION_TYPE.Group:
            case EXPRESSION_TYPE.Bracket:
                if (expr.children.length > 0) {
                    ret = this.evaluateCondition(expr.children[0], value,isCondition);
                    if (isCondition) {
                        if (typeof ret === "boolean") {
                        }
                        else {
                            ret = (ret == value);
                        } 
                    }
                }
                break;
            case EXPRESSION_TYPE.Binary:
                switch (expr.value) {
                    case 'or':
                        ret = (this.evaluateCondition(expr.children[0], value) || this.evaluateCondition(expr.children[1], value,isCondition));
                        break;
                    case 'and':
                        ret = (this.evaluateCondition(expr.children[0], value) && this.evaluateCondition(expr.children[1], value, isCondition));
                        break;
                    case 'not':
                        ret = !(this.evaluateCondition(expr.children[0], value));
                        break;
                }
                break;
            case EXPRESSION_TYPE.Literal:
                if (isCondition) {
                    debug('execution', "comparing " + expr.value + " to " + value);
                    return (expr.value == value);
                }
                else
                    return expr.value;
                break;
            case EXPRESSION_TYPE.Text:  // functions

                let params;
                let funct = expr.value;
                debug('execution', 'executing funct:' + funct);

                if (funct == '') {
                    console.log('No Function');
                    console.log(expr);
                }
                params = this.getParameterValues(expr);
                debug('execution', 'parameters');
                debug('execution', params);

                return ExecuteFunction(funct, params, value, isCondition);

                break;
            case EXPRESSION_TYPE.Operator:
                let values = this.getValues(expr);
                debug('execution', " Operator" + expr.value, values);

                return ExecuteOperator(expr.value, values, value, isCondition);
                break;

        }
        debug('execution', " executing " + expr.type, expr.value + " result: " + ret);
        expr.result = ret;
        return ret;
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
function ExecuteFunction(funct, params, value, isCondition) {
    switch (funct) {
        case 'in':
            if (params.indexOf(value) != -1)
                return true;
            else
                return false;

            break;
        case 'startsWith':
            return value.startsWith(params[0]);
            break;
        case 'between':
            return (value >= params[0] && value <= params[1]);
            break;
    }


}
function ExecuteOperator(operator, values, value, isCondition) {
    let ret;
    switch (operator) {
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
            console.log("*** Operator " + operator + " NOT SUPPORTED??");
            break;
    }

    return ret; 

}
function debug(type, title, obj = null) {

    logger.log(title);

    if (type == 'execution' && !Parser.debugExecution)
        return;
    if (type == 'tokens' && !Parser.debugTokens)
        return;

    console.log(title);
    if (obj)
    console.log(obj);
}
/*
var conditionFunctions = [{
    name: 'in',
    function: function (expr,leftValue) let params = expr.getParameterValues();
        if (params.indexOf(leftValue) != -1)
            return true;
        else
            return false;
    }
}];
*/
function testCond(expr, value, res) {

    const parser = new Parser();
    const ret = parser.evaluateCondition(expr, value);
    if (ret !== res) {
        Parser.debugExecution = true;
        Parser.debugExpression = true;
//        parser.evaluateCondition(expr, value);
        console.log("***Error -" + expr + " failed for " + value);
        logger.log("***Error -" + expr + " failed for " + value);
//        throw Error("Error -" + expr + " failed for " + value);

    }
    return;
}
function testExp(expr,  res) {

    const parser = new Parser();
    const ret = parser.evaluate(expr);
    if (ret !== res) {
        Parser.debugExecution = true;
        Parser.debugExpression = true;
        //        parser.evaluateCondition(expr, value);
        console.log("***Error -" + expr + " failed for " );
        logger.log("***Error -" + expr + " failed for " );
        //        throw Error("Error -" + expr + " failed for " + value);

    }
    return;
}
logger.log("starting");
testAll();
logger.save("./parser.log");

function testAll() {


Parser.debugTokens = false;
Parser.debugExpression = true;
Parser.debugExecution = false;

//  literals
    testExp(`(2 + 3) * 4`, 20);
    testExp(`4 * (2 + 3)`, 20);


    return;
    testExp(`2 + 3 * 4`, 14);
    testExp('"high"', 'high');
    testExp(`2+3`, 5);

    testCond("-20", '55', false);
    testCond("55", '55', true);
    
    testCond("High", 'High', true);

    testCond("High", 'Low', false);

    return;


testCond("> 200 or < 500", 20, true);
testCond("(> 200) or (< 500)", 20, true);
testCond("(in (abc,'xyz-abc')", 'abc', true);    //  not , in, 'abc', 'xyz-abc'
testCond("(in (abc,'xyz-abc') ) and startsWith('a')", 'abc', true);    //  not , in, 'abc', 'xyz-abc'

testCond("in (abc,'xyz-abc','another entry', 9)", "abc", true);

testCond("(2+3)", '5', true);    //  not , in, 'abc', 'xyz-abc'
testCond("2+3", '5', true);    //  not , in, 'abc', 'xyz-abc'
testCond("2*4", '8', true);    //  not , in, 'abc', 'xyz-abc'


testCond("(2+3)*4", '20', true);    //  not , in, 'abc', 'xyz-abc'

testCond("(in (abc,'xyz-abc') ) and startsWith('a')", 'abc', true);    //  not , in, 'abc', 'xyz-abc'
testCond("in (abc,'xyz-abc') and startsWith('a')", 'abc', true);    //  not , in, 'abc', 'xyz-abc'

testCond("75.25", '75', false);
//testCond("75.25", '75.25', true);    
testCond("2,075.25", '75', false);
testCond("2,075.25", '2075.25', true);
testCond("-20", '-20', true);

testCond(">=75", '75', true);
testCond("<=55", '55', true);
testCond("==55", '55', true);

testCond("2 + 3", '5', true);

testCond("> 200 or < 500", 20, true);

testCond("object.fun('test')", '75', true);
testCond("5 + object.fun('test')", '75', true);

testCond("in (abc,'xyz-abc','another entry')", "abc", true);
testCond("not in (abc,'xyz-abc') ", 'abc', true);
testCond("in (abc,'xyz-abc') and startsWith('a') ", 'abc', true);    //  not , in, 'abc', 'xyz-abc'
testCond("in (abc,'xyz-abc') and not startsWith('a') ", 'abc', false);    //  not , in, 'abc', 'xyz-abc'
testCond("in (abc,'xyz-abc') and startsWith('a')  and 3 ", 'abc', false);    //  not , in, 'abc', 'xyz-abc'
testCond("75", 'not 75', false);
testCond("'High'", 'High', true);
testCond("in (abc,'xyz-abc','another entry')", "abc", true);
testCond("between ( 95 , 2,500.0 )", 200, true);

}

