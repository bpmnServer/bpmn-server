import {} from './';

var pokemon = {
    firstname: 'Pika',
    lastname: 'Chu ',
    getPokeName: function () {
        var fullname = this.firstname + ' ' + this.lastname;
        return fullname;
    }
};

var pokemonName = function (snack, hobby) {
    console.log(this.getPokeName() + ' loves ' + snack + ' and ' + hobby);
};


pokemonName.call(pokemon, 'sushi', 'algorithms'); // Pika Chu  loves sushi and algorithms
pokemonName.apply(pokemon, ['sushi', 'algorithms']); // Pika Chu  loves sushi and algorithms

var js = `return this.a+this.b;`;
var scope = { a: 1, b: 2, 3: 3 };

var result = Function(js).bind(scope)();
console.log(result);

class ScriptUtil {
    event;
    itemId;
    elementId;
    processName;
    log(msg) {
        console.log(msg);
    }
}
var sampleObj = new ScriptUtil();
console.log(sampleObj);
var data = { a: 1, b: 2 };
var output = { var1: 'val1' };
var input = {};

var variables = { data, input, output };
js = `
    data['c']=5;
    data.b=3;
    input['d']=6;
    input.e=7;
    this.log('testing abc');
    //output={var2: 'val2'}; does not work
    output.var2='val3';     // this works
    return 99;
`;

var addition = Function("data", "input", "output", js);
var res = addition.call(new ScriptUtil(), data, input, output);
//res = addition.apply(scope, [5, 3]);
console.log(res,data,input,output); // shows '8'