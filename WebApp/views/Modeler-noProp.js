"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelerNoProp = void 0;
let xml, base_url, title, processName;
class ModelerNoProp {
    constructor(bpmnServer) {
        this.bpmnServer = bpmnServer;
    }
    displayNew(name, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            processName = name;
            title = processName;
            xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<bpmn2:definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:bpmn2=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" xsi:schemaLocation=\"http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd\" id=\"sample-diagram\" targetNamespace=\"http://bpmn.io/schema/bpmn\">\n  <bpmn2:process id=\"Process_1\" isExecutable=\"false\">\n    <bpmn2:startEvent id=\"StartEvent_1\"/>\n  </bpmn2:process>\n  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\n    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_1\">\n      <bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"StartEvent_1\">\n        <dc:Bounds height=\"36.0\" width=\"36.0\" x=\"412.0\" y=\"240.0\"/>\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn2:definitions>";
            response.write(getText());
            response.end();
        });
    }
    display(process, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            processName = process;
            xml = yield this.bpmnServer.definitions.getSource(processName);
            title = processName;
            response.write(getText());
            response.end();
        });
    }
}
exports.ModelerNoProp = ModelerNoProp;
function getText() {
    return `<!DOCTYPE html>
<html lang="en-CA" class="no-js">
<head>
<meta charset="UTF-8">
<title>Omni-WorkFlow</title>
<script type='text/javascript' src='/javascripts/jquery.min.js'></script>
<script type='text/javascript' src='/javascripts/bootstrap.min.js'></script>
<script type='text/javascript' src='/javascripts/jquery-ui.min.js'></script>
<script type='text/javascript' src='/javascripts/jquery.isloading.min.js'></script>
<script type='text/javascript' src='/javascripts/workflow.js'></script>
<script type='text/javascript' src='/javascripts/processEditor.js'></script>
<link rel='stylesheet' href='/stylesheets/bootstrap.min.css' type='text/css'>
<link rel='stylesheet' href='/stylesheets/bootstrap-theme.min.css' type='text/css'>
<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' type='text/css'>
<link rel='stylesheet' href='/stylesheets/diagram-js.css' type='text/css'>
<link rel='stylesheet' href='/vendor/bpmn-font/css/bpmn-embedded.css' type='text/css'>
<link rel='stylesheet' href='/stylesheets/app.css' type='text/css'>
<link rel='stylesheet' href='/stylesheets/jquery-ui.css' type='text/css'>
<link rel='stylesheet' href='/stylesheets/jquery-ui.theme.css' type='text/css'>
</head>
<body>
<script>
    var omni_base_url="${base_url}";
    var ajax_object =null;					
</script>        
<!--- Views::header -->
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
        <a href="/" class="navbar-brand">
            <img src="https://demo.omniworkflow.com/web//images/omniworkflow_icon.png" /></a>
    </div>
    <!-- Collection of nav links, forms, and other content for toggling -->
    <div id="navbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
        </ul>
<ul class="nav navbar-nav navbar-right">
<li><a href='javascript:window.saveDiagramFunct();'>Save Model</a></li>
<li>
  </li>        
</ul></div>
</nav>         
  <div class='clearfix' height=0;></div>
      <!-- end of omni_header -->
            </div> 
<style>
 div.entry-content { margin:5px !important;}
</style>
    <div class="content" style="min-height:400px" id="js-drop-zone">
        <h2 style="padding-left:20px;">${title} </h2>

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
${xml}
</script>
<script> 
	var processId='${processName}';

	
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
//# sourceMappingURL=Modeler-noProp.js.map