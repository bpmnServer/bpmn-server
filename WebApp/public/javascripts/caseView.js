        var jsonData;
//	--- Layout ---
	var main_layout;
	var workAreaTabbar;
	var itemTabbar;

// --- Item Forms -----
	var ProcessItemForm;
	var ActionForm;
	var ConditionForm;
	var ItemDocForm;

	var gridItems;
        var gridData;
        var gridNotifications;
        var gridNotificationLogs;
	var currentItemId;


	function getCaseJson()
	{
		var el=jQuery('#targetBlock');
	 	el.html("loading item details ...");
		var url=getAjaxUrl();

	 	var caseId=getParameterByName('caseId');
	 	var data = {
	 				'action': 'omni_ajax_call',
	 				'command': 'case.getJson',
	 				'caseId': caseId
	 			};
//	 	alert(url+"data :"+data.action+" "+data.command+" "+data.file);
		jQuery.post(url, data, function(response) {
	//		alert(response);
			jsonData=response;
//			displayCase(jsonData);
			}).error(function() {
                            alert("Error requesting data " + settings.url + thrownError  +request+"response:" +response);
                            waiting("");
                        }); 
	}
//	------------------------------- Build Page
	function BuildCasePage()
	{
		return;
		BuildCaseMainLayout();
		BuildCaseWorkArea();
	}

	var dxImgPath;
	
	function BuildCaseMainLayout()
	{
	dxImgPath=omni_base_url+'vendor/dhtmlx/codebase/imgs/';
	window.skin = "skyblue"; // for tree image_path
			dhtmlx.image_path=dxImgPath;

	main_layout = new dhtmlXLayoutObject('MainLayout', '2E');

	var diagram = main_layout.cells('a');
        var scr="<span style='float:right;'>Zoom:<a href='javascript:zoomDiag(1);'>+</a>";
        scr+="  <a href='javascript:zoomDiag(0);'>=</a>";
        scr+="  <a href='javascript:zoomDiag(-1);'>-</a></span>";
	diagram.setText('Diagram'+' for Case '+caseId+' - '+caseTitle+scr);
	diagram.setCollapsedText('Diagram'+' for Case '+caseId+' - '+caseTitle);
	
//	diagram.hideHeader();
	diagram.attachObject("diagramContents");
}
	

function BuildCaseWorkArea()
{
	workArea = main_layout.cells('b');
	workArea.setText('Details');
        
	workAreaTabbar = workArea.attachTabbar();

	workAreaTabbar.addTab('CaseItems','Case Items');
	var CaseItems = workAreaTabbar.cells('CaseItems');
	CaseItems.setActive();
        

	BuildCaseItems();

	workAreaTabbar.addTab('CaseData','Case Data');
	workAreaTabbar.addTab('Notifications','Notifications');
	workAreaTabbar.addTab('NotificationLogs','Notifications Log');

/*	var caseData = workAreaTabbar.cells('CaseData');
//	caseData.setWidth(760);
//	caseData.hideHeader();
//	itemsList.attachObject("proessItems");	// adding the list select to this cell

	gridData = caseData.attachGrid();
	gridData.setIconsPath(dxImgPath);
        
	gridData.setHeader("Field,Value");
	gridData.setColTypes("ro,ro");
	gridData.setColumnIds("field,value");
	
	gridData.setInitWidths("100,400");
	gridData.init(); */
        
    	gridData= initGrid(workAreaTabbar.cells('CaseData')
            ,"Field,Value","ro,ro","field,value","100,400","str,str");
        
    flds="id,ruleId,userType,userId,userName,userGroup,actor,eventType,eventDate";

    gridNotification= initGrid(workAreaTabbar.cells('Notifications')
            ,flds,"",flds,'','');


    flds="id,ruleId,notificationId,userType,userId,userName,userGroup,actor,eventType,issueDate,email,subject,message,reason";
    
    	gridNotificationLogs= initGrid(workAreaTabbar.cells('NotificationLogs')
            ,flds,'',flds,'',"str,str");

	statusBar = workArea.attachStatusBar();
//	displayStatus('Starting');
	
}
function initGrid(parent,headers,colTypes,colIds,colWidths,colSorts)
{
    
    var parts = headers.split(',');

    if (colTypes=='')
    {
        for(var i=0;i<parts.length;i++)
        {
            if (i>0)
            {
                colTypes+=',ro';
                colWidths+=',100';
            }
            else
            {
                colTypes+='ro';
                colWidths+=' 100';
            }

        }
    }
    
	grid = parent.attachGrid();
	grid.setIconsPath(dxImgPath);
        
	grid.setHeader(headers);
	grid.setColTypes(colTypes);
	grid.setColumnIds(colIds);
	
	grid.setInitWidths(colWidths);
	grid.init();
        return grid;
}
function displayCaseItemData(force,fromTab)
{
		if (typeof(fromTab)==='undefined') fromTab=false;
		if (force)
			ItemDataChanges=true;
		if (!ItemDataChanges)
			return;
		if  ((itemTabbar.getActiveTab()=='itemData') || fromTab)
		{
		dhtmlx.message("display item data");
		ItemDataChanges=false;
		}
		
	var item = getObject('items',currentItemId);		
	
	if (item.dataElements==null)
		{
		item['dataElements']=Array();
		}
	var des=item.dataElements;
	
	var objs=jsonData['dataElements'];
	if (objs!=null)
	{
		var rows=Array();
		for(var i=0;i<objs.length;i++)
		{
			var processDataElement=objs[i];
			var visible="";
			var input="";
			var fldName="";
			
			for(var d=0;d<des.length;d++)
			{
				var de=des[d];
				if (de.refId==processDataElement.id)
				{
					visible=de.visible;
					input=de.input;
					fldName=de.field;
				}
			}
			var row= { id: processDataElement.id , data: [ processDataElement.name, visible,input,fldName]};
			rows.push(row)
		}

		var data = {rows: rows};
		gridItemData.clearAll();
		gridItemData.parse(data,"json");

		gridItemData.selectRow(0);
		var rowId=gridItemData.getSelectedRowId();
		
	}
    displayItemDescription(currentItemId);
		
}
function displayCaseItemDescription(itemId)
{
}
function BuildCaseItems()
{
	var CaseItems = workAreaTabbar.cells('CaseItems');

	
        var layout_2 = CaseItems.attachLayout('2U');
	var itemsList = layout_2.cells('a');
	itemsList.setWidth(760);
	itemsList.hideHeader();
        
	var itemB = layout_2.cells('b');
        itemB.hideHeader();

//	itemsList.attachObject("proessItems");	// adding the list select to this cell
//  replace by grid 

	gridItems = itemsList.attachGrid();
	gridItems.setIconsPath(dxImgPath);
        
	gridItems.setHeader("No,Type,Label,Action,Status,Started,Completed,Actor");
	gridItems.setColTypes("ro,ro,ro,link,ro,ro,ro,ro");
	gridItems.setColumnIds("rowNo,type,label,action,status,started,completed,actor");
	
	gridItems.setInitWidths("24,100,100,70,120,120,70,150");
//	gridItems.setColAlign("left,left");
	
//	gridItems.setColSorting('str,str');
	gridItems.init();
	
	gridItems.attachEvent("onRowSelect",function(rowId,cellIndex){
		displayCaseItemDetails(rowId);
	});	

 // end of grid
}
function displayCaseData()
{
	return;
        var firstRow;
        firstRow=populateGrid(gridItems,jsonData['items']);
        populateGrid(gridData,jsonData['data']);
        populateGrid(gridNotification,jsonData['notifications']);
        populateGrid(gridNotificationLogs,jsonData['notificationlogs']);
        
	displayCaseItemDetails(firstRow);

}
function displayCaseItemDetails(rowId)
{
    
}


