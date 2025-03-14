/**
 * 
2️⃣ Core Features
Feature	Description
DMN XML Parsing	Load and parse DMN XML files into an internal model.
Condition Evaluation	Evaluate input data against conditions in the decision table.
Hit Policy Handling	Implement standard DMN hit policies (e.g., FIRST, COLLECT, PRIORITY, SUM).
Multiple Input Columns	Each rule row should match the corresponding input field automatically.
Multiple Output Columns	The decision table should return structured output based on defined columns.
Data Type Handling	Support numeric, boolean, string conditions.
Performance Optimization	Ensure fast decision evaluation for large tables.
Logging & Debugging	Track rule execution for debugging.
Integration APIs	Provide REST/CLI/SDK for calling the engine.
3️⃣ DMN Hit Policies to Support
✔ FIRST → Return the first matching rule.
✔ COLLECT → Return all matching rules.
✔ PRIORITY → Use the highest-priority match.
✔ RULE ORDER → Return matches in rule order.
✔ UNIQUE → Ensure exactly one match (error if multiple).
✔ SUM / MIN / MAX → Apply mathematical aggregation to numeric outputs.
✔ COUNT → Count how many rules match.

4️⃣ Inputs & Outputs
Example DMN Table:

Age	Income	Decision
>=18	>50000	"Approved"
<18	-	"Rejected"
✔ Inputs: { age: 20, income: 60000 }
✔ Expected Output: { Decision: "Approved" }


 */

import * as fs from 'fs';
import * as xml2js from 'xml2js';
import {   unaryTest, evaluate as feelEvaluate  } from 'feelin';

/**
 * 
 * 
	✔ Parses DMN XML into structured JSON.
	✔ Extracts input/output columns dynamically.
	✔ Processes DMN hit policies correctly.
	✔ Handles encoded XML characters (<, >, &).
 */
    
    class DMNParser {
        static async loadDMNFile(filePath: string) {
            const fileContent = fs.readFileSync(filePath, "utf-8");
            const parser = new xml2js.Parser({ explicitArray: false });
    
            try {
                const parsedXML = await parser.parseStringPromise(fileContent);
                return DMNParser.convertDMNToJSON(parsedXML);
            } catch (error) {
                console.error("Error parsing DMN XML:", error);
                throw new Error("Failed to parse DMN XML file.");
            }
        }
    
        static convertDMNToJSON(parsedXML: any): DecisionTable {
            const decisionTable = parsedXML.definitions.decision.decisionTable;
            const hitPolicy = decisionTable.$.hitPolicy;
    
            const inputColumns = decisionTable.input.map((input: any) => ({
                
                name: DMNParser.getInputField(input).name,
                type: DMNParser.getInputField(input).type
            }));
    
            const outputColumns = decisionTable.output.map((output: any) => ({
                name: DMNParser.getOutputField(output).name,
                type: DMNParser.getOutputField(output).type
            }));
    
            const rules = decisionTable.rule.map((rule: any) => ({
                conditions: rule.inputEntry.map((entry: any, index: number) => ({
                    operator: DMNParser.extractOperator(entry.text),
                    value: DMNParser.convertToType(entry.text, inputColumns[index].type)
                })),
                outcomes: rule.outputEntry.map((entry: any, index: number) =>
                    DMNParser.convertToType(entry.text.replace(/"/g, ""), outputColumns[index].type)
                )
            }));
    
            return { hitPolicy, inputColumns, outputColumns, rules, defaultOutcome: {} };
        }
    
        static extractOperator(conditionText: string): string {

            if (conditionText.startsWith("{") && conditionText.endsWith("}")) {
                try {
                    let ret=feelEvaluate(conditionText.slice(1, -1)); // Remove { } and parse FEEL
                    console.log('value is feel',conditionText,ret);
                    return 'feel';
                } catch (error) {
                    console.error("❌ FEEL Parsing Error:", error);
                }
            }


            const match = conditionText.match(/(>=|<=|==|!=|>|<)/);
            return match ? match[0] : "=="; // Default to equality if no operator found
        }
    
        static convertToType(value: string, type: string): any {

            // Detect FEEL expressions wrapped in {}
            if (value.startsWith("{") && value.endsWith("}")) {
                return value.slice(1, -1);
            }

            const match = value.trim().match(/(>=|<=|==|!=|>|<)?\s*(-?\d+(\.\d+)?)/);
    
            if (match) {
                const numValue = match[2].includes(".") ? parseFloat(match[2]) : parseInt(match[2], 10);
                return numValue;
            }
        
            if (type === "boolean") return value.toLowerCase() === "true";
            return value;
        }
        static getInputField(inpt) {
            /*
                  <input id="i2" label="Income">
        <inputExpression typeRef="integer">
          <text>income</text>
        </inputExpression>
            */
        return {id:inpt.$.id,label:inpt.$.label,type:inpt.inputExpression.$.typeRef,name:inpt.$.label};


        }
        static getOutputField(output) {
            /*
      <output id="OutputClause_1x57vxz" label="Max Amount" name="maxAmount" typeRef="number" />

            */
        return {id:output.$.id,name:output.$.name?output.$.name:output.$.label,type:output.$.typeRef};

        }
            // New: Generate human-readable documentation of rules
    /**
        ✅ Summary
            ✅ Format rules in a human-readable structure.
            ✅ Include hit policy, input conditions, and output values.
            ✅ Display conditions per rule in a structured way.
            ✔ Generates clear, structured documentation of DMN decision rules.
            ✔ Formats conditions & outcomes properly.
            ✔ Displays hit policy, input columns, and output columns.
            ✔ Handles missing conditions gracefully (e.g., - for unrestricted conditions).
    **/
    static documentRules(decisionTable) {
        let doc = `📄 **Decision Table Documentation**\n`;
        doc += `===================================\n`;
        doc += `🔹 **Hit Policy:** ${decisionTable.hitPolicy}\n`;
        doc += `🔹 **Input Columns:** ${decisionTable.inputColumns.map(col => col.name+":"+col.type).join(", ")}\n`;
        doc += `🔹 **Output Columns:** ${decisionTable.outputColumns.map(col => col.name+":"+col.type).join(", ")}\n\n`;
        doc += `📌 **Rules:**\n`;
        decisionTable.rules.forEach((rule, index) => {
            doc += `\n🔸 **Rule ${index + 1}:**\n`;
            doc += `   - **Conditions:**\n`;
            rule.conditions.forEach((condition, colIndex) => {
                doc += `     - ${decisionTable.inputColumns[colIndex].name} ${condition.operator} ${condition.value}\n`;
            });
            doc += `   - **Outcomes:**\n`;
            rule.outcomes.forEach((outcome, colIndex) => {
                doc += `     - ${decisionTable.outputColumns[colIndex].name}: ${outcome}\n`;
            });
        });
        doc += `\n✅ **Default Outcome:**\n`;
        for (const [key, value] of Object.entries(decisionTable.defaultOutcome)) {
            doc += `   - ${key}: ${value}\n`;
        }
        return doc;
    }

    }
    
// Define DecisionTable and Condition types
type DecisionTable = {
    hitPolicy: string;
    inputColumns: {name: string; type: string}[];
    outputColumns:  {name: string; type: string}[]; 
    rules: { conditions: Condition[]; outcomes: any[] }[];
    defaultOutcome: Record<string, any>;
};

type Condition = {
    operator: string; //"==" | "!=" | ">" | "<" | ">=" | "<=";
    value: any;
};

export { DMNParser , DecisionTable , Condition};