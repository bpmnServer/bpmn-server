// Cancel click event

jQuery(document).ready(function () {

    if (jQuery('.startDate').length) {
        let startDate;
        jQuery('.startDate').each(function (index) {
            startDate = $(this).html();
        });
    

        jQuery('.date').each(function (index) {

            let val = $(this).html();
            if (val!='')
                $(this).html(dateDiff(val,startDate));
        });
    }

});


function dateDiff(dateStr,target) {


    if (target == '')
        target = null;
    var startTime;

    var endDate = new Date(target);
    var startTime = new Date(dateStr);
    var seconds = Math.abs(endDate.getTime() - startTime) / 1000;


    // get total seconds between the times
    var delta = seconds; //Math.abs(date_future - date_now) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = Math.floor(delta % 60);  // in theory the modulus is not required
    if (days > 0)
        return (days + " days");
    if (hours > 0)
        return (hours + " hours");
    if (minutes > 0)
        return (minutes + " minutes");
    return (seconds + " seconds");
}


jQuery(document).ready(function () {
	
        if (jQuery('#processItems').length)
        {
            jQuery('#processItems').on('change',(function(evt){

                    itemId=jQuery(this).val();

                processItemClicked(evt,itemId);
            })); 
        }

	jQuery('.error').addClass('ui-icon ui-icon-alert');
	var objs=jQuery('.validtionError');
	jQuery(objs).addClass('ui-icon ui-icon-alert');
});



jQuery(function() {
    
if (jQuery( "#diagram" ).length)
{
    jQuery( "#diagram" ).resizable({
      alsoResize: "#workArea",
              minWidth: 1200,
          minHeight: 300
    });
}

if (jQuery( "#workArea" ).length)
{
    jQuery( "#workArea" ).resizable({
              minWidth: 1200,
          minHeight: 300
      });
}
if (jQuery( "#tabs" ).length)
{
    jQuery( "#tabs" ).tabs();
}
if (jQuery( "#accordion" ).length)
{
    jQuery( "#accordion" ).accordion({
        heightStyle: "fill"
      });
}
if (jQuery( "#accordion-resizer" ).length)
{
    jQuery( "#accordion-resizer" ).resizable({
        minHeight: 140,
        minWidth: 200,
        resize: function() {
            jQuery( "#accordion" ).accordion( "refresh" );
        }
      });
}
});

var counter=0;
function processItemClicked(evt,id)
{
    try
    {
	if(id==null)
		return;
	
	
	var ajax=true;
 	var el=jQuery('#itemDetails');
 	var file;
 	var caseId;
 	var id;

    jQuery("#ItemsList").val(id);
 	
/* 	jQuery( "#tabs" ).tabs( "option", "active", 1); */
    
    counter++;
 	
 	el.html("loading item details ..."+counter);
 	
 
 	file=getParameterByName('file');
 	
 	var baseUrl=window.location.href.split('?')[0];
 	url= baseUrl+"?action=itemDetails&file="+file+"&item="+id;
 	if (File==null || file=="")
 		{
 		caseId=getParameterByName('caseId');
 		url=baseUrl+"?action=itemDetails&caseId="+caseId+"&item="+id;
 		}
	
 	if (ajax==false)
 	{
 	
 		el.html("<iframe src='"+url+"' width='100%' height='240px' />");
 	}
 	else
 	{
 	var data = {
 				'action': 'omniitemDetails',
 				'file': file,
 				'caseId': caseId,
 				'item': id
 			};
 	
 	if (ajax_object!=null)
 		{
 		url=ajax_object.ajax_url;
 		}
	jQuery.post(url, data, function(response) {
	 	el.html(response);
		}); 	 	
 	
/* 	jQuery.post({
 		url: ajaxurl ,  $data,
 	  beforeSend: function( xhr ) {
 	    xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
 	  }
 	})
 	 .done(function( data ) {
		 	el.html(data);
 	    }
 	  ); */
	

 	 }
    }
   catch(exc)
   {
	   alert(exc);
   }
 	
}
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

