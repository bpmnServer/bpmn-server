
function animateFlow(flowId,seq) {
    let group = document.querySelector(`[data-element-id="${flowId}"]`);
    if (!group) {
        console.warn(`Flow group not found: ${flowId}`);
        return;
    }
    group.classList.add("Completed");

    let path = group.querySelector("path");
    if (!path) {
        console.warn(`No <path> found inside group: ${flowId}`);
        return;
    }
//    $('#seq_'+seq).show();

    let pathLength = path.getTotalLength();
    gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength, opacity: 1 });

    // **Create Moving Dot ("Head") for Flow Animation**
    let movingDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    movingDot.setAttribute("r", "5");  // Radius of the dot
    movingDot.setAttribute("fill", "red");  // Color of the dot
    movingDot.setAttribute("data-moving-dot", flowId);
    group.appendChild(movingDot);

    // **Animate Path and Move the "Head"**
    gsap.to(path, { strokeDashoffset: 0, duration: 1, ease: "power2.out" });
    if (typeof MotionPathPlugin !== 'undefined') {
        gsap.to(movingDot, {
            motionPath: { path: path, align: path, alignOrigin: [0.5, 0.5] },
            duration: 1,
            ease: "power2.out",
            onComplete: () => movingDot.remove()
        });
    } else {
        movingDot.remove();
    }
}

function animateFlow2(flowId) {
    let group = document.querySelector(`[data-element-id="${flowId}"]`);
    if (!group) {
        console.warn(`Flow group not found: ${flowId}`);
        return gsap.to({}, {}); // Prevent breaking animation
    }

    let path = group.querySelector("path");
    if (!path) {
        console.warn(`No <path> found inside group: ${flowId}`);
        return gsap.to({}, {}); // Prevent breaking animation
    }

    let pathLength = path.getTotalLength();

    // ✅ Ultimate Fix: Ensure the whole stroke is visible before animation
    
/*    gsap.set(path, { 
        strokeDasharray: 4, //pathLength/10,   // Set full stroke length
        strokeDashoffset: pathLength,  // Fully hide at start
        opacity: 1  // Ensure visibility
    });
  */  

    return gsap.to(path, { 
        strokeDasharray: 4, //pathLength/10,   // Set full stroke length
        strokeDashoffset: 0,  // Reveal the stroke from start to end
        opacity: 1,  // Ensure visibility
        duration: 1, 
        ease: "power2.out"
    });
}
function activateTask(taskId,seq) {
    let task = document.querySelector(`[data-element-id="${taskId}"]`);

    if (task) {
        task.classList.add("Pending");
        $('#seq_'+seq).show();


        gsap.to(task, { attr: { fill: "yellow" }, duration: 10 });

        // ✅ Fix: Task expands and then shrinks back to normal
        gsap.to(task, { 
            scale: 1.1, 
            duration: 0.5, 
            onComplete: () => gsap.to(task, { scale: 1, duration: 0.2 }) 
        });

   }
}

function endAnimation(elementId,seq,action) {
    let element = document.querySelector(`[data-element-id="${elementId}"]`);
    if (!element) return;
    element.classList.remove("Pending");
    if (action==='Ended')
        element.classList.add("Completed");
    else if (action==='Cancelled')
        element.classList.add("Cancelled")
    
    if (element) {
        $('#seq_'+seq).show();
        // ✅ Ending Effect: Shrink, Fade Out, or Change Color
        let originalFill = element.getAttribute("fill"); // Store original fill color
        gsap.to(element, {
            scale: 0.9,
            fill: "#ccc",
             opacity: 0.5, duration: 1 ,
             onComplete: () => 
                 gsap.to(element, { scale: 1, fill: originalFill, opacity:1, duration: 0.2 }) 
             


        });
    }
}
// GSAP powers the optional "Show Animation" feature only. Guard its module-load use so a
// missing/blocked gsap never throws here — otherwise the whole script aborts and the core
// diagram decorations (scanSVG: sequence numbers + status colors) silently disappear.
let tl = null;
let animationRun = 0;
if (typeof gsap !== 'undefined' && typeof MotionPathPlugin !== 'undefined') gsap.registerPlugin(MotionPathPlugin);
function animationStatus(message) {
    const status = document.getElementById('animationStatus');
    if (status) status.textContent = message;
}

async function playWithoutGsap(flowInfo, run) {
    for (let index = 0; index < flowInfo.length && run === animationRun; index++) {
        const item = flowInfo[index];
        const element = item.id && document.querySelector('[data-element-id="' + CSS.escape(item.id) + '"]');
        if (!element) continue;
        if (index === 0) {
            await element.animate([
                { transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }
            ], { duration: 650 }).finished;
        } else if (item.type === 'bpmn:SequenceFlow') {
            const path = element.querySelector('path');
            if (path && path.getTotalLength) {
                const length = path.getTotalLength();
                path.style.strokeDasharray = String(length);
                path.style.strokeDashoffset = String(length);
                const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                dot.setAttribute('r', '5');
                dot.setAttribute('fill', 'red');
                dot.setAttribute('data-moving-dot', item.id);
                element.appendChild(dot);
                const points = Array.from({ length: 21 }, (_, i) => {
                    const point = path.getPointAtLength(length * i / 20);
                    return { transform: `translate(${point.x}px, ${point.y}px)` };
                });
                try {
                    await Promise.all([
                        path.animate([{ strokeDashoffset: String(length) }, { strokeDashoffset: '0' }], { duration: 800 }).finished,
                        dot.animate(points, { duration: 800 }).finished
                    ]);
                } finally {
                    path.style.strokeDashoffset = '0';
                    dot.remove();
                }
            }
            element.classList.add('Completed');
        } else if (item.action === 'Waiting') {
            element.classList.add('Pending');
        } else if (item.action === 'Ended' || item.action === 'Cancelled') {
            element.classList.remove('Pending');
            element.classList.add(item.action === 'Ended' ? 'Completed' : 'Cancelled');
        }
        if (item.seq) $('#seq_' + item.seq).show();
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    if (run === animationRun) animationStatus('Replay complete. Click again to restart.');
}
function pauseAnimation() {
    if (!tl) return;
    tl.addPause(() => {
        console.log("Timeline paused — waiting for user...");
        document.getElementById("continueBtn").style.display = "block";
      });

}
function continueAnimation() {
    if (!tl) return;
    tl.play();
    document.getElementById("continueBtn").style.display = "none";
}


function startAnimation() {
    const flowInfo = getFlowInfo();
    if (!flowInfo.length) {
        animationStatus('No recorded steps are available for this instance.');
        return;
    }
    animationRun++;
    if (tl) tl.kill();
    if (typeof gsap !== 'undefined') gsap.killTweensOf('.djs-element');
    document.querySelectorAll('[data-moving-dot]').forEach(dot => dot.remove());

    document.querySelectorAll(`.Pending`).forEach(element => { element.classList.remove("Pending"); });
    document.querySelectorAll(`.Completed`).forEach(element => { element.classList.remove("Completed"); });
    document.querySelectorAll(`.Cancelled`).forEach(element => { element.classList.remove("Cancelled"); });
    animationStatus('Replaying recorded steps…');
    if (typeof gsap === 'undefined') {
        playWithoutGsap(flowInfo, animationRun).catch(error => {
            console.error('Animation failed:', error);
            animationStatus('Animation could not be played.');
        });
        return;
    }
    tl = gsap.timeline({ paused: true, onComplete: () => animationStatus('Replay complete. Click again to restart.') });

    for(let i=0;i<flowInfo.length;i++)
        {
            let item=flowInfo[i];
            if (item.seq)
                $('#seq_'+(item.seq+1)).hide();
        }

    
    for(let i=0;i<flowInfo.length;i++)
    {
        let item=flowInfo[i];
        if (i==0)
        {
            $('#seq_'+item.seq).hide();
            const firstElement = item.id && document.querySelector('[data-element-id="' + CSS.escape(item.id) + '"]');
            if (firstElement)
                tl.to(firstElement, { scale: 1.2, duration: 0.5, repeat: 1, yoyo: true });
        }
        else if (item.type==='bpmn:SequenceFlow')
            tl.call(() => animateFlow(item.id,item.seq+1), null, "+=0.5"); // Activate task and wait
           // tl.add(animateFlow(item.id), "+=0.5"); // Animate flow and wait
        else 
            {
                if (item.action==='Waiting')
                {
                    tl.call(() => activateTask(item.id,item.seq+1), null, "+=0.5"); // Activate task and wait
//                    tl.addPause("waiting");
}
                else if (item.action==='Ended' || item.action==='Cancelled')
                    tl.call(() => endAnimation(item.id,item.seq+1,item.action), null, "+=0.5"); 
            }
    }
    tl.play();

    return;
}

// Ensure the SVG is fully loaded before running the animation
document.addEventListener("DOMContentLoaded", start);
let svg;

 function getFlowInfo() {
    let json = document.getElementById('jsonInfo');
    let info = json ? JSON.parse(json.textContent) : [];
    let flow=[];
    info.forEach(item => {
        try {
            let fl=JSON.parse(item.message.replaceAll(`'`,`"`));
            if (fl.id && fl.seq && fl.action) flow.push(fl);
        }
        catch(exc) {}
    });
    if (!flow.length) {
        const itemJson = document.getElementById('animationItems');
        if (itemJson) {
            const items = JSON.parse(itemJson.textContent);
            flow = items.filter(item => item.id && item.seq).map(item => ({
                id: item.id, seq: item.seq, type: item.type,
                action: item.type === 'bpmn:SequenceFlow' ? 'Taken' : item.status === 'wait' ? 'Waiting' : 'Ended'
            }));
        }
    }
    return flow;
 }
 function start()
    {
    scanSVG()

    svg = $('svg');
    if (!svg.get(0))
        return;


        $(document).click(function (event) {
            let id = $(event.target).parent().attr('data-element-id')
            if (id)
                return displayDescription(id);

         }); 

    }

    function onItemClick(evt,id)
    {
        displayItemDetails(id);

    }
    decorMap = new Map();
    function scanSVG() {
            // every page loads this script; only instance pages define decorations
            if (typeof decorations === 'undefined') return;

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

            decorations.forEach(decor => {
                let set = decorMap.get(decor.id);
                if (set)
                    set.push(decor);
                else
                    set = [decor];

                decorMap.set(decor.id, set);
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

                    let decorSet = decorMap.get(id);
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
function decorateNode(id) 
{

    let decorSet = decorMap.get(id);
    if (decorSet) {
        
        let g = $(svg).find('.djs-element[data-element-id=flow1]');
        setElementDecor(svg, g, decorSet);
    }

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
    if (!id)
        return;
    let jsonInfo=getItemElement(id);
    if (!jsonInfo)
        console.log("Element not found: " + id);
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

        if (decor.type==='seq')
        {
            txtEl.setAttributeNS(null, 'id', 'seq_' + decor.seq);
            txtEl.setAttributeNS(null, 'fill', decor.color);
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
        }
        else if (decor.type==='token')
        {
            txtEl.setAttributeNS(null, 'stroke', decor.color);

            let tSpanEl = document.createElementNS(svgNS, "tspan");
            //                    tSpanEl.style.fontSize = "20px";
            tSpanEl.innerHTML = decor.token;
            tSpanEl.setAttributeNS(null, 'x', x-20);
            tSpanEl.setAttributeNS(null, 'y', -16);
            tSpanEl.setAttributeNS(null, 'fill-opacity', '.5');
           // tSpanEl.setAttributeNS(null, 'fill', "chocolate");
            txtEl.appendChild(tSpanEl);
            txtEl.classList.add('decor-token');
            el.appendChild(txtEl);
    
            }

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

    html += getDescAttribute(desc, 'title', "<tr><td><b>", "</b></td></tr>");
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
    let txt = desc[attr];
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
