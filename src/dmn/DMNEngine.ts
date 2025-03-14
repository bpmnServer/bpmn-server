import {DecisionTable, Condition, DMNParser}  from './DMNParser'
import {   unaryTest, evaluate as feelEvaluate  } from 'feelin';

class DMNEngine {
    table: DecisionTable;
    private options: any;

    constructor(options:any={debug:false}) {
        this.options=options;        
    }
    async load(filePath: string) {
        this.table= await DMNParser.loadDMNFile(filePath);
        console.log(filePath,'loaded');
        return this;
    }

    evaluate(input: Record<string, any>): any {

        if (Array.isArray(input))
        {
            let inputRec={};
            for(let i=0;i<input.length;i++)
            {
                inputRec[this.table.inputColumns[i].name]=input[i];
            }
            input=inputRec;
            
        }
        if (this.options.debug==true) {
            console.log(``);
            console.log(`Evaluating input:`,JSON.stringify(input));
            console.log(``);
        }
        if (this.table===null)
            console.log("Must load a decision table first");

        let matchedRules: { outcomes: any[] }[] = [];
    
        let ruleId=1;
        for (const rule of this.table.rules) {
            if (this.matchesRule(ruleId,rule.conditions, input)) {
                if (this.options.debug==true)
                    console.log(`✅ Rule # ${ruleId} matched`);
                matchedRules.push({ outcomes: rule.outcomes });
    
                if (this.table.hitPolicy === "FIRST") {
                    return this.formatOutput(rule.outcomes);
                }
            }
            ruleId++;
        }
    
        if (matchedRules.length === 0) {
            return this.table.defaultOutcome;
        }
    
        if (this.table.hitPolicy === "RULE ORDER") {
            return matchedRules.map(rule => this.formatOutput(rule.outcomes));  // ✅ Respects order
        }
    
        return this.applyHitPolicy(matchedRules);
    }

    private applyHitPolicy(matchedRules: { outcomes: any[] }[]): any {
        const policy = this.table.hitPolicy;
        const outputColumns = this.table.outputColumns;

        if (policy === "COLLECT") {
            return matchedRules.map(rule => this.formatOutput(rule.outcomes));
        }

        if (policy === "PRIORITY") {
            return this.formatOutput(matchedRules[0].outcomes);
        }

        if (policy === "RULE ORDER") {
            return matchedRules.map(rule => this.formatOutput(rule.outcomes));
        }

        if (policy === "UNIQUE") {
            if (matchedRules.length !== 1) {
                throw new Error(`UNIQUE hit policy violated: ${matchedRules.length} rules matched.`);
            }
            return this.formatOutput(matchedRules[0].outcomes);
        }

        if (policy === "SUM") {
            return outputColumns.reduce((acc, col, index) => {
                acc[col.name] = matchedRules.reduce((sum, rule) => sum + (typeof rule.outcomes[index] === "number" ? rule.outcomes[index] : 0), 0);
                return acc;
            }, {} as Record<string, number>);
        }

        if (policy === "MIN") {
            return outputColumns.reduce((acc, col, index) => {
                acc[col.name] = Math.min(...matchedRules.map(rule => rule.outcomes[index]).filter(v => typeof v === "number"));
                return acc;
            }, {} as Record<string, number>);
        }

        if (policy === "COUNT") {
            return matchedRules.length;
        }

        return this.formatOutput(matchedRules[0].outcomes);
    }

    private matchesRule(ruleId,conditions: Condition[], input: Record<string, any>): boolean {
        return conditions.every((condition, index) => {
            const inputColumn = this.table.inputColumns[index].name;

            let inputValue=null;
            if ((inputColumn in input)) 
                inputValue=input[inputColumn];

            return this.evaluateCondition(ruleId,inputValue, condition);
        });
    }

	private evaluateCondition<T>(ruleId,inputValue: T, condition: Condition): boolean {

        let ret;
        //  check for Feel

        if (condition.operator==='feel'){
                try {
                    let ret=feelEvaluate(condition.value,inputValue); // Remove { } and parse FEEL
                    console.log(`   RuleId: ${ruleId} FEEL `,condition.value,'input:',inputValue,'ret',ret);
                    return ret;
                } catch (error) {
                    console.error("❌ FEEL Parsing Error:", error);
                }
            
        }

        
        ret =this.checkCondition(inputValue, condition.operator, condition.value);

        if (this.options.debug==true) {
            const match=(ret===true)?"🔍":"❌";
            console.log(`   ${match} Rule # ${ruleId} Checking: input: ${inputValue} oper: ${condition.operator} value: ${condition.value}`);
    
        }
        return ret;

    }
    private checkCondition<T>(inputValue: T, operator: string, value: T | T[]): boolean {

        // Treat null or "-" as wildcard (always match)


        if (value === 'null' && (inputValue===null || inputValue=== undefined))
            return true;
        if (value === null || value === "-" || value === undefined) {
            return true;
        }
		switch (operator) {
			case "==": return inputValue === value;
			case "!=": return inputValue !== value;
			case ">": return inputValue > value;
			case "<": return inputValue < value;
			case ">=": return inputValue >= value;
			case "<=": return inputValue <= value;
			default:
				console.log(`❌ Unknown operator: ${operator}`);
				return false;
		}
	}
	
    private formatOutput(outcomes: any[]): Record<string, any> {
        return this.table.outputColumns.reduce((acc, col, index) => {
            acc[col.name] = outcomes[index];
            return acc;
        }, {} as Record<string, any>);
    }
}

export { DMNEngine }