"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modeller = void 0;
class Modeller {
    display(request, response) {
        response.write(getText());
        response.end();
    }
}
 function getText() {
    return `<!DOCTYPE html>
<html lang="en-CA" class="no-js">
<head>
<meta charset="UTF-8">
<title>Omni-WorkFlow</title>
<script type='text/javascript' src='https://demo.omniworkflow.com/web/js/jquery.min.js'></script>
<script type='text/javascript' src='https://demo.omniworkflow.com/web/lib/bootstrap/bootstrap.min.js'></script>
<script type='text/javascript' src='https://demo.omniworkflow.com/web/lib/dhtmlx/codebase/dhtmlx.js'></script>
<script type='text/javascript' src='https://demo.omniworkflow.com/web/lib/dhtmlx/codebase/datastore.js'></script>
<script type='text/javascript' src='https://demo.omniworkflow.com/web/lib/jquery-ui/jquery-ui.min.js'></script>
<script type='text/javascript' src='https://demo.omniworkflow.com/web/js/jquery.isloading.min.js'></script>
<script type='text/javascript' src='https://demo.omniworkflow.com/web/lib/jquery.validate.min.js'></script>
<script type='text/javascript' src='https://demo.omniworkflow.com/web/js/workflow.js'></script>
<script type='text/javascript' src='https://demo.omniworkflow.com/web/js/jsonHelper.js'></script>
<script type='text/javascript' src='/javascripts/processEditor.js'></script>
<script type='text/javascript' src='https://demo.omniworkflow.com/web/js/caseView.js'></script>
<script type='text/javascript' src='https://demo.omniworkflow.com/web/lib/codemirror.js'></script>
<script type='text/javascript' src='https://demo.omniworkflow.com/web/lib/gherkin.js'></script>
<link rel='stylesheet' href='https://demo.omniworkflow.com/web/lib/bootstrap/bootstrap.min.css' type='text/css'>
<link rel='stylesheet' href='https://demo.omniworkflow.com/web/lib/bootstrap/bootstrap-theme.min.css' type='text/css'>
<link rel='stylesheet' href='https://demo.omniworkflow.com/web/lib/dhtmlx/codebase/dhtmlx.css' type='text/css'>
<link rel='stylesheet' href='https://demo.omniworkflow.com/web/lib/dhtmlx/skins/skyblue/dhtmlx.css' type='text/css'>
<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' type='text/css'>
<link rel='stylesheet' href='https://demo.omniworkflow.com/web/css/diagram-js.css' type='text/css'>
<link rel='stylesheet' href='https://demo.omniworkflow.com/web/vendor/bpmn-font/css/bpmn-embedded.css' type='text/css'>
<link rel='stylesheet' href='https://demo.omniworkflow.com/web/css/app.css' type='text/css'>
<link rel='stylesheet' href='https://demo.omniworkflow.com/web/lib/jquery-ui/jquery-ui.css' type='text/css'>
<link rel='stylesheet' href='https://demo.omniworkflow.com/web/lib/jquery-ui/jquery-ui.theme.css' type='text/css'>
<link rel='stylesheet' href='https://demo.omniworkflow.com/web/css\workflow.css' type='text/css'>
<link rel='stylesheet' href='https://demo.omniworkflow.com/web/lib/codemirror.css' type='text/css'>
</head>
<body>
<script>

    var omni_base_url="/";
    var ajax_object =null;					
</script>        <!--- Views::header -->
     <div id="omni_page">
            <div id="omni_header">
        
<!-- MenusView.php:displayMenus -->

<!-- bootstrap menus --->
    
<nav role="navigation" class="navbar navbar-default">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
        <button type="button" data-target="#navbarCollapse" data-toggle="collapse" class="navbar-toggle">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a href="#" class="navbar-brand"><img 
                src="https://demo.omniworkflow.com/web//images/omniworkflow_icon.png" /></a>
    </div>
    <!-- Collection of nav links, forms, and other content for toggling -->
    <div id="navbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
            <li><a class='' href='https://demo.omniworkflow.com/index.php?action=process.show'>Processes</a></li><li><a class='' 
href='https://demo.omniworkflow.com/index.php?action=task.dashboard'>Dashboard</a></li><li><a class='' 
href='https://demo.omniworkflow.com/index.php?action=case.list'>Cases</a></li><li class='dropdown'>
                        <a data-toggle='dropdown' class='xdropdown-toggle' href='#'>Tools <b class='caret'></b></a>
                        <ul role='menu' class='dropdown-menu'><li>
<a href='https://demo.omniworkflow.com/index.php?action=tools.debugScript'>Debug Script</a></li><li><a href='https://demo.omniworkflow.com/index.php?action=tools.runTests'>Run Test Scenarios</a></li><li><a href='https://demo.omniworkflow.com/index.php?action=tools.testRules'>Test Business Rules</a></li>
                            </ul>
                            </li>         <li class='dropdown'>
                        <a data-toggle='dropdown' class='xdropdown-toggle' href='#'>User <b class='caret'></b></a>
                        <ul role='menu' class='dropdown-menu'><li>
<a href='https://demo.omniworkflow.com/index.php?action=user.profile'>Profile</a></li><li><a href='https://demo.omniworkflow.com/index.php?action=user.logout'>Logout</a></li>
                            </ul>
                            </li>         <li class='dropdown'>
                        <a data-toggle='dropdown' class='xdropdown-toggle' href='#'>Admin <b class='caret'></b></a>
                        <ul role='menu' class='dropdown-menu'><li><a href='https://demo.omniworkflow.com/index.php?action=admin.listEvents'>View Events</a></li><li><a href='https://demo.omniworkflow.com/index.php?action=admin.listNotifications'>View Notifications</a></li><li><a href='https://demo.omniworkflow.com/index.php?action=admin.resetCaseData'>Reset Case Data</a></li><li><a href='https://demo.omniworkflow.com/index.php?action=admin.installDB'>Reset All Data</a></li>
                            </ul>
                            </li>         <li><a class='' href='http://omniworkflow.com/help' target='_blank'>Help</a></li></ul><ul class="nav navbar-nav navbar-right"><li><a href='javascript:window.saveDiagramFunct();'>Save Model</a></li><li><a href='https://demo.omniworkflow.com/index.php?action=process.describe&processId=30'>Proceed to Design</a></li>        </ul></div>
</nav>         <!--
<div id='menu-bar'>
    <div style="width:140px;float:left">
                <image  id='maxButton' 
                        src="https://demo.omniworkflow.com/web//images/max-screen.png" />
    </div>
</div> -->
   <div class='clearfix' height=0;></div>
                <!-- end of omni_header -->
            </div> 
<style>
 div.entry-content { margin:5px !important;}
</style>
    <div class="content" style="min-height:400px" id="js-drop-zone">

        BusinessRules diagram

    <div class="message error">
      <div class="note">
        <p>Ooops, we could not display the BPMN 2.0 diagram.</p>

        <div class="details">
          <span>cause of the problem</span>
          <pre></pre>
        </div>
      </div>
    </div>

    <div class="canvas" style="height:800px" id="js-canvas"></div>
    
  </div>
  <ul class="buttons">
    <li>
      <div id="js-download-diagram" href title="download BPMN diagram">
        
      </div>
    </li>
    <li>
      <div id="js-download-svg" href title="download as SVG image">
        
      </div>
    </li>
    <li>
    </li>
  </ul>

<br />
  <script src="/javascripts/modeller.js"></script>
<script id="xmlSrc" type="text/xmldata">
<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
  <bpmn2:collaboration id="Collaboration_0f1ds8a">
    <bpmn2:participant id="Participant_1jd0dzx" processRef="Process_1" />
  </bpmn2:collaboration>
  <bpmn2:process id="Process_1" isExecutable="false">
    <bpmn2:endEvent id="EndEvent_06pgfoi">
      <bpmn2:incoming>SequenceFlow_0zjg90l</bpmn2:incoming>
      <bpmn2:incoming>SequenceFlow_0lztydf</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:userTask id="Task_1osvffp" name="Vacation Input">
      <bpmn2:incoming>SequenceFlow_1a6ilj8</bpmn2:incoming>
      <bpmn2:outgoing>SequenceFlow_1boll6e</bpmn2:outgoing>
    </bpmn2:userTask>
    <bpmn2:startEvent id="StartEvent_1">
      <bpmn2:outgoing>SequenceFlow_0whnvj5</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:userTask id="Task_0bcb90p" name="Select Rule">
      <bpmn2:incoming>SequenceFlow_0whnvj5</bpmn2:incoming>
      <bpmn2:outgoing>SequenceFlow_1a6ilj8</bpmn2:outgoing>
      <bpmn2:outgoing>SequenceFlow_13do9hq</bpmn2:outgoing>
    </bpmn2:userTask>
    <bpmn2:userTask id="Task_1kjzxt6" name="Life Insurance Input">
      <bpmn2:incoming>SequenceFlow_13do9hq</bpmn2:incoming>
      <bpmn2:outgoing>SequenceFlow_0x7yowh</bpmn2:outgoing>
    </bpmn2:userTask>
    <bpmn2:businessRuleTask id="Task_16ijq52" name="Vacation">
      <bpmn2:incoming>SequenceFlow_1boll6e</bpmn2:incoming>
      <bpmn2:outgoing>SequenceFlow_0zjg90l</bpmn2:outgoing>
    </bpmn2:businessRuleTask>
    <bpmn2:businessRuleTask id="Task_0z1yxdw" name="Life Insurance">
      <bpmn2:incoming>SequenceFlow_0x7yowh</bpmn2:incoming>
      <bpmn2:outgoing>SequenceFlow_0lztydf</bpmn2:outgoing>
    </bpmn2:businessRuleTask>
    <bpmn2:sequenceFlow id="SequenceFlow_0zjg90l" sourceRef="Task_16ijq52" targetRef="EndEvent_06pgfoi" />
    <bpmn2:sequenceFlow id="SequenceFlow_0lztydf" sourceRef="Task_0z1yxdw" targetRef="EndEvent_06pgfoi" />
    <bpmn2:sequenceFlow id="SequenceFlow_1a6ilj8" sourceRef="Task_0bcb90p" targetRef="Task_1osvffp">
      <bpmn2:conditionExpression xsi:type="bpmn2:tFormalExpression" />
    </bpmn2:sequenceFlow>
    <bpmn2:sequenceFlow id="SequenceFlow_1boll6e" sourceRef="Task_1osvffp" targetRef="Task_16ijq52" />
    <bpmn2:sequenceFlow id="SequenceFlow_0whnvj5" sourceRef="StartEvent_1" targetRef="Task_0bcb90p" />
    <bpmn2:sequenceFlow id="SequenceFlow_13do9hq" sourceRef="Task_0bcb90p" targetRef="Task_1kjzxt6">
      <bpmn2:conditionExpression xsi:type="bpmn2:tFormalExpression" />
    </bpmn2:sequenceFlow>
    <bpmn2:sequenceFlow id="SequenceFlow_0x7yowh" sourceRef="Task_1kjzxt6" targetRef="Task_0z1yxdw" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_0f1ds8a">
      <bpmndi:BPMNShape id="Participant_1jd0dzx_di" bpmnElement="Participant_1jd0dzx">
        <dc:Bounds x="131" y="13" width="685" height="352" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="168" y="168" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="141" y="204" width="90" height="20" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BusinessRuleTask_03vzq9i_di" bpmnElement="Task_16ijq52">
        <dc:Bounds x="524" y="61" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_06pgfoi_di" bpmnElement="EndEvent_06pgfoi">
        <dc:Bounds x="718" y="182" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="691" y="222" width="90" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1boll6e_di" bpmnElement="SequenceFlow_1boll6e">
        <di:waypoint xsi:type="dc:Point" x="455" y="101" />
        <di:waypoint xsi:type="dc:Point" x="524" y="101" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="445" y="80" width="90" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0zjg90l_di" bpmnElement="SequenceFlow_0zjg90l">
        <di:waypoint xsi:type="dc:Point" x="624" y="101" />
        <di:waypoint xsi:type="dc:Point" x="736" y="101" />
        <di:waypoint xsi:type="dc:Point" x="736" y="182" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="635" y="80" width="90" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="UserTask_0rw6e8z_di" bpmnElement="Task_1osvffp">
        <dc:Bounds x="355" y="61" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_0whnvj5_di" bpmnElement="SequenceFlow_0whnvj5">
        <di:waypoint xsi:type="dc:Point" x="204" y="186" />
        <di:waypoint xsi:type="dc:Point" x="228" y="186" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="171" y="165" width="90" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_1a6ilj8_di" bpmnElement="SequenceFlow_1a6ilj8">
        <di:waypoint xsi:type="dc:Point" x="278" y="146" />
        <di:waypoint xsi:type="dc:Point" x="278" y="101" />
        <di:waypoint xsi:type="dc:Point" x="355" y="101" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="248" y="117" width="90" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_13do9hq_di" bpmnElement="SequenceFlow_13do9hq">
        <di:waypoint xsi:type="dc:Point" x="278" y="226" />
        <di:waypoint xsi:type="dc:Point" x="278" y="290" />
        <di:waypoint xsi:type="dc:Point" x="355" y="290" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="248" y="252" width="90" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="UserTask_17nj3xt_di" bpmnElement="Task_0bcb90p">
        <dc:Bounds x="228" y="146" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="UserTask_1b89lvo_di" bpmnElement="Task_1kjzxt6">
        <dc:Bounds x="355" y="250" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_0x7yowh_di" bpmnElement="SequenceFlow_0x7yowh">
        <di:waypoint xsi:type="dc:Point" x="455" y="290" />
        <di:waypoint xsi:type="dc:Point" x="524" y="290" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="445" y="269" width="90" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="BusinessRuleTask_12vw6oi_di" bpmnElement="Task_0z1yxdw">
        <dc:Bounds x="524" y="250" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_0lztydf_di" bpmnElement="SequenceFlow_0lztydf">
        <di:waypoint xsi:type="dc:Point" x="624" y="290" />
        <di:waypoint xsi:type="dc:Point" x="736" y="290" />
        <di:waypoint xsi:type="dc:Point" x="736" y="218" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="635" y="269" width="90" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>
</script>
<script> 
	var processId='30';

	
	var OmniXML;
	var OmniSVG;
	var OmniChangesCallback=diagramChanged;
        window.saveDiagramFunct=saveDiagram;


</script>
                
            <!-- end of omni_contents -->
      <div id="omni_footer">
          <hr /></div>
            
<!-- end of omni_page -->
</div>
                                                                      
`;

 } 
 exports.Modeller = Modeller;
//# sourceMappingURL=Modeller.js.map