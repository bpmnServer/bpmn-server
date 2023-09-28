
$('document').ready(function () {

    let svg = $('svg');

    if (!svg.get(0))
        return;

        scanSVG()


        $(document).click(function (event) {
            let id = $(event.target).parent().attr('data-element-id')
            if (id)
                return displayDescription(id);

/*            console.log(event.target);
            console.log("Clicked" + id );
            var text = $(event.target).text();

            $('#Details-block').html(id); */
         });
});

        function onItemClick(evt,id)
        {
            displayItemDetails(id);

        }
        function scanSVG() {

            /**
             *  Modification to SVG 
             *      1.  add onclick event to every  node
             *      2.  add decorations
             *      decorations is an array of object each object
             *          taskId, sequence, color 
             * 

            let decorations = [
                {id: 'StartEvent_1' , seq: 1, color: 'blue' },
                {id: 'UserTask_Buy', seq: 2, color: 'green'},
                {id: 'UserTask_drive', seq: 3, color: 'red'}
            ];
             * */

            let map = new Map();

            decorations.forEach(decor => {
                let set = map.get(decor.id);
                if (set)
                    set.push(decor);
                else
                    set = [decor];

                map.set(decor.id, set);
            });

            let svg = $('svg');
            let lastChange;

            // var svg = document.getElementsByTagName('svg')[0];
            let list = $(svg).find('.djs-element[data-element-id]');

            list.each(function () {

                let id = $(this).attr('data-element-id');

                if (id.indexOf('_label') > 0) { }
                else {
                    let g = $(this);


            //        setElementClick(g);

                    let decorSet = map.get(id);
                    if (decorSet) {

/*                        $('[data-element-id="' + id + '"]>.djs-visual>rect').css('stroke', cl).css('fill','#d3dfd2');
                        $('[data-element-id="' + id + '"]>.djs-visual>path').css('stroke', cl);
                        $('[data-element-id="' + id + '"]>.djs-visual circle').css('stroke', cl).css('fill', '#d3dfd2');
*/
                        setElementDecor(svg, g, decorSet);
                    }
                }

            });
            //scanChidlren(svg,'svg');
}
function textDumm() {
    var svgNS = "http://www.w3.org/2000/svg";
    var newText = document.createElementNS(svgNS, "text");
    newText.setAttributeNS(null, "x", x);
    newText.setAttributeNS(null, "y", y);
    newText.setAttributeNS(null, "font-size", "100");

    var textNode = document.createTextNode(val);
    newText.appendChild(textNode);
    document.getElementById("g").appendChild(newText)
}
function setElementDecor(svg, g, decorSet) {

    let id = g.attr('data-element-id');
    let jsonInfo=getItemElement(id);
    if (jsonInfo.type) {
        let bpmnType = jsonInfo.type.replace('bpmn:', 'bpmn_');
        $(g)[0].classList.add(bpmnType);
    }
 
    if (decorSet[0].color == 'black')
        $(g)[0].classList.add("Completed");
    else if (decorSet[0].color == 'gray')
        $(g)[0].classList.add("Cancelled");
    else
        $(g)[0].classList.add("Pending");

    var svgNS = "http://www.w3.org/2000/svg";

    var x = 4;
    let first = true;
    decorSet.forEach(decor => {
        let el = $(g).get(0);   // base html element
        let txtEl = document.createElementNS(svgNS, "text");

        if (decor.color=='black')
            txtEl.setAttributeNS(null, 'class', 'djs-label Completed-Seq');
        else
            txtEl.setAttributeNS(null, 'class', 'djs-label Pending-Seq');
        txtEl.setAttributeNS(null, 'stroke', decor.color);
        txtEl.setAttributeNS(null, 'x', x);
        txtEl.setAttributeNS(null, 'y', -3);


        let tSpanEl = document.createElementNS(svgNS, "tspan");
        if (first)
            tSpanEl.innerHTML = decor.seq;
        else
            tSpanEl.innerHTML = ','+decor.seq;
        //                    tSpanEl.style.fontSize = "20px";
        tSpanEl.setAttributeNS(null, 'x', x);
        tSpanEl.setAttributeNS(null, 'y', -3);
        tSpanEl.setAttributeNS(null, 'fill-opacity', '.2');
        tSpanEl.setAttributeNS(null, 'fill', "chocolate");


        txtEl.appendChild(tSpanEl);
        el.appendChild(txtEl);

        lastChange = txtEl;
        x += 20;
        first = false;
    });


    //                    $(g).append(document.createTextNode("Hello"));

    /* php code
     *                         $text=$sep.$decore[1];
                            $color = $decore[2];
                            $txt =$g->addChild('text');
                                    $txt->addAttribute('class', ' djs-label');
                                    $txt->addAttribute('stroke', $color);
                            $ts = $txt->addChild('tspan',$text);
                                    $ts->addAttribute('x',$dx);
                                    $ts->addAttribute('y',-3);
     */

    /*
    var svgEl = $(svg).get(0);
    svgEl.appendChild(lastChange);
    var html = svgEl.innerHTML;
    svgEl.innerHTML = html;
    */
    //svgEl.beginElement();
    console.log("TaskId: " + id);
}

function setElementClick(element) {

    let id = element.attr('data-element-id');

    var attr = element.attr('onclick');

    if (typeof attr !== typeof undefined && attr !== false) {
    }
    else {
        let action = 'processItemClicked(evt, "' + id + '");'
        action = 'onItemClick(evt,"' + id + '");';
        element.attr("onclick", action);
    }

    console.log("id:" + id);
    console.log(element.attr('onclick'));
///                if (!isset($attrs['onclick']))
///                    $g -> addAttribute("onclick", "top.processItemClicked(evt,'$id')");

                // check decorations

}
var descDialog = null;

function displayDescription(itemId) {
    var html = 'click on any item in the diagram to view description.'
    var title = 'Model Helper';
    if (itemId == null) {

    } else {
        var element = getItemElement(itemId);

        if (element) {
            let desc = bpmn_descriptions[element.type.replace('bpmn:', '')];
            html = getItemDescription(desc, element);

            title = (element.name) ? element.name : itemId;
        }
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
function getItemElement(itemId) {

    let element;
    let i;
    for (i = 0; i < jsonData.flows.length; i++) {

        if (jsonData.flows[i].id == itemId) {
            return jsonData.flows[i];
        }
    }
    for (i = 0; i < jsonData.elements.length; i++) {

        if (jsonData.elements[i].id == itemId) {
            return jsonData.elements[i];
        }

    }
}

function getItemDescription(desc,element) {

    if (desc == null) {
        return '';
    }
    var html = "<table style='font-size:1.2em'>";

    var pre = '';
    var post = '</td></tr>';

    html += getDescAttribute(desc, 'title', "<tr><td><b>", "</b>",post);
    html += getDescAttribute(desc, 'desc', "<tr><td colspan='2'>", post);
//    html += getDescAttribute(desc, 'userDoc', "<tr><td>", post);
    html += getDescAttribute(element, 'id', "<tr><td>id:</td><td>", post);
    html += getDescAttribute(element, 'type', "<tr><td>type:</td><td>", post);
    html += getDescAttribute(desc, 'start', "<tr><td>Starts:</td><td>", post);
    html += getDescAttribute(desc, 'completion', "<tr><td>Completes:</td><td>", post);
    if (element.description) {
        element.description.forEach(desc => {
            html += `<tr><td style='width:20%;'>${desc[0]}</td><td>${desc[1]}</td><td></tr>`;
        });
    }
    if (element.behaviours) {
        element.behaviours.forEach(beh => {
            html += `<tr><td style='width:20%;'>${beh[0]}</td><td>${beh[1]}</td><td></tr>`;
        });
    }
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
