enum TeamsEnum {

  TREASURY_OFFICERS_TEAM = "Treasury Officers Team",
  RM_TEAM = "RM Team",
  FINANCE_TEAM = "Finance Team",
  OPERATIONS_HEAD_TEAM = "Operations Head Team",
  DIRECTORS_TEAM = "Directors Team",
  HR_HEAD_TEAM = "HR Head Team",

  RISK_OFFICERS_TEAM = "Risk Officers Team",
  COMPLIANCE_OFFICERS_TEAM = "Compliance Officers Team",

  TREASURY_HEAD_TEAM = "Treasury Head Team",
  FINANCE_CONTROLLERS_TEAM = "Finance Controllers Team",
  CFO = "CFO",
  VICE_PRESIDENT_TEAM = "Vice President Team",
  SENIOR_OPS_TEAM = "Senior Ops Team",
  BOARD_MEMBER = "Board Member",
  CEO = "CEO",
  REGULATOR = "Regulator"
}

class ApprovalRules 
{

static rules=ApprovalRules.initRules();
static teams1=[
  {"groupName": "Treasury Officers Team","minApprovers": 2},
  {"groupName": "RM Team","minApprovers": 1},
  {"groupName": "Finance Team","minApprovers": 2},
  {"groupName": "Operations Head Team","minApprovers": 1},
{"groupName": "Finance Team","minApprovers": 1},
{"groupName": "Directors Team","minApprovers": 1 } ,
{"groupName": "HR Head Team","minApprovers": 1}];

static teams2=[
{"groupName": "Risk Officers Team",    "minApprovers": 1},
{"groupName": "Compliance Officers Team",    "minApprovers": 2}];

static teams3=[
   {"groupName":"Treasury Head Team",    "minApprovers": 1 },
   {"groupName":"Finance Controllers Team",    "minApprovers": 1},
   {"groupName":"CFO",    "minApprovers": 1},
   {"groupName":"Vice President Team",    "minApprovers": 2},
   {"groupName":"Senior Ops Team",    "minApprovers": 3},
   {"groupName":"Board Member",    "minApprovers": 1},
   {"groupName":"CEO",    "minApprovers": 1},
   {"groupName":"Regulator",   "minApprovers": 1}];


static IsApprovalDone(context) {
    // get the minApprovers
    console.log(context);
    let keys=context.itemKey.split('.');
    let stage=keys[0];
    
    let stageRules=ApprovalRules.rules[stage];

    let allItems=context.token.execution.getItems();

    let completed=new Map();
    allItems.forEach(item=>{
      if (item.status==='end' && item.endedAt!==null && item.type=='bpmn:UserTask' && item.itemKey.startsWith(stage+'.'))
      { 
        let team=item.itemKey.split('.')[1];
        let count=0;
        if (completed.has(team))
            count=completed.get(team);
        count++;
        completed.set(team,count)
      }
    });
    let completedTeams={};
    completed.forEach((team,count)=>{
      completedTeams[team]=count;
    })
    console.log(completedTeams);
    return ApprovalRules.checkRules(stageRules,completed);
    
  }
static checkRules1(ct:Map<TeamsEnum,any>): boolean {
  if (ct.has(TeamsEnum.BOARD_MEMBER) 
      && ct.has(TeamsEnum.CEO) 
      && ct.has(TeamsEnum.REGULATOR) 
      || (ct.has(TeamsEnum.VICE_PRESIDENT_TEAM) 
         && ct.has(TeamsEnum.SENIOR_OPS_TEAM)) 
    )
    return true;
}

static checkRules(rules,data): boolean {
    let ret=false;
    Object.keys(rules).forEach(cond=>{
        let rule=rules[cond];
        if (cond=='$AND') {
            ret=true;
            rule.forEach(r=>{
                let oret=ApprovalRules.checkRules(r,data);
                if (oret==false)
                    ret=oret;
            });
        }
        else if (cond=='$OR') {
            rule.forEach(r=>{
                let oret=ApprovalRules.checkRules(r,data);
                if (oret==true)
                    ret=oret;
            });
        }
        else // simple condition like "groupName..."
        {
            let gr=rules.groupName;
            let mn=rules.minApprovers;
            let count=data.get(gr);
            if (count>=mn)
                ret=true;
        }
        

    });

    return ret;

}
static getTeams(rule,list)
{

    let key=Object.keys(rule)[0];

    if (key=='$AND' || key=='$OR')
    {
        rule[key].forEach(r=>{
            ApprovalRules.getTeams(r,list);
        });
    }
    else
        list.push(rule);

}
static  async getApprovers(context) {
    
    let stage=context.itemsKey.split('.');
    
    let items=[];
    let stageTeams=[];
    ApprovalRules.getTeams(ApprovalRules.rules[stage],stageTeams);

    for(let t=0;t<stageTeams.length;t++)
    {
        ;
        for(let i=0;i<stageTeams[t].minApprovers;i++)
        {
          items.push(''+stageTeams[t].groupName+'.'+(i+1))
        }
    }
    
    return items;

  }
  static getMinApprovers(stage,team) {
    
    let stageTeams=ApprovalRules.rules[stage];

    for(let t=0;t<stageTeams.length;t++)
    {
      if (stageTeams[t].groupName==team)
        return stageTeams[t].minApprovers;
    }
    return 0;

  }
  static initRules() {
    
      return  {
          "Stage_A": 
            { "$OR": 
              [
              { "$AND":
                [
                  {"groupName": "Treasury Officers Team","minApprovers": 2},
                  {"groupName": "RM Team","minApprovers": 1}
                ]},
              { "$AND":
                [
                  {"groupName": "Finance Team","minApprovers": 2},
                  {"groupName": "Operations Head Team","minApprovers": 1}
                ]},
              {"groupName": "Finance Team","minApprovers": 1},
              {"groupName": "Directors Team","minApprovers": 1 } ,
              {"groupName": "HR Head Team","minApprovers": 1}
              ]
            },
          "Stage_B":
             {"$OR":[{
                    "groupName": "Risk Officers Team",
                    "minApprovers": 1
                },
                  {
                    "groupName": "Compliance Officers Team",
                    "minApprovers": 2
                  }
                ]
             } ,
           "Stage_C":
              {"$OR":[
                  {
                    "groupName": "Treasury Head Team",
                    "minApprovers": 1
                  },
                  {
                    "groupName": "Finance Controllers Team",
                    "minApprovers": 1
                  }
                ]
              },
          "Stage_D":
             [
                  {
                    "groupName": "CFO",
                    "minApprovers": 1
                  },
                  {
                    "groupName": "Vice President Team",
                    "minApprovers": 2
                  },
                  {
                    "groupName": "Senior Ops Team",
                    "minApprovers": 3
                  }
                ]
              ,
          "Stage_E": 
             [
                  {
                    "groupName": "Board Member",
                    "minApprovers": 1
                  },
                  {
                    "groupName": "CEO",
                    "minApprovers": 1
                  },
                  {
                    "groupName": "Regulator",
                    "minApprovers": 1
                  }
               ]};
              
  }
}
export {ApprovalRules}
