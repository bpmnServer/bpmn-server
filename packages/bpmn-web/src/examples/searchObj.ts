var objs = [{
    "item": "nuts", "quantity": 30,
    "carrier": { "name": "Shipit", "fee": 3 }
},
{
    "item": "bolts", "quantity": 50,
    "carrier": { "name": "Shipit", "fee": 4 }
},
{
    "item": "washers", "quantity": 10,
    "carrier": { "name": "Shipit", "fee": 1 }
}
];
/**
 * examples:
 *  
 *  Two  major format:
 *  A.  field: <expression>
 *      quantity: {$gt: 10}
 *      item: 'washers'
 *      carrier.name: 'Shipit'
 *      
 *  B.  <expression>
 *      $or: [ { quantity: { $lt: 20 } }, { price: 10 } ]
 * syntax:
 *  1.  expression->      field: <value>
 *  2.  expression->      field: <expression>
 *  3.  expression->      field: { $logical: [expression]}
 *  4.  field: { $not: {expression}}
 *          $operator>  $gt $lt
 *          $logical>   $and    $or 
 *          $gt:    10
 *          $lt..
 *          $and:   
 */
//find(objs, { item: "bolts" });
//find(objs, { quantity: { "$gt": 10} , item: 'nuts' });


/*
class Searcher {
    criteria;
    object;
    constructor(criteria) {
        this.criteria = criteria;
    }
    searchAll(objs) {

        var self = this;
        return objs.filter(function (item) { return self.search(item); });

    }

    search(obj) {

        this.object = obj;
            var pass = true;
            //  1 split criteria into several terms
        this.evalExprs(this.criteria);
    }
    evalExpresssion(expression) {


    }

    evalExprs( expr, orExpression = false) {

        var pass = true;
        if (typeof expr === 'object' &&
            !Array.isArray(expr) &&
            expr !== null) {

            const terms = Object.keys(expr);
            if (terms.length > 1) {
                for (var t = 0; t < terms.length; t++) {

                    var term = terms[t];
                    var newExpr = {};
                    newExpr[term] = expr[term];
                    this.evalExprs(newExpr);
                }
                return;
            }
            else // single value
            {
                var val = terms[0];
                if (val && val.substring(0, 1) == '$') {
                    switch (val) {
                        case '$and':
                            pass = this.evalExprs(expr);
                            break;
                        case '$or':
                            pass = this.evalExprs(expr);
                            break;
                        case '$not':
                            break;
                        case '$gt':
                            if (!(val > operand))
                                pass = false;
                            break;
                        case '$lt':
                            if (!(val < operand))
                                pass = false;
                            break;
                    }


            }

                }
            }
        }
        else if (Array.isArray(expr)) {
            for (var i = 0; i < expr.length; i++) {
                var exp = expr[i];
                pass = this.evalExprs(exp, null);
                if (orExpression === false)
                    break;
            }
        }
        else {

            if (val != expr)
                pass = false;
        }
        }
        console.log('--Expression:', expr, 'val:', val, 'result:', pass)
        return pass;
    }

}
var result= new Searcher({ $or: [{ quantity: { "$gt": 10 } }, { item: 'washers' }] }).searchAll(objs);
*/