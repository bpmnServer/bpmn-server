
/*

run:

npx typedoc --json api.json

* sample output 
@Get('/model')
  async getModelList() {
    var list=await this.api.model.list({},SystemUser);
    return list;
  }
  //get all workflow
  @Get('/')
  getWorkflows() {
    return this.api.data.getPendingUserTasks({},SystemUser);
  }
  //create workflow
  @Post('/:workflowname')
  @ApiBody({ description: 'create worflow, submit data in json format', type:SampleApiSchema})
  @ApiOperation({
    operationId: 'startWorkflow',
    description: 'start new workflow',
  })
startWorkflow(
  @Param('workflowname') workflowname:string,
  @Body() data: Object,
  ) {
  return this.bpmnService.startWorkflow(workflowname,data);
}

-- Additional options:
  @Get(path)
  @Body()

*/

import * as path from "path";
import * as ts from "typescript";
import * as fs from 'fs';
const input={};
function main(input) {

}
class sModule {
  name;
  comment;
  members=[];
  constructor(json) {
    this.name=json.name;
    this.comment=json.comment.summary[0].text;
          json.children.forEach(child=>{

             this.members.push(new sMember(child));
          });
  
    
  }
  Out() {
    let txt=`//---------------------------- ${this.name}
    //---------------------------- 
    ${this.comment}

    //---------------------------- 

    `
    this.members.forEach(m=>{ txt+=''+m.out();});
    txt+=``;
    return txt;
  }
}
class sMember {
  name;
  comment;
  isAsync;
  returnType;
  params=[];
  constructor(m) {
      this.name=m.name; 
    
      m.signatures.forEach(sign=>{
        sign.comment.summary.forEach(l=>{ this.comment=l.text;});
    
        this.returnType= sign.type.name;
        if (sign.type.typeArguments)
          sign.type.typeArguments.forEach(tt=>{this.returnType=tt.name;});
    
        sign.parameters.forEach(param=>{
            this.params.push(new sParam(param));
        });
    
      });
    
  }
  /**
   * 
   * @returns 
   */
  out() {
    let txt=`
    //---------------------------- 
    //    ${this.name}
    //${this.comment}

    ${this.name}:${this.returnType}(`;
    this.params.forEach(p=>{txt+=`    `+p.out();})
    txt+=`) {
    }
    `;
    return txt;
  }
}
class sParam{
  name;
  type='any';
  isOptional=false;
  comment='';
  constructor (param)
  {
    this.name=param.name;
    if (param.comment && param.comment.summary)
      this.comment='  -"'+param.comment.summary[0].text+'"';

    if (param.flags && param.flags.isOptional)
        this.isOptional=true;
    if (param.type.type=='reference')
        this.type=param.type.name;

  }
  out() {
    let txt=`${this.name}:${this.type} ${this.comment},  `;
    return txt;
  
  }

}

getClass("IAPIEngine");

function getClass(name) {

  const json=fs.readFileSync('api.json');
  const src=JSON.parse(json+'');

src.children.forEach(cls=>{
  if (cls.name==name)
      {
        let sCls = new sModule(cls);
        let txt='';
        txt=sCls.Out();
        console.log('txt:',txt);
      
      }

    } );
}
