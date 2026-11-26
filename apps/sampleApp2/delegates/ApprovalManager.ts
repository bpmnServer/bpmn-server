type ApprovalRule = { groupName: string; minApprovers: number };
type ApprovalStage = ApprovalRule[][];

export class ApprovalManager {
  private static approvalRules: Record<string, ApprovalStage> = {
    A: [
      [{ groupName: "Treasury Officers Team", minApprovers: 2 }, { groupName: "RM Team", minApprovers: 1 }],
      [{ groupName: "Finance Team", minApprovers: 2 }],
      [{ groupName: "Operations Head Team", minApprovers: 1 }, { groupName: "Finance Team", minApprovers: 1 }],
      [{ groupName: "Directors Team", minApprovers: 1 }],
      [{ groupName: "HR Head Team", minApprovers: 1 }]
    ],
    B: [
      [{ groupName: "Risk Officers Team", minApprovers: 1 }, { groupName: "Compliance Officers Team", minApprovers: 2 }]
    ],
    C: [
      [{ groupName: "Treasury Head Team", minApprovers: 1 }, { groupName: "Finance Controllers Team", minApprovers: 1 }]
    ],
    D: [
      [{ groupName: "CFO", minApprovers: 1 }, { groupName: "Vice President Team", minApprovers: 2 }],
      [{ groupName: "Senior Ops Team", minApprovers: 3 }]
    ],
    E: [
      [{ groupName: "Board Member", minApprovers: 1 }, { groupName: "CEO", minApprovers: 1 }, { groupName: "Regulator", minApprovers: 1 }]
    ]
  };

  /**
   * Checks if a stage is approved based on provided approvals.
   */
  public static isStageApproved(stage: string, approvalsProvided: Record<string, number>): boolean {
    const stageRules = this.approvalRules[stage];
    if (!stageRules) {
      console.error(`Invalid stage: ${stage}`);
      return false;
    }

    return stageRules.some(ruleSet => 
      ruleSet.every(rule => (approvalsProvided[rule.groupName] || 0) >= rule.minApprovers)
    );
  }

  /**
   * Gets the list of required teams and the max number of approvers for a given stage.
   */
  public static getRequiredTeams(stage: string): Record<string, number> | null {
    const stageRules = this.approvalRules[stage];
    if (!stageRules) {
      console.error(`Invalid stage: ${stage}`);
      return null;
    }

    const teamApprovals: Record<string, number> = {};

    stageRules.forEach(ruleSet => {
      ruleSet.forEach(rule => {
        if (!teamApprovals[rule.groupName] || rule.minApprovers > teamApprovals[rule.groupName]) {
          teamApprovals[rule.groupName] = rule.minApprovers;
        }
      });
    });

    return teamApprovals;
  }

  /**
   * Documents the approval rules for a given stage, or all stages if null.
   * @param stage - The stage to document (or null for all stages).
   * @returns A formatted string listing the approval conditions.
   */
  public static documentStageRules(stage: string | null = null): string {
    const stagesToProcess = stage ? { [stage]: this.approvalRules[stage] } : this.approvalRules;
    
    let documentation = "";

    for (const [stageKey, stageRules] of Object.entries(stagesToProcess)) {
      if (!stageRules) {
        console.error(`Invalid stage: ${stageKey}`);
        continue;
      }

      documentation += `\nApproval Rules for Stage ${stageKey}:\n`;

      stageRules.forEach((ruleSet, index) => {
        documentation += `\n  Option ${index + 1}: Requires approval from any of the following:\n`;
        ruleSet.forEach(rule => {
          documentation += `    - ${rule.groupName} (Min Approvers: ${rule.minApprovers})\n`;
        });
      });
    }

    return documentation.trim();
  }
static test() {

// Example Usage
const approvals: Record<string, number> = {
    "Treasury Officers Team": 2,
    "Finance Team": 1,
    "CFO": 1,
    "Vice President Team": 2
  };
  console.log(ApprovalManager.documentStageRules(null));
  
  console.log("Stage A Teams",ApprovalManager.getRequiredTeams("A")); 
  // { "Treasury Officers Team": 2, "RM Team": 1, "Finance Team": 2, "Operations Head Team": 1, "Directors Team": 1, "HR Head Team": 1 }
  
  console.log("Stage D Teams",ApprovalManager.getRequiredTeams("D")); 
  
  console.log("Stage A",approvals,ApprovalManager.isStageApproved("A", approvals)); // true or false
  console.log("Stage D",ApprovalManager.isStageApproved("D", approvals)); // true or false
  
      
}
}

