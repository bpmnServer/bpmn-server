interface IProcessInput {
	name:	string;
	source?: string;
	data: [];
	user: string;
	engine: any;
	instance: any;
}

interface IProcessOutput {
	engine: any;
	instance: any;
	envets: [];
	logs: [];
}
interface IProcessError {
	error?: any;
}

function process1() {

}
function process2(input: IProcessInput) : IProcessOutput {
	return {
		engine: input.engine,
		instance: input.instance,
		envets: null,
		logs: []
	};
}
	
function fun1(): void {
		return;
 }

function fun2(p1: string, p2: number): string {
	return 'abc' + p1 + p2;
}
function complex(p1: string): IProcessOutput | IProcessError {

		if (p1 == 'abc') {
			return {
				engine: null,
				instance: null,
				envets: null,
				logs: []
			};
		}
		else {
			return {error: 'not good'};
        }
 }

