"use strict";
function getText(instance, json, svg, decorations) {
    let processName = instance.name;
    let text = `<script>
	inDesignMode = false;
	inViewMode = true;
	var caseTitle = '${instance.name}';
	var caseId ='${instance.id}';
	jQuery(document).ready(function () {

    return;
		BuildCasePage();
		displayCaseData();
		main_layout.cells('a').setHeight(200);
		main_layout.cells('b').setHeight(300);
		jQuery('#diagramContents').parent().css('overflow-y', 'auto');
	});
	jsonData = ${json}
	decorations = ${decorations}

</script>
<div id="MainLayout" class='mainLayout'>
	<!-- js will embed layout here -->
</div>
<!-- Diagram here -->
<div id='diagramContents'>
	<div>
		${svg}
	</div>
</div>
<!-- end of diagram -->
</div>
`;
    return text;
}
function getHeader() {
    return `
<!DOCTYPE html>
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
	<script type='text/javascript' src='/javascripts/caseView.js'></script>
	<link rel='stylesheet' href='/stylesheets/bootstrap.min.css' type='text/css'>
	<link rel='stylesheet' href='/stylesheets/bootstrap-theme.min.css' type='text/css'>
	<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' type='text/css'>
	<link rel='stylesheet' href='/stylesheets/diagram-js.css' type='text/css'>
	<link rel='stylesheet' href='/vendor/bpmn-font/css/bpmn-embedded.css' type='text/css'>
	<link rel='stylesheet' href='/stylesheets/app.css' type='text/css'>
	<link rel='stylesheet' href='/stylesheets/jquery-ui.css' type='text/css'>
	<link rel='stylesheet' href='/stylesheets/jquery-ui.theme.css' type='text/css'>
	<script type='text/javascript' src='/vendor/dhtmlx/codebase/dhtmlx.js'></script>
	<script type='text/javascript' src='/vendor/dhtmlx/codebase/datastore.js'></script>
	<script type='text/javascript' src='/javascripts/jsonHelper.js'></script>
	<script type='text/javascript' src='/javascripts/svgHelper.js'></script>
	<link rel='stylesheet' href='/vendor/dhtmlx/codebase/dhtmlx.css' type='text/css'>
	<link rel='stylesheet' href='/vendor/dhtmlx/skins/skyblue/dhtmlx.css' type='text/css'>
</head>
<body>
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
					<a href="/" class="navbar-brand"><img src="/images/omniworkflow_icon.png" /></a>
				</div>
				<!-- Collection of nav links, forms, and other content for toggling -->
				<div id="navbarCollapse" class="collapse navbar-collapse">
					<ul class="nav navbar-nav">
						<li><a class='' href='/processes'>Processes</a></li>
						<li><a class='' href='/dashboard'>Dashboard</a></li>
						<li><a class='' href='/cases'>Cases</a></li>
						<li><a class='' href='http://omniworkflow.com/help' target='_blank'>Help</a></li>
					</ul><ul class="nav navbar-nav navbar-right">
					</ul>
				</div>
			</nav>
			<div class='clearfix' height=0;></div>
			<!-- end of omni_header -->
		</div>
		`;
}
function getItemAction(item) {
    if (item.status == 'wait') {
        return "actionName^link^_self";
    }
    else {
        return "";
    }
}

module.exports = { getHeader,getText }