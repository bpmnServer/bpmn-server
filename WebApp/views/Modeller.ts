
import { BPMNServer, dateDiff, Behaviour_names } from '../';

const config = require('../configuration.js').configuration;



const bpmnServer = new BPMNServer(config);

const definitions = bpmnServer.definitions;

let xml, base_url, title, processName;


class Modeller {
    async display(process, request, response) {
        processName = process;
        xml = await definitions.getSource(processName);
        title = processName;
        response.write(getText());
        response.end();
    }
}
exports.Modeller = Modeller;
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

export { Modeller }
