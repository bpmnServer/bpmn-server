function process1() {
}
function process2(input) {
    return {
        engine: input.engine,
        instance: input.instance,
        envets: null,
        logs: []
    };
}
function fun1() {
    return;
}
function fun2(p1, p2) {
    return 'abc' + p1 + p2;
}
function complex(p1) {
    if (p1 == 'abc') {
        return {
            engine: null,
            instance: null,
            envets: null,
            logs: []
        };
    }
    else {
        return { error: 'not good' };
    }
}
//# sourceMappingURL=test1.js.map