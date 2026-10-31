# Decision Table Processor

## Overview
The **Decision Table Processor** is a TypeScript class designed to evaluate structured decision tables dynamically. It allows users to define complex rules based on conditions and execute logical evaluations to determine outcomes. The processor supports multiple operators, compound conditions, and priority-based rule ordering.

## Features

### 1. **Condition-Based Evaluation**
- Each rule contains a set of **conditions** that must be met for the rule to trigger.
- Supported operators:
  - `==`, `!=`, `>`, `<`, `>=`, `<=`
  - `IN`, `NOT IN` (for checking inclusion in lists)
  - `CONTAINS` (for substring matching)

### 2. **Compound Conditions (AND/OR Logic)**
- Supports **nested conditions** using `AND` and `OR` operators.
- `AND`: All conditions must be satisfied.
- `OR`: At least one condition must be satisfied.

### 3. **Rule Prioritization**
- Rules are sorted by **priority** (higher priority rules are evaluated first).
- If multiple rules match, the highest priority rule determines the outcome.

### 4. **Flexible Decision Table Structure**
- Rules are defined in a structured JSON-like format.
- Each rule consists of:
  - **Conditions**: A set of logical checks.
  - **Outcome**: The result returned if the rule matches.
  - **Priority** *(Optional)*: Determines rule execution order.
- If no rule matches, a **default outcome** is returned.

### 5. **Dynamic Rule Management**
- **Add new rules** dynamically.
- **Remove existing rules** based on index.

### 6. **Serialization & Deserialization**
- The decision table can be **exported to JSON** using `serialize()`.
- Supports **loading decision tables from JSON** via `deserialize()`.

## Example Usage
```typescript
const decisionTable = {
    rules: [
        {
            conditions: [
                {
                    type: "AND",
                    conditions: [
                        { field: "creditScore", operator: ">=", value: 700 },
                        { field: "income", operator: ">=", value: 50000 }
                    ]
                }
            ],
            outcome: "Approved",
            priority: 2
        },
        {
            conditions: [
                { field: "region", operator: "IN", value: ["US", "CA", "UK"] }
            ],
            outcome: "Eligible for Special Offers",
            priority: 4
        }
    ],
    defaultOutcome: "Pending Review"
};

const processor = new DecisionTableProcessor(decisionTable);
console.log(processor.evaluate({ creditScore: 750, income: 60000 })); // "Approved"
console.log(processor.evaluate({ region: "US" })); // "Eligible for Special Offers"
console.log(processor.evaluate({ creditScore: 650, income: 40000 })); // "Pending Review"
```

## Use Cases
- **Loan Approval Systems**: Determine loan eligibility based on financial data.
- **Access Control**: Define authorization rules for user access levels.
- **Recommendation Engines**: Provide personalized content based on user attributes.
- **Fraud Detection**: Flag suspicious transactions using rule-based patterns.

## Future Enhancements
- Support for **custom operators**.
- Performance optimizations for large rule sets.
- Integration with **databases** or external rule engines.

## Conclusion
The **Decision Table Processor** provides a flexible and powerful mechanism for evaluating structured decision logic dynamically. Its modular design allows for easy extension and integration into various applications requiring rule-based decision-making.

