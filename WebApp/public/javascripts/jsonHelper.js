/* jQuery( document ).ajaxError(function( event, request, settings , thrownError ,response ) {
  alert("Error requesting page (jsonHelper) " + settings.url + thrownError  +request +response);
}); */
var jsonData;
var statusBar;
function displayStatus(msg)
{
   if (typeof statusBar !== 'undefined') {
       statusBar.setText(msg);
    }
}

function getTreeData(data,field)
{
	
	var text="<ul>";
	for (var i=0;i<data.length;i++)
	{
		var object=data[i];
	   	var val=object[field];
		text+='<li>'+val+'</li>';
		var children=object['children'];
		text+=getTreeData(children,field);
	}
	text+="</ul>";

	return text;	
	
}

function getObject(path,objectId)
{
    if (objectId!==null)
        path=path+'.['+objectId+']';
    return getJsonValue(path);
}

function deleteJsonObject(path,objectId)
{
    var res=getJsonNode(path,false);

    var index = res['index'];
    
    var parent= res['parent'];
    
    if (index > -1) {
        parent.splice(index, 1);
    }    
    var tree = res['tree'];
    for(var i=0;i<tree.length;i++)
    {
        tree[i]['_modified']=true;
    }    
    markModified();
}

function getJsonNode(path,createFlag)
{
        //var jsonData;
    if (!jsonData) {
        console.log("Error jsonData is not defined");
        return null;
    }
        var nodes=path.split('.');
        var data=jsonData;
        var parent=null;
        var tree=Array();
        var node;
        for(var i=0;i<nodes.length;i++)
        {
            if (data!==null)
                tree.push(data);
            parent=data;
            node=nodes[i];

            if (node.indexOf('[')==0)
            {
                var keyName='id';
                var ki=node.indexOf('=');
                if (ki > 0)
                    keyName=node.substring(1,ki);
                else
                    ki=0;
                var index=node.substring(ki+1,node.length-1);

                if (data instanceof Array)
                {
                    var found=false;
                    for(var indx=0;indx<data.length;indx++)
                    {
                        var rec=data[indx];
                        if (rec[keyName]==index)
                        {
                            data=rec;
                            found=true;
                            break;
                        }
                    }
                    // record not found -- may be need to be created
                    if (!found)
                    {
                        if (createFlag)
                        {
                           var obj=new Object();
                            obj[keyName]=index;
                            data.push(obj);
                            data=obj;
                        }
                        else
                        {
                            data=null;
                        return {data:data,parent:parent,node:node,tree: tree ,status:'NotFound',index:indx};
                        }
                    }
                }
                else
                {
                    node=index;
                    data=data[node];
                }
            }
            else
            {
                if(node in data) {
                    data=data[node];
                }
                else {
                    if (createFlag)
                    {   // create new object or new array we need to find out
                        if ((i<nodes.length-1) && (nodes[i+1].indexOf('[')==0)) {
                            data[node]=new Array();
                        } else {
                            data[node]=new Object();
                        }
                        data=data[node];
                                
                    } else {
                        data=null;
                        break;
                    }
                }
            }
        }
        
    return {data:data,parent:parent,tree: tree ,node:node,index:indx};
}
function getJsonValue(path)
{
    var res=getJsonNode(path,false);
    return res['data'];
}

function setJsonValue(path,value)
{
    var res=getJsonNode(path,true);
    var pnode=res['parent'];
    var node = res['node'];
    var tree = res['tree'];
    for(var i=0;i<tree.length;i++)
    {
        tree[i]['_modified']=true;
    }
    pnode[node]=value;
    markModified();
}
function markModified()
{
    window.onbeforeunload = function() {
            return 'Changes to your Design will be lost?';
            };    
}
function getItemValue(path,itemId,field)
{
        return getJsonValue(path+'.['+itemId+'].'+field);
	var value=null;
	data=procJson[path];
 	jQuery.each(data, function(indx, object){  

       		   	var id=object.id
       		   	if (id==itemId)
       		   	{
           		   	var val=object[field];
           		   	value=val;
           		   	return false;
       		   	}
       	   });
   	   return value;
}

function populateField(path,itemId,field)
{
	var val=getItemValue(path,itemId,field);
        fieldName='form_input_'+field;
    
    	var fld = jQuery('[name='+fieldName+']');
	fld.val(fieldVal);

}
function processItemOver(evt,itemId)
{
//	alert(itemId);
    evt.srcElement.setAttribute("fill-opacity", ".5");
    evt.srcElement.setAttribute("fill", "chocolate");
	
}
function processItemOut(evt,itemId)
{
//	alert(itemId);
    evt.srcElement.setAttribute("fill-opacity", ".5");
    evt.srcElement.setAttribute("fill", "none");
	
}
function processItemClicked(evt,itemId)
{
	displayItemDetails(itemId);
	
}

function populateSelect(data,selectControl,keyName,valName)
{
	var sel=jQuery('#'+selectControl);

	sel.on('change',(function(evt){

		var itemId=jQuery(this).val();

	    processItemClicked(evt,itemId);
	})); 
	
	
	var text="";
	   jQuery.each(data, function(indx, object){  

		   	var key=object[keyName];
		   	var val=object[valName];
		   	var opt='<option value="'+key+'">'+val+'</optiion';
	        sel.append(opt);
	   
	   });
}
function populateCombo(combo,data,idProperty,valueProperty)
{
	for(var i=0;i<data.length;i++)
	{
            var obj=data[i];
            var id=obj[idProperty];
            var val=obj[valueProperty];
            combo.put(id,val);                
        }
}

function populateGrid(grid,data)
{
	var objs=data;
	if (objs==null)
            return null

	var rows=Array();
	for(var i=0;i<objs.length;i++)
	{
		var obj=objs[i];
                
                var data=Array();
                for(var c=0;c<grid.getColumnsNum();c++)
                {
                    var colId=grid.getColumnId(c);
                    var val=obj[colId];
                    if (val==null)
                        val="";
                    data.push(val);
                }
		var row= { id: obj.id , data: data};
		rows.push(row);

	}
	var data = {rows: rows};
	grid.clearAll();
	grid.parse(data,"json");

	grid.selectRow(0);
	var rowId=grid.getSelectedRowId();
    
        return rowId;
}

function confirm(message,text)
{
			dhtmlx.confirm({
				title:message,
				ok:"Yes", cancel:"No",
				text:text,
				callback:function(result){
				return result;
			}});
}	