/*
 * Copyright (c) 2015, Omni-Workflow - Omnibuilder.com by OmniSphere Information Systems. All rights reserved. For licensing, see LICENSE.md or http://workflow.omnibuilder.com/license
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


jQuery(window).resize(function () {

	if (typeof main_layout !== 'undefined') {
		main_layout.setSizes();
	}
});

/*
	BuildPage and its parts
	
	Display first time data 
	
	Synchronize	 data into Json var procJson
	
	Items:
		grid (read only), several forms
			focus is sync using bind between the two
			displayItemDetails

*/
//	--- Layout ---
var inDesignMode = false;
var inViewMode = false;
var main_layout;
var workAreaTabbar;
var itemTabbar;
var procDocForm;

// --- Item Forms -----
var ProcessItemForm;
var ActionForm;
var MessageForm;
var SignalForm;
var ConditionForm;
var ItemDocForm;

var gridItems;
var gridItemData;
var gridDT;
var gridDataMapInput;
var gridDataMapOutput;
var gridScripts;

var gridPools;
var gridActors;

var currentItemId;

//	----------------- Data Elements 

var form_prop;
var gridDataElements;

var gridAccessRules;
var form_access;
//	var dataElementsStore;

var gridNotificationRules;

var currentDataElementId;

var directionTabBar;
var actionTypeCombo;
// Modeler

function diagramChanged() {
	try {
		//            omniMenusLocal.setItemEnabled("local.saveModel");
	}
	catch (Ex) {

	}
}


function saveDiagram() {
	//            displayStatus("Saving Data.");
	var url = getAjaxUrl();

	/*	
		
	$.ajax({
	   url             :    url+"?command=saveDiagram",
	   type            :   'POST',
	   processData     :   false,
	   contentType     :   'text/xml',
	   data            :   xmlDocument,
	   sucess          :   function( data ) {
		  alert('success'+data);
	   },
	   error           :   function() {
		  alert('failed to send ajax request');
	   },
	   complete        :   function( response) {
		  alert('ajax request completed'+response.responseText);
	   }
	});
	
	return;
	
	
		xmlDocument = encodeURIComponent(bpmn);
	
	*/
	if (typeof OmniXML == "undefined") {
		alert("No changes to save. BPMN Modeler requires you to make changes in order to save.");
		return;
	}
	waiting("Saving..");
	var data = {
		'action': 'omni_ajax_call',
		'command': 'modeler.saveDiagram',
		'processId': processId,
		'bpmn': OmniXML,
		'svg': OmniSVG
	};


	/*			jQuery( document ).ajaxError(function( event, request, settings , thrownError ,response ) {
							    
					alert("Error requesting data " + settings.url + thrownError  +request+"response:" +response);
									waiting("");
								    
				});
	*/

	jQuery.post(url, data, function (response) {
		waiting("");
		window.onbeforeunload = null;
		//				alert(response);
	}).error(function (event, request, settings, thrownError, response) {
		//                            alert("Error requesting data " + settings.url + thrownError  +request+"response:" +response);
		waiting("");
		window.onbeforeunload = null;

	});
}


// end of Modeler

function newModel() {
	//            alert("new");
	formData = [
		{ type: "settings", position: "label-left", labelWidth: 100, inputWidth: 120 },
		{
			type: "block", inputWidth: "auto", offsetTop: 12, list: [
				{ type: "input", name: "modelName", label: "New Model Name", value: "new model" },
				{ type: "input", name: "modelTitle", label: "New Model Title", value: "new model" },
				{ type: "button", value: "Proceed", offsetLeft: 70, offsetTop: 14 }
			]
		}
	];
	dhxWins = new dhtmlXWindows();
	//			dhxWins.attachViewportTo("vp");
	w1 = dhxWins.createWindow("w1", 40, 40, 300, 200);
	w1.setText("New Model");
	myForm = w1.attachForm(formData, true);

	myForm.attachEvent("onButtonClick", function (name) {
		var value = myForm.getItemValue("modelName");
		var title = myForm.getItemValue("modelTitle");
		//                        alert(value);
		dhxWins.unload();
		invokeAction('modeler.new', '&processName=' + value + '&processTitle=' + title);
	});

}

function invokeAction(action, params) {
	var inAdminMode = false;
	var seperator = '?';

	if (typeof omni_admin_page !== 'undefined') {
		inAdminMode = omni_admin_page;
	}
	if (inAdminMode)
		seperator = '&';

	var url = window.location.href.split(seperator)[0];
	url = url + seperator + "action=" + action + params;
	window.location = url;
	return;

}
function getAjaxUrl() {
	var baseUrl = window.location.href.split('?')[0];

	var url = baseUrl;
	if (ajax_object != null) {
		url = ajax_object.ajax_url;
	}
	return url;
}
function buildJsonForSave() {
	var saveData = new Object();
	var items = procJson['items'];
	var mods = Array();

	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (item['_modified'] == true)
			mods.push(item);
	}
	saveData["process"] = procJson['process'];
	saveData["items"] = mods;//procJson['items'];
	saveData["dataElements"] = procJson['dataElements'];
	saveData["actors"] = procJson['actors'];
	saveData["accessRules"] = procJson['accessRules'];
	saveData["notificationRules"] = procJson['notificationRules'];
	saveData["pools"] = procJson['pools'];

	return saveData;
	var jsonStr = JSON.stringify(objMap);
	alert(jsonStr);

	return jsonStr;

}
function saveJson() {
	waiting("Saving..");

	displayStatus("Saving Data.");
	var url = getAjaxUrl();
	var jsonStr = buildJsonForSave();
	/*            alert(jsonStr);
			    
				jsonStr.replace(/\n/g,"~~n");
				alert(jsonStr); */

	var processId = getParameterByName('processId');
	var data = {
		'action': 'omni_ajax_call',
		'command': 'process.saveJson',
		'processId': processId,
		'json': jsonStr
	};

	jQuery.post(url, data, function (response) {
		waiting("");
		displayStatus("Data Saved.");
		window.onbeforeunload = null;

	}, 'json')
		.error(function (event, request, settings, thrownError, response) {
			//                            alert("Error requesting data " + settings.url + thrownError  +request+"response:" +response);
			waiting("");
			window.onbeforeunload = null;
		});

}
function getJson() {
	waiting("Loading Data");
	displayStatus("Loading data...");
	var el = jQuery('#targetBlock');
	el.html("loading item details ...");
	var url = getAjaxUrl();
	window.onbeforeunload = null;

	var processId = getParameterByName('processId');
	var data = {
		'action': 'omni_ajax_call',
		'command': 'process.getJson',
		'processId': processId
	};
	//	 	alert(url+"data :"+data.action+" "+data.command+" "+data.file);

	/*
				jQuery.ajax({
				   url             :    url ,
				   type            :   'POST',
				   processData     :   false,
				   dataType        :   'text',
				   data            :   data,
				   success          :   function( data, textStatus, jqXHR ) {
										displayStatus("Data Loaded.");
										waiting("");
										procJson=data;
										jsonData=procJson;
										displayData(procJson);
										 },
				   error           :   function() {
										alert("Error requesting data " + settings.url + thrownError  +request+"response:" +response);
										waiting("");
										},
				   complete        :   function( response) {
										displayStatus("Data Loaded.");
								    
										}                                    
				});
	
	*/
	jQuery.post(url, data, function (response) {
		//			alert(response);
		displayStatus("Data Loaded.");

		waiting("");
		procJson = response;
		jsonData = procJson;
		displayData(procJson);
	}).error(function (event, request, settings, thrownError, response) {
		alert("Error requesting data " + event.responseText);
		waiting("");
	});
}
function validationError(item, tab) {
	displayItemDetails(item);

}

function validate() {
	displayStatus("validating...");
	var el = jQuery('#targetBlock');
	el.html("loading item details ...");
	var url = getAjaxUrl();


	var jsonStr = buildJsonForSave();

	var processId = getParameterByName('processId');
	var data = {
		'action': 'omni_ajax_call',
		'command': 'process.validate',
		'processId': processId,
		'json': jsonStr
	};
	//	 	alert(url+"data :"+data.action+" "+data.command+" "+data.file);
	jQuery.post(url, data, function (response) {
		displayStatus("Validated.");
		// jQuery UI solution
		/*
					var $dialog = jQuery('<div style="overflow-y: scroll;height:400px">'+response+'</div>')
							.dialog({
//                                            autoOpen: false,
									title: 'Validation Results',
									width: 500,
									height: 400
							});
		//return;
		*/
		// dhxWins solution
		dhxWins = new dhtmlXWindows();
		var w1 = dhxWins.createWindow("w1", 200, 200, 320, 450);
		w1.setText("Validation Results");
		w1.attachHTMLString('<div style="overflow-y: scroll;height:400px">' + response + '</div>');
	}).error(function (event, request, settings, thrownError, response) {

		//                    alert(event.responseText);

		dhxWins = new dhtmlXWindows();
		var w1 = dhxWins.createWindow("w1", 200, 200, 320, 450);
		w1.setText("Validation Results");
		w1.attachHTMLString('<div style="overflow-y: scroll;height:400px">' + event.responseText + '</div>');

		//   alert("Error requesting data " + settings.url + thrownError  +request+"response:" +response);
		waiting("");
	});
}




//	------------------------------- Build Page
function BuildPage() {
	BuildMainLayout();
	BuildWorkArea();
}

var dxImgPath;

function BuildMainLayout() {
	dxImgPath = omni_base_url + '/lib/dhtmlx/codebase/imgs/';
	window.skin = "skyblue"; // for tree image_path
	dhtmlx.image_path = dxImgPath;

	main_layout = new dhtmlXLayoutObject('MainLayout', '2E');
	//      main_layout.setAutoSize("a", "a;b");
	var diagram = main_layout.cells('a');
	var scr = "<span style='float:right;'>Zoom:<a href='javascript:zoomDiag(1);'>+</a>";
	scr += "  <a href='javascript:zoomDiag(0);'>=</a>";
	scr += "  <a href='javascript:zoomDiag(-1);'>-</a></span>";
	diagram.setText('Diagram' + ' for Process ' + modelTitle + scr);
	diagram.setCollapsedText('Diagram' + ' for Process ' + modelTitle);

	//	diagram.hideHeader();
	diagram.attachObject("diagramContents");
	//        main_layout.cells("a").dhxcont.mainCont.style.overflow="auto";         
}
var zoomValue = 1;
var initialBox = null;
function zoomDiag(amount) {
	if (initialBox == null) {
		initialBox = jQuery("svg")[0].getAttribute('viewBox', viewBox);
		initialBox = initialBox.split(" ");
	}
	if (amount == 0)
		zoomValue = 1;
	else
		zoomValue += (amount / 10);

	var viewBox = initialBox[0] + ' ' + initialBox[1] + ' ' + Math.floor(initialBox[2] / zoomValue) + ' ' + Math.floor(initialBox[3] / zoomValue) + ' ';
	jQuery("svg")[0].setAttribute('viewBox', viewBox);
	//jQuery("svg").css('transform', 'scale('+zoomValue+')')  


}

function BuildWorkArea() {
	workArea = main_layout.cells('b');
	workArea.setText('Design Details');
	//        workArea.hideHeader();

	workAreaTabbar = workArea.attachTabbar();

	workAreaTabbar.addTab('ProcessItems', 'Process Items');
	var ProcessItems = workAreaTabbar.cells('ProcessItems');
	ProcessItems.setActive();

	BuildDataModel(workAreaTabbar);

	BuildAccessRules(workAreaTabbar);

	BuildNotificationRules(workAreaTabbar);

	BuildProcessItems();

	/*	workAreaTabbar.addTab('data','Data Model');
		var dataTab = workAreaTabbar.cells('data');
		dataTab.attachObject("DataModel"); */

	workAreaTabbar.addTab('ProcessDetails', 'Process Setting');
	var ProcessDetails = workAreaTabbar.cells('ProcessDetails');

	gridPools = ProcessDetails.attachGrid();
	gridPools.setIconsPath(dxImgPath);

	gridPools.setHeader(["Pool Name", "Implementation"]);
	gridPools.setColTypes("ro,co");

	combo = gridPools.getCombo(1);
	combo.put("", "Undefined");
	combo.put("all", "Full Implementation");
	combo.put("no", "No Implementation");
	combo.put("msgs", "Receive Messages Only");

	gridPools.setColumnIds("name,implementation");

	gridPools.setInitWidths("270,150");
	gridPools.setColAlign("left,left");
	gridPools.init();


	gridPools.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {

		var cId = gridPools.getColumnId(cInd);

		if (gridPools.getColType(cInd) == 'ch') {
			nValue = gridItemData.cells(rId, cInd).isChecked();
		}
		debug("onChange! " + stage + " row" + rId + " cell:" + cInd + ":" + cId + " value:" + nValue + " from " + oValue + " type:" + gridItemData.getColType(cInd));


		//        	var item = getObject('pools',rId);		
		//                item[cId]=nValue;
		setJsonValue('pools.[' + rId + '].' + cId, nValue);

		return true;
	});


	workAreaTabbar.addTab('docs', 'Documentation');
	var docs = workAreaTabbar.cells('docs');
	var str = [
		{ type: "settings", labelWidth: 80, inputWidth: 250, position: "absolute" },
		{ type: "editor", name: "form_input_description", label: "Editor", labelWidth: 900, inputWidth: 900, inputHeight: 120, labelLeft: 5, labelTop: 5, inputLeft: 5, inputTop: 21 }
	];
	procDocForm = docs.attachForm(str);
	procDocForm.attachEvent("onChange", function (status) {
		processFieldUpdated(procDocForm, status);
	});
	statusBar = workArea.attachStatusBar();
	displayStatus("starting");

}
function addTab(tabbar, id, title, obj) {
	tabbar.addTab(id, title);
	var tab = tabbar.cells(id);
	//tab.setActive();

	if (obj != null)
		tab.attachObject(obj);
	return tab;
}
function displayItemData(force, fromTab) {
	if (typeof (fromTab) === 'undefined') fromTab = false;
	if (force)
		ItemDataChanges = true;
	if (!ItemDataChanges)
		return;
	if ((itemTabbar.getActiveTab() == 'itemData') || fromTab) {
		debug("display item data");
		ItemDataChanges = false;
	}

	var item = getObject('items', currentItemId);

	if (item.dataElements == null) {
		item['dataElements'] = Array();
	}
	var des = item.dataElements;

	var objs = procJson['dataElements'];
	if (objs != null) {
		var rows = Array();
		for (var i = 0; i < objs.length; i++) {
			var processDataElement = objs[i];
			var view = "";
			var edit = "";
			var fldName = "";

			for (var d = 0; d < des.length; d++) {
				var de = des[d];
				if (de.refId == processDataElement.id) {
					if ((de.view === "true") || (de.view == true))
						view = true;
					if ((de.edit === "true") || (de.edit == true))
						edit = true;
					fldName = de.field;
				}
			}
			var row = { id: processDataElement.id, data: [processDataElement.name, view, edit, fldName] };
			rows.push(row)
		}

		var data = { rows: rows };
		gridItemData.clearAll();
		gridItemData.parse(data, "json");

		gridItemData.selectRow(0);
		var rowId = gridItemData.getSelectedRowId();

	}

	displayItemDescription(currentItemId);

}
function displayActiveScripts() {

	var path = 'items.[' + currentItemId + '].scripts';

	displayObject([ScriptsForm], path, gridScripts.getSelectedRowId());

	for (var i = 0; i < gridScripts.getRowsNum(); i++) {
		gridScripts.cells2(i, 0).setTextColor('gray');
	}
	var scripts = getObject(path, null);
	if (scripts !== null) {
		for (var i = 0; i < scripts.length; i++) {
			var scr = scripts[i];
			var id = scr['id'];
			gridScripts.cells(id, 0).setTextColor('black');

		}
	}

}
function displayItemDescription(itemId) {
	var html = getItemDescription(itemId);

	jQuery("#itemDescription").html(html);
}

function getItemDescription(itemId) {

	desc = getObject('itemsDescription', itemId);
	let type;
	jsonData.elements.forEach(el => {
		if (el.id == item.id) {
			type = el.type.replace('bpmn:','');
        }
	});
	if (!type)
		return;

	let desc = bpmn_descriptions[type];


	if (desc == null) {
		return '';
	}
	var html = "<table style='font-size:.8em'>";

	var pre = '';
	var post = '</td></tr>';
	html += getDescAttribute(desc, 'title', "<tr><td><b>", "</b>" + post);
	html += getDescAttribute(desc, 'desc', "<tr><td>", post);
	html += getDescAttribute(desc, 'userDoc', "<tr><td>", post);
	html += getDescAttribute(desc, 'start', "<tr><td>Start:", post);
	html += getDescAttribute(desc, 'completion', "<tr><td>Completion:", post);
	//    html+= getDescAttribute(desc,'designOptions',"<tr><td style='width:20%;'>Design Options:</td><td>",post);
	//    html+= getDescAttribute(desc,'modelOptions',"<tr><td style='width:20%;'>Model Options:</td><td>",post);

	html += "</table>";

	return html;

}
function getDescAttribute(desc, attr, pre, post) {
	txt = '';
	txt = desc[attr];
	if ((typeof txt === 'undefined') || (txt === null))
		return '';

	if (jQuery.isArray(txt)) {

		if (txt.length > 0) {
			var dOptions = "<ul>";
			for (var i = 0; i < txt.length; i++) {
				var opt = txt[i];
				dOptions += "<li>" + opt + "</li>";
			}
			dOptions += "</ul>";
			txt = dOptions;
		}
	}
	if (txt == '')
		return '';
	else
		return pre + txt + post;
}
function updateItemData(rowId, field, value) {
	debug("updating item data");

	setJsonValue('items.[' + currentItemId + '].dataElements.[refId=' + rowId + '].' + field, value);

}

var ItemDataChanges = true;
//	----------------------------------
function BuildMonitorForItemData() {
	workAreaTabbar.attachEvent("onSelect", function (id, lastId) {

		displayItemData(false);

		return true;
	});

	itemTabbar.attachEvent("onSelect", function (id, lastId) {
		if ((id == 'itemData') || (id == 'itemDT'))
			displayItemData(false, true);
		return true;
	});

	gridItems.attachEvent("onRowSelect", function (rowId, cellIndex) {
		displayItemData(true);	// force a display
	});



}
function cancelChanges() {
	dhtmlx.confirm({
		type: "confirm-warning",
		text: "this will cancel all the changes",
		callback: function (ret) {

			if (ret)
				getJson();

		}
	});

}
function BuildProcessItems() {
	var ProcessItems = workAreaTabbar.cells('ProcessItems');


	//	var itemsMenu = workAreaTabbar.attachMenu();

	var layout_2 = ProcessItems.attachLayout('2U');
	var itemsList = layout_2.cells('a');
	itemsList.setWidth(360);
	itemsList.hideHeader();
	//	itemsList.attachObject("proessItems");	// adding the list select to this cell
	//  replace by grid 

	gridItems = itemsList.attachGrid();
	gridItems.setIconsPath(dxImgPath);

	gridItems.setHeader(["Type", "Name"]);
	gridItems.setColTypes("ro,ro");
	gridItems.setColumnIds("type,name");

	gridItems.setInitWidths("150,250");
	gridItems.setColAlign("left,left");

	gridItems.setColSorting('str,str');
	gridItems.init();

	gridItems.attachEvent("onRowSelect", function (rowId, cellIndex) {
		displayItemDetails(rowId);
	});

	// end of grid

	var ItemDetails = layout_2.cells('b');
	ItemDetails.hideHeader();
	itemTabbar = ItemDetails.attachTabbar();

	var tab = addTab(itemTabbar, 'itemDetails', "Item Details", "itemDetails");
	tab.setActive();

	var str1 =
		[
			{
				"type": "fieldset", "name": "MessageName", "label": "Message Name", "inputWidth": "auto", "list": [
					{ "type": "input", "name": "form_input_message", "label": "Message Name", "labelWidth": 105, "inputWidth": 150 }
				]
			},
			{
				"type": "fieldset", "name": "TargetProcess", "label": "Target Process", "inputWidth": "auto", "list": [
					{ "type": "input", "name": "form_input_targetProcessName", "label": "Target Process Name", "labelWidth": 105, "inputWidth": 150 },
					{ "type": "newcolumn" },
					{ "type": "input", "name": "form_input_targetNodeId", "label": "Target Node Id", "labelWidth": 105, "inputWidth": 150 }
				]
			},
			{
				"type": "fieldset", "name": "DecisionTable", "label": "Business Rule", "inputWidth": "auto", "list": [
					{ "type": "input", "name": "form_input_decisionTable", "label": "Decision Table Name", "labelWidth": 105, "inputWidth": 150 }
				]
			},
			{
				"type": "fieldset", "name": "MultiInstance", "label": "Multi-Instances", "inputWidth": "auto", "list": [
					{ "type": "input", "name": "form_input_multiInstDatapath", "label": "Data Path", "labelWidth": 105, "inputWidth": 150 }
				]
			},
			{
				"type": "fieldset", "name": "Flow Navigation", "label": "Flow Navigation", "inputWidth": "auto", "list": [
					{ "type": "input", "name": "form_input_fromNodeLabel", "label": "From", "labelWidth": 105, "inputWidth": 150 },
					{ "type": "newcolumn" }, { "type": "input", "name": "form_input_toNodeLabel", "label": "To", "labelWidth": 105, "inputWidth": 150 }
				]
			},
			{
				"type": "fieldset", "name": "Timer", "label": "Timer", "inputWidth": "auto", "list": [
					{
						"type": "select", "name": "form_input_timerType", "label": "Timer Type", "labelWidth": 105, "inputWidth": 150,
						"options": [{ "text": "", "value": "" },
						{ "text": "DateTime", "value": "DateTime" },
						{ "text": "duration", "value": "duration" }]
					},
					{ "type": "input", "name": "form_input_timer", "label": "Timer value", "labelWidth": 105, "inputWidth": 150 },
					{ "type": "newcolumn" },
					{ "type": "input", "name": "form_input_timerRepeat", "label": "Repeat", "labelWidth": 105, "inputWidth": 150 }
				]
			},
			{
				"type": "fieldset", "name": "Gateway", "label": "Gateway", "inputWidth": "auto", "list": [
					{
						"type": "select", "name": "form_input_direction", "label": "Direction?", "labelWidth": 105, "inputWidth": 150,
						"options": [{ "text": "", "value": "" }, { "text": "Converging", "value": "Converging" },
						{ "text": "Diverging", "value": "Diverging" }]
					},
					{ "type": "newcolumn" },
					{ "type": "input", "name": "form_input_defaultFlowId", "label": "Default Flow", "labelWidth": 105, "inputWidth": 150 }
				]
			},
			{
				"type": "fieldset", "name": "TaskClass", "label": "Task Class", "inputWidth": "auto", "list": [
					/*		{"type":"input","name":"form_input_actionLabel","label":"Task Class","labelWidth":105,"inputWidth":350,rows:3},
									{ type:"button" , name:"form_button_edit", label:"Edit", value:"Edit", 
									width:"50", inputWidth:50 , inputTop:-40 , inputLeft:0},		*/
					{
						type: "select", name: "form_input_actionType", label: "Task Class", labelWidth: 100, "inputWidth": 350, labelAlign: "left",
/*			"options":[					
                                        {"text":"Default","value":"-"},
                                        {"text":"Questionnaire","value":"Questionnaire"},
					{"text":"Approval","value":"Approval"},
					{"text":"Due Diligence","value":"DueDiligence"},
					{"text":"Form","value":"Form"}] */},
					{ "type": "input", "name": "form_input_actionParameters", "label": "Parameters", "labelWidth": 105, "inputWidth": 350, rows: 3 }
				]
			},
			{
				"type": "fieldset", "name": "Management", "label": "Management", "inputWidth": "auto", "list": [
					{ "type": "input", "name": "form_input_priority", "label": "Priority", "labelWidth": 105, "inputWidth": 150 },
					{ "type": "newcolumn" },
					{ "type": "input", "name": "form_input_deadline", "label": "Deadline", "labelWidth": 105, "inputWidth": 150 },
					{ "type": "input", "name": "form_input_effort", "label": "Effort", "labelWidth": 105, "inputWidth": 150 }
				]
			},
			{
				"type": "fieldset", "name": "Navigation", "label": "Navigation", "inputWidth": "auto", "list": [
					{ "type": "input", "name": "form_input_inflowsLabels", "label": "In-Flows", "labelWidth": 105, "inputWidth": 150 },
					{ "type": "newcolumn" },
					{ "type": "input", "name": "form_input_outflowsLabels", "label": "Out-Flows", "labelWidth": 105, "inputWidth": 150 }
				]
			},
			{
				"type": "fieldset", "name": "General", "label": "General", "inputWidth": "auto", "list": [
					{ "type": "input", "name": "form_input_type", "label": "Type", "labelWidth": 105, "inputWidth": 150 },
					{ "type": "input", "name": "form_input_subType", "label": "subType", "labelWidth": 105, "inputWidth": 150 },
					/*		{"type":"input","name":"form_input_actor","label":"Actor","labelWidth":105,"inputWidth":150}, */
					{ "type": "newcolumn" },
					{ "type": "input", "name": "form_input_name", "label": "Name", "labelWidth": 105, "inputWidth": 150 },
					{ "type": "input", "name": "form_input_id", "label": "Id", "labelWidth": 105, "inputWidth": 150 },
					{ "type": "input", "name": "form_input_pool", "label": "Pool", "labelWidth": 105, "inputWidth": 150 }
				]
			}
		]
	// Message
	var strMsg = [{
		"type": "fieldset", "name": "Message", "label": "Message", "inputWidth": "auto", "list": [
			{ "type": "input", "name": "form_input_targetProcessName", "label": "Target Process Name", "labelWidth": 105, "inputWidth": 150 },
			{ "type": "newcolumn" },
			{ "type": "input", "name": "form_input_targetNodeId", "label": "Target Node Id", "labelWidth": 105, "inputWidth": 150 }
		]
	}]
	// Signal
	var strSignal = [{
		"type": "fieldset", "name": "Signal", "label": "Signal", "inputWidth": "auto", "list": [
			{ "type": "input", "name": "form_input_signalName", "label": "Signal", "labelWidth": 105, "inputWidth": 150 }
		]
	}]
	// Action
	var str2 = [{
		"type": "fieldset", "name": "Action", "label": "Action", "inputWidth": "auto", "list": [{ "type": "select", "name": "form_input_actionType", "label": "Action Type", "labelWidth": 105, "inputWidth": 150, "options": [{ "text": "None", "value": "None" }, { "text": "Form", "value": "Form" }, { "text": "Script", "value": "Script" }, { "text": "Function", "value": "Function" }] },
		{ "type": "input", "name": "form_input_actionScript", "rows": 5, "label": "Action Script", "labelWidth": 105, "inputWidth": 425 }
		]
	}]
	// Scripts
	var strScripts = [{
		"type": "fieldset", "name": "Scripts", "label": "Scripts", "inputWidth": "auto", "list":
			[
				{ "type": "input", "name": "form_input_script", "rows": 8, "label": "Script", "labelWidth": 105, "inputWidth": 425 }
			]
	}]
	// Condition
	var str3 = [{
		"type": "fieldset", "name": "Condition", "label": "Condition", "inputWidth": "auto", "list": [
			{ "type": "input", "name": "form_input_condition", "rows": 5, "label": "Condition", "labelWidth": 105, "inputWidth": 425 }]
	}]

	ProcessItemForm = tab.attachForm(str1);

	actionTypeCombo = ProcessItemForm.getSelect('form_input_actionType');

	ProcessItemForm.attachEvent("onButtonClick", function (name) {
		var type;
		type = "Property";

		if (name == 'form_button_edit') {
			showComponentEditDialog();
		}
	});


	jQuery(ProcessItemForm).attr('id', 'ProcessItemForm');

	// scripts 
	if (true) {
		itemTabbar.addTab('scripts', 'Scripts');
		tab = itemTabbar.cells('scripts');
		var layout = tab.attachLayout('2U');

		var cell = layout.cells('a');
		cell.setWidth("100");
		cell.hideHeader();

		gridScripts = cell.attachGrid();
		gridScripts.setIconsPath(dxImgPath);

		gridScripts.setHeader(["Event", "Script"]);
		gridScripts.setColTypes("ro", "ch");
		gridScripts.setColumnIds("event", "script");

		gridScripts.setInitWidths("270");
		gridScripts.setColAlign("left");
		gridScripts.init();

		gridScripts.attachEvent("onRowSelect", function (rowId, cellIndex) {

			// display the gird
			// getCurrentItem 
			var path = 'items.[' + currentItemId + '].scripts';
			displayObject([ScriptsForm], path, rowId);

		});

		cell = layout.cells('b');
		cell.hideHeader();

		ScriptsForm = cell.attachForm(strScripts);

		ScriptsForm.attachEvent("onChange", function (fieldName) {
			var rowId = gridScripts.getSelectedRowId();
			var path = 'items.[' + currentItemId + '].scripts.[' + rowId + ']';

			//itemFieldUpdated(ScriptsForm,status,path);         
			var value = ScriptsForm.getItemValue(fieldName);
			var field = getPropertyFromField(fieldName);
			if (value == '') {
				deleteJsonObject(path);
			} else {
				setJsonValue(path + '.' + field, value);
			}
			displayActiveScripts();

		});
	}
	/* --------------------- Property -------------*/

	itemTabbar.addTab('condition', 'Condition');
	tab = itemTabbar.cells('condition');
	ConditionForm = tab.attachForm(str3);

	itemTabbar.addTab('action', 'Action');
	tab = itemTabbar.cells('action');
	ActionForm = tab.attachForm(str2);

	/*	itemTabbar.addTab('message','Message');
		  tab = itemTabbar.cells('message');
		  MessageForm = tab.attachForm(strMsg);
	*/
	itemTabbar.addTab('signal', 'Signal');
	tab = itemTabbar.cells('signal');
	SignalForm = tab.attachForm(strSignal);


	itemTabbar.addTab('itemData', 'Data Usage');
	tab = itemTabbar.cells('itemData');

	gridItemData = tab.attachGrid();
	gridItemData.setIconsPath(dxImgPath);

	gridItemData.setHeader(["Property Name", "Visible/View", "Edit", "Field Name"]);
	gridItemData.setColTypes("ro,ch,ch,ed");
	gridItemData.setColumnIds("name,view,edit,field");

	gridItemData.setInitWidths("270,50,50,200");
	gridItemData.setColAlign("left,left,left,left");
	gridItemData.setColSorting('str,str');
	gridItemData.enableDragAndDrop(true);
	gridItemData.init();
	//	gridItemData.sync(dataElementsStore);
	gridItemData.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {

		var cId = gridItemData.getColumnId(cInd);

		if (gridItemData.getColType(cInd) == 'ch') {
			nValue = gridItemData.cells(rId, cInd).isChecked();
		}
		debug("onChange! " + stage + " row" + rId + " cell:" + cInd + ":" + cId + " value:" + nValue + " from " + oValue + " type:" + gridItemData.getColType(cInd));
		updateItemData(rId, cId, nValue);
		return true;
	});

	BuildDataMap(itemTabbar);
	//---------------

	itemTabbar.addTab('itemDoc', 'Documentation');
	tab = itemTabbar.cells('itemDoc');

	var str = [
		{ type: "settings", labelWidth: 80, inputWidth: 250, position: "absolute" },
		{ type: "editor", name: "form_input_description", label: "Editor", labelWidth: 900, inputWidth: 900, inputHeight: 120, labelLeft: 5, labelTop: 5, inputLeft: 5, inputTop: 21 }
	];

	ItemDocForm = tab.attachForm(str);
	ItemDocForm.attachEvent("onChange", function (status) {
		itemFieldUpdated(ProcessItemForm, status);
	});

	ProcessItemForm.attachEvent("onChange", function (status) {
		itemFieldUpdated(ProcessItemForm, status);
	});
	ActionForm.attachEvent("onChange", function (status) {
		itemFieldUpdated(ActionForm, status);
	});
	/*	MessageForm.attachEvent("onChange", function (status){
			itemFieldUpdated(MessageForm,status); 
		});
		SignalForm.attachEvent("onChange", function (status){
			itemFieldUpdated(SignalForm,status); 
		}); */
	ConditionForm.attachEvent("onChange", function (status) {
		itemFieldUpdated(ConditionForm, status);
	});
	ItemDocForm.attachEvent("onChange", function (status) {
		itemFieldUpdated(ItemDocForm, status);
	});


	itemTabbar.addTab('itemDescription', 'Description');
	tab = itemTabbar.cells('itemDescription');
	tab.attachHTMLString("<div id='itemDescription'>Item Description is here</div>");

	BuildMonitorForItemData();

}
function showComponentEditDialog() {

	var processId = getParameterByName('processId');
	cmd = '?action=omni_ajax_call&command=process.descignComponent&processId=' + processId
		+ '&item=' + currentItemId;

	var url = getAjaxUrl() + cmd;
	jQuery("#pop-dialog").load(url).dialog({ modal: true }).dialog('open');
	return;

}
function BuildDataMap(itemTabbar) {
	itemTabbar.addTab('itemDataMap', 'Data Map');
	var tab = itemTabbar.cells('itemDataMap');

	// tab.hideHeader();
	directionTabBar = tab.attachTabbar();

	directionTabBar.addTab('input', 'Input Map');
	directionTabBar.addTab('output', 'Output Map');

	var tab1 = directionTabBar.cells("input");
	tab1.setActive();
	gridDataMapInput = initDataMapTab(tab1, 'dataMapInput');

	var tab2 = directionTabBar.cells("output");

	gridDataMapOutput = initDataMapTab(tab2, 'dataMapOutput');
}
//====

function initDataMapTab(tab, dataElement) {
	var layout = tab.attachLayout('2E');

	var cell = layout.cells('a');
	cell.setHeight("15");
	cell.hideHeader();
	cell.setText('');

	var str = [
		{ type: "settings", labelWidth: 80, inputWidth: 250, position: "absolute" },
		{
			type: "button", name: "form_button_add", label: "Add Rule", value: "Add Map",
			width: "75", inputWidth: 75, inputTop: 5, inputLeft: 20
		},
		{
			type: "button", name: "form_button_del", label: "Delete Rule", value: "Delete Map",
			width: "75", inputWidth: 75, inputTop: 5, inputLeft: 140
		}
	];

	var form = cell.attachForm(str);
	form.attachEvent("onButtonClick", function (name) {
		var type;
		type = "Property";
		var path = 'items.[' + currentItemId + '].' + dataElement;

		if (name == 'form_button_add') {
			var defaults = {};
			newObject(grid, path, defaults);
		}
		if (name == 'form_button_del') {
			deleteObject(grid, path);
		}
	});

	cell = layout.cells('b');
	cell.hideHeader();

	var grid;

	grid = cell.attachGrid();

	grid.setIconsPath(dxImgPath);

	grid.setHeader(["External Name", "Value Type", "Value"]);

	grid.setColTypes("ed,coro,ed");

	var dmValueType = grid.getCombo(1);
	dmValueType.put("L", "Literal Value");
	dmValueType.put("V", "Process Variable");
	dmValueType.put("E", "Expression");

	grid.setColumnIds("fieldName,valueType,value");

	grid.setInitWidths("120,120,200");
	grid.setColAlign("left,left,left");
	grid.setColSorting('str,str,str');


	//        grid.enableColumnMove(true);
	//        grid.setColumnColor("gray,white,white,#d5f1ff,#d5f1ff");
	grid.enableDragAndDrop(true);

	grid.init();

	//        newObject(grid,'dataElements',defaults);
	//	grid.sync(dataElementsStore);
	grid.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {

		if (stage == 2) {
			var cId = grid.getColumnId(cInd);

			if (grid.getColType(cInd) == 'ch') {
				nValue = grid.cells(rId, cInd).isChecked();
			}
			debug("onChange! " + stage + " row" + rId + " cell:" + cInd + ":" + cId + " value:"
				+ nValue + " from " + oValue + " type:" + grid.getColType(cInd));
			setJsonValue('items.[' + currentItemId + '].' + dataElement + '.[' + rId + '].' + cId, nValue);
		}
		return true;
	});

	return grid;
}
function displayDataMaps() {
	var data1 = getJsonNode('items.[' + currentItemId + '].dataMapInput').data;
	var data2 = getJsonNode('items.[' + currentItemId + '].dataMapOutput').data;

	if (data1 == null)
		gridDataMapInput.clearAll();
	else
		populateGrid(gridDataMapInput, data1);
	if (data2 == null)
		gridDataMapOutput.clearAll();
	else
		populateGrid(gridDataMapOutput, data2);
}

function BuildDataModel(tabbar) {
	tabbar.addTab('dataModel', 'Data Model');
	var dataModel = tabbar.cells('dataModel');
	var layout_3 = dataModel.attachLayout('2U');

	/* --------------------- Properties List -------------*/

	//	dataElementsStore = new dhtmlXDataStore()


	var cell_9 = layout_3.cells('a');
	cell_9.setText('Properties');

	var grid_4 = cell_9.attachGrid();
	grid_4.setIconsPath(dxImgPath);

	grid_4.setHeader(["Name", "Title", "Type"]);
	grid_4.setColTypes("ro,ro,ro");
	grid_4.setColumnIds("name,title,dataType");

	grid_4.setInitWidths("270,250,100");
	grid_4.setColAlign("left,left,left");
	//	grid_4.setColTypes("ed,ed");


	grid_4.setColSorting('str,str');
	grid_4.init();

	gridDataElements = grid_4;
	gridDataElements.attachEvent("onRowSelect", function (rowId, cellIndex) {
		displayProperty(rowId);
	});

	/* --------------------- Property -------------*/
	var cell_6 = layout_3.cells('b');
	cell_6.setText('Property Details');

	var str = [
		{ type: "settings", labelWidth: 80, inputWidth: 250, position: "absolute" },
		{
			type: "button", name: "form_button_prop", label: "New Property", value: "New Property",
			width: "75", inputWidth: 75, inputTop: 5, inputLeft: 20
		},
		{
			type: "button", name: "form_button_del", label: "Delete Property", value: "Delete Property",
			width: "75", inputWidth: 75, inputTop: 5, inputLeft: 140
		},
		{
			"type": "fieldset", "name": "Property", "label": "Property", "inputWidth": "auto",
			offsetLeft: 10, offsetTop: 40, "list": [
				{ type: "settings", position: "label-left" },
				{ type: "input", name: "form_input_name", label: "Name", labelWidth: 100, labelAlign: "left" },
				{ type: "input", name: "form_input_title", label: "Title", labelWidth: 100, labelAlign: "left" },
				{ type: "input", name: "form_input_description", label: "Description", labelWidth: 100, labelAlign: "left" },
				{
					type: "select", name: "form_input_dataType", label: "Data Type", labelWidth: 100, labelAlign: "left",
					"options": [{ "text": "String", "value": "String" },
					{ "text": "Number", "value": "Number" },
					{ "text": "Text", "value": "Text" },
					{ "text": "Select", "value": "Select" },
					{ "text": "Date", "value": "Date" },
					{ "text": "Checkbox", "value": "Checkbox" },
					{ "text": "Business Object", "value": "BusinessObject" },
					{ "text": "Record", "value": "Record" },
					{ "text": "Radio", "value": "Radio" },
					{ "text": "Email", "value": "Email" },
					{ "text": "File", "value": "File" }]
				},
				{ type: "input", name: "form_input_record", label: "Parent Record", labelWidth: 100, labelAlign: "left" },
				{ type: "input", name: "form_input_taskId", label: "Scope Task Id", labelWidth: 100, labelAlign: "left" },
				{ type: "input", name: "form_input_validValues", label: "Valid Values", rows: 3, labelWidth: 100, labelAlign: "left" },
				{ type: "input", name: "form_input_options", label: "Options", rows: 3, labelWidth: 100, labelAlign: "left" },
				{ type: "checkbox", name: "form_input_req", label: "Required", labelWidth: 100, labelAlign: "left" }
			]
		}
	];
	form_prop = cell_6.attachForm(str);
	form_prop.attachEvent("onChange", function (fieldName) {
		var field = getPropertyFromField(fieldName);
		var value = form_prop.getItemValue(fieldName);

		ItemDataChanges = true;

		debug("onChange!" + fieldName + " val:" + value + " for de:" + currentDataElementId);
		if (field == 'name')
			gridDataElements.cells(currentDataElementId, 0).setValue(value);
		if (field == 'title')
			gridDataElements.cells(currentDataElementId, 1).setValue(value);
		if (field == 'dataType')
			gridDataElements.cells(currentDataElementId, 2).setValue(value);

		setJsonValue("dataElements.[" + currentDataElementId + "]." + field, value)
		//		var de = getObject('dataElements',currentDataElementId);
		//		de[field]=value;
	});


	//	form_prop.sync(dataElementsStore);
	//	gridDataElements.sync(dataElementsStore);

	form_prop.bind(gridDataElements);
	form_prop.attachEvent("onButtonClick", function (name) {

		var type;
		type = "Property";

		if (name == 'form_button_prop') {
			ItemDataChanges = true;
			var defaults = { name: "new Property", type: type };
			newObject(gridDataElements, 'dataElements', defaults);
			/*			var newId=(new Date()).valueOf();
						var rowId=gridDataElements.getSelectedRowId();
						var indx=gridDataElements.getRowIndex(rowId);
						
						gridDataElements.addRow(newId,"new Property,"+type,indx+1);
						indx=gridDataElements.getRowIndex(newId);
						gridDataElements.selectRow(indx,true,false,true);
			*/
		}
		if (name == 'form_button_del') {
			ItemDataChanges = true;
			deleteObject(gridDataElements, 'dataElements');
			displayProperty(gridDataElements.getSelectedRowId());
		}

	});
}

var arActorCombo1;
var arActorCombo2;
var nrActorCombo;
var nrTasksCombo1;
var nrTasksCombo2;

function populateActorCombo() {
	populateArActorCombo();
	populateCombo(nrActorCombo, procJson['actors'], 'actor', 'actor');
}
function populateArActorCombo() {
	populateCombo(arActorCombo1, procJson['actors'], 'actor', 'actor');
	populateCombo(arActorCombo2, procJson['actors'], 'actor', 'actor');

	return;
	var data = procJson['accessRules'];
	for (var i = 0; i < data.length; i++) {
		var ar = data[i];
		var val = ar['asActor'];
		if ((val !== '') && (val !== null)) {
			arActorCombo.put(val, val);
		}
	}
}
function BuildAccessRules(tabbar) {
	tabbar.addTab('access', 'Access Rules');
	var dataModel = tabbar.cells('access');
	var layout_3 = dataModel.attachLayout('3L');

	var cell_9 = layout_3.cells('a');
	cell_9.setText('Access Rules');

	gridAccessRules = cell_9.attachGrid();
	gridAccessRules.setIconsPath(dxImgPath);

	gridAccessRules.setHeader(["User Goup", "Actor", "Privilege", "On", "As Actor", "Can Change", "Work Scope Type", "WorkScope Variable"]);
	gridAccessRules.setColTypes("co,co,co,co,ed,ch,co,co");
	gridAccessRules.setColumnIds("userGroup,actor,privilege,nodeId,asActor,canChange,workScopeType,workScopeVariable");

	gridAccessRules.setInitWidths("100,80,80,40,40,150,80,40");
	gridAccessRules.setColAlign("center,center,center,center,left,center,center,center,center");

	arUserGroupCombo = gridAccessRules.getCombo(0);
	arActorCombo1 = gridAccessRules.getCombo(1);
	arActorCombo2 = gridAccessRules.getCombo(4);

	combo = gridAccessRules.getCombo(2);
	combo.put("V", "View");
	combo.put("P", "Perform");
	combo.put("A", "Assign");

	combo = gridAccessRules.getCombo(3);
	combo.put("__Process__", "Process");

	gridAccessRules.init();

	gridAccessRules.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {

		var cId = gridAccessRules.getColumnId(cInd);

		if (gridAccessRules.getColType(cInd) == 'ch') {
			nValue = gridAccessRules.cells(rId, cInd).isChecked();
		}
		if (cId == 'asActor') {
			//                    populateArActorCombo();
		}
		debug("onChange! " + stage + " row" + rId + " cell:" + cInd + ":" + cId + " value:" + nValue + " from " + oValue + " type:" + gridItemData.getColType(cInd));


		setJsonValue('accessRules.[' + rId + '].' + cId, nValue)

		return true;
	});

	/* --------------------- Property -------------*/
	var cell_6 = layout_3.cells('b');
	cell_6.setText('');

	var str = [
		{ type: "settings", labelWidth: 80, inputWidth: 250, position: "absolute" },
		{
			type: "button", name: "form_button_add", label: "Add Rule", value: "Add Rule",
			width: "75", inputWidth: 75, inputTop: 5, inputLeft: 20
		},
		{
			type: "button", name: "form_button_del", label: "Delete Rule", value: "Delete Rule",
			width: "75", inputWidth: 75, inputTop: 5, inputLeft: 140
		},
		{
			type: "button", name: "form_button_addA", label: "Add Actor", value: "Add Actor",
			width: "75", inputWidth: 75, inputTop: 55, inputLeft: 20
		},
		{
			type: "button", name: "form_button_delA", label: "Delete Adtor", value: "Delete Actor",
			width: "75", inputWidth: 75, inputTop: 55, inputLeft: 140
		}
	];

	cell_6.setHeight(120);
	form_access = cell_6.attachForm(str);
	form_access.attachEvent("onChange", function (fieldName) {

		var field = getPropertyFromField(fieldName);
		var value = form_prop.getItemValue(fieldName);

		debug("onChange!" + fieldName + " val:" + value + " for de:" + currentDataElementId);
	});


	form_access.attachEvent("onButtonClick", function (name) {
		var type;
		type = "Property";

		if (name == 'form_button_add') {
			var defaults = {};
			newObject(gridAccessRules, 'accessRules', defaults);
		}
		if (name == 'form_button_del') {
			deleteObject(gridAccessRules, 'accessRules');
		}
		if (name == 'form_button_addA') {
			var defaults = {};
			newObject(gridActors, 'actors', defaults);
			populateActorCombo();
		}
		if (name == 'form_button_delA') {
			deleteObject(gridActors, 'actors');
			populateActorCombo();
		}


	});

	// Actors
	var cell_7 = layout_3.cells('c');
	cell_7.setText('Actors');

	gridActors = cell_7.attachGrid();
	gridActors.setIconsPath(dxImgPath);

	gridActors.setHeader(["Actor", "Description"]);
	gridActors.setColTypes("ed,ed");
	gridActors.setColumnIds("actor,description");

	gridActors.setInitWidths("100,300");
	gridActors.setColAlign("center,center");
	gridActors.init();

	gridActors.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {

		var cId = gridActors.getColumnId(cInd);

		if (gridActors.getColType(cInd) == 'ch') {
			nValue = gridItemData.cells(rId, cInd).isChecked();
		}
		debug("onChange! " + stage + " row" + rId + " cell:" + cInd + ":" + cId + " value:" + nValue + " from " + oValue + " type:" + gridItemData.getColType(cInd));

		setJsonValue('actors.[' + rId + '].' + cId, nValue)
		populateActorCombo();
		return true;
	});


}
function BuildNotificationRules(tabbar) {
    /*  var id;
     *  var $userType;   // Group, Actor , assigN users
 var $userId;             // user id
 var $userGroup;        // user group name
 var $actor;
 
 var $nodeId;      // null for process 
 
 var $eventType;     //  Start , Completion , Assigned , Unassigned work, Error  
 var $delay;
 
 var $cancelIf;      // Completed , Assigned
     */
	tabbar.addTab('notification', 'Notifications');
	var dataModel = tabbar.cells('notification');
	var layout_3 = dataModel.attachLayout('2U');

	var cell_9 = layout_3.cells('a');
	cell_9.setText('Notifications');

	gridNotificationRules = cell_9.attachGrid();
	gridNotificationRules.setIconsPath(dxImgPath);

	gridNotificationRules.setHeader(["User Type", "User Goup", "Actor", "When", "On", "Delay", "Cancel on"
		, "template", "repeat after", "repeat count"]);
	gridNotificationRules.setColTypes("co,co,co,co,co,ed,co,ed,ed,ed");
	gridNotificationRules.setColumnIds("userType,userGroup,actor,eventType,nodeId,delay,cancelIf,template,repeatAfter,repeatCount");

	gridNotificationRules.setInitWidths("50,50,50,50,100,50,50,50,50,50");
	gridNotificationRules.setColAlign("center,center,center");

	var nrUserType = gridNotificationRules.getCombo(0);
	nrUserType.put("G", "User Group");
	nrUserType.put("A", "Actor");
	nrUserType.put("N", "Assigned Users");
	var nrEventType = gridNotificationRules.getCombo(3);
	nrEventType.put("S", "Start");
	nrEventType.put("C", "Completion");
	nrEventType.put("A", "Assigned");
	nrEventType.put("U", "Unassigned");
	nrEventType.put("E", "Error");
	nrActorCombo = gridNotificationRules.getCombo(2);

	nrTasksCombo1 = gridNotificationRules.getCombo(4);
	nrTasksCombo2 = gridNotificationRules.getCombo(6);
	nrTasksCombo1.put("__Process__", "Process");
	//          nrTasksCombo2.put("__Process__","Process");
	nrTasksCombo2.put("S", "Start");
	nrTasksCombo2.put("C", "Completion");
	nrTasksCombo2.put("A", "Assigned");
	nrTasksCombo2.put("U", "Unassigned");
	nrTasksCombo2.put("E", "Error");

	gridNotificationRules.init();

	gridNotificationRules.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {

		var cId = gridNotificationRules.getColumnId(cInd);

		debug("onChange! " + stage + " row" + rId + " cell:" + cInd + ":" + cId + " value:" + nValue + " from " + oValue + " type:" + gridItemData.getColType(cInd));

		setJsonValue('notificationRules.[' + rId + '].' + cId, nValue)

		return true;
	});

	/* --------------------- Property -------------*/
	var cell_6 = layout_3.cells('b');
	cell_6.setText('');

	var str = [
		{ type: "settings", labelWidth: 80, inputWidth: 250, position: "absolute" },
		{
			type: "button", name: "form_button_add", label: "Add Notification", value: "Add Notification",
			width: "75", inputWidth: 75, inputTop: 5, inputLeft: 20
		},
		{
			type: "button", name: "form_button_del", label: "Delete Notification", value: "Delete Notification",
			width: "75", inputWidth: 75, inputTop: 5, inputLeft: 140
		}
	];

	cell_6.setHeight(120);
	form_access = cell_6.attachForm(str);

	form_access.attachEvent("onButtonClick", function (name) {
		var type;
		type = "Property";

		if (name == 'form_button_add') {
			var defaults = {};
			newObject(gridNotificationRules, 'notificationRules', defaults);
		}
		if (name == 'form_button_del') {
			deleteObject(gridNotificationRules, 'notificationRules');
		}
	});

}

function deleteObject(grid, path) {
	var rowId = grid.getSelectedRowId();
	var indx = grid.getRowIndex(rowId);
	//			var arr=procJson[path];
	//                        if (arr==null)
	{
		var parentNode = getJsonNode(path);
		if (parentNode.data == null) {
			parentNode.parent[parentNode.node] = Array();
			arr = parentNode.parent[parentNode.node];
		}
		else
			arr = parentNode.data;
	}

	var newArr = arr.splice(indx, 1);
	grid.deleteRow(rowId);

	if (indx == grid.getRowsNum())
		indx--;
	grid.selectRow(indx);

}
function newObject(grid, path, defaultValues) {
	var newId = (new Date()).valueOf();
	var rowId = grid.getSelectedRowId();
	var indx = grid.getRowIndex(rowId);
	var beforeObj = getObject(path, rowId);

	var values = Array();
	for (var k in defaultValues) {
		values.push(defaultValues[k]);
	}

	grid.addRow(newId, values, indx + 1);

	indx = grid.getRowIndex(newId);
	var object = defaultValues;
	object['id'] = newId;
	/* causing errors with child grids                        */
	//			var arr=procJson[path];
	//                        if (arr==null)
	{
		var parentNode = getJsonNode(path);
		if (parentNode.data == null) {
			parentNode.parent[parentNode.node] = Array();
			arr = parentNode.parent[parentNode.node];
		}
		else
			arr = parentNode.data;
	}
	var newArr = arr.splice(indx, 0, object);
	grid.selectRow(indx, true, false, true);
}
function itemFieldUpdated(form, fieldName) {
	var value = form.getItemValue(fieldName);
	debug("onChange!" + fieldName + " val:" + value + " for row:" + currentItemId);
	var field = getPropertyFromField(fieldName);
	setJsonValue('items.[' + currentItemId + '].' + field, value);
}
function processFieldUpdated(form, fieldName) {
	var value = form.getItemValue(fieldName);
	debug("onChange!" + fieldName + " val:" + value);
	var field = getPropertyFromField(fieldName);
	setJsonValue('process.' + field, value);
}
function initFields() {
	ProcessItemForm.setReadonly('form_input_id', true);

	ProcessItemForm.setReadonly('form_input_type', true);
	ProcessItemForm.setReadonly('form_input_subType', true);

	ProcessItemForm.setReadonly('form_input_pool', true);
	ProcessItemForm.setReadonly('form_input_inflowsLabels', true);
	ProcessItemForm.setReadonly('form_input_outflowsLabels', true);
	ProcessItemForm.setReadonly('form_input_fromNodeLabel', true);
	ProcessItemForm.setReadonly('form_input_toNodeLabel', true);
}
function displayObject(forms, path, objectId) {
	var obj = getObject(path, objectId);


	forms.forEach(function (form) {
		form.forEachItem(function (name) {
			var type = form.getItemType(name);
			if ((type == 'input') || (type == 'select') || (type == 'checkbox') || (type == 'editor')) {
				var fieldName = getPropertyFromField(name);
				if (obj == null) {
					form.setItemValue(name, '');
				}
				else {
					if (fieldName in obj) {
						var val = obj[fieldName];
						form.setItemValue(name, val);
					}
					else {
						form.setItemValue(name, null);
					}
				}
			}
		});
	});
}
function displayProperty(rowId) {
	currentDataElementId = rowId;
	displayObject([form_prop], 'dataElements', rowId);
}
function getPropertyFromField(fieldName) {
	if (fieldName.indexOf("form_input") == 0) {
		var l = "form_input_".length;
		return fieldName.substring(l);
	}
	return fieldName;
}
var descDialog = null;

function displayDescription(itemId) {
	if (itemId == null) {
		var html = 'click on any item in the diagram to view description.'
		var title = 'Model Helper';

	} else {
		var html = getItemDescription(itemId);
		var title = getJsonValue('itemsDescription.[' + itemId + '].label');

		//        var title = getObject('items',itemId).label;	
	}
	if (descDialog == null) {

		descDialog = jQuery('<div width="100%">' + html + '</div>')
			.dialog({
				title: title,
				autoOpen: true,
				width: 300,
				height: 300,
				overflow: "auto",
				resizeStop: function (event, ui) {
					//     alert(ui.size);
				},
				close: function (event, ui) {
					descDialog = null;
				}
			});
	}
	else {
		jQuery(descDialog).dialog('option', 'title', title);
		descDialog.html(html);
	}

}
function displayItemDetails(itemId) {
	if (inViewMode) {
		displayDescription(itemId);
		return;
	}

	if (inDesignMode) {
		currentItemId = itemId;

		workAreaTabbar.cells('ProcessItems').setActive();

		var forms = [ProcessItemForm, ActionForm, ConditionForm, ItemDocForm];

		displayObject(forms, 'items', itemId);
		checkItemFields(itemId);

		var rowId = gridItems.getSelectedRowId();
		if (rowId != itemId) {
			gridItems.selectRowById(itemId);
			displayItemData(true);
		}

		displayActiveScripts();
		displayDataMaps();

	}
}
function showHideCell(parent, cell, show) {
	if (show)
		parent.cells(cell).show();
	else
		parent.cells(cell).hide();
}
function showHideItem(parent, item, show) {
	if (show)
		parent.showItem(item);
	else
		parent.hideItem(item);
}


function checkItemFields(itemId) {
	var type = getItemValue('items', itemId, "type");
	var subtype = getItemValue('items', itemId, "subType");
	var hasMessage = getItemValue('items', itemId, "hasMessage");
	var hasSignal = getItemValue('items', itemId, "hasSignal");
	var hasTimer = getItemValue('items', itemId, "hasTimer");
	var isFlow = false;
	var isTask = false;
	var send = false;
	var receive = false;

	var multiInstance = false;

	var loopType = getItemValue('items', itemId, "loopType");

	if (loopType != null)
		multiInstance = true;

	if (type == 'receiveTask')
		receive = true;
	else if (type == 'intermediateCatchEvent' && subtype == 'message')
		receive = true;
	else if (type == 'endEvent' && subtype == 'message')
		send = true;
	else if (type == 'startEvent' && subtype == 'message')
		receive = true;
	else
		if (type == 'intermediateThrowEvent' || type == 'sendTask')
			send = true;


	if ((type.indexOf('Task') >= 0) || (type.indexOf('task') >= 0))
		isTask = true;

	if ((type == 'sequenceFlow') || (type == 'messageFlow'))
		isFlow = true;


	showHideCell(itemTabbar, 'itemDoc', !isFlow);
	showHideCell(itemTabbar, 'itemData', type == 'userTask');
	showHideCell(itemTabbar, 'itemDataMap',
		((send || receive || type == 'callActivity' || type == 'businessRuleTask')));

	if (receive)
		directionTabBar.cells('output').setText("Match Map");
	else
		directionTabBar.cells('output').setText("Output Map");

	showHideCell(directionTabBar, 'input', !send);


	showHideCell(itemTabbar, 'condition', isFlow);
	showHideItem(ProcessItemForm, "Flow Navigation", isFlow);
	showHideItem(ProcessItemForm, "Navigation", !isFlow);

	itemTabbar.cells('action').hide();


	showHideItem(ProcessItemForm, "Management", type == 'userTask');

	showHideItem(ProcessItemForm, "TargetProcess", send || (type.indexOf("callActivity") == 0));
	showHideItem(ProcessItemForm, "MessageName", receive);

	//        showHideItem(ProcessItemForm,"callActivity",(type.indexOf("callActivity")==0));

	showHideItem(ProcessItemForm, "DecisionTable", (type.indexOf("businessRuleTask") == 0));
	showHideItem(ProcessItemForm, "MultiInstance", multiInstance);

	showHideItem(ProcessItemForm, "Gateway", (type.indexOf("Gateway") != -1));

	//	showHideCell(itemTabbar,'message',hasMessage);
	showHideCell(itemTabbar, 'signal', hasSignal);
	showHideItem(ProcessItemForm, "Timer", hasTimer);

}

function displayData() {
	if (inViewMode)
		displayDescription(null);

	if (inDesignMode == false)
		return;
	//  display gridItems

	// Process details
	populateActorCombo();

	// Populate Select 
	// 
	// 
	//        actionTypeCombo= ProcessItemForm.getSelect('form_input_actionType');
	//        populateCombo(actionTypeCombo,procJson['actionTypes'],'name','title');
	var opts = ProcessItemForm.getOptions('form_input_actionType');
	opts.length = 0;
	var arr = Array();
	//            arr = new Array([[1,'opt1'], [2, 'opt2']);
	var data = procJson['actionTypes'];
	for (var i = 0; i < data.length; i++) {
		var obj = data[i];
		var id = obj['name'];
		var val = obj['title'];
		var opt = document.createElement("option");
		opt.text = val;
		opt.value = id;
		opts.add(opt);
	}

	// end of populate Select
	var combo = gridAccessRules.getCombo(0);
	populateCombo(combo, procJson['userRoles'], 'name', 'name');
	combo = gridNotificationRules.getCombo(1);
	populateCombo(combo, procJson['userRoles'], 'name', 'name');

	displayObject([procDocForm], 'process', null);

	combo = gridAccessRules.getCombo(3);
	var procItems = procJson["items"];

	for (var i = 0; i < procItems.length; i++) {
		var item = procItems[i];
		if ((item['type'] == 'userTask') || (item['type'] == 'startEvent')) {
			combo.put(item['id'], item['name']);
		}
	}

	for (var i = 0; i < procItems.length; i++) {
		var item = procItems[i];
		if ((item['superType'] == 'Task') || (item['superType'] == 'Event')) {
			var label = item['type'] + ':' + item['name'];
			nrTasksCombo1.put(item['id'], label);
			//            nrTasksCombo2.put(item['id'],label);                
		}
	}

	///
	populateGrid(gridScripts, procJson['scriptEvents']);

	populateGrid(gridActors, procJson['actors']);

	populateGrid(gridAccessRules, procJson['accessRules']);

	populateGrid(gridNotificationRules, procJson['notificationRules']);

	populateGrid(gridPools, procJson['pools']);


	var objs = procJson['items'];
	if (objs != null) {

		var rows = Array();
		for (var i = 0; i < objs.length; i++) {
			var obj = objs[i];
			var row = { id: obj.id, data: [obj.type, obj.name] };
			rows.push(row);

		}
		var data = { rows: rows };
		gridItems.clearAll();
		gridItems.parse(data, "json");

		gridItems.selectRow(0);
		var rowId = gridItems.getSelectedRowId();
		displayItemDetails(rowId);

	}

	// display gridObjects
	var objs = procJson['dataElements'];
	if (objs != null) {

		var rows = Array();
		for (var i = 0; i < objs.length; i++) {
			var obj = objs[i];
			if (obj.id == null)
				obj.id = 'dataElement' + i;
			var row = { id: obj.id, data: [obj.name, obj.title, obj.dataType] };
			rows.push(row)
		}
		var data = { rows: rows };
		gridDataElements.clearAll();
		gridDataElements.parse(data, "json");

		gridDataElements.selectRow(0);
		rowId = gridDataElements.getSelectedRowId();
		displayProperty(rowId);

	}

}
var treeIndx = 0;

function debugWindow(jsonRoot) {
	treeIndx = 0;
	dhxWins = new dhtmlXWindows();
	var w1 = dhxWins.createWindow("w1", 20, 30, 320, 400);
	w1.setText("Process Data");

	var tree = w1.attachTree();
	tree.setImagePath(dxImgPath + 'dhxtree_' + window.skin + '/');
	tree.deleteChildItems(0);
	//		tree.insertNewChild(0,1,"Root");

	debugObject(tree, jsonRoot, 0);

	tree.closeAllItems(0);
}

function debugObject(tree, object, parent) {
	if (object instanceof Array) {
		for (var i = 0; i < object.length; i++) {
			var obj = object[i];
			treeIndx++;
			if ((obj instanceof Array) || (obj instanceof Object)) {
				tree.insertNewChild(parent, treeIndx, i);
				debugObject(tree, obj, treeIndx);
			}
			else
				tree.insertNewChild(parent, treeIndx, i + " : " + obj);
		}
	}
	else {
		if (object instanceof Object) {
			for (var propertyName in object) {
				treeIndx++;
				var obj = object[propertyName];
				if ((obj instanceof Array) || (obj instanceof Object)) {
					tree.insertNewChild(parent, treeIndx, propertyName);
					debugObject(tree, obj, treeIndx);
				}
				else
					tree.insertNewChild(parent, treeIndx, propertyName + " : " + obj);
			}
		}
		else
			tree.insertNewChild(parent, treeIndx++, object);
	}
}
function waiting(msg) {
	if (msg == '') {
		jQuery("#omni_page").isLoading("hide");

	}
	else {
		jQuery("#omni_page")
			.isLoading({
				text: msg,
				position: "overlay"
			});
	}
    /*
    if (msg=='')
    {
         dhxWins.unload();
         return;
    }
    else
    {
        $( "selector" ).isLoading();    
    }
    
     dhxWins = new dhtmlXWindows();
     var w1 = dhxWins.createWindow("w1", 200, 200, 120, 120);
     w1.setText("waiting");
     w1.attachHTMLString(msg);
*/
}
function debug(msg) {
	//    dhtmlx.message(msg);
}