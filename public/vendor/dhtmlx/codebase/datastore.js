/*
Product Name: dhtmlxSuite 
Version: 4.2.1 
Edition: Standard 
License: content of this file is covered by GPL. Usage outside GPL terms is prohibited. To obtain Commercial or Enterprise license contact sales@dhtmlx.com
Copyright UAB Dinamenta http://www.dhtmlx.com
*/

/*
This software is allowed to use under GPL or you need to obtain Commercial or Enterise License
to use it in non-GPL project. Please contact sales@dhtmlx.com for details
*/
/*DHX:Depend core/dhx.js*/
/*DHX:Depend core/assert.js*/
if (!window.dhx) 
	dhx={};

//check some rule, show message as error if rule is not correct
dhx.assert = function(test, message){
	if (!test){
		dhx.assert_error(message);
	}
};

dhx.assert_error = function(message){
	dhx.log("error",message);
	if (dhx.message && typeof message == "string")
		dhx.message({ type:"debug", text:message, expire:-1 });
	if (dhx.debug !== false)
		eval("debugger;");
};

//entry point for analitic scripts
dhx.assert_core_ready = function(){
	if (window.dhx_on_core_ready)	
		dhx_on_core_ready();
};

/*
	Common helpers
*/
dhx.version="3.0";
dhx.codebase="./";
dhx.name = "Core";

//coding helpers
dhx.clone = function(source){
	var f = dhx.clone._function;
	f.prototype = source;
	return new f();
};
dhx.clone._function = function(){};

//copies methods and properties from source to the target
dhx.extend = function(base, source, force){
	dhx.assert(base,"Invalid mixing target");
	dhx.assert(source,"Invalid mixing source");

	if (base._dhx_proto_wait){
		dhx.PowerArray.insertAt.call(base._dhx_proto_wait, source,1);
		return base;
	}
	
	//copy methods, overwrite existing ones in case of conflict
	for (var method in source)
		if (!base[method] || force)
			base[method] = source[method];
		
	//in case of defaults - preffer top one
	if (source.defaults)
		dhx.extend(base.defaults, source.defaults);
	
	//if source object has init code - call init against target
	if (source.$init)	
		source.$init.call(base);
				
	return base;	
};

//copies methods and properties from source to the target from all levels
dhx.copy = function(source){
	dhx.assert(source,"Invalid mixing target");
	if(arguments.length>1){
		var target = arguments[0];
		source = arguments[1];
	} else 
		var target =  (dhx.isArray(source)?[]:{});

	for (var method in source){
		if(source[method] && typeof source[method] == "object" && !dhx.isDate(source[method])){
			target[method] = (dhx.isArray(source[method])?[]:{});
			dhx.copy(target[method],source[method]);
		}else{
			target[method] = source[method];
		}
	}

	return target;	
};


dhx.single = function(source){ 
	var instance = null;
	var t = function(config){
		if (!instance)
			instance = new source({});
			
		if (instance._reinit)
			instance._reinit.apply(instance, arguments);
		return instance;
	};
	return t;
};

dhx.protoUI = function(){
	if (dhx.debug_proto)
		dhx.log("UI registered: "+arguments[0].name);
		
	var origins = arguments;
	var selfname = origins[0].name;
	
	var t = function(data){
		if (!t)
			return dhx.ui[selfname].prototype;

		var origins = t._dhx_proto_wait;
		if (origins){
			var params = [origins[0]];
			
			for (var i=1; i < origins.length; i++){
				params[i] = origins[i];
				
				if (params[i]._dhx_proto_wait)
					params[i] = params[i].call(dhx, params[i].name);

				if (params[i].prototype && params[i].prototype.name)
					dhx.ui[params[i].prototype.name] = params[i];
			}
			dhx.ui[selfname] = dhx.proto.apply(dhx, params);
			if (t._dhx_type_wait)	
				for (var i=0; i < t._dhx_type_wait.length; i++)
					dhx.Type(dhx.ui[selfname], t._dhx_type_wait[i]);
				
			t = origins = null;	
		}
			
		if (this != dhx)
			return new dhx.ui[selfname](data);
		else 
			return dhx.ui[selfname];
	};
	t._dhx_proto_wait = Array.prototype.slice.call(arguments, 0);
	return dhx.ui[selfname]=t;
};

dhx.proto = function(){
	 
	if (dhx.debug_proto)
		dhx.log("Proto chain:"+arguments[0].name+"["+arguments.length+"]");

	var origins = arguments;
	var compilation = origins[0];
	var has_constructor = !!compilation.$init;
	var construct = [];
	
	dhx.assert(compilation,"Invalid mixing target");
		
	for (var i=origins.length-1; i>0; i--) {
		dhx.assert(origins[i],"Invalid mixing source");
		if (typeof origins[i]== "function")
			origins[i]=origins[i].prototype;
		if (origins[i].$init) 
			construct.push(origins[i].$init);
		if (origins[i].defaults){ 
			var defaults = origins[i].defaults;
			if (!compilation.defaults)
				compilation.defaults = {};
			for (var def in defaults)
				if (dhx.isUndefined(compilation.defaults[def]))
					compilation.defaults[def] = defaults[def];
		}
		if (origins[i].type && compilation.type){
			for (var def in origins[i].type)
				if (!compilation.type[def])
					compilation.type[def] = origins[i].type[def];
		}
			
		for (var key in origins[i]){
			if (!compilation[key])
				compilation[key] = origins[i][key];
		}
	}
	
	if (has_constructor)
		construct.push(compilation.$init);
	
	
	compilation.$init = function(){
		for (var i=0; i<construct.length; i++)
			construct[i].apply(this, arguments);
	};
	var result = function(config){
		this.$ready=[];
		dhx.assert(this.$init,"object without init method");
		this.$init(config);
		if (this._parseSettings)
			this._parseSettings(config, this.defaults);
		for (var i=0; i < this.$ready.length; i++)
			this.$ready[i].call(this);
	};
	result.prototype = compilation;
	
	compilation = origins = null;
	return result;
};
//creates function with specified "this" pointer
dhx.bind=function(functor, object){ 
	return function(){ return functor.apply(object,arguments); };  
};

//loads module from external js file
dhx.require=function(module, callback, master){
	if (typeof module != "string"){
		var count = module.length||0;
		var callback_origin = callback;

		if (!count){
			for (var file in module) count++;
			callback = function(){ count--; if (count === 0) callback_origin.apply(this, arguments); };
			for (var file in module)
				dhx.require(file, callback, master);
		} else {
			callback = function(){
				if (count){
					count--;
					dhx.require(module[module.length - count - 1], callback, master);
				} else 
					return callback_origin.apply(this, arguments);
				
			};
			callback();
		}
		return;
	}

	if (dhx._modules[module] !== true){
		if (module.substr(-4) == ".css") {
			var link = dhx.html.create("LINK",{  type:"text/css", rel:"stylesheet", href:dhx.codebase+module});
			document.head.appendChild(link);
			if (callback)
				callback.call(master||window);
			return;
		}

		var step = arguments[4];

		//load and exec the required module
		if (!callback){
			//sync mode
			dhx.exec( dhx.ajax().sync().get(dhx.codebase+module).responseText );
			dhx._modules[module]=true;
		} else {

			if (!dhx._modules[module]){	//first call
				dhx._modules[module] = [[callback, master]];

				dhx.ajax(dhx.codebase+module, function(text){
					dhx.exec(text);	//evaluate code
					var calls = dhx._modules[module];	//callbacks
					dhx._modules[module] = true;
					for (var i=0; i<calls.length; i++)
						calls[i][0].call(calls[i][1]||window, !i);	//first callback get true as parameter
				});
			} else	//module already loading
				dhx._modules[module].push([callback, master]);
		}
		
	}
};
dhx._modules = {};	//hash of already loaded modules

//evaluate javascript code in the global scoope
dhx.exec=function(code){
	if (window.execScript)	//special handling for IE
		window.execScript(code);
	else window.eval(code);
};

dhx.wrap = function(code, wrap){
	if (!code) return wrap;
	return function(){
		var result = code.apply(this, arguments);
		wrap.apply(this,arguments);
		return result;
	};
};

//check === undefined
dhx.isUndefined=function(a){
	return typeof a == "undefined";
};
//delay call to after-render time
dhx.delay=function(method, obj, params, delay){
	return window.setTimeout(function(){
		var ret = method.apply(obj,(params||[]));
		method = obj = params = null;
		return ret;
	},delay||1);
};

//common helpers

//generates unique ID (unique per window, nog GUID)
dhx.uid = function(){
	if (!this._seed) this._seed=(new Date).valueOf();	//init seed with timestemp
	this._seed++;
	return this._seed;
};
//resolve ID as html object
dhx.toNode = function(node){
	if (typeof node == "string") return document.getElementById(node);
	return node;
};
//adds extra methods for the array
dhx.toArray = function(array){ 
	return dhx.extend((array||[]),dhx.PowerArray, true);
};
//resolve function name
dhx.toFunctor=function(str){ 
	return (typeof(str)=="string") ? eval(str) : str; 
};
/*checks where an object is instance of Array*/
dhx.isArray = function(obj) {
	return Array.isArray?Array.isArray(obj):(Object.prototype.toString.call(obj) === '[object Array]');
};
dhx.isDate = function(obj){
	return obj instanceof Date;
};

//dom helpers

//hash of attached events
dhx._events = {};
//attach event to the DOM element
dhx.event=function(node,event,handler,master){
	node = dhx.toNode(node);
	
	var id = dhx.uid();
	if (master) 
		handler=dhx.bind(handler,master);	
		
	dhx._events[id]=[node,event,handler];	//store event info, for detaching
		
	//use IE's of FF's way of event's attaching
	if (node.addEventListener)
		node.addEventListener(event, handler, false);
	else if (node.attachEvent)
		node.attachEvent("on"+event, handler);

	return id;	//return id of newly created event, can be used in eventRemove
};

//remove previously attached event
dhx.eventRemove=function(id){
	
	if (!id) return;
	dhx.assert(this._events[id],"Removing non-existing event");
		
	var ev = dhx._events[id];
	//browser specific event removing
	if (ev[0].removeEventListener)
		ev[0].removeEventListener(ev[1],ev[2],false);
	else if (ev[0].detachEvent)
		ev[0].detachEvent("on"+ev[1],ev[2]);
		
	delete this._events[id];	//delete all traces
};


//debugger helpers
//anything starting from error or log will be removed during code compression

//add message in the log
dhx.log = function(type,message,details){
	if (arguments.length == 1){
		message = type;
		type = "log";
	}
	/*jsl:ignore*/
	if (window.console && console.log){
		type=type.toLowerCase();
		if (window.console[type])
			window.console[type](message||"unknown error");
		else
			window.console.log(type +": "+message);

		if (details) 
			window.console.log(details);
	}	
	/*jsl:end*/
};
//register rendering time from call point 
dhx.log_full_time = function(name){
	dhx._start_time_log = new Date();
	dhx.log("Timing start ["+name+"]");
	window.setTimeout(function(){
		var time = new Date();
		dhx.log("Timing end ["+name+"]:"+(time.valueOf()-dhx._start_time_log.valueOf())/1000+"s");
	},1);
};
//register execution time from call point
dhx.log_time = function(name){
	var fname = "_start_time_log"+name;
	if (!dhx[fname]){
		dhx[fname] = new Date();
		dhx.log("Info","Timing start ["+name+"]");
	} else {
		var time = new Date();
		dhx.log("Info","Timing end ["+name+"]:"+(time.valueOf()-dhx[fname].valueOf())/1000+"s");
		dhx[fname] = null;
	}
};
dhx.debug_code = function(code){
	code.call(dhx);
};
//event system
dhx.EventSystem={
	$init:function(){
		if (!this._evs_events){
			this._evs_events = {};		//hash of event handlers, name => handler
			this._evs_handlers = {};	//hash of event handlers, ID => handler
			this._evs_map = {};
		}
	},
	//temporary block event triggering
	blockEvent : function(){
		this._evs_events._block = true;
	},
	//re-enable event triggering
	unblockEvent : function(){
		this._evs_events._block = false;
	},
	mapEvent:function(map){
		dhx.extend(this._evs_map, map, true);
	},
	on_setter:function(config){
		if(config){
			for(var i in config){
				if(typeof config[i] == 'function')
					this.attachEvent(i, config[i]);
			}
		}
	},
	//trigger event
	callEvent:function(type,params){
		if (this._evs_events._block) return true;
		
		type = type.toLowerCase();
		var event_stack =this._evs_events[type.toLowerCase()];	//all events for provided name
		var return_value = true;

		if (dhx.debug)	//can slowdown a lot
			dhx.log("info","["+this.name+"] event:"+type,params);
		
		if (event_stack)
			for(var i=0; i<event_stack.length; i++){
				/*
					Call events one by one
					If any event return false - result of whole event will be false
					Handlers which are not returning anything - counted as positive
				*/
				if (event_stack[i].apply(this,(params||[]))===false) return_value=false;
			}
		if (this._evs_map[type] && !this._evs_map[type].callEvent(type,params))
			return_value =	false;
			
		return return_value;
	},
	//assign handler for some named event
	attachEvent:function(type,functor,id){
		dhx.assert(functor, "Invalid event handler for "+type);

		type=type.toLowerCase();
		
		id=id||dhx.uid(); //ID can be used for detachEvent
		functor = dhx.toFunctor(functor);	//functor can be a name of method

		var event_stack=this._evs_events[type]||dhx.toArray();
		//save new event handler
		event_stack.push(functor);
		this._evs_events[type]=event_stack;
		this._evs_handlers[id]={ f:functor,t:type };
		
		return id;
	},
	//remove event handler
	detachEvent:function(id){
		if(!this._evs_handlers[id]){
			return;
		}
		var type=this._evs_handlers[id].t;
		var functor=this._evs_handlers[id].f;
		
		//remove from all collections
		var event_stack=this._evs_events[type];
		event_stack.remove(functor);
		delete this._evs_handlers[id];
	},
	hasEvent:function(type){
		type=type.toLowerCase();
		return this._evs_events[type]?true:false;
	}
};

dhx.extend(dhx, dhx.EventSystem);

//array helper
//can be used by dhx.toArray()
dhx.PowerArray={
	//remove element at specified position
	removeAt:function(pos,len){
		if (pos>=0) this.splice(pos,(len||1));
	},
	//find element in collection and remove it 
	remove:function(value){
		this.removeAt(this.find(value));
	},	
	//add element to collection at specific position
	insertAt:function(data,pos){
		if (!pos && pos!==0) 	//add to the end by default
			this.push(data);
		else {	
			var b = this.splice(pos,(this.length-pos));
  			this[pos] = data;
  			this.push.apply(this,b); //reconstruct array without loosing this pointer
  		}
  	},  	
  	//return index of element, -1 if it doesn't exists
  	find:function(data){ 
  		for (var i=0; i<this.length; i++) 
  			if (data==this[i]) return i; 	
  		return -1; 
  	},
  	//execute some method for each element of array
  	each:function(functor,master){
		for (var i=0; i < this.length; i++)
			functor.call((master||this),this[i]);
	},
	//create new array from source, by using results of functor 
	map:function(functor,master){
		for (var i=0; i < this.length; i++)
			this[i]=functor.call((master||this),this[i]);
		return this;
	}, 
	filter:function(functor, master){
		for (var i=0; i < this.length; i++)
			if (!functor.call((master||this),this[i])){
				this.splice(i,1);
				i--;
			}
		return this;
	}
};

dhx.env = {};

// dhx.env.transform 
// dhx.env.transition
(function(){
	if (navigator.userAgent.indexOf("Mobile")!=-1) 
		dhx.env.mobile = true;
	if (dhx.env.mobile || navigator.userAgent.indexOf("iPad")!=-1 || navigator.userAgent.indexOf("Android")!=-1)
		dhx.env.touch = true;
	if (navigator.userAgent.indexOf('Opera')!=-1)
		dhx.env.isOpera=true;
	else{
		//very rough detection, but it is enough for current goals
		dhx.env.isIE=!!document.all;
		dhx.env.isFF=!document.all;
		dhx.env.isWebKit=(navigator.userAgent.indexOf("KHTML")!=-1);
		dhx.env.isSafari=dhx.env.isWebKit && (navigator.userAgent.indexOf('Mac')!=-1);
	}
	if(navigator.userAgent.toLowerCase().indexOf("android")!=-1)
		dhx.env.isAndroid = true;
	dhx.env.transform = false;
	dhx.env.transition = false;
	var options = {};
	options.names = ['transform', 'transition'];
	options.transform = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];
	options.transition = ['transition', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
	
	var d = document.createElement("DIV");
	for(var i=0; i<options.names.length; i++) {
		var coll = options[options.names[i]];
		
		for (var j=0; j < coll.length; j++) {
			if(typeof d.style[coll[j]] != 'undefined'){
				dhx.env[options.names[i]] = coll[j];
				break;
			}
		}
	}
    d.style[dhx.env.transform] = "translate3d(0,0,0)";
    dhx.env.translate = (d.style[dhx.env.transform])?"translate3d":"translate";

	var prefix = ''; // default option
	var cssprefix = false;
	if(dhx.env.isOpera){
		prefix = '-o-';
		cssprefix = "O";
	}
	if(dhx.env.isFF)
		prefix = '-Moz-';
	if(dhx.env.isWebKit)
		prefix = '-webkit-';
	if(dhx.env.isIE)
		prefix = '-ms-';

    dhx.env.transformCSSPrefix = prefix;

	dhx.env.transformPrefix = cssprefix||(dhx.env.transformCSSPrefix.replace(/-/gi, ""));
	dhx.env.transitionEnd = ((dhx.env.transformCSSPrefix == '-Moz-')?"transitionend":(dhx.env.transformPrefix+"TransitionEnd"));
})();


dhx.env.svg = (function(){
		return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
})();


//html helpers
dhx.html={
	_native_on_selectstart:0,
	denySelect:function(){
		if (!dhx._native_on_selectstart)
			dhx._native_on_selectstart = document.onselectstart;
		document.onselectstart = dhx.html.stopEvent;
	},
	allowSelect:function(){
		if (dhx._native_on_selectstart !== 0){
			document.onselectstart = dhx._native_on_selectstart||null;
		}
		dhx._native_on_selectstart = 0;

	},
	index:function(node){
		var k=0;
		//must be =, it is not a comparation!
		/*jsl:ignore*/
		while (node = node.previousSibling) k++;
		/*jsl:end*/
		return k;
	},
	_style_cache:{},
	createCss:function(rule){
		var text = "";
		for (var key in rule)
			text+= key+":"+rule[key]+";";
		
		var name = this._style_cache[text];
		if (!name){
			name = "s"+dhx.uid();
			this.addStyle("."+name+"{"+text+"}");
			this._style_cache[text] = name;
		}
		return name;
	},
	addStyle:function(rule){
		var style = document.createElement("style");
		style.setAttribute("type", "text/css");
		style.setAttribute("media", "screen"); 
		/*IE8*/
		if (style.styleSheet)
			style.styleSheet.cssText = rule;
		else
			style.appendChild(document.createTextNode(rule));
		document.getElementsByTagName("head")[0].appendChild(style);
	},
	create:function(name,attrs,html){
		attrs = attrs || {};
		var node = document.createElement(name);
		for (var attr_name in attrs)
			node.setAttribute(attr_name, attrs[attr_name]);
		if (attrs.style)
			node.style.cssText = attrs.style;
		if (attrs["class"])
			node.className = attrs["class"];
		if (html)
			node.innerHTML=html;
		return node;
	},
	//return node value, different logic for different html elements
	getValue:function(node){
		node = dhx.toNode(node);
		if (!node) return "";
		return dhx.isUndefined(node.value)?node.innerHTML:node.value;
	},
	//remove html node, can process an array of nodes at once
	remove:function(node){
		if (node instanceof Array)
			for (var i=0; i < node.length; i++)
				this.remove(node[i]);
		else
			if (node && node.parentNode)
				node.parentNode.removeChild(node);
	},
	//insert new node before sibling, or at the end if sibling doesn't exist
	insertBefore: function(node,before,rescue){
		if (!node) return;
		if (before && before.parentNode)
			before.parentNode.insertBefore(node, before);
		else
			rescue.appendChild(node);
	},
	//return custom ID from html element 
	//will check all parents starting from event's target
	locate:function(e,id){
		if (e.tagName)
			var trg = e;
		else {
			e=e||event;
			var trg=e.target||e.srcElement;
		}
		
		while (trg){
			if (trg.getAttribute){	//text nodes has not getAttribute
				var test = trg.getAttribute(id);
				if (test) return test;
			}
			trg=trg.parentNode;
		}	
		return null;
	},
	//returns position of html element on the page
	offset:function(elem) {
		if (elem.getBoundingClientRect) { //HTML5 method
			var box = elem.getBoundingClientRect();
			var body = document.body;
			var docElem = document.documentElement;
			var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
			var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
			var clientTop = docElem.clientTop || body.clientTop || 0;
			var clientLeft = docElem.clientLeft || body.clientLeft || 0;
			var top  = box.top +  scrollTop - clientTop;
			var left = box.left + scrollLeft - clientLeft;
			return { y: Math.round(top), x: Math.round(left) };
		} else { //fallback to naive approach
			var top=0, left=0;
			while(elem) {
				top = top + parseInt(elem.offsetTop,10);
				left = left + parseInt(elem.offsetLeft,10);
				elem = elem.offsetParent;
			}
			return {y: top, x: left};
		}
	},
	//returns relative position of event
	posRelative:function(ev){
		ev = ev || event;
		if (!dhx.isUndefined(ev.offsetX))
			return { x:ev.offsetX, y:ev.offsetY };	//ie, webkit
		else
			return { x:ev.layerX, y:ev.layerY };	//firefox
	},
	//returns position of event
	pos:function(ev){
		ev = ev || event;
        if(ev.pageX || ev.pageY)	//FF, KHTML
            return {x:ev.pageX, y:ev.pageY};
        //IE
        var d  =  ((dhx.env.isIE)&&(document.compatMode != "BackCompat"))?document.documentElement:document.body;
        return {
                x:ev.clientX + d.scrollLeft - d.clientLeft,
                y:ev.clientY + d.scrollTop  - d.clientTop
        };
	},
	//prevent event action
	preventEvent:function(e){
		if (e && e.preventDefault) e.preventDefault();
		return dhx.html.stopEvent(e);
	},
	//stop event bubbling
	stopEvent:function(e){
		(e||event).cancelBubble=true;
		return false;
	},
	//add css class to the node
	addCss:function(node,name){
        node.className+=" "+name;
    },
    //remove css class from the node
    removeCss:function(node,name){
        node.className=node.className.replace(RegExp(" "+name,"g"),"");
    }
};

dhx.ready = function(code){
	if (this._ready) code.call();
	else this._ready_code.push(code);
};
dhx._ready_code = [];

//autodetect codebase folder
(function(){
	var temp = document.getElementsByTagName("SCRIPT");	//current script, most probably
	dhx.assert(temp.length,"Can't locate codebase");
	if (temp.length){
		//full path to script
		temp = (temp[temp.length-1].getAttribute("src")||"").split("/");
		//get folder name
		temp.splice(temp.length-1, 1);
		dhx.codebase = temp.slice(0, temp.length).join("/")+"/";
	}
	dhx.event(window, "load", function(){
		dhx4.callEvent("onReady",[]);
		dhx.delay(function(){
			dhx._ready = true;
			for (var i=0; i < dhx._ready_code.length; i++)
				dhx._ready_code[i].call();
			dhx._ready_code=[];
		});
	});
	
})();

dhx.locale=dhx.locale||{};


dhx.assert_core_ready();


dhx.ready(function(){
	dhx.event(document.body,"click", function(e){
		dhx4.callEvent("onClick",[e||event]);
	});
});


/*DHX:Depend core/bind.js*/
/*DHX:Depend core/dhx.js*/
/*DHX:Depend core/config.js*/
/*
	Behavior:Settings
	
	@export
		customize
		config
*/

/*DHX:Depend core/template.js*/
/*
	Template - handles html templates
*/

/*DHX:Depend core/dhx.js*/

(function(){

var _cache = {};
var newlines = new RegExp("(\\r\\n|\\n)","g");
var quotes = new RegExp("(\\\")","g");

dhx.Template = function(str){
	if (typeof str == "function") return str;
	if (_cache[str])
		return _cache[str];
		
	str=(str||"").toString();			
	if (str.indexOf("->")!=-1){
		str = str.split("->");
		switch(str[0]){
			case "html": 	//load from some container on the page
				str = dhx.html.getValue(str[1]);
				break;
			case "http": 	//load from external file
				str = new dhx.ajax().sync().get(str[1],{uid:dhx.uid()}).responseText;
				break;
			default:
				//do nothing, will use template as is
				break;
		}
	}
		
	//supported idioms
	// {obj.attr} => named attribute or value of sub-tag in case of xml
	str=(str||"").toString();		
	str=str.replace(newlines,"\\n");
	str=str.replace(quotes,"\\\"");

	str=str.replace(/\{obj\.([^}?]+)\?([^:]*):([^}]*)\}/g,"\"+(obj.$1?\"$2\":\"$3\")+\"");
	str=str.replace(/\{common\.([^}\(]*)\}/g,"\"+(common.$1||'')+\"");
	str=str.replace(/\{common\.([^\}\(]*)\(\)\}/g,"\"+(common.$1?common.$1.apply(this, arguments):\"\")+\"");
	str=str.replace(/\{obj\.([^}]*)\}/g,"\"+(obj.$1)+\"");
	str=str.replace("{obj}","\"+obj+\"");
	str=str.replace(/#([^#'";, ]+)#/gi,"\"+(obj.$1)+\"");

	try {
		_cache[str] = Function("obj","common","return \""+str+"\";");
	} catch(e){
		dhx.assert_error("Invalid template:"+str);
	}

	return _cache[str];
};


dhx.Template.empty=function(){	return "";	};
dhx.Template.bind =function(value){	return dhx.bind(dhx.Template(value),this); };


	/*
		adds new template-type
		obj - object to which template will be added
		data - properties of template
	*/
dhx.Type=function(obj, data){ 
	if (obj._dhx_proto_wait){
		if (!obj._dhx_type_wait)
			obj._dhx_type_wait = [];
				obj._dhx_type_wait.push(data);
		return;
	}
		
	//auto switch to prototype, if name of class was provided
	if (typeof obj == "function")
		obj = obj.prototype;
	if (!obj.types){
		obj.types = { "default" : obj.type };
		obj.type.name = "default";
	}
	
	var name = data.name;
	var type = obj.type;
	if (name)
		type = obj.types[name] = dhx.clone(data.baseType?obj.types[data.baseType]:obj.type);
	
	for(var key in data){
		if (key.indexOf("template")===0)
			type[key] = dhx.Template(data[key]);
		else
			type[key]=data[key];
	}

	return name;
};

})();
/*DHX:Depend core/dhx.js*/

dhx.Settings={
	$init:function(){
		/* 
			property can be accessed as this.config.some
			in same time for inner call it have sense to use _settings
			because it will be minified in final version
		*/
		this._settings = this.config= {}; 
	},
	define:function(property, value){
		if (typeof property == "object")
			return this._parseSeetingColl(property);
		return this._define(property, value);
	},
	_define:function(property,value){
		//method with name {prop}_setter will be used as property setter
		//setter is optional
		var setter = this[property+"_setter"];
		return this._settings[property]=setter?setter.call(this,value,property):value;
	},
	//process configuration object
	_parseSeetingColl:function(coll){
		if (coll){
			for (var a in coll)				//for each setting
				this._define(a,coll[a]);		//set value through config
		}
	},
	//helper for object initialization
	_parseSettings:function(obj,initial){
		//initial - set of default values
		var settings = {}; 
		if (initial)
			settings = dhx.extend(settings,initial);
					
		//code below will copy all properties over default one
		if (typeof obj == "object" && !obj.tagName)
			dhx.extend(settings,obj, true);	
		//call config for each setting
		this._parseSeetingColl(settings);
	},
	_mergeSettings:function(config, defaults){
		for (var key in defaults)
			switch(typeof config[key]){
				case "object": 
					config[key] = this._mergeSettings((config[key]||{}), defaults[key]);
					break;
				case "undefined":
					config[key] = defaults[key];
					break;
				default:	//do nothing
					break;
			}
		return config;
	},

	debug_freid_c_id:true,
	debug_freid_a_name:true
};
/*DHX:Depend core/datastore.js*/
/*DHX:Depend core/load.js*/
/* 
	ajax operations 
	
	can be used for direct loading as
		dhx.ajax(ulr, callback)
	or
		dhx.ajax().item(url)
		dhx.ajax().post(url)

*/

/*DHX:Depend core/dhx.js*/

dhx.ajax = function(url,call,master){
	//if parameters was provided - made fast call
	if (arguments.length!==0){
		var http_request = new dhx.ajax();
		if (master) http_request.master=master;
		return http_request.get(url,null,call);
	}
	if (!this.getXHR) return new dhx.ajax(); //allow to create new instance without direct new declaration
	
	return this;
};
dhx.ajax.count = 0;
dhx.ajax.prototype={
	master:null,
	//creates xmlHTTP object
	getXHR:function(){
		if (dhx.env.isIE)
		 return new ActiveXObject("Microsoft.xmlHTTP");
		else 
		 return new XMLHttpRequest();
	},
	/*
		send data to the server
		params - hash of properties which will be added to the url
		call - callback, can be an array of functions
	*/
	send:function(url,params,call){
		var x=this.getXHR();
		if (!dhx.isArray(call))
			call = [call];
		//add extra params to the url
		if (typeof params == "object"){
			var t=[];
			for (var a in params){
				var value = params[a];
				if (value === null || value === dhx.undefined)
					value = "";
				t.push(a+"="+encodeURIComponent(value));// utf-8 escaping
		 	}
			params=t.join("&");
		}
		if (params && this.request==='GET'){
			url=url+(url.indexOf("?")!=-1 ? "&" : "?")+params;
			params=null;
		}
		
		x.open(this.request,url,!this._sync);
		if (this.request === 'POST')
			x.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		 
		//async mode, define loading callback
		 var self=this;
		 x.onreadystatechange= function(){
			if (!x.readyState || x.readyState == 4){
				if (dhx.debug_time) dhx.log_full_time("data_loading");	//log rendering time
				dhx.ajax.count++;
				if (call && self){
					for (var i=0; i < call.length; i++)	//there can be multiple callbacks
						if (call[i]){
							var method = (call[i].success||call[i]);
							if (x.status >= 400 || (!x.status && !x.responseText))
								method = call[i].error;
							if (method)
								method.call((self.master||self),x.responseText,x.responseXML,x);
						}
				}
				if (self) self.master=null;
				call=self=null;	//anti-leak
			}
		 };
		
		x.send(params||null);
		return x; //return XHR, which can be used in case of sync. mode
	},
	//GET request
	get:function(url,params,call){
		if (arguments.length == 2){
			call = params;
			params = null;
		}
		this.request='GET';
		return this.send(url,params,call);
	},
	//POST request
	post:function(url,params,call){
		this.request='POST';
		return this.send(url,params,call);
	},
	//PUT request
	put:function(url,params,call){
		this.request='PUT';
		return this.send(url,params,call);
	},
	//POST request
	del:function(url,params,call){
		this.request='DELETE';
		return this.send(url,params,call);
	}, 
	sync:function(){
		this._sync = true;
		return this;
	},
	bind:function(master){
		this.master = master;
		return this;
	}
};
/*submits values*/
dhx.send = function(url, values, method, target){
	var form = dhx.html.create("FORM",{
		"target":(target||"_self"),
		"action":url,
		"method":(method||"POST")
	},"");
	for (var k in values) {
		var field = dhx.html.create("INPUT",{"type":"hidden","name": k,"value": values[k]},"");
		form.appendChild(field);
	}
	form.style.display = "none";
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
};


dhx.AtomDataLoader={
	$init:function(config){
		//prepare data store
		this.data = {}; 
		if (config){
			this._settings.datatype = config.datatype||"json";
			this.$ready.push(this._load_when_ready);
		}
	},
	_load_when_ready:function(){
		this._ready_for_data = true;
		
		if (this._settings.url)
			this.url_setter(this._settings.url);
		if (this._settings.data)
			this.data_setter(this._settings.data);
	},
	url_setter:function(value){
		if (!this._ready_for_data) return value;
		this.load(value, this._settings.datatype);	
		return value;
	},
	data_setter:function(value){
		if (!this._ready_for_data) return value;
		this.parse(value, this._settings.datatype);
		return true;
	},
	debug_freid_c_datatype:true,
	debug_freid_c_dataFeed:true,

	//loads data from external URL
	load:function(url,call){
		if (url.$proxy) {
			url.load(this, typeof call == "string" ? call : "json");
			return;
		}

		this.callEvent("onXLS",[]);
		if (typeof call == "string"){	//second parameter can be a loading type or callback
			//we are not using setDriver as data may be a non-datastore here
			this.data.driver = dhx.DataDriver[call];
			call = arguments[2];
		} else if (!this.data.driver)
			this.data.driver = dhx.DataDriver.json;

		//load data by async ajax call
		//loading_key - can be set by component, to ignore data from old async requests
		var callback = [{
			success: this._onLoad,
			error: this._onLoadError
		}];
		
		if (call){
			if (dhx.isArray(call))
				callback.push.apply(callback,call);
			else
				callback.push(call);
		}
			

		return dhx.ajax(url,callback,this);
	},
	//loads data from object
	parse:function(data,type){
		this.callEvent("onXLS",[]);
		this.data.driver = dhx.DataDriver[type||"json"];
		this._onLoad(data,null);
	},
	//default after loading callback
	_onLoad:function(text,xml,loader,key){
		var driver = this.data.driver;
		var data = driver.toObject(text,xml);
		if (data){
			var top = driver.getRecords(data)[0];
			this.data=(driver?driver.getDetails(top):text);
		} else 
			this._onLoadError(text,xml,loader);

		this.callEvent("onXLE",[]);
	},
	_onLoadError:function(text, xml, xhttp){
		this.callEvent("onXLE",[]);
		this.callEvent("onLoadError",arguments);
		dhx4.callEvent("onLoadError", [text, xml, xhttp, this]);
	},
	_check_data_feed:function(data){
		if (!this._settings.dataFeed || this._ignore_feed || !data) return true;
		var url = this._settings.dataFeed;
		if (typeof url == "function")
			return url.call(this, (data.id||data), data);
		url = url+(url.indexOf("?")==-1?"?":"&")+"action=get&id="+encodeURIComponent(data.id||data);
		this.callEvent("onXLS",[]);
		dhx.ajax(url, function(text,xml,loader){
			this._ignore_feed=true;
			var data = dhx.DataDriver.toObject(text, xml);
			if (data)
				this.setValues(data.getDetails(data.getRecords()[0]));
			else
				this._onLoadError(text,xml,loader);
			this._ignore_feed=false;
			this.callEvent("onXLE",[]);
		}, this);
		return false;
	}
};

/*
	Abstraction layer for different data types
*/

dhx.DataDriver={};
dhx.DataDriver.json={
	//convert json string to json object if necessary
	toObject:function(data){
		if (!data) data="[]";
		if (typeof data == "string"){
			try{
				eval ("dhx.temp="+data);
			} catch(e){
				dhx.assert_error(e);
				return null;
			}
			data = dhx.temp;
		}

		if (data.data){ 
			var t = data.data.config = {};
			for (var key in data)
				if (key!="data")
					t[key] = data[key];
			data = data.data;
		}
			
		return data;
	},
	//get array of records
	getRecords:function(data){
		if (data && !dhx.isArray(data))
		 return [data];
		return data;
	},
	//get hash of properties for single record
	getDetails:function(data){
		if (typeof data == "string")
			return { id:dhx.uid(), value:data };
		return data;
	},
	//get count of data and position at which new data need to be inserted
	getInfo:function(data){
		var cfg = data.config;
		if (!cfg) return {};

		return { 
		 _size:(cfg.total_count||0),
		 _from:(cfg.pos||0),
		 _parent:(cfg.parent||0),
		 _config:(cfg.config),
		 _key:(cfg.dhx_security)
		};
	},
	child:"data"
};

dhx.DataDriver.html={
	/*
		incoming data can be
		 - collection of nodes
		 - ID of parent container
		 - HTML text
	*/
	toObject:function(data){
		if (typeof data == "string"){
		 var t=null;
		 if (data.indexOf("<")==-1)	//if no tags inside - probably its an ID
			t = dhx.toNode(data);
		 if (!t){
			t=document.createElement("DIV");
			t.innerHTML = data;
		 }
		 
		 return t.getElementsByTagName(this.tag);
		}
		return data;
	},
	//get array of records
	getRecords:function(node){
		var data = [];
		for (var i=0; i<node.childNodes.length; i++){
			var child = node.childNodes[i];
			if (child.nodeType == 1)
				data.push(child);
		}
		return data;
	},
	//get hash of properties for single record
	getDetails:function(data){
		return dhx.DataDriver.xml.tagToObject(data);
	},
	//dyn loading is not supported by HTML data source
	getInfo:function(data){
		return { 
		 _size:0,
		 _from:0
		};
	},
	tag: "LI"
};

dhx.DataDriver.jsarray={
	//eval jsarray string to jsarray object if necessary
	toObject:function(data){
		if (typeof data == "string"){
		 eval ("dhx.temp="+data);
		 return dhx.temp;
		}
		return data;
	},
	//get array of records
	getRecords:function(data){
		return data;
	},
	//get hash of properties for single record, in case of array they will have names as "data{index}"
	getDetails:function(data){
		var result = {};
		for (var i=0; i < data.length; i++) 
		 result["data"+i]=data[i];
		 
		return result;
	},
	//dyn loading is not supported by js-array data source
	getInfo:function(data){
		return { 
		 _size:0,
		 _from:0
		};
	}
};

dhx.DataDriver.csv={
	//incoming data always a string
	toObject:function(data){
		return data;
	},
	//get array of records
	getRecords:function(data){
		return data.split(this.row);
	},
	//get hash of properties for single record, data named as "data{index}"
	getDetails:function(data){
		data = this.stringToArray(data);
		var result = {};
		for (var i=0; i < data.length; i++) 
		 result["data"+i]=data[i];
		 
		return result;
	},
	//dyn loading is not supported by csv data source
	getInfo:function(data){
		return { 
		 _size:0,
		 _from:0
		};
	},
	//split string in array, takes string surrounding quotes in account
	stringToArray:function(data){
		data = data.split(this.cell);
		for (var i=0; i < data.length; i++)
		 data[i] = data[i].replace(/^[ \t\n\r]*(\"|)/g,"").replace(/(\"|)[ \t\n\r]*$/g,"");
		return data;
	},
	row:"\n",	//default row separator
	cell:","	//default cell separator
};

dhx.DataDriver.xml={
	_isValidXML:function(data){
		if (!data || !data.documentElement)
			return null;
		if (data.getElementsByTagName("parsererror").length)
			return null;
		return data;
	},
	//convert xml string to xml object if necessary
	toObject:function(text,xml){
		if (this._isValidXML(data))
			return data;
		if (typeof text == "string")
			var data = this.fromString(text.replace(/^[\s]+/,""));
		else
			data = text;

		if (this._isValidXML(data))
			return data;
		return null;
	},
	//get array of records
	getRecords:function(data){
		return this.xpath(data,this.records);
	},
	records:"/*/item",
	child:"item",
	config:"/*/config",
	//get hash of properties for single record
	getDetails:function(data){
		return this.tagToObject(data,{});
	},
	//get count of data and position at which new data_loading need to be inserted
	getInfo:function(data){
		
		var config = this.xpath(data, this.config);
		if (config.length)
			config = this.assignTypes(this.tagToObject(config[0],{}));
		else 
			config = null;

		return { 
		 _size:(data.documentElement.getAttribute("total_count")||0),
		 _from:(data.documentElement.getAttribute("pos")||0),
		 _parent:(data.documentElement.getAttribute("parent")||0),
		 _config:config,
		 _key:(data.documentElement.getAttribute("dhx_security")||null)
		};
	},
	//xpath helper
	xpath:function(xml,path){
		if (window.XPathResult){	//FF, KHTML, Opera
		 var node=xml;
		 if(xml.nodeName.indexOf("document")==-1)
		 xml=xml.ownerDocument;
		 var res = [];
		 var col = xml.evaluate(path, node, null, XPathResult.ANY_TYPE, null);
		 var temp = col.iterateNext();
		 while (temp){ 
			res.push(temp);
			temp = col.iterateNext();
		}
		return res;
		}	
		else {
			var test = true;
			try {
				if (typeof(xml.selectNodes)=="undefined")
					test = false;
			} catch(e){ /*IE7 and below can't operate with xml object*/ }
			//IE
			if (test)
				return xml.selectNodes(path);
			else {
				//Google hate us, there is no interface to do XPath
				//use naive approach
				var name = path.split("/").pop();
				return xml.getElementsByTagName(name);
			}
		}
	},
	assignTypes:function(obj){
		for (var k in obj){
			var test = obj[k];
			if (typeof test == "object")
				this.assignTypes(test);
			else if (typeof test == "string"){
				if (test === "") 
					continue;
				if (test == "true")
					obj[k] = true;
				else if (test == "false")
					obj[k] = false;
				else if (test == test*1)
					obj[k] = obj[k]*1;
			}
		}
		return obj;
	},
	//convert xml tag to js object, all subtags and attributes are mapped to the properties of result object
	tagToObject:function(tag,z){
		z=z||{};
		var flag=false;
				
		//map attributes
		var a=tag.attributes;
		if(a && a.length){
			for (var i=0; i<a.length; i++)
		 		z[a[i].name]=a[i].value;
		 	flag = true;
	 	}
		//map subtags
		
		var b=tag.childNodes;
		var state = {};
		for (var i=0; i<b.length; i++){
			if (b[i].nodeType==1){
				var name = b[i].tagName;
				if (typeof z[name] != "undefined"){
					if (!dhx.isArray(z[name]))
						z[name]=[z[name]];
					z[name].push(this.tagToObject(b[i],{}));
				}
				else
					z[b[i].tagName]=this.tagToObject(b[i],{});	//sub-object for complex subtags
				flag=true;
			}
		}
		
		if (!flag)
			return this.nodeValue(tag);
		//each object will have its text content as "value" property
		z.value = z.value||this.nodeValue(tag);
		return z;
	},
	//get value of xml node 
	nodeValue:function(node){
		if (node.firstChild)
		 return node.firstChild.data;	//FIXME - long text nodes in FF not supported for now
		return "";
	},
	//convert XML string to XML object
	fromString:function(xmlString){
		try{
			if (window.DOMParser)		// FF, KHTML, Opera
				return (new DOMParser()).parseFromString(xmlString,"text/xml");
			if (window.ActiveXObject){	// IE, utf-8 only 
				var temp=new ActiveXObject("Microsoft.xmlDOM");
				temp.loadXML(xmlString);
				return temp;
			}
		} catch(e){
			dhx.assert_error(e);
			return null;
		}
		dhx.assert_error("Load from xml string is not supported");
	}
};

/*DHX:Depend core/dhx.js*/

/*
	Behavior:DataLoader - load data in the component
	
	@export
		load
		parse
*/
dhx.DataLoader=dhx.proto({
	$init:function(config){
		//prepare data store
		config = config || "";
		
		//list of all active ajax requests
		this._ajax_queue = dhx.toArray();

		this.data = new dhx.DataStore();
		this.data.attachEvent("onClearAll",dhx.bind(this._call_onclearall,this));
		this.data.attachEvent("onServerConfig", dhx.bind(this._call_on_config, this));
		this.data.feed = this._feed;

	},

	_feed:function(from,count,callback){
				//allow only single request at same time
				if (this._load_count)
					return this._load_count=[from,count,callback];	//save last ignored request
				else
					this._load_count=true;
				this._feed_last = [from, count];
				this._feed_common.call(this, from, count, callback);
	},
	_feed_common:function(from, count, callback){
		var url = this.data.url;
		if (from<0) from = 0;
		this.load(url+((url.indexOf("?")==-1)?"?":"&")+(this.dataCount()?("continue=true&"):"")+"start="+from+"&count="+count,[
			this._feed_callback,
			callback
		]);
	},
	_feed_callback:function(){
		//after loading check if we have some ignored requests
		var temp = this._load_count;
		var last = this._feed_last;
		this._load_count = false;
		if (typeof temp =="object" && (temp[0]!=last[0] || temp[1]!=last[1]))
			this.data.feed.apply(this, temp);	//load last ignored request
	},
	//loads data from external URL
	load:function(url,call){
		var ajax = dhx.AtomDataLoader.load.apply(this, arguments);
		this._ajax_queue.push(ajax);

		//prepare data feed for dyn. loading
		if (!this.data.url)
			this.data.url = url;
	},
	//load next set of data rows
	loadNext:function(count, start, callback, url, now){
		if (this._settings.datathrottle && !now){
			if (this._throttle_request)
				window.clearTimeout(this._throttle_request);
			this._throttle_request = dhx.delay(function(){
				this.loadNext(count, start, callback, url, true);
			},this, 0, this._settings.datathrottle);
			return;
		}

		if (!start && start !== 0) start = this.dataCount();
		this.data.url = this.data.url || url;

		if (this.callEvent("onDataRequest", [start,count,callback,url]) && this.data.url)
			this.data.feed.call(this, start, count, callback);
	},
	_maybe_loading_already:function(count, from){
		var last = this._feed_last;
		if(this._load_count && last){
			if (last[0]<=from && (last[1]+last[0] >= count + from )) return true;
		}
		return false;
	},
	//default after loading callback
	_onLoad:function(text,xml,loader){
		//ignore data loading command if data was reloaded 
		this._ajax_queue.remove(loader);

		var data = this.data.driver.toObject(text,xml);
		if (data) 
			this.data._parse(data);
		else
			return this._onLoadError(text, xml, loader);
		
		//data loaded, view rendered, call onready handler
		this._call_onready();

		this.callEvent("onXLE",[]);
	},
	removeMissed_setter:function(value){
		return this.data._removeMissed = value;
	},
	scheme_setter:function(value){
		this.data.scheme(value);
	},	
	dataFeed_setter:function(value){
		this.data.attachEvent("onBeforeFilter", dhx.bind(function(text, value){
			if (this._settings.dataFeed){

				var filter = {};				
				if (!text && !value) return;
				if (typeof text == "function"){
					if (!value) return;
					text(value, filter);
				} else 
					filter = { text:value };

				this.clearAll();
				var url = this._settings.dataFeed;
				var urldata = [];
				if (typeof url == "function")
					return url.call(this, value, filter);
				for (var key in filter)
					urldata.push("dhx_filter["+key+"]="+encodeURIComponent(filter[key]));
				this.load(url+(url.indexOf("?")<0?"?":"&")+urldata.join("&"), this._settings.datatype);
				return false;
			}
		},this));
		return value;
	},

	debug_freid_c_ready:true,
	debug_freid_c_datathrottle:true,
	
	_call_onready:function(){
		if (this._settings.ready && !this._ready_was_used){
			var code = dhx.toFunctor(this._settings.ready);
			if (code)
				dhx.delay(code, this, arguments);
			this._ready_was_used = true;
		}
	},
	_call_onclearall:function(){
		for (var i = 0; i < this._ajax_queue.length; i++)
			this._ajax_queue[i].abort();

		this._ajax_queue = dhx.toArray();
	},
	_call_on_config:function(config){
		this._parseSeetingColl(config);
	}
},dhx.AtomDataLoader);


/*
	DataStore is not a behavior, it standalone object, which represents collection of data.
	Call provideAPI to map data API

	@export
		exists
		idByIndex
		indexById
		get
		set
		refresh
		dataCount
		sort
		filter
		next
		previous
		clearAll
		first
		last
*/
dhx.DataStore = function(){
	this.name = "DataStore";
	
	dhx.extend(this, dhx.EventSystem);

	this.setDriver("json");	//default data source is an
	this.pull = {};						//hash of IDs
	this.order = dhx.toArray();		//order of IDs
	this._marks = {};
};

dhx.DataStore.prototype={
	//defines type of used data driver
	//data driver is an abstraction other different data formats - xml, json, csv, etc.
	setDriver:function(type){
		dhx.assert(dhx.DataDriver[type],"incorrect DataDriver");
		this.driver = dhx.DataDriver[type];
	},
	//process incoming raw data
	_parse:function(data,master){
		this.callEvent("onParse", [this.driver, data]);
		if (this._filter_order)
			this.filter();
			
		//get size and position of data
		var info = this.driver.getInfo(data);
		if (info._key)
			dhx.securityKey = info._key;
		if (info._config)
			this.callEvent("onServerConfig",[info._config]);

		//get array of records
		var recs = this.driver.getRecords(data);

		this._inner_parse(info, recs);

		//in case of tree store we may want to group data
		if (this._scheme_group && this._group_processing)
			this._group_processing(this._scheme_group);

		//optional data sorting
		if (this._scheme_sort){
			this.blockEvent();
			this.sort(this._scheme_sort);
			this.unblockEvent();
		}
		this.callEvent("onStoreLoad",[this.driver, data]);
		//repaint self after data loading
		this.refresh();
	},
	_inner_parse:function(info, recs){
		var from = (info._from||0)*1;
		var subload = true;
		var marks = false;

		if (from === 0 && this.order[0]){ //update mode
			if (this._removeMissed){
				//update mode, create kill list
				marks = {};
				for (var i=0; i<this.order.length; i++)
					marks[this.order[i]]=true;
			}
			
			subload = false;
			from = this.order.length;
		}

		var j=0;
		for (var i=0; i<recs.length; i++){
			//get hash of details for each record
			var temp = this.driver.getDetails(recs[i]);
			var id = this.id(temp); 	//generate ID for the record
			if (!this.pull[id]){		//if such ID already exists - update instead of insert
				this.order[j+from]=id;	
				j++;
			} else if (subload && this.order[j+from])
				j++;

			if(this.pull[id]){
				dhx.extend(this.pull[id],temp,true);//add only new properties
				if (this._scheme_update)
					this._scheme_update(this.pull[id]);
				//update mode, remove item from kill list
				if (marks)
					delete marks[id];
			} else{
				this.pull[id] = temp;
				if (this._scheme_init)
					this._scheme_init(temp);
			}
			
		}

		//update mode, delete items which are not existing in the new xml
		if (marks){
			this.blockEvent();
			for (var delid in marks)
				this.remove(delid);
			this.unblockEvent();
		}

		if (!this.order[info._size-1])
			this.order[info._size-1] = dhx.undefined;
	},
	//generate id for data object
	id:function(data){
		return data.id||(data.id=dhx.uid());
	},
	changeId:function(old, newid){
		//dhx.assert(this.pull[old],"Can't change id, for non existing item: "+old);
		if(this.pull[old])
			this.pull[newid] = this.pull[old];
		this.pull[newid].id = newid;
		this.order[this.order.find(old)]=newid;
		if (this._filter_order)
			this._filter_order[this._filter_order.find(old)]=newid;
		if (this._marks[old]){
			this._marks[newid] = this._marks[old];
			delete this._marks[old];
		}


		this.callEvent("onIdChange", [old, newid]);
		if (this._render_change_id)
			this._render_change_id(old, newid);
		delete this.pull[old];
	},
	//get data from hash by id
	item:function(id){
		return this.pull[id];
	},
	//assigns data by id
	update:function(id,data){
		if (dhx.isUndefined(data)) data = this.item(id);
		if (this._scheme_update)
			this._scheme_update(data);
		if (this.callEvent("onBeforeUpdate", [id, data]) === false) return false;
		this.pull[id]=data;
		this.callEvent("onStoreUpdated",[id, data, "update"]);
	},
	//sends repainting signal
	refresh:function(id){
		if (this._skip_refresh) return; 
		
		if (id)
			this.callEvent("onStoreUpdated",[id, this.pull[id], "paint"]);
		else
			this.callEvent("onStoreUpdated",[null,null,null]);
	},
	silent:function(code, master){
		this._skip_refresh = true;
		code.call(master||this);
		this._skip_refresh = false;
	},
	//converts range IDs to array of all IDs between them
	getRange:function(from,to){		
		//if some point is not defined - use first or last id
		//BEWARE - do not use empty or null ID
		if (from)
			from = this.indexById(from);
		else 
			from = (this.$min||this.startOffset)||0;
		if (to)
			to = this.indexById(to);
		else {
			to = Math.min(((this.$max||this.endOffset)||Infinity),(this.dataCount()-1));
			if (to<0) to = 0; //we have not data in the store
		}

		if (from>to){ //can be in case of backward shift-selection
			var a=to; to=from; from=a;
		}

		return this.getIndexRange(from,to);
	},
	//converts range of indexes to array of all IDs between them
	getIndexRange:function(from,to){
		to=Math.min((to||Infinity),this.dataCount()-1);
		
		var ret=dhx.toArray(); //result of method is rich-array
		for (var i=(from||0); i <= to; i++)
			ret.push(this.item(this.order[i]));
		return ret;
	},
	//returns total count of elements
	dataCount:function(){
		return this.order.length;
	},
	//returns truy if item with such ID exists
	exists:function(id){
		return !!(this.pull[id]);
	},
	//nextmethod is not visible on component level, check DataMove.move
	//moves item from source index to the target index
	move:function(sindex,tindex){
		dhx.assert(sindex>=0 && tindex>=0, "DataStore::move","Incorrect indexes");

		var id = this.idByIndex(sindex);
		var obj = this.item(id);
		
		this.order.removeAt(sindex);	//remove at old position
		//if (sindex<tindex) tindex--;	//correct shift, caused by element removing
		this.order.insertAt(id,Math.min(this.order.length, tindex));	//insert at new position
		
		//repaint signal
		this.callEvent("onStoreUpdated",[id,obj,"move"]);
	},
	scheme:function(config){
		this._scheme = {};
		this._scheme_init = config.$init;
		this._scheme_update = config.$update;
		this._scheme_serialize = config.$serialize;
		this._scheme_group = config.$group;
		this._scheme_sort = config.$sort;

		//ignore $-starting properties, as they have special meaning
		for (var key in config)
			if (key.substr(0,1) != "$")
				this._scheme[key] = config[key];
	},
	sync:function(source, filter, silent){
		if (typeof source == "string")
			source = $$("source");

		if (typeof filter != "function"){
			silent = filter;
			filter = null;
		}
		
		if (dhx.debug_bind){
			this.debug_sync_master = source; 
			dhx.log("[sync] "+this.debug_bind_master.name+"@"+this.debug_bind_master._settings.id+" <= "+this.debug_sync_master.name+"@"+this.debug_sync_master._settings.id);
		}

		this._backbone_source = false;
		if (source.name != "DataStore"){
			if (source.data && source.data.name == "DataStore")
				source = source.data;
			else
				this._backbone_source = true;
		}

		
		var	sync_logic = dhx.bind(function(mode, record, data){
			if (this._backbone_source){
				//ignore first call for backbone sync
				if (!mode) return; 
				//data changing
				if (mode.indexOf("change") === 0){
					if (mode == "change"){
						this.pull[record.id] = record.attributes;
						this.refresh(record.id);
						return;
					} else return;	//ignoring property change event
				}

				//we need to access global model, it has different position for different events
				if (mode == "reset")
					data = record;
				//fill data collections from backbone model
				this.order = []; this.pull = {};
				this._filter_order = null;
				for (var i=0; i<data.models.length; i++){
					var id = data.models[i].id;
					this.order.push(id);
					this.pull[id] = data.models[i].attributes;
				}
			} else {
				this._filter_order = null;
				this.order = dhx.toArray([].concat(source.order));
				this.pull = source.pull;
			}
			
			
			if (filter)
				this.silent(filter);
			
			if (this._on_sync)
				this._on_sync();
			if (dhx.debug_bind)
				dhx.log("[sync:request] "+this.debug_sync_master.name+"@"+this.debug_sync_master._settings.id + " <= "+this.debug_bind_master.name+"@"+this.debug_bind_master._settings.id);
			this.callEvent("onSyncApply",[]);
			if (!silent) 
				this.refresh();
			else
				silent = false;
		}, this);

		if (this._backbone_source)
			source.bind('all', sync_logic);
		else
			this._sync_events = [
				source.attachEvent("onStoreUpdated", sync_logic),
				source.attachEvent("onIdChange", dhx.bind(function(old, nid){ this.changeId(old, nid); }, this))
			];

		sync_logic();
	},
	//adds item to the store
	add:function(obj,index){
		//default values		
		if (this._scheme)
			for (var key in this._scheme)
				if (dhx.isUndefined(obj[key]))
					obj[key] = this._scheme[key];
		
		if (this._scheme_init)
			this._scheme_init(obj);
		
		//generate id for the item
		var id = this.id(obj);

		//in case of treetable order is sent as 3rd parameter
		var order = arguments[2]||this.order;
		
		//by default item is added to the end of the list
		var data_size = order.length;
		
		if (dhx.isUndefined(index) || index < 0)
			index = data_size; 
		//check to prevent too big indexes			
		if (index > data_size){
			dhx.log("Warning","DataStore:add","Index of out of bounds");
			index = Math.min(order.length,index);
		}
		if (this.callEvent("onBeforeAdd", [id, obj, index]) === false) return false;

		dhx.assert(!this.exists(id), "Not unique ID");
		
		this.pull[id]=obj;
		order.insertAt(id,index);
		if (this._filter_order){	//adding during filtering
			//we can't know the location of new item in full dataset, making suggestion
			//put at end by default
			var original_index = this._filter_order.length;
			//put at start only if adding to the start and some data exists
			if (!index && this.order.length)
				original_index = 0;

			this._filter_order.insertAt(id,original_index);
		}
		this.callEvent("onAfterAdd",[id,index]);
		//repaint signal
		this.callEvent("onStoreUpdated",[id,obj,"add"]);
		return id;
	},
	
	//removes element from datastore
	remove:function(id){
		//id can be an array of IDs - result of getSelect, for example
		if (dhx.isArray(id)){
			for (var i=0; i < id.length; i++)
				this.remove(id[i]);
			return;
		}
		if (this.callEvent("onBeforeDelete",[id]) === false) return false;
		
		dhx.assert(this.exists(id), "Not existing ID in remove command"+id);

		var obj = this.item(id);	//save for later event
		//clear from collections
		this.order.remove(id);
		if (this._filter_order) 
			this._filter_order.remove(id);
			
		delete this.pull[id];
		if (this._marks[id])
			delete this._marks[id];

		this.callEvent("onAfterDelete",[id]);
		//repaint signal
		this.callEvent("onStoreUpdated",[id,obj,"delete"]);
	},
	//deletes all records in datastore
	clearAll:function(){
		//instead of deleting one by one - just reset inner collections
		this.pull = {};
		this.order = dhx.toArray();
		//this.feed = null;
		this._filter_order = this.url = null;
		this.callEvent("onClearAll",[]);
		this.refresh();
	},
	//converts id to index
	idByIndex:function(index){
		if (index>=this.order.length || index<0)
			dhx.log("Warning","DataStore::idByIndex Incorrect index");
			
		return this.order[index];
	},
	//converts index to id
	indexById:function(id){
		var res = this.order.find(id);	//slower than idByIndex
		
		if (!this.pull[id])
			dhx.log("Warning","DataStore::indexById Non-existing ID: "+ id);
			
		return res;
	},
	//returns ID of next element
	next:function(id,step){
		return this.order[this.indexById(id)+(step||1)];
	},
	//returns ID of first element
	first:function(){
		return this.order[0];
	},
	//returns ID of last element
	last:function(){
		return this.order[this.order.length-1];
	},
	//returns ID of previous element
	previous:function(id,step){
		return this.order[this.indexById(id)-(step||1)];
	},
	/*
		sort data in collection
			by - settings of sorting
		
		or
		
			by - sorting function
			dir - "asc" or "desc"
			
		or
		
			by - property
			dir - "asc" or "desc"
			as - type of sortings
		
		Sorting function will accept 2 parameters and must return 1,0,-1, based on desired order
	*/
	sort:function(by, dir, as){
		var sort = by;	
		if (typeof by == "function")
			sort = {as:by, dir:dir};
		else if (typeof by == "string")
			sort = {by:by.replace(/#/g,""), dir:dir, as:as};

		
		var parameters = [sort.by, sort.dir, sort.as];
		if (!this.callEvent("onBeforeSort",parameters)) return;	
		
		this._sort_core(sort);
		
		//repaint self
		this.refresh();
		
		this.callEvent("onAfterSort",parameters);
	},
	_sort_core:function(sort){
		if (this.order.length){
			var sorter = this._sort._create(sort);
			//get array of IDs
			var neworder = this.getRange(this.first(), this.last());
			neworder.sort(sorter);
			this.order = neworder.map(function(obj){ 
				dhx.assert(obj, "Client sorting can't be used with dynamic loading");
				return this.id(obj);
			},this);
		}
	},
	/*
		Filter datasource
		
		text - property, by which filter
		value - filter mask
		
		or
		
		text  - filter method
		
		Filter method will receive data object and must return true or false
	*/
	_filter_reset:function(preserve){
		//remove previous filtering , if any
		if (this._filter_order && !preserve){
			this.order = this._filter_order;
			delete this._filter_order;
		}
	},
	_filter_core:function(filter, value, preserve){
		var neworder = dhx.toArray();
		for (var i=0; i < this.order.length; i++){
			var id = this.order[i];
			if (filter(this.item(id),value))
				neworder.push(id);
		}
		//set new order of items, store original
		if (!preserve ||  !this._filter_order)
			this._filter_order = this.order;
		this.order = neworder;
	},
	filter:function(text,value,preserve){
		if (!this.callEvent("onBeforeFilter", [text, value])) return;
		
		this._filter_reset(preserve);
		if (!this.order.length) return;
		
		//if text not define -just unfilter previous state and exit
		if (text){
			var filter = text;
			value = value||"";
			if (typeof text == "string"){
				text = text.replace(/#/g,"");
				if (typeof value == "function")
					filter = function(obj){
						return value(obj[text]);
					};
				else{
					value = value.toString().toLowerCase();
					filter = function(obj,value){	//default filter - string start from, case in-sensitive
						dhx.assert(obj, "Client side filtering can't be used with dynamic loading");
						return (obj[text]||"").toString().toLowerCase().indexOf(value)!=-1;
					};
				}
			}
			
			this._filter_core(filter, value, preserve, this._filterMode);
		}
		//repaint self
		this.refresh();
		
		this.callEvent("onAfterFilter", []);
	},
	/*
		Iterate through collection
	*/
	each:function(method,master){
		for (var i=0; i<this.order.length; i++)
			method.call((master||this), this.item(this.order[i]));
	},
	_methodPush:function(object,method){
		return function(){ return object[method].apply(object,arguments); };
	},

	addMark:function(id, mark, css, value){
		var obj = this._marks[id]||{};
		this._marks[id] = obj;
		if (!obj[mark]){
			obj[mark] = value||true;	
			if (css){
				this.item(id).$css = (this.item(id).$css||"")+" "+mark;
				this.refresh(id);
			}
		}
		return obj[mark];
	},
	removeMark:function(id, mark, css){
		var obj = this._marks[id];
		if (obj && obj[mark])
			delete obj[mark];
		if (css){
			var current_css = this.item(id).$css;
			if (current_css){
				this.item(id).$css = current_css.replace(mark, "");
				this.refresh(id);
			}
		}
	},
	hasMark:function(id, mark){
		var obj = this._marks[id];
		return (obj && obj[mark]);
	},
	/*
		map inner methods to some distant object
	*/
	provideApi:function(target,eventable){
		this.debug_bind_master = target;
			
		if (eventable){
			this.mapEvent({
				onbeforesort:	target,
				onaftersort:	target,
				onbeforeadd:	target,
				onafteradd:		target,
				onbeforedelete:	target,
				onafterdelete:	target,
				onbeforeupdate: target/*,
				onafterfilter:	target,
				onbeforefilter:	target*/
			});
		}
			
		var list = ["sort","add","remove","exists","idByIndex","indexById","item","update","refresh","dataCount","filter","next","previous","clearAll","first","last","serialize","sync","addMark","removeMark","hasMark"];
		for (var i=0; i < list.length; i++)
			target[list[i]] = this._methodPush(this,list[i]);
			
	},
	/*
		serializes data to a json object
	*/
	serialize: function(){
		var ids = this.order;
		var result = [];
		for(var i=0; i< ids.length;i++) {
			var el = this.pull[ids[i]];
			if (this._scheme_serialize){
				el = this._scheme_serialize(el);
				if (el===false) continue;
			}
			result.push(el);
		}
		return result;
	},

	_sort:{
		_create:function(config){
			return this._dir(config.dir, this._by(config.by, config.as));
		},
		_as:{
			"date":function(a,b){
				a=a-0; b=b-0;
				return a>b?1:(a<b?-1:0);
			},
			"int":function(a,b){
				a = a*1; b=b*1;
				return a>b?1:(a<b?-1:0);
			},
			"string_strict":function(a,b){
				a = a.toString(); b=b.toString();
				return a>b?1:(a<b?-1:0);
			},
			"string":function(a,b){
				if (!b) return 1;
				if (!a) return -1;
				
				a = a.toString().toLowerCase(); b=b.toString().toLowerCase();
				return a>b?1:(a<b?-1:0);
			}
		},
		_by:function(prop, method){
			if (!prop)
				return method;
			if (typeof method != "function")
				method = this._as[method||"string"];

			dhx.assert(method, "Invalid sorting method");
			return function(a,b){
				return method(a[prop],b[prop]);
			};
		},
		_dir:function(prop, method){
			if (prop == "asc" || !prop)
				return method;
			return function(a,b){
				return method(a,b)*-1;
			};
		}
	}
};




//UI interface
dhx.BaseBind = {
	debug_freid_ignore:{
		"id":true
	},
	
	bind:function(target, rule, format){
		if (typeof target == 'string')
			target = dhx.ui.get(target);
			
		if (target._initBindSource) target._initBindSource();
		if (this._initBindSource) this._initBindSource();

		
			
		if (!target.getBindData)
			dhx.extend(target, dhx.BindSource);
		if (!this._bind_ready){
			var old_render = this.render;
			if (this.filter){
				var key = this._settings.id;
				this.data._on_sync = function(){
					target._bind_updated[key] = false;
				};
			}
			this.render = function(){
				if (this._in_bind_processing) return;
				
				this._in_bind_processing = true;
				var result = this.callEvent("onBindRequest");
				this._in_bind_processing = false;
				
				return old_render.apply(this, ((result === false)?arguments:[]));
			};
			if (this.getValue||this.getValues)
				this.save = function(){
					if (this.validate && !this.validate()) return;
					target.setBindData((this.getValue?this.getValue:this.getValues()),this._settings.id);
				};
			this._bind_ready = true;
		}
		target.addBind(this._settings.id, rule, format);
		
		if (dhx.debug_bind)
			dhx.log("[bind] "+this.name+"@"+this._settings.id+" <= "+target.name+"@"+target._settings.id);

		var target_id = this._settings.id;
		//FIXME - check for touchable is not the best solution, to detect necessary event
		this.attachEvent(this.touchable?"onAfterRender":"onBindRequest", function(){
			return target.getBindData(target_id);
		});
		//we want to refresh list after data loading if it has master link
		//in same time we do not want such operation for dataFeed components
		//as they are reloading data as response to the master link
		if (!this._settings.dataFeed && this.loadNext)
			this.data.attachEvent("onStoreLoad", function(){
				target._bind_updated[target_id] = false;
			});

		if (this.isVisible(this._settings.id))
			this.refresh();
	},
	unbind:function(target){
		return this._unbind(target);
	},
	_unbind:function(target){
		target.removeBind(this._settings.id);
		var events = (this._sync_events||(this.data?this.data._sync_events:0));
		if (events && target.data)
			for (var i=0; i<events.length; i++)
				target.data.detachEvent(events[i]);
	}
};

//bind interface
dhx.BindSource = {
	$init:function(){
		this._bind_hash = {};		//rules per target
		this._bind_updated = {};	//update flags
		this._ignore_binds = {};
		
		//apply specific bind extension
		this._bind_specific_rules(this);
	},
	saveBatch:function(code){
		this._do_not_update_binds = true;
		code.call(this);
		this._do_not_update_binds = false;
		this._update_binds();
	},
	setBindData:function(data, key){
		if (key)
			this._ignore_binds[key] = true;

		if (dhx.debug_bind)
				dhx.log("[bind:save] "+this.name+"@"+this._settings.id+" <= "+"@"+key);
		if (this.setValue)
			this.setValue(data);
		else if (this.setValues)
			this.setValues(data);
		else {
			var id = this.getCursor();
			if (id){
				data = dhx.extend(this.item(id), data, true);
				this.update(id, data);
			}
		}
		this.callEvent("onBindUpdate", [data, key]);		
		if (this.save)
			this.save();
		
		if (key)
			this._ignore_binds[key] = false;
	},
	//fill target with data
	getBindData:function(key, update){
		//fire only if we have data updates from the last time
		if (this._bind_updated[key]) return false;
		var target = dhx.ui.get(key);
		//fill target only when it visible
		if (target.isVisible(target._settings.id)){
			this._bind_updated[key] = true;
			if (dhx.debug_bind)
				dhx.log("[bind:request] "+this.name+"@"+this._settings.id+" => "+target.name+"@"+target._settings.id);
			this._bind_update(target, this._bind_hash[key][0], this._bind_hash[key][1]); //trigger component specific updating logic
			if (update && target.filter)
				target.refresh();
		}
	},
	//add one more bind target
	addBind:function(source, rule, format){
		this._bind_hash[source] = [rule, format];
	},
	removeBind:function(source){
		delete this._bind_hash[source];
		delete this._bind_updated[source];
		delete this._ignore_binds[source];
	},
	//returns true if object belong to "collection" type
	_bind_specific_rules:function(obj){
		if (obj.filter)
			dhx.extend(this, dhx.CollectionBind);
		else if (obj.setValue)
			dhx.extend(this, dhx.ValueBind);
		else
			dhx.extend(this, dhx.RecordBind);
	},
	//inform all binded objects, that source data was updated
	_update_binds:function(){
		if (!this._do_not_update_binds)
			for (var key in this._bind_hash){
				if (this._ignore_binds[key]) continue;
				this._bind_updated[key] = false;
				this.getBindData(key, true);
			}
	},
	//copy data from source to the target
	_bind_update_common:function(target, rule, data){
		if (target.setValue)
			target.setValue(data?data[rule]:data);
		else if (!target.filter){
			if (!data && target.clear)
				target.clear();
			else {
				if (target._check_data_feed(data))
					target.setValues(dhx.clone(data));
			}
		} else {
			target.data.silent(function(){
				this.filter(rule,data);
			});
		}
		target.callEvent("onBindApply", [data,rule,this]);
	}
};


//pure data objects
dhx.DataValue = dhx.proto({
	name:"DataValue",
	isVisible:function(){ return true; },
	$init:function(config){ 
		this.data = ""||config; 
		var id = (config&&config.id)?config.id:dhx.uid();
		this._settings = { id:id };
		dhx.ui.views[id] = this;
	},
	setValue:function(value){
		this.data = value;
		this.callEvent("onChange", [value]);
	},
	getValue:function(){
		return this.data;
	},
	refresh:function(){ this.callEvent("onBindRequest"); }
}, dhx.EventSystem, dhx.BaseBind);

dhx.DataRecord = dhx.proto({
	name:"DataRecord",
	isVisible:function(){ return true; },
	$init:function(config){
		this.data = config||{}; 
		var id = (config&&config.id)?config.id:dhx.uid();
		this._settings = { id:id };
		dhx.ui.views[id] = this;
	},
	getValues:function(){
		return this.data;
	},
	setValues:function(data){
		this.data = data;
		this.callEvent("onChange", [data]);
	},
	refresh:function(){ this.callEvent("onBindRequest"); }
}, dhx.EventSystem, dhx.BaseBind, dhx.AtomDataLoader, dhx.Settings);


dhx.DataCollection = dhx.proto({
	name:"DataCollection",
	isVisible:function(){ 
		if (!this.data.order.length && !this.data._filter_order && !this._settings.dataFeed) return false;
		return true; 
	},
	$init:function(config){
		this.data.provideApi(this, true);
		var id = (config&&config.id)?config.id:dhx.uid();
		this._settings.id =id;
		dhx.ui.views[id] = this;
		this.data.attachEvent("onStoreLoad", dhx.bind(function(){
			this.callEvent("onBindRequest",[]);
		}, this));
	},
	refresh:function(){ this.callEvent("onBindRequest",[]); }
}, dhx.DataLoader, dhx.EventSystem, dhx.BaseBind, dhx.Settings);




dhx.ValueBind={
	$init:function(){
		this.attachEvent("onChange", this._update_binds);
	},
	_bind_update:function(target, rule, format){
		var data = this.getValue()||"";
		if (format) data = format(data);
		
		if (target.setValue)
			target.setValue(data);
		else if (!target.filter){
			var pod = {}; pod[rule] = data;
			if (target._check_data_feed(data))
				target.setValues(pod);
		} else{
			target.data.silent(function(){
				this.filter(rule,data);
			});
		}
		target.callEvent("onBindApply", [data,rule,this]);
	}
};

dhx.RecordBind={
	$init:function(){
		this.attachEvent("onChange", this._update_binds);		
	},
	_bind_update:function(target, rule){
		var data = this.getValues()||null;
		this._bind_update_common(target, rule, data);
	}
};

dhx.CollectionBind={
	$init:function(){
		this._cursor = null;
		this.attachEvent("onSelectChange", function(data){
			var sel = this.getSelected();
			this.setCursor(sel?(sel.id||sel):null);
		});
		this.attachEvent("onAfterCursorChange", this._update_binds);		
		this.data.attachEvent("onStoreUpdated", dhx.bind(function(id, data, mode){
			if (id && id == this.getCursor() && mode != "paint")
				this._update_binds();
		},this));
		this.data.attachEvent("onClearAll", dhx.bind(function(){
			this._cursor = null;
		},this));
		this.data.attachEvent("onIdChange", dhx.bind(function(oldid, newid){
			if (this._cursor == oldid)
				this._cursor = newid;
		},this));
	},
	setCursor:function(id){
		if (id == this._cursor || (id !== null && !this.item(id))) return;
		
		this.callEvent("onBeforeCursorChange", [this._cursor]);
		this._cursor = id;
		this.callEvent("onAfterCursorChange",[id]);
	},
	getCursor:function(){
		return this._cursor;
	},
	_bind_update:function(target, rule){ 
		var data = this.item(this.getCursor())|| this._settings.defaultData || null;
		this._bind_update_common(target, rule, data);
	}
};	
/*DHX:Depend core/legacy_bind.js*/
/*DHX:Depend core/dhx.js*/
/*DHX:Depend core/bind.js*/

/*jsl:ignore*/

if (!dhx.ui)
	dhx.ui = {};

if (!dhx.ui.views){
	dhx.ui.views = {};
	dhx.ui.get = function(id){
		if (id._settings) return id;
		return dhx.ui.views[id];
	};
}

dhtmlXDataStore = function(config){
	var obj = new dhx.DataCollection(config);
	var name = "_dp_init";
	obj[name]=function(dp){
		//map methods
		var varname = "_methods";
		dp[varname]=["dummy","dummy","changeId","dummy"];
		
		this.data._old_names = {
			"add":"inserted",
			"update":"updated",
			"delete":"deleted"
		};
		this.data.attachEvent("onStoreUpdated",function(id,data,mode){
			if (id && !dp._silent)
				dp.setUpdated(id,true,this._old_names[mode]);
		});
		
		
		varname = "_getRowData";
		//serialize item's data in URL
		dp[varname]=function(id,pref){
			var ev=this.obj.data.item(id);
			var data = { id:id };
			data[this.action_param] = this.obj.getUserData(id);
			if (ev)
				for (var a in ev){
						data[a]=ev[a];
				}
			
			return data;
		};

		this.changeId = function(oldid, newid){ 
			this.data.changeId(oldid, newid);	
			dp._silent = true;
			this.data.callEvent("onStoreUpdated", [newid, this.item(newid), "update"]);
			dp._silent = false;
		};	

		varname = "_clearUpdateFlag";
		dp[varname]=function(){};
		this._userdata = {};

	};
	obj.dummy = function(){};
	obj.setUserData=function(id,name,value){
		this._userdata[id]=value;
	};
	obj.getUserData=function(id,name){
		return this._userdata[id];
	};
	obj.dataFeed=function(obj){
		this.define("dataFeed", obj);
	};
	dhx.extend(obj, dhx.BindSource);
	return obj;
};

if (window.dhtmlXDataView)
	dhtmlXDataView.prototype._initBindSource=function(){
		this.isVisible = function(){
			if (!this.data.order.length && !this.data._filter_order && !this._settings.dataFeed) return false;
			return true;
		};
		var settings = "_settings";
		this._settings = this._settings || this[settings];
		if (!this._settings.id)
			this._settings.id = dhx.uid();
		this.unbind = dhx.BaseBind.unbind;
		this.unsync = dhx.BaseBind.unsync;
		dhx.ui.views[this._settings.id] = this;
	};

if (window.dhtmlXChart)
	dhtmlXChart.prototype._initBindSource=function(){
		this.isVisible = function(){
			if (!this.data.order.length && !this.data._filtered_state && !this._settings.dataFeed) return false;
			return true;
		};
		var settings = "_settings";
		this._settings = this._settings || this[settings];
		if (!this._settings.id)
			this._settings.id = dhx.uid();
		this.unbind = dhx.BaseBind.unbind;
		this.unsync = dhx.BaseBind.unsync;
		dhx.ui.views[this._settings.id] = this;
	};
	

dhx.BaseBind.unsync = function(target){
	return dhx.BaseBind._unbind.call(this, target);
}
dhx.BaseBind.unbind = function(target){
	return dhx.BaseBind._unbind.call(this, target);
}
dhx.BaseBind.legacyBind = function(){
	return dhx.BaseBind.bind.apply(this, arguments);
};
dhx.BaseBind.legacySync = function(source, rule){
	if (this._initBindSource) this._initBindSource();
	if (source._initBindSource) source._initBindSource();

	this.attachEvent("onAfterEditStop", function(id){
		this.save(id);
		return true;
	});

		
		

	this.attachEvent("onDataRequest", function(start, count){
		for (var i=start; i<start+count; i++)
			if (!source.data.order[i]){
				source.loadNext(count, start);
				return false;
			}
	});



	this.save = function(id){
		if (!id) id = this.getCursor();
		var sobj = this.item(id);
		var tobj = source.item(id);
		for (var key in sobj)
			if (key.indexOf("$")!==0)
				tobj[key] = sobj[key];
		source.refresh(id);
	};

	if (source && source.name == "DataCollection")
		return source.data.sync.apply(this.data, arguments);
	else
		return this.data.sync.apply(this.data, arguments);
};

if (window.dhtmlXForm){
	
	dhtmlXForm.prototype.bind = function(target){
		dhx.BaseBind.bind.apply(this, arguments);
		target.getBindData(this._settings.id);
	};
	dhtmlXForm.prototype.unbind = function(target){
		dhx.BaseBind._unbind.call(this,target);
	};

	dhtmlXForm.prototype._initBindSource = function(){
		if (dhx.isUndefined(this._settings)){
			this._settings = {
				id: dhx.uid(),
				dataFeed:this._server_feed
			};
			dhx.ui.views[this._settings.id] = this;
		}
	};
	dhtmlXForm.prototype._check_data_feed = function(data){
		if (!this._settings.dataFeed || this._ignore_feed || !data) return true;
		var url = this._settings.dataFeed;
		if (typeof url == "function")
			return url.call(this, (data.id||data), data);
		url = url+(url.indexOf("?")==-1?"?":"&")+"action=get&id="+encodeURIComponent(data.id||data);
		this.load(url);
		return false;
	};
	dhtmlXForm.prototype.setValues = dhtmlXForm.prototype.setFormData;
	dhtmlXForm.prototype.getValues = function(){
		return this.getFormData(false, true);
	};

	dhtmlXForm.prototype.dataFeed = function(value){
		if (this._settings)
			this._settings.dataFeed = value;
		else
			this._server_feed = value;
	};

	dhtmlXForm.prototype.refresh = dhtmlXForm.prototype.isVisible = function(value){
		return true;
	};
}
 
if (window.scheduler){
	if (!window.Scheduler)
		window.Scheduler = {};
	Scheduler.$syncFactory=function(scheduler){
		scheduler.sync = function(source, rule){
			if (this._initBindSource) this._initBindSource();
			if (source._initBindSource) source._initBindSource();

			var process = "_process_loading";
			var insync = function(ignore){
					scheduler.clearAll();
					var order = source.data.order;
					var pull = source.data.pull;
					var evs = [];
					for (var i=0; i<order.length; i++){
						if (rule && rule.copy)
							evs[i]=dhx.clone(pull[order[i]]);
						else
							evs[i]=pull[order[i]];
					}
					scheduler[process](evs);
					scheduler.callEvent("onSyncApply",[]);
			};
			this.save = function(id){
				if (!id) id = this.getCursor();
				var data = this.item(id);
				var olddat = source.item(id);

				if (this.callEvent("onStoreSave", [id, data, olddat])){
					dhx.extend(source.item(id),data, true);
					source.update(id);
				}
			};
			this.item = function(id){
				return this.getEvent(id);
			};
			this._sync_events=[
				source.data.attachEvent("onStoreUpdated", function(id, data, mode){ 
					insync.call(this);
				}),
				source.data.attachEvent("onIdChange", function(oldid, newid){
					combo.changeOptionId(oldid, newid);
				})
			];
			this.attachEvent("onEventChanged", function(id){
				this.save(id);
			});
			this.attachEvent("onEventAdded", function(id, data){
				if (!source.data.pull[id])
				source.add(data);
			});
			this.attachEvent("onEventDeleted", function(id){
				if (source.data.pull[id])
					source.remove(id);
			});
			insync();
		};
		scheduler.unsync = function(target){
			dhx.BaseBind._unbind.call(this,target);
		}
		scheduler._initBindSource = function(){
			if (!this._settings)
				this._settings = { id:dhx.uid() };
		}
	}
	Scheduler.$syncFactory(window.scheduler);
}
if (window.dhtmlXCombo){
	dhtmlXCombo.prototype.bind = function(){
		dhx.BaseBind.bind.apply(this, arguments);
	};
	dhtmlXCombo.unbind = function(target){
		dhx.BaseBind._unbind.call(this,target);
	}
	dhtmlXCombo.unsync = function(target){
		dhx.BaseBind._unbind.call(this,target);
	}

	dhtmlXCombo.prototype.dataFeed = function(value){
		if (this._settings)
			this._settings.dataFeed = value;
		else
			this._server_feed = value;
	};

	dhtmlXCombo.prototype.sync = function(source, rule){
		if (this._initBindSource) this._initBindSource();
		if (source._initBindSource) source._initBindSource();


		var combo = this;

		var insync = function(ignore){
			combo.clearAll();
			combo.addOption(this.serialize());

			combo.callEvent("onSyncApply",[]);
		};

		//source.data.attachEvent("onStoreLoad", insync);
		this._sync_events=[
			source.data.attachEvent("onStoreUpdated", function(id, data, mode){ 
				insync.call(this);
			}),
			source.data.attachEvent("onIdChange", function(oldid, newid){
				combo.changeOptionId(oldid, newid);
			})
		];


		insync.call(source);
	};

	dhtmlXCombo.prototype._initBindSource = function() { 
		if (dhx.isUndefined(this._settings)){
			this._settings = {
				id: dhx.uid(),
				dataFeed:this._server_feed
			};
			dhx.ui.views[this._settings.id] = this;

			this.data = { silent:dhx.bind(function(code){
				code.call(this);
			},this)};

			dhx4._eventable(this.data);

			this.attachEvent("onChange", function() {
				this.callEvent("onSelectChange", [this.getSelectedValue()]);
			});
			this.attachEvent("onXLE", function(){
				this.callEvent("onBindRequest",[]);
			});
		}
	};

	dhtmlXCombo.prototype.item = function(id) {
		return this.getOption(id);
	};

	dhtmlXCombo.prototype.getSelected = function() {
		return this.getSelectedValue();
	};
	dhtmlXCombo.prototype.isVisible = function() {
		if (!this.optionsArr.length && !this._settings.dataFeed) return false;
		return true;
	};
	dhtmlXCombo.prototype.refresh = function() {
		this.render(true);
	};
}

if (window.dhtmlXGridObject){
	dhtmlXGridObject.prototype.bind = function(source, rule, format) {
		dhx.BaseBind.bind.apply(this, arguments);
	};
	dhtmlXGridObject.prototype.unbind = function(target){
		dhx.BaseBind._unbind.call(this,target);
	}
	dhtmlXGridObject.prototype.unsync = function(target){
		dhx.BaseBind._unbind.call(this,target);
	}
	
	dhtmlXGridObject.prototype.dataFeed = function(value){
		if (this._settings)
			this._settings.dataFeed = value;
		else
			this._server_feed = value;
	};

	dhtmlXGridObject.prototype.sync = function(source, rule){
		if (this._initBindSource) this._initBindSource();
		if (source._initBindSource) source._initBindSource();

		var grid = this;
		var parsing = "_parsing";
		var parser = "_parser";
		var locator = "_locator";
		var parser_func = "_process_store_row";
		var locator_func = "_get_store_data";

		this.save = function(id){
			if (!id) id = this.getCursor();
			dhx.extend(source.item(id),this.item(id), true);
			source.update(id);
		};
		var insync = function(ignore){
			var cursor = grid.getCursor?grid.getCursor():null;

			var from = 0; 
			if (grid._legacy_ignore_next){
				from  = grid._legacy_ignore_next;
				grid._legacy_ignore_next = false;
			} else {
				grid.clearAll();
			}

			var count = this.dataCount();
			if (count){
				grid[parsing]=true;
				for (var i = from; i < count; i++){
					var id = this.order[i];
					if (!id) continue;
					if (from && grid.rowsBuffer[i]) continue;
					grid.rowsBuffer[i]={
						idd: id,
						data: this.pull[id]
					};
					grid.rowsBuffer[i][parser] = grid[parser_func];
					grid.rowsBuffer[i][locator] = grid[locator_func];
					grid.rowsAr[id]=this.pull[id];
				}
				if (!grid.rowsBuffer[count-1]){
					grid.rowsBuffer[count-1] = dhtmlx.undefined;
					grid.xmlFileUrl = grid.xmlFileUrl||this.url;
				}

				if (grid.pagingOn)
					grid.changePage();
				else {
					if (grid._srnd && grid._fillers)
						grid._update_srnd_view();
					else{
						grid.render_dataset();
						grid.callEvent("onXLE",[]);
					}
				}
				grid[parsing]=false;
			}

			if (cursor && grid.setCursor)
				grid.setCursor(grid.rowsAr[cursor]?cursor:null);

			grid.callEvent("onSyncApply",[]);
		};

		//source.data.attachEvent("onStoreLoad", insync);
		this._sync_events=[
			source.data.attachEvent("onStoreUpdated", function(id, data, mode){ 
				if (mode == "delete"){
					grid.deleteRow(id);
					grid.data.callEvent("onStoreUpdated",[id, data, mode]);
				} else if (mode == "update"){
					grid.callEvent("onSyncUpdate", [data, mode]);
					grid.update(id, data);
					grid.data.callEvent("onStoreUpdated",[id, data, mode]);
				} else if (mode == "add"){
					grid.callEvent("onSyncUpdate", [data, mode]);
					grid.add(id, data, this.indexById(id));
					grid.data.callEvent("onStoreUpdated",[id,data,mode]);
				} else insync.call(this);

			}),
			source.data.attachEvent("onStoreLoad", function(driver, data){
				grid.xmlFileUrl = source.data.url;
				grid._legacy_ignore_next = driver.getInfo(data)._from;
			}),
			source.data.attachEvent("onIdChange", function(oldid, newid){
				grid.changeRowId(oldid, newid);
			})
		];
		
		grid.attachEvent("onDynXLS", function(start, count){
			for (var i=start; i<start+count; i++)
				if (!source.data.order[i]){
					source.loadNext(count, start);
					return false;
				}
			grid._legacy_ignore_next = start;
			insync.call(source.data);
		});

		insync.call(source.data);
		grid.attachEvent("onEditCell", function(stage, id, ind, value, oldvalue){
			if (stage==2 && value != oldvalue)
				this.save(id);
			return true;
		});
		grid.attachEvent("onClearAll",function(){
			var name = "_f_rowsBuffer";
	    	this[name]=null; 
	    });
	
		if (rule && rule.sort)	
			grid.attachEvent("onBeforeSorting", function(ind, type, dir){
				if (type == "connector") return false;
				var id = this.getColumnId(ind);
				source.sort("#"+id+"#", (dir=="asc"?"asc":"desc"), (type=="int"?type:"string"));
				grid.setSortImgState(true, ind, dir);
				return false;
			});

		if (rule && rule.filter){
			grid.attachEvent("onFilterStart", function(cols, values){
				var name = "_con_f_used";
				if (grid[name] && grid[name].length)
					return false;

				source.data.silent(function(){
					source.filter();
					for (var i=0; i<cols.length; i++){
						if (values[i] == "") continue;
						var id = grid.getColumnId(cols[i]);
						source.filter("#"+id+"#", values[i], i!=0);
					}
				});

				source.refresh();
				return false;
			});
			grid.collectValues = function(index){
				var id = this.getColumnId(index);
				return (function(id){
					var values = [];
					var checks = {};
					this.data.each(function(obj){
						var value = obj[id];
						if (!checks[value]){
							checks[value] = true;
							values.push(value);
						}
					});
					values.sort();
					return values;
				}).call(source, id);
			};
		}

		if (rule && rule.select)
			grid.attachEvent("onRowSelect", function(id){
				source.setCursor(id);
			});

		grid.clearAndLoad = function(url){
			source.clearAll();
			source.load(url);
		};
		

				    
	};

	dhtmlXGridObject.prototype._initBindSource = function() { 
		if (dhx.isUndefined(this._settings)){
			this._settings = {
				id: dhx.uid(),
				dataFeed:this._server_feed
			};
			dhx.ui.views[this._settings.id] = this;

			this.data = { silent:dhx.bind(function(code){
				code.call(this);
			},this)};

			dhx4._eventable(this.data);
			var name = "_cCount";
			for (var i=0; i<this[name]; i++)
				if (!this.columnIds[i])
					this.columnIds[i] = "cell"+i;

			this.attachEvent("onSelectStateChanged", function(id) {
				this.callEvent("onSelectChange", [id]);
			});
			this.attachEvent("onSelectionCleared", function() {
				this.callEvent("onSelectChange", [null]);
			});
			this.attachEvent("onEditCell", function(stage,rId) {
				if (stage === 2 && this.getCursor) {
					if (rId && rId == this.getCursor())
						this._update_binds();
				}
				return true;
			});
			this.attachEvent("onXLE", function(){
				this.callEvent("onBindRequest",[]);
			});
		}
	};

	dhtmlXGridObject.prototype.item = function(id) {
		if (id === null) return null;
		var source = this.getRowById(id);
		if (!source) return null;
		
		var name = "_attrs";
		var data = dhx.copy(source[name]);
			data.id = id;
		var length = this.getColumnsNum();
		for (var i = 0; i < length; i++) {
			data[this.columnIds[i]] = this.cells(id, i).getValue();
		}
		return data;
	};

	dhtmlXGridObject.prototype.update = function(id,data){
		for (var i=0; i<this.columnIds.length; i++){
			var key = this.columnIds[i];
			if (!dhx.isUndefined(data[key]))
				this.cells(id, i).setValue(data[key]);
		}
		var name = "_attrs";
		var attrs = this.getRowById(id)[name];
		for (var key in data)
			attrs[key] = data[key];
		this.callEvent("onBindUpdate",[id]);
	};

	dhtmlXGridObject.prototype.add = function(id,data,index){
		var ar_data = [];
		for (var i=0; i<this.columnIds.length; i++){
			var key = this.columnIds[i];
			ar_data[i] = dhx.isUndefined(data[key])?"":data[key];
		}
		this.addRow(id, ar_data, index);
		var name = "_attrs";
		this.getRowById(id)[name] = dhx.copy(data);
	};

	dhtmlXGridObject.prototype.getSelected = function() {
		return this.getSelectedRowId();
	};
	dhtmlXGridObject.prototype.isVisible = function() {
		var name = "_f_rowsBuffer";
		if (!this.rowsBuffer.length && !this[name] && !this._settings.dataFeed) return false;
		return true;
	};
	dhtmlXGridObject.prototype.refresh = function() {
		this.render_dataset();
	};

	dhtmlXGridObject.prototype.filter = function(callback, master){
		//if (!this.rowsBuffer.length && !this._f_rowsBuffer) return;
		if (this._settings.dataFeed){
			var filter = {};
			if (!callback && !master) return;
			if (typeof callback == "function"){
				if (!master) return;
				callback(master, filter);
			} else  if (dhx.isUndefined(callback))
				filter = master;
			else
				filter[callback] = master;

			this.clearAll(); 
			var url = this._settings.dataFeed;
			if (typeof url == "function")
				return url.call(this, master, filter);

			var urldata = [];
			for (var key in filter)
				urldata.push("dhx_filter["+key+"]="+encodeURIComponent(filter[key]));

			this.load(url+(url.indexOf("?")<0?"?":"&")+urldata.join("&"));
			return false;
		}

		if (master === null) {
			return this.filterBy(0, function(){ return false; });
		}

		this.filterBy(0, function(value, id){
			return callback.call(this, id, master);
		});
	};
}


if (window.dhtmlXTreeObject){
	dhtmlXTreeObject.prototype.bind = function() {
		dhx.BaseBind.bind.apply(this, arguments);
	};
	dhtmlXTreeObject.prototype.unbind = function(target){
		dhx.BaseBind._unbind.call(this,target);
	}

	

	dhtmlXTreeObject.prototype.dataFeed = function(value){
		if (this._settings)
			this._settings.dataFeed = value;
		else
			this._server_feed = value;
	};

	dhtmlXTreeObject.prototype._initBindSource = function() {
		if (dhx.isUndefined(this._settings)){
			this._settings = {
				id: dhx.uid(),
				dataFeed:this._server_feed
			};
			dhx.ui.views[this._settings.id] = this;

			this.data = { silent:dhx.bind(function(code){
				code.call(this);
			},this)};

			dhx4._eventable(this.data);

			this.attachEvent("onSelect", function(id) {
				this.callEvent("onSelectChange", [id]);
			});
			this.attachEvent("onEdit", function(stage,rId) {
				if (stage === 2) {
					if (rId && rId == this.getCursor())
						this._update_binds();
				}
				return true;
			});
		}
	};

	dhtmlXTreeObject.prototype.item = function(id) {
		if (id === null) return null;
		return { id: id, text:this.getItemText(id)};
	};

	dhtmlXTreeObject.prototype.getSelected = function() {
		return this.getSelectedItemId();
	};
	dhtmlXTreeObject.prototype.isVisible = function() {
		return true;
	};
	dhtmlXTreeObject.prototype.refresh = function() {
		//dummy placeholder
	};

	dhtmlXTreeObject.prototype.filter = function(callback, master){
		//dummy placeholder, because tree doesn't support filtering
		if (this._settings.dataFeed){
			var filter = {};
			if (!callback && !master) return;
			if (typeof callback == "function"){
				if (!master) return;
				callback(master, filter);
			} else  if (dhx.isUndefined(callback))
				filter = master;
			else
				filter[callback] = master;

			this.deleteChildItems(0); 
			var url = this._settings.dataFeed;
			if (typeof url == "function")
				return url.call(this, [(data.id||data), data]);
			var urldata = [];
			for (var key in filter)
				urldata.push("dhx_filter["+key+"]="+encodeURIComponent(filter[key]));

			this.loadXML(url+(url.indexOf("?")<0?"?":"&")+urldata.join("&"));
			return false;
		}
	};

	dhtmlXTreeObject.prototype.update = function(id,data){
		if (!dhx.isUndefined(data.text))
			this.setItemText(id, data.text);
	};
}

/*jsl:end*/


