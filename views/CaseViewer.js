"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseViewer = void 0;
const config = require('../configuration.js').configuration;
const definitions = config.definitions;
let xml, base_url, title;
var parseString = require('xml2js').parseString;
xml = "<root>Hello xml2js!</root>";
parseString(xml, function (err, result) {
    console.dir(result);
});
class CaseViewer {
    display(request, response) {
        let process = request.query.process;
        xml = definitions.getSource(process);
        title = process;
        response.write(getText());
        response.end();
    }
}
exports.CaseViewer = CaseViewer;
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

    var omni_base_url="${base_url}";
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

        ${title}

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
//# sourceMappingURL=Modeller.js.map
//# sourceMappingURL=CaseViewer.js.map