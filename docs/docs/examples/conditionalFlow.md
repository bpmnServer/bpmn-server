# Conditional Flow

## Using simple script expressions

![Using Modeler](../images/bb-conditional-flow.PNG){align=left}


```xml

  <bpmn:sequenceFlow>    

   <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression" language="JavaScript">
      (data.needsCleaning=="Yes")
   </bpmn:conditionExpression>
  ..

```

<div style="clear:both"></div>

## Using simple script expressions


![TS Code](../images/condition-2.PNG){align=left}

![TS Code](../images/condition-3.PNG)
