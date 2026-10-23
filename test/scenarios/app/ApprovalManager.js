// The approval rules of the multi-stage approval scenarios: which teams approve each stage, and how many of each.
export class ApprovalManager {
  static approvalRules = {
    A: [
      [{ groupName: "Treasury Officers Team", minApprovers: 2 }, { groupName: "RM Team", minApprovers: 1 }],
      [{ groupName: "Finance Team", minApprovers: 2 }],
      [{ groupName: "Operations Head Team", minApprovers: 1 }, { groupName: "Finance Team", minApprovers: 1 }],
      [{ groupName: "Directors Team", minApprovers: 1 }],
      [{ groupName: "HR Head Team", minApprovers: 1 }],
    ],
    B: [
      [{ groupName: "Risk Officers Team", minApprovers: 1 }, { groupName: "Compliance Officers Team", minApprovers: 2 }],
    ],
    C: [
      [{ groupName: "Treasury Head Team", minApprovers: 1 }, { groupName: "Finance Controllers Team", minApprovers: 1 }],
    ],
    D: [
      [{ groupName: "CFO", minApprovers: 1 }, { groupName: "Vice President Team", minApprovers: 2 }],
      [{ groupName: "Senior Ops Team", minApprovers: 3 }],
    ],
    E: [
      [{ groupName: "Board Member", minApprovers: 1 }, { groupName: "CEO", minApprovers: 1 }, { groupName: "Regulator", minApprovers: 1 }],
    ],
  };

  /** Whether a stage is approved: one of its rule sets met by the approvals given, per team. */
  static isStageApproved(stage, approvalsProvided) {
    const stageRules = this.approvalRules[stage];
    if (!stageRules) return false;
    return stageRules.some((ruleSet) => ruleSet.every((rule) => (approvalsProvided[rule.groupName] || 0) >= rule.minApprovers));
  }

  /** The teams a stage may need, each with the most approvers any of its rule sets asks of it. */
  static getRequiredTeams(stage) {
    const stageRules = this.approvalRules[stage];
    if (!stageRules) return null;
    const teams = {};
    for (const ruleSet of stageRules) for (const rule of ruleSet) {
      if (!teams[rule.groupName] || rule.minApprovers > teams[rule.groupName]) teams[rule.groupName] = rule.minApprovers;
    }
    return teams;
  }
}
