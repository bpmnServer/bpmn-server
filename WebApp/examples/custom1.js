var services =
{
    service1(scope, callback) {
        console.log(" Service fn1 is called");
        callback(null, { data: 1 });
    },
    service2(scope, callback) {
        console.log(" Service fn2 is called from custom1.js");
        callback(null, { data: 1 });
    }
}
var extensions= {
    camundaServiceTask(activity) {
        if (activity.behaviour.expression) {
            activity.behaviour.Service = myServiceExpression;
        }
        if (activity.behaviour.resultVariable) {
            activity.on('end', (api) => {
                activity.environment.output[activity.behaviour.resultVariable] = api.content.output;
            });
        }
    }
}

function myServiceExpression(activity) {
    const { type: atype, behaviour, environment } = activity;
    const expression = behaviour.expression;
    const type = `${atype}:expression`;
    return {
        type,
        expression,
        execute,
    };

    function execute(executionMessage, callback) {
        console.log(' camunda: expression="\${environment.services.serviceFn1}" camunda: resultVariable="result" ');
        console.log('executionMessage');
//        console.log(executionMessage);
        console.log('expression');
        console.log(expression);
        const serviceFunction = environment.resolveExpression(expression, executionMessage);
        console.log('serviceFunction');
        console.log(serviceFunction);
        serviceFunction.call(activity, executionMessage, (err, result) => {
            callback(err, result);
        });
    }
}


module.exports = { services ,extensions };