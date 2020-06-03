
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

            console.log(map.has('StartEvent_1'));
            console.log(map.has('StartEventxx'));

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
                    if (decorSet)
                        setElementDecor(svg, g, decorSet);
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
    console.log(decorSet);

//    let g2 = $(g).children('g');

    // $(g).appendChild('< text class="djs-label><tspan x='4' y='-3'>7</tspan></text>');

    var svgNS = "http://www.w3.org/2000/svg";

    var x = 4;
    let first = true;
    decorSet.forEach(decor => {
        let el = $(g).get(0);   // base html element
        let txtEl = document.createElementNS(svgNS, "text");


        txtEl.setAttributeNS(null, 'class', 'djs-label');
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
        tSpanEl.setAttributeNS(null, 'fill-opacity', '.5');
        tSpanEl.setAttributeNS(null, 'fill', "chocolate");


        txtEl.appendChild(tSpanEl);
        el.appendChild(txtEl);

        lastChange = txtEl;
        x += 7;
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