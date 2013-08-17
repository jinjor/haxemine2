(function () { "use strict";
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var Hash = function() {
	this.h = { };
};
$hxClasses["Hash"] = Hash;
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = function() { }
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntHash = function() {
	this.h = { };
};
$hxClasses["IntHash"] = IntHash;
IntHash.__name__ = ["IntHash"];
IntHash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,h: null
	,__class__: IntHash
}
var IntIter = function(min,max) {
	this.min = min;
	this.max = max;
};
$hxClasses["IntIter"] = IntIter;
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var Lambda = function() { }
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
}
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
Lambda.mapi = function(it,f) {
	var l = new List();
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(i++,x));
	}
	return l;
}
Lambda.has = function(it,elt,cmp) {
	if(cmp == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			if(x == elt) return true;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(cmp(x,elt)) return true;
		}
	}
	return false;
}
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
}
Lambda.foreach = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(!f(x)) return false;
	}
	return true;
}
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
}
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
}
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
}
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
}
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
}
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
Lambda.concat = function(a,b) {
	var l = new List();
	var $it0 = $iterator(a)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(x);
	}
	var $it1 = $iterator(b)();
	while( $it1.hasNext() ) {
		var x = $it1.next();
		l.add(x);
	}
	return l;
}
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = function() { }
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = function() { }
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = function() { }
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { }
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var haxe = {}
haxe.Json = function() {
};
$hxClasses["haxe.Json"] = haxe.Json;
haxe.Json.__name__ = ["haxe","Json"];
haxe.Json.parse = function(text) {
	return new haxe.Json().doParse(text);
}
haxe.Json.stringify = function(value) {
	return new haxe.Json().toString(value);
}
haxe.Json.prototype = {
	parseString: function() {
		var start = this.pos;
		var buf = new StringBuf();
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			if(c == 34) break;
			if(c == 92) {
				buf.b += HxOverrides.substr(this.str,start,this.pos - start - 1);
				c = this.str.charCodeAt(this.pos++);
				switch(c) {
				case 114:
					buf.b += String.fromCharCode(13);
					break;
				case 110:
					buf.b += String.fromCharCode(10);
					break;
				case 116:
					buf.b += String.fromCharCode(9);
					break;
				case 98:
					buf.b += String.fromCharCode(8);
					break;
				case 102:
					buf.b += String.fromCharCode(12);
					break;
				case 47:case 92:case 34:
					buf.b += String.fromCharCode(c);
					break;
				case 117:
					var uc = Std.parseInt("0x" + HxOverrides.substr(this.str,this.pos,4));
					this.pos += 4;
					buf.b += String.fromCharCode(uc);
					break;
				default:
					throw "Invalid escape sequence \\" + String.fromCharCode(c) + " at position " + (this.pos - 1);
				}
				start = this.pos;
			} else if(c != c) throw "Unclosed string";
		}
		buf.b += HxOverrides.substr(this.str,start,this.pos - start - 1);
		return buf.b;
	}
	,parseRec: function() {
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			switch(c) {
			case 32:case 13:case 10:case 9:
				break;
			case 123:
				var obj = { }, field = null, comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 125:
						if(field != null || comma == false) this.invalidChar();
						return obj;
					case 58:
						if(field == null) this.invalidChar();
						obj[field] = this.parseRec();
						field = null;
						comma = true;
						break;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					case 34:
						if(comma) this.invalidChar();
						field = this.parseString();
						break;
					default:
						this.invalidChar();
					}
				}
				break;
			case 91:
				var arr = [], comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 93:
						if(comma == false) this.invalidChar();
						return arr;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					default:
						if(comma) this.invalidChar();
						this.pos--;
						arr.push(this.parseRec());
						comma = true;
					}
				}
				break;
			case 116:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 114 || this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return true;
			case 102:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 97 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 115 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return false;
			case 110:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 108) {
					this.pos = save;
					this.invalidChar();
				}
				return null;
			case 34:
				return this.parseString();
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:case 45:
				this.pos--;
				if(!this.reg_float.match(HxOverrides.substr(this.str,this.pos,null))) throw "Invalid float at position " + this.pos;
				var v = this.reg_float.matched(0);
				this.pos += v.length;
				var f = Std.parseFloat(v);
				var i = f | 0;
				return i == f?i:f;
			default:
				this.invalidChar();
			}
		}
	}
	,nextChar: function() {
		return this.str.charCodeAt(this.pos++);
	}
	,invalidChar: function() {
		this.pos--;
		throw "Invalid char " + this.str.charCodeAt(this.pos) + " at position " + this.pos;
	}
	,doParse: function(str) {
		this.reg_float = new EReg("^-?(0|[1-9][0-9]*)(\\.[0-9]+)?([eE][+-]?[0-9]+)?","");
		this.str = str;
		this.pos = 0;
		return this.parseRec();
	}
	,quote: function(s) {
		this.buf.b += Std.string("\"");
		var i = 0;
		while(true) {
			var c = s.charCodeAt(i++);
			if(c != c) break;
			switch(c) {
			case 34:
				this.buf.b += Std.string("\\\"");
				break;
			case 92:
				this.buf.b += Std.string("\\\\");
				break;
			case 10:
				this.buf.b += Std.string("\\n");
				break;
			case 13:
				this.buf.b += Std.string("\\r");
				break;
			case 9:
				this.buf.b += Std.string("\\t");
				break;
			case 8:
				this.buf.b += Std.string("\\b");
				break;
			case 12:
				this.buf.b += Std.string("\\f");
				break;
			default:
				this.buf.b += String.fromCharCode(c);
			}
		}
		this.buf.b += Std.string("\"");
	}
	,toStringRec: function(v) {
		var $e = (Type["typeof"](v));
		switch( $e[1] ) {
		case 8:
			this.buf.b += Std.string("\"???\"");
			break;
		case 4:
			this.objString(v);
			break;
		case 1:
		case 2:
			this.buf.b += Std.string(v);
			break;
		case 5:
			this.buf.b += Std.string("\"<fun>\"");
			break;
		case 6:
			var c = $e[2];
			if(c == String) this.quote(v); else if(c == Array) {
				var v1 = v;
				this.buf.b += Std.string("[");
				var len = v1.length;
				if(len > 0) {
					this.toStringRec(v1[0]);
					var i = 1;
					while(i < len) {
						this.buf.b += Std.string(",");
						this.toStringRec(v1[i++]);
					}
				}
				this.buf.b += Std.string("]");
			} else if(c == Hash) {
				var v1 = v;
				var o = { };
				var $it0 = v1.keys();
				while( $it0.hasNext() ) {
					var k = $it0.next();
					o[k] = v1.get(k);
				}
				this.objString(o);
			} else this.objString(v);
			break;
		case 7:
			var e = $e[2];
			this.buf.b += Std.string(v[1]);
			break;
		case 3:
			this.buf.b += Std.string(v?"true":"false");
			break;
		case 0:
			this.buf.b += Std.string("null");
			break;
		}
	}
	,objString: function(v) {
		this.fieldsString(v,Reflect.fields(v));
	}
	,fieldsString: function(v,fields) {
		var first = true;
		this.buf.b += Std.string("{");
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			var value = Reflect.field(v,f);
			if(Reflect.isFunction(value)) continue;
			if(first) first = false; else this.buf.b += Std.string(",");
			this.quote(f);
			this.buf.b += Std.string(":");
			this.toStringRec(value);
		}
		this.buf.b += Std.string("}");
	}
	,toString: function(v) {
		this.buf = new StringBuf();
		this.toStringRec(v);
		return this.buf.b;
	}
	,reg_float: null
	,pos: null
	,str: null
	,buf: null
	,__class__: haxe.Json
}
haxe.Serializer = function() {
	this.buf = new StringBuf();
	this.cache = new Array();
	this.useCache = haxe.Serializer.USE_CACHE;
	this.useEnumIndex = haxe.Serializer.USE_ENUM_INDEX;
	this.shash = new Hash();
	this.scount = 0;
};
$hxClasses["haxe.Serializer"] = haxe.Serializer;
haxe.Serializer.__name__ = ["haxe","Serializer"];
haxe.Serializer.run = function(v) {
	var s = new haxe.Serializer();
	s.serialize(v);
	return s.toString();
}
haxe.Serializer.prototype = {
	serializeException: function(e) {
		this.buf.b += Std.string("x");
		this.serialize(e);
	}
	,serialize: function(v) {
		var $e = (Type["typeof"](v));
		switch( $e[1] ) {
		case 0:
			this.buf.b += Std.string("n");
			break;
		case 1:
			if(v == 0) {
				this.buf.b += Std.string("z");
				return;
			}
			this.buf.b += Std.string("i");
			this.buf.b += Std.string(v);
			break;
		case 2:
			if(Math.isNaN(v)) this.buf.b += Std.string("k"); else if(!Math.isFinite(v)) this.buf.b += Std.string(v < 0?"m":"p"); else {
				this.buf.b += Std.string("d");
				this.buf.b += Std.string(v);
			}
			break;
		case 3:
			this.buf.b += Std.string(v?"t":"f");
			break;
		case 6:
			var c = $e[2];
			if(c == String) {
				this.serializeString(v);
				return;
			}
			if(this.useCache && this.serializeRef(v)) return;
			switch(c) {
			case Array:
				var ucount = 0;
				this.buf.b += Std.string("a");
				var l = v.length;
				var _g = 0;
				while(_g < l) {
					var i = _g++;
					if(v[i] == null) ucount++; else {
						if(ucount > 0) {
							if(ucount == 1) this.buf.b += Std.string("n"); else {
								this.buf.b += Std.string("u");
								this.buf.b += Std.string(ucount);
							}
							ucount = 0;
						}
						this.serialize(v[i]);
					}
				}
				if(ucount > 0) {
					if(ucount == 1) this.buf.b += Std.string("n"); else {
						this.buf.b += Std.string("u");
						this.buf.b += Std.string(ucount);
					}
				}
				this.buf.b += Std.string("h");
				break;
			case List:
				this.buf.b += Std.string("l");
				var v1 = v;
				var $it0 = v1.iterator();
				while( $it0.hasNext() ) {
					var i = $it0.next();
					this.serialize(i);
				}
				this.buf.b += Std.string("h");
				break;
			case Date:
				var d = v;
				this.buf.b += Std.string("v");
				this.buf.b += Std.string(HxOverrides.dateStr(d));
				break;
			case Hash:
				this.buf.b += Std.string("b");
				var v1 = v;
				var $it1 = v1.keys();
				while( $it1.hasNext() ) {
					var k = $it1.next();
					this.serializeString(k);
					this.serialize(v1.get(k));
				}
				this.buf.b += Std.string("h");
				break;
			case IntHash:
				this.buf.b += Std.string("q");
				var v1 = v;
				var $it2 = v1.keys();
				while( $it2.hasNext() ) {
					var k = $it2.next();
					this.buf.b += Std.string(":");
					this.buf.b += Std.string(k);
					this.serialize(v1.get(k));
				}
				this.buf.b += Std.string("h");
				break;
			case haxe.io.Bytes:
				var v1 = v;
				var i = 0;
				var max = v1.length - 2;
				var charsBuf = new StringBuf();
				var b64 = haxe.Serializer.BASE64;
				while(i < max) {
					var b1 = v1.b[i++];
					var b2 = v1.b[i++];
					var b3 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt((b1 << 4 | b2 >> 4) & 63));
					charsBuf.b += Std.string(b64.charAt((b2 << 2 | b3 >> 6) & 63));
					charsBuf.b += Std.string(b64.charAt(b3 & 63));
				}
				if(i == max) {
					var b1 = v1.b[i++];
					var b2 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt((b1 << 4 | b2 >> 4) & 63));
					charsBuf.b += Std.string(b64.charAt(b2 << 2 & 63));
				} else if(i == max + 1) {
					var b1 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt(b1 << 4 & 63));
				}
				var chars = charsBuf.b;
				this.buf.b += Std.string("s");
				this.buf.b += Std.string(chars.length);
				this.buf.b += Std.string(":");
				this.buf.b += Std.string(chars);
				break;
			default:
				this.cache.pop();
				if(v.hxSerialize != null) {
					this.buf.b += Std.string("C");
					this.serializeString(Type.getClassName(c));
					this.cache.push(v);
					v.hxSerialize(this);
					this.buf.b += Std.string("g");
				} else {
					this.buf.b += Std.string("c");
					this.serializeString(Type.getClassName(c));
					this.cache.push(v);
					this.serializeFields(v);
				}
			}
			break;
		case 4:
			if(this.useCache && this.serializeRef(v)) return;
			this.buf.b += Std.string("o");
			this.serializeFields(v);
			break;
		case 7:
			var e = $e[2];
			if(this.useCache && this.serializeRef(v)) return;
			this.cache.pop();
			this.buf.b += Std.string(this.useEnumIndex?"j":"w");
			this.serializeString(Type.getEnumName(e));
			if(this.useEnumIndex) {
				this.buf.b += Std.string(":");
				this.buf.b += Std.string(v[1]);
			} else this.serializeString(v[0]);
			this.buf.b += Std.string(":");
			var l = v.length;
			this.buf.b += Std.string(l - 2);
			var _g = 2;
			while(_g < l) {
				var i = _g++;
				this.serialize(v[i]);
			}
			this.cache.push(v);
			break;
		case 5:
			throw "Cannot serialize function";
			break;
		default:
			throw "Cannot serialize " + Std.string(v);
		}
	}
	,serializeFields: function(v) {
		var _g = 0, _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.b += Std.string("g");
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0, _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += Std.string("r");
				this.buf.b += Std.string(i);
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeString: function(s) {
		var x = this.shash.get(s);
		if(x != null) {
			this.buf.b += Std.string("R");
			this.buf.b += Std.string(x);
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.b += Std.string("y");
		s = StringTools.urlEncode(s);
		this.buf.b += Std.string(s.length);
		this.buf.b += Std.string(":");
		this.buf.b += Std.string(s);
	}
	,toString: function() {
		return this.buf.b;
	}
	,useEnumIndex: null
	,useCache: null
	,scount: null
	,shash: null
	,cache: null
	,buf: null
	,__class__: haxe.Serializer
}
haxe.Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = new Array();
	this.cache = new Array();
	var r = haxe.Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe.Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe.Unserializer;
haxe.Unserializer.__name__ = ["haxe","Unserializer"];
haxe.Unserializer.initCodes = function() {
	var codes = new Array();
	var _g1 = 0, _g = haxe.Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe.Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
}
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
}
haxe.Unserializer.prototype = {
	unserialize: function() {
		switch(this.buf.charCodeAt(this.pos++)) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			var p1 = this.pos;
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
			}
			return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
		case 121:
			var len = this.readDigits();
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = StringTools.urlDecode(s);
			this.scache.push(s);
			return s;
		case 107:
			return Math.NaN;
		case 109:
			return Math.NEGATIVE_INFINITY;
		case 112:
			return Math.POSITIVE_INFINITY;
		case 97:
			var buf = this.buf;
			var a = new Array();
			this.cache.push(a);
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c == 104) {
					this.pos++;
					break;
				}
				if(c == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n = this.readDigits();
			if(n < 0 || n >= this.cache.length) throw "Invalid reference";
			return this.cache[n];
		case 82:
			var n = this.readDigits();
			if(n < 0 || n >= this.scache.length) throw "Invalid string reference";
			return this.scache[n];
		case 120:
			throw this.unserialize();
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 119:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl)[index];
			if(tag == null) throw "Unknown enum index " + name + "@" + index;
			var e = this.unserializeEnum(edecl,tag);
			this.cache.push(e);
			return e;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new Hash();
			this.cache.push(h);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s = this.unserialize();
				h.set(s,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h = new IntHash();
			this.cache.push(h);
			var buf = this.buf;
			var c = this.buf.charCodeAt(this.pos++);
			while(c == 58) {
				var i = this.readDigits();
				h.set(i,this.unserialize());
				c = this.buf.charCodeAt(this.pos++);
			}
			if(c != 104) throw "Invalid IntHash format";
			return h;
		case 118:
			var d = HxOverrides.strDate(HxOverrides.substr(this.buf,this.pos,19));
			this.cache.push(d);
			this.pos += 19;
			return d;
		case 115:
			var len = this.readDigits();
			var buf = this.buf;
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid bytes length";
			var codes = haxe.Unserializer.CODES;
			if(codes == null) {
				codes = haxe.Unserializer.initCodes();
				haxe.Unserializer.CODES = codes;
			}
			var i = this.pos;
			var rest = len & 3;
			var size = (len >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i + (len - rest);
			var bytes = haxe.io.Bytes.alloc(size);
			var bpos = 0;
			while(i < max) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				var c3 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				var c4 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c3 << 6 | c4) & 255;
			}
			if(rest >= 2) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				if(rest == 3) {
					var c3 = codes[buf.charCodeAt(i++)];
					bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				}
			}
			this.pos += len;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			o.hxUnserialize(this);
			if(this.buf.charCodeAt(this.pos++) != 103) throw "Invalid custom data";
			return o;
		default:
		}
		this.pos--;
		throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.buf.charCodeAt(this.pos++) != 58) throw "Invalid enum format";
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = new Array();
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw "Invalid object";
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!js.Boot.__instanceof(k,String)) throw "Invalid object key";
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,getResolver: function() {
		return this.resolver;
	}
	,setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_) {
			return null;
		}}; else this.resolver = r;
	}
	,resolver: null
	,scache: null
	,cache: null
	,length: null
	,pos: null
	,buf: null
	,__class__: haxe.Unserializer
}
haxe.io = {}
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var _g1 = 0, _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.charCodeAt(i);
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
}
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
}
haxe.io.Bytes.prototype = {
	getData: function() {
		return this.b;
	}
	,toHex: function() {
		var s = new StringBuf();
		var chars = [];
		var str = "0123456789abcdef";
		var _g1 = 0, _g = str.length;
		while(_g1 < _g) {
			var i = _g1++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g1 = 0, _g = this.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.b[i];
			s.b += String.fromCharCode(chars[c >> 4]);
			s.b += String.fromCharCode(chars[c & 15]);
		}
		return s.b;
	}
	,toString: function() {
		return this.readString(0,this.length);
	}
	,readString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c2 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,compare: function(other) {
		var b1 = this.b;
		var b2 = other.b;
		var len = this.length < other.length?this.length:other.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) return b1[i] - b2[i];
		}
		return this.length - other.length;
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		if(b1 == b2 && pos > srcpos) {
			var i = len;
			while(i > 0) {
				i--;
				b1[i + pos] = b2[i + srcpos];
			}
			return;
		}
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b1[i + pos] = b2[i + srcpos];
		}
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,get: function(pos) {
		return this.b[pos];
	}
	,b: null
	,length: null
	,__class__: haxe.io.Bytes
}
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
var js = {}
js.Boot = function() { }
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = function() { }
$hxClasses["js.Lib"] = js.Lib;
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib["eval"] = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
js.NodeC = function() { }
$hxClasses["js.NodeC"] = js.NodeC;
js.NodeC.__name__ = ["js","NodeC"];
js.Node = function() { }
$hxClasses["js.Node"] = js.Node;
js.Node.__name__ = ["js","Node"];
js.Node.require = null;
js.Node.querystring = null;
js.Node.util = null;
js.Node.fs = null;
js.Node.dgram = null;
js.Node.net = null;
js.Node.os = null;
js.Node.http = null;
js.Node.https = null;
js.Node.path = null;
js.Node.url = null;
js.Node.dns = null;
js.Node.vm = null;
js.Node.process = null;
js.Node.tty = null;
js.Node.assert = null;
js.Node.crypto = null;
js.Node.tls = null;
js.Node.repl = null;
js.Node.childProcess = null;
js.Node.console = null;
js.Node.cluster = null;
js.Node.setTimeout = null;
js.Node.clearTimeout = null;
js.Node.setInterval = null;
js.Node.clearInterval = null;
js.Node.global = null;
js.Node.__filename = null;
js.Node.__dirname = null;
js.Node.module = null;
js.Node.stringify = null;
js.Node.parse = null;
js.Node.queryString = null;
js.Node.newSocket = function(options) {
	return new js.Node.net.Socket(options);
}
var org = {}
org.jinjor = {}
org.jinjor.haxemine = {}
org.jinjor.haxemine.messages = {}
org.jinjor.haxemine.messages.SocketMessage = function(socket,key) {
	var _g = this;
	this.funcs = new Hash();
	this.pub = function(data) {
		socket.emit(key,haxe.Serializer.run(data));
	};
	this.sub = function(subKey,f) {
		if(!_g.funcs.exists(subKey)) {
			_g.funcs.set(subKey,f);
			socket.on(key,function(data) {
				f(haxe.Unserializer.run(data));
			});
		}
	};
};
$hxClasses["org.jinjor.haxemine.messages.SocketMessage"] = org.jinjor.haxemine.messages.SocketMessage;
org.jinjor.haxemine.messages.SocketMessage.__name__ = ["org","jinjor","haxemine","messages","SocketMessage"];
org.jinjor.haxemine.messages.SocketMessage.prototype = {
	funcs: null
	,sub: null
	,pub: null
	,__class__: org.jinjor.haxemine.messages.SocketMessage
}
org.jinjor.haxemine.messages.AllHaxeFilesM = function(socket) {
	org.jinjor.haxemine.messages.SocketMessage.call(this,socket,"search");
};
$hxClasses["org.jinjor.haxemine.messages.AllHaxeFilesM"] = org.jinjor.haxemine.messages.AllHaxeFilesM;
org.jinjor.haxemine.messages.AllHaxeFilesM.__name__ = ["org","jinjor","haxemine","messages","AllHaxeFilesM"];
org.jinjor.haxemine.messages.AllHaxeFilesM.__super__ = org.jinjor.haxemine.messages.SocketMessage;
org.jinjor.haxemine.messages.AllHaxeFilesM.prototype = $extend(org.jinjor.haxemine.messages.SocketMessage.prototype,{
	__class__: org.jinjor.haxemine.messages.AllHaxeFilesM
});
org.jinjor.haxemine.messages.CompileError = function(originalMessage,mode) {
	this.originalMessage = originalMessage;
	var parsed = (function($this) {
		var $r;
		switch( (mode)[1] ) {
		case 0:
			$r = org.jinjor.haxemine.messages.CompileError.parseTypeScriptCompileErrorMessage(originalMessage);
			break;
		case 1:
			$r = org.jinjor.haxemine.messages.CompileError.parseHaxeCompileErrorMessage(originalMessage);
			break;
		}
		return $r;
	}(this));
	this.path = parsed.path;
	this.row = parsed.row;
	this.message = parsed.message;
};
$hxClasses["org.jinjor.haxemine.messages.CompileError"] = org.jinjor.haxemine.messages.CompileError;
org.jinjor.haxemine.messages.CompileError.__name__ = ["org","jinjor","haxemine","messages","CompileError"];
org.jinjor.haxemine.messages.CompileError.parseHaxeCompileErrorMessage = function(message) {
	var elms = message.split(":");
	console.log(elms);
	return { path : elms[0], row : Std.parseInt(elms[1]), message : elms[elms.length - 1]};
}
org.jinjor.haxemine.messages.CompileError.parseTypeScriptCompileErrorMessage = function(message) {
	var elms = message.split(":");
	var r = new EReg(".*\\(([0-9]+),([0-9]+)\\):.*","");
	console.log(r.match(message));
	return { path : elms[0], row : Std.parseInt(r.matched(1)), column : Std.parseInt(r.matched(2)), message : elms[elms.length - 1]};
}
org.jinjor.haxemine.messages.CompileError.prototype = {
	message: null
	,row: null
	,path: null
	,originalMessage: null
	,__class__: org.jinjor.haxemine.messages.CompileError
}
org.jinjor.haxemine.messages.DoTaskM = function(socket) {
	org.jinjor.haxemine.messages.SocketMessage.call(this,socket,"doTask");
};
$hxClasses["org.jinjor.haxemine.messages.DoTaskM"] = org.jinjor.haxemine.messages.DoTaskM;
org.jinjor.haxemine.messages.DoTaskM.__name__ = ["org","jinjor","haxemine","messages","DoTaskM"];
org.jinjor.haxemine.messages.DoTaskM.__super__ = org.jinjor.haxemine.messages.SocketMessage;
org.jinjor.haxemine.messages.DoTaskM.prototype = $extend(org.jinjor.haxemine.messages.SocketMessage.prototype,{
	__class__: org.jinjor.haxemine.messages.DoTaskM
});
org.jinjor.haxemine.messages.DoTasksM = function(socket) {
	org.jinjor.haxemine.messages.SocketMessage.call(this,socket,"doTasks");
};
$hxClasses["org.jinjor.haxemine.messages.DoTasksM"] = org.jinjor.haxemine.messages.DoTasksM;
org.jinjor.haxemine.messages.DoTasksM.__name__ = ["org","jinjor","haxemine","messages","DoTasksM"];
org.jinjor.haxemine.messages.DoTasksM.__super__ = org.jinjor.haxemine.messages.SocketMessage;
org.jinjor.haxemine.messages.DoTasksM.prototype = $extend(org.jinjor.haxemine.messages.SocketMessage.prototype,{
	__class__: org.jinjor.haxemine.messages.DoTasksM
});
org.jinjor.haxemine.messages.FileDetail = function(text,mode) {
	this.text = text;
	this.mode = mode;
};
$hxClasses["org.jinjor.haxemine.messages.FileDetail"] = org.jinjor.haxemine.messages.FileDetail;
org.jinjor.haxemine.messages.FileDetail.__name__ = ["org","jinjor","haxemine","messages","FileDetail"];
org.jinjor.haxemine.messages.FileDetail.prototype = {
	mode: null
	,text: null
	,__class__: org.jinjor.haxemine.messages.FileDetail
}
org.jinjor.haxemine.messages.InitialInfoDto = function(mode,projectRoot,allFiles,taskInfos,searchEnabled) {
	this.projectRoot = projectRoot;
	this.allFiles = allFiles;
	this.taskInfos = taskInfos;
	this.searchEnabled = searchEnabled;
};
$hxClasses["org.jinjor.haxemine.messages.InitialInfoDto"] = org.jinjor.haxemine.messages.InitialInfoDto;
org.jinjor.haxemine.messages.InitialInfoDto.__name__ = ["org","jinjor","haxemine","messages","InitialInfoDto"];
org.jinjor.haxemine.messages.InitialInfoDto.prototype = {
	searchEnabled: null
	,taskInfos: null
	,allFiles: null
	,projectRoot: null
	,mode: null
	,__class__: org.jinjor.haxemine.messages.InitialInfoDto
}
org.jinjor.haxemine.messages.InitialInfoM = function(socket) {
	org.jinjor.haxemine.messages.SocketMessage.call(this,socket,"initialInfo");
};
$hxClasses["org.jinjor.haxemine.messages.InitialInfoM"] = org.jinjor.haxemine.messages.InitialInfoM;
org.jinjor.haxemine.messages.InitialInfoM.__name__ = ["org","jinjor","haxemine","messages","InitialInfoM"];
org.jinjor.haxemine.messages.InitialInfoM.__super__ = org.jinjor.haxemine.messages.SocketMessage;
org.jinjor.haxemine.messages.InitialInfoM.prototype = $extend(org.jinjor.haxemine.messages.SocketMessage.prototype,{
	__class__: org.jinjor.haxemine.messages.InitialInfoM
});
org.jinjor.haxemine.messages.SaveFileDto = function(fileName,text) {
	this.fileName = fileName;
	this.text = text;
};
$hxClasses["org.jinjor.haxemine.messages.SaveFileDto"] = org.jinjor.haxemine.messages.SaveFileDto;
org.jinjor.haxemine.messages.SaveFileDto.__name__ = ["org","jinjor","haxemine","messages","SaveFileDto"];
org.jinjor.haxemine.messages.SaveFileDto.prototype = {
	text: null
	,fileName: null
	,__class__: org.jinjor.haxemine.messages.SaveFileDto
}
org.jinjor.haxemine.messages.SaveM = function(socket) {
	org.jinjor.haxemine.messages.SocketMessage.call(this,socket,"save");
};
$hxClasses["org.jinjor.haxemine.messages.SaveM"] = org.jinjor.haxemine.messages.SaveM;
org.jinjor.haxemine.messages.SaveM.__name__ = ["org","jinjor","haxemine","messages","SaveM"];
org.jinjor.haxemine.messages.SaveM.__super__ = org.jinjor.haxemine.messages.SocketMessage;
org.jinjor.haxemine.messages.SaveM.prototype = $extend(org.jinjor.haxemine.messages.SocketMessage.prototype,{
	__class__: org.jinjor.haxemine.messages.SaveM
});
org.jinjor.haxemine.messages.SearchM = function(socket) {
	org.jinjor.haxemine.messages.SocketMessage.call(this,socket,"search");
};
$hxClasses["org.jinjor.haxemine.messages.SearchM"] = org.jinjor.haxemine.messages.SearchM;
org.jinjor.haxemine.messages.SearchM.__name__ = ["org","jinjor","haxemine","messages","SearchM"];
org.jinjor.haxemine.messages.SearchM.__super__ = org.jinjor.haxemine.messages.SocketMessage;
org.jinjor.haxemine.messages.SearchM.prototype = $extend(org.jinjor.haxemine.messages.SocketMessage.prototype,{
	__class__: org.jinjor.haxemine.messages.SearchM
});
org.jinjor.haxemine.messages.SearchResult = function(fileName,row,message) {
	this.fileName = fileName;
	this.row = row;
	this.message = message;
};
$hxClasses["org.jinjor.haxemine.messages.SearchResult"] = org.jinjor.haxemine.messages.SearchResult;
org.jinjor.haxemine.messages.SearchResult.__name__ = ["org","jinjor","haxemine","messages","SearchResult"];
org.jinjor.haxemine.messages.SearchResult.prototype = {
	message: null
	,row: null
	,fileName: null
	,__class__: org.jinjor.haxemine.messages.SearchResult
}
org.jinjor.haxemine.messages.SearchResultM = function(socket) {
	org.jinjor.haxemine.messages.SocketMessage.call(this,socket,"search-result");
};
$hxClasses["org.jinjor.haxemine.messages.SearchResultM"] = org.jinjor.haxemine.messages.SearchResultM;
org.jinjor.haxemine.messages.SearchResultM.__name__ = ["org","jinjor","haxemine","messages","SearchResultM"];
org.jinjor.haxemine.messages.SearchResultM.__super__ = org.jinjor.haxemine.messages.SocketMessage;
org.jinjor.haxemine.messages.SearchResultM.prototype = $extend(org.jinjor.haxemine.messages.SocketMessage.prototype,{
	__class__: org.jinjor.haxemine.messages.SearchResultM
});
org.jinjor.haxemine.messages.SourceFile = function(pathFromProjectRoot) {
	this.pathFromProjectRoot = pathFromProjectRoot;
	var splitted = pathFromProjectRoot.split("/");
	this.shortName = splitted[splitted.length - 1];
};
$hxClasses["org.jinjor.haxemine.messages.SourceFile"] = org.jinjor.haxemine.messages.SourceFile;
org.jinjor.haxemine.messages.SourceFile.__name__ = ["org","jinjor","haxemine","messages","SourceFile"];
org.jinjor.haxemine.messages.SourceFile.equals = function(o1,o2) {
	if(o1 == null || o2 == null) return false;
	return o1.pathFromProjectRoot == o2.pathFromProjectRoot;
}
org.jinjor.haxemine.messages.SourceFile.prototype = {
	shortName: null
	,pathFromProjectRoot: null
	,__class__: org.jinjor.haxemine.messages.SourceFile
}
org.jinjor.haxemine.messages.TaskInfo = function(taskName,content,auto) {
	this.taskName = taskName;
	this.content = content;
	this.auto = auto;
};
$hxClasses["org.jinjor.haxemine.messages.TaskInfo"] = org.jinjor.haxemine.messages.TaskInfo;
org.jinjor.haxemine.messages.TaskInfo.__name__ = ["org","jinjor","haxemine","messages","TaskInfo"];
org.jinjor.haxemine.messages.TaskInfo.prototype = {
	auto: null
	,content: null
	,taskName: null
	,__class__: org.jinjor.haxemine.messages.TaskInfo
}
org.jinjor.haxemine.messages.TaskProgress = function(taskName,compileErrors) {
	this.taskName = taskName;
	this.compileErrors = compileErrors;
};
$hxClasses["org.jinjor.haxemine.messages.TaskProgress"] = org.jinjor.haxemine.messages.TaskProgress;
org.jinjor.haxemine.messages.TaskProgress.__name__ = ["org","jinjor","haxemine","messages","TaskProgress"];
org.jinjor.haxemine.messages.TaskProgress.prototype = {
	compileErrors: null
	,taskName: null
	,__class__: org.jinjor.haxemine.messages.TaskProgress
}
org.jinjor.haxemine.messages.TaskProgressM = function(socket) {
	org.jinjor.haxemine.messages.SocketMessage.call(this,socket,"taskProgress");
};
$hxClasses["org.jinjor.haxemine.messages.TaskProgressM"] = org.jinjor.haxemine.messages.TaskProgressM;
org.jinjor.haxemine.messages.TaskProgressM.__name__ = ["org","jinjor","haxemine","messages","TaskProgressM"];
org.jinjor.haxemine.messages.TaskProgressM.__super__ = org.jinjor.haxemine.messages.SocketMessage;
org.jinjor.haxemine.messages.TaskProgressM.prototype = $extend(org.jinjor.haxemine.messages.SocketMessage.prototype,{
	__class__: org.jinjor.haxemine.messages.TaskProgressM
});
org.jinjor.haxemine.server = {}
org.jinjor.haxemine.server.Console = function() { }
$hxClasses["org.jinjor.haxemine.server.Console"] = org.jinjor.haxemine.server.Console;
org.jinjor.haxemine.server.Console.__name__ = ["org","jinjor","haxemine","server","Console"];
org.jinjor.haxemine.server.Console.print = function(s,author) {
	console.log((author || "haxemine") + " > " + s);
}
org.jinjor.haxemine.server.FileUtil = function() {
};
$hxClasses["org.jinjor.haxemine.server.FileUtil"] = org.jinjor.haxemine.server.FileUtil;
org.jinjor.haxemine.server.FileUtil.__name__ = ["org","jinjor","haxemine","server","FileUtil"];
org.jinjor.haxemine.server.FileUtil.getAllMatchedFiles = function(root,filter,_callback) {
	org.jinjor.haxemine.server.FileUtil.walk(root,function(err,results) {
		if(err != null) _callback(err,null); else {
			var all = [];
			org.jinjor.haxemine.server.FileUtil.async.map(results,function(item,cb) {
				if(filter(item)) cb(null,item.split(root + "/")[1]); else cb(null,null);
			},function(err1,items) {
				items.forEach(function(item) {
					if(item != null) all.push(item);
				});
			});
			_callback(null,all);
		}
	});
}
org.jinjor.haxemine.server.FileUtil.walk = function(dir,done) {
	var results = [];
	org.jinjor.haxemine.server.FileUtil.fs.readdir(dir,function(err,list) {
		if(err != null) return done(err,null);
		var pending = list.length;
		if(pending == 0) return done(null,results);
		list.forEach(function(file) {
			file = dir + "/" + file;
			org.jinjor.haxemine.server.FileUtil.fs.stat(file,function(err1,stat) {
				if(stat != null && stat.isDirectory()) org.jinjor.haxemine.server.FileUtil.walk(file,function(err2,res) {
					results = results.concat(res);
					if(--pending == 0) done(null,results);
				}); else {
					results.push(file);
					if(--pending == 0) done(null,results);
				}
			});
			return true;
		});
		return;
	});
}
org.jinjor.haxemine.server.FileUtil.prototype = {
	__class__: org.jinjor.haxemine.server.FileUtil
}
org.jinjor.haxemine.server.HaxemineConfig = function(port,mode,hxml,commands) {
	this.port = port;
	this.mode = mode;
	this.hxml = hxml;
	this.commands = commands;
};
$hxClasses["org.jinjor.haxemine.server.HaxemineConfig"] = org.jinjor.haxemine.server.HaxemineConfig;
org.jinjor.haxemine.server.HaxemineConfig.__name__ = ["org","jinjor","haxemine","server","HaxemineConfig"];
org.jinjor.haxemine.server.HaxemineConfig.prototype = {
	commands: null
	,hxml: null
	,mode: null
	,port: null
	,__class__: org.jinjor.haxemine.server.HaxemineConfig
}
org.jinjor.haxemine.server.HaxemineConfigDao = function() {
};
$hxClasses["org.jinjor.haxemine.server.HaxemineConfigDao"] = org.jinjor.haxemine.server.HaxemineConfigDao;
org.jinjor.haxemine.server.HaxemineConfigDao.__name__ = ["org","jinjor","haxemine","server","HaxemineConfigDao"];
org.jinjor.haxemine.server.HaxemineConfigDao.makeConfpath = function(projectRoot) {
	return projectRoot + "/" + "haxemine.json";
}
org.jinjor.haxemine.server.HaxemineConfigDao.getAllHxmlFiles = function(projectRoot,_callback) {
	var filter = function(item) {
		return StringTools.endsWith(item,".hxml");
	};
	org.jinjor.haxemine.server.FileUtil.getAllMatchedFiles(projectRoot,filter,_callback);
}
org.jinjor.haxemine.server.HaxemineConfigDao.prototype = {
	create: function(process,projectRoot,onCreate,onCancel) {
		var confPath = org.jinjor.haxemine.server.HaxemineConfigDao.makeConfpath(projectRoot);
		org.jinjor.haxemine.server.Console.print("haxemine.json" + "is required in current directory.");
		org.jinjor.haxemine.server.Console.print("create " + "haxemine.json" + " here? [y/n]");
		var rli = org.jinjor.haxemine.server.HaxemineConfigDao.readline.createInterface(process.stdin,process.stdout);
		rli.on("line",function(cmd) {
			if(cmd == "y") org.jinjor.haxemine.server.HaxemineConfigDao.getAllHxmlFiles(projectRoot,function(err,files) {
				if(err != null) {
					org.jinjor.haxemine.server.Console.print(err);
					throw err;
				}
				files.sort(function(f1,f2) {
					return StringTools.startsWith(f1,"build") && StringTools.startsWith(f2,"compile")?1:-1;
				});
				var xhml = Lambda.array(Lambda.map(files,function(file) {
					return { path : file, auto : true};
				}));
				var conf = new org.jinjor.haxemine.server.HaxemineConfig(8765,"haxe",xhml,[]);
				var confJson = JSON.stringify(conf,null," ");
				org.jinjor.haxemine.server.HaxemineConfigDao.fs.writeFileSync(confPath,confJson,"utf8");
				org.jinjor.haxemine.server.Console.print("created haxemine.conf\n" + confJson);
				org.jinjor.haxemine.server.Console.print("modify haxemine.conf and restart haxemine.");
				onCreate();
				process.exit(0);
			}); else if(cmd == "n") {
				process.stdin.destroy();
				onCancel();
			}
			rli.prompt();
		});
	}
	,get: function(projectRoot) {
		var confPath = org.jinjor.haxemine.server.HaxemineConfigDao.makeConfpath(projectRoot);
		if(!org.jinjor.haxemine.server.HaxemineConfigDao.path.existsSync(confPath)) return null;
		var conf = haxe.Json.parse(org.jinjor.haxemine.server.HaxemineConfigDao.fs.readFileSync(confPath,"utf8"));
		conf.port = conf.port || 8765;
		if(conf.hxml == null) conf.hxml = [];
		var _g = 0, _g1 = conf.hxml;
		while(_g < _g1.length) {
			var hxml = _g1[_g];
			++_g;
			hxml.auto = hxml.auto || true;
		}
		return conf;
	}
	,__class__: org.jinjor.haxemine.server.HaxemineConfigDao
}
org.jinjor.haxemine.server.Main = function() { }
$hxClasses["org.jinjor.haxemine.server.Main"] = org.jinjor.haxemine.server.Main;
org.jinjor.haxemine.server.Main.__name__ = ["org","jinjor","haxemine","server","Main"];
org.jinjor.haxemine.server.Main.main = function() {
	org.jinjor.haxemine.server.Main.sourcemap.install();
	var projectRoot = ".";
	var confDao = new org.jinjor.haxemine.server.HaxemineConfigDao();
	var conf = confDao.get(projectRoot);
	if(conf == null) {
		var _process = process;
		confDao.create(_process,projectRoot,function() {
			_process.exit(0);
		},function() {
			_process.exit(0);
		});
	} else org.jinjor.haxemine.server.Main.startApp(projectRoot,conf);
}
org.jinjor.haxemine.server.Main.startApp = function(projectRoot,conf) {
	org.jinjor.haxemine.server.Console.print("projectRoot:" + projectRoot);
	org.jinjor.haxemine.server.Console.print("port:" + conf.port);
	var mode = conf.mode == "typescript"?org.jinjor.haxemine.server.Mode.TypeScript:org.jinjor.haxemine.server.Mode.Haxe;
	var taskInfos = conf.mode == "typescript"?Lambda.array(Lambda.map(conf.commands,function(command) {
		var name = "typescript_beta";
		var content = command.command;
		return new org.jinjor.haxemine.messages.TaskInfo(name,content,command.auto == null?true:command.auto);
	})):Lambda.array(Lambda.map(conf.hxml,function(hxml) {
		var name = hxml.path;
		var content = org.jinjor.haxemine.server.Main.fs.readFileSync(projectRoot + "/" + hxml.path,"utf8");
		return new org.jinjor.haxemine.messages.TaskInfo(name,content,hxml.auto == null?true:hxml.auto);
	}));
	var _path = org.jinjor.haxemine.server.Main.path;
	var _express = org.jinjor.haxemine.server.Main.express;
	var app = org.jinjor.haxemine.server.Main.express();
	console.log(__dirname + "/public/favicon.ico");
	app.configure(function() {
		app.set("port",conf.port);
		app["use"](org.jinjor.haxemine.server.Main.express.favicon(__dirname + "/public/favicon.ico"));
		app["use"](org.jinjor.haxemine.server.Main.express.logger("dev"));
		app["use"](org.jinjor.haxemine.server.Main.express.bodyParser());
		app["use"](org.jinjor.haxemine.server.Main.express.methodOverride());
		app["use"](app.router);
		app["use"](eval("_express.static(_path.join(__dirname, 'public'))"));
	});
	app.get("/",function(req,res) {
		res.writeHead(200,{ 'Content-Type' : "text/html"});
		var rs = org.jinjor.haxemine.server.Main.fs.createReadStream(__dirname + "/index.html");
		org.jinjor.haxemine.server.Main.sys.pump(rs,res);
	});
	app.get("/src",function(req,res) {
		var fileName = req.query.fileName;
		if(fileName == null) res.send(); else {
			res.contentType("application/json");
			console.log(req.query.fileName);
			res.send(haxe.Json.stringify(org.jinjor.haxemine.server.Service.findFromSrc(projectRoot + "/" + fileName)));
		}
	});
	var server = org.jinjor.haxemine.server.Main.http.createServer(app);
	server.listen(app.get("port"),function() {
		org.jinjor.haxemine.server.Console.print("haxemine listening on port " + Std.string(app.get("port")));
	});
	var io = org.jinjor.haxemine.server.Main.socketio.listen(server,{ 'log level' : 1});
	io.sockets.on("connection",function(socket) {
		var initialInfoM = new org.jinjor.haxemine.messages.InitialInfoM(socket);
		var allHaxeFilesM = new org.jinjor.haxemine.messages.AllHaxeFilesM(socket);
		var searchResultM = new org.jinjor.haxemine.messages.SearchResultM(socket);
		var searchM = new org.jinjor.haxemine.messages.SearchM(socket);
		var saveM = new org.jinjor.haxemine.messages.SaveM(socket);
		var doTaskM = new org.jinjor.haxemine.messages.DoTaskM(socket);
		var doTasksM = new org.jinjor.haxemine.messages.DoTasksM(socket);
		var taskProgressM = new org.jinjor.haxemine.messages.TaskProgressM(socket);
		org.jinjor.haxemine.server.Console.print("connection");
		org.jinjor.haxemine.server.Service.getAllFiles(projectRoot,mode,function(err,files) {
			if(err != null) {
				console.log(err);
				throw err;
			}
			initialInfoM.pub(new org.jinjor.haxemine.messages.InitialInfoDto(mode,projectRoot,files,taskInfos,org.jinjor.haxemine.server.OS.isWin()));
		});
		saveM.sub("Main.startApp",function(saveFileDto) {
			if(saveFileDto.fileName == null) {
				console.log(saveFileDto);
				throw "bad request.";
			}
			org.jinjor.haxemine.server.Service.save(mode,projectRoot,saveFileDto,allHaxeFilesM,socket);
			org.jinjor.haxemine.server.Service.doAutoTasks(conf,projectRoot,socket,taskProgressM);
		});
		doTaskM.sub("Main.startApp",function(taskName) {
			org.jinjor.haxemine.server.Service.doTask(conf,projectRoot,socket,taskProgressM,taskName);
		});
		doTasksM.sub("Main.startApp",function(_) {
			org.jinjor.haxemine.server.Service.doAutoTasks(conf,projectRoot,socket,taskProgressM);
		});
		socket.on("disconnect",function() {
			org.jinjor.haxemine.server.Console.print("disconnect");
		});
		searchM.sub("Main.startApp",function(word) {
			org.jinjor.haxemine.server.Service.searchWord(word,mode,function(err,result) {
				searchResultM.pub(result);
			});
		});
	});
}
org.jinjor.haxemine.server.Mode = $hxClasses["org.jinjor.haxemine.server.Mode"] = { __ename__ : ["org","jinjor","haxemine","server","Mode"], __constructs__ : ["TypeScript","Haxe"] }
org.jinjor.haxemine.server.Mode.TypeScript = ["TypeScript",0];
org.jinjor.haxemine.server.Mode.TypeScript.toString = $estr;
org.jinjor.haxemine.server.Mode.TypeScript.__enum__ = org.jinjor.haxemine.server.Mode;
org.jinjor.haxemine.server.Mode.Haxe = ["Haxe",1];
org.jinjor.haxemine.server.Mode.Haxe.toString = $estr;
org.jinjor.haxemine.server.Mode.Haxe.__enum__ = org.jinjor.haxemine.server.Mode;
org.jinjor.haxemine.server.OS = function() { }
$hxClasses["org.jinjor.haxemine.server.OS"] = org.jinjor.haxemine.server.OS;
org.jinjor.haxemine.server.OS.__name__ = ["org","jinjor","haxemine","server","OS"];
org.jinjor.haxemine.server.OS.isWin = function() {
	return StringTools.startsWith(org.jinjor.haxemine.server.OS.type().toLowerCase(),"win");
}
org.jinjor.haxemine.server.OS.type = function() {
	return org.jinjor.haxemine.server.OS.os.type();
}
org.jinjor.haxemine.server.Service = function() {
};
$hxClasses["org.jinjor.haxemine.server.Service"] = org.jinjor.haxemine.server.Service;
org.jinjor.haxemine.server.Service.__name__ = ["org","jinjor","haxemine","server","Service"];
org.jinjor.haxemine.server.Service.getPostfix = function(mode) {
	return (function($this) {
		var $r;
		switch( (mode)[1] ) {
		case 0:
			$r = ".ts";
			break;
		case 1:
			$r = ".hx";
			break;
		}
		return $r;
	}(this));
}
org.jinjor.haxemine.server.Service.save = function(mode,projectRoot,data,allHaxeFilesM,socket) {
	var _path = projectRoot + "/" + data.fileName;
	var isNew = !org.jinjor.haxemine.server.Service.path.existsSync(_path);
	org.jinjor.haxemine.server.Service.saveToSrc(org.jinjor.haxemine.server.Service.fs,_path,data.text);
	if(isNew) org.jinjor.haxemine.server.Service.getAllFiles(projectRoot,mode,function(err,files) {
		if(err != null) {
			console.log(err);
			throw err;
		}
		allHaxeFilesM.pub(files);
	});
	socket.emit("stdout","saved");
}
org.jinjor.haxemine.server.Service.doTask = function(conf,projectRoot,socket,taskProgressM,taskName) {
	var tasks = Lambda.array(Lambda.filter(conf.hxml,function(hxml) {
		return hxml.path == taskName;
	}).map(function(hxml) {
		var task = org.jinjor.haxemine.server.Service.createCompileHaxeTask(socket,taskProgressM,projectRoot,hxml.path);
		return task;
	}));
	org.jinjor.haxemine.server.Service.async.series(tasks,function() {
	});
}
org.jinjor.haxemine.server.Service.doAutoTasks = function(conf,projectRoot,socket,taskProgressM) {
	var tasks = conf.mode == "typescript"?Lambda.array(Lambda.filter(conf.commands,function(command) {
		return command.auto != null && command.auto;
	}).map(function(command) {
		var task = org.jinjor.haxemine.server.Service.createCompileTypeScriptTask(socket,taskProgressM,projectRoot,"typescript_beta",command.command);
		return task;
	})):Lambda.array(Lambda.filter(conf.hxml,function(hxml) {
		return hxml.auto != null && hxml.auto;
	}).map(function(hxml) {
		var task = org.jinjor.haxemine.server.Service.createCompileHaxeTask(socket,taskProgressM,projectRoot,hxml.path);
		return task;
	}));
	org.jinjor.haxemine.server.Service.async.series(tasks,function() {
	});
}
org.jinjor.haxemine.server.Service.searchWord = function(word,mode,cb) {
	if(!org.jinjor.haxemine.server.OS.isWin()) throw "search unsupported ."; else {
		var command = "findstr /N /S " + word + " *" + org.jinjor.haxemine.server.Service.getPostfix(mode);
		org.jinjor.haxemine.server.Console.print(command);
		org.jinjor.haxemine.server.Service.childProcess.exec(command,function(err,stdout,stderr) {
			if(err != null) cb(null,[]); else {
				var messages = stdout.split("\n");
				var results = Lambda.array(Lambda.filter(messages,function(message) {
					return message != "";
				}).map(function(message) {
					console.log(message);
					var fileName = StringTools.replace(message.split(":")[0],"\\","/");
					var row = Std.parseInt(message.split(":")[1]);
					return new org.jinjor.haxemine.messages.SearchResult(fileName,row,message);
				}));
				cb(null,results);
			}
		});
	}
}
org.jinjor.haxemine.server.Service.findFromSrc = function(fileName) {
	var editorMode = StringTools.endsWith(fileName,".ts")?"typescript":"haxe";
	return new org.jinjor.haxemine.messages.FileDetail(org.jinjor.haxemine.server.Service.fs.readFileSync(fileName,"utf8"),editorMode);
}
org.jinjor.haxemine.server.Service.saveToSrc = function(fs,fileName,text) {
	fs.writeFileSync(fileName,text,"utf8");
}
org.jinjor.haxemine.server.Service.createCompileTypeScriptTask = function(socket,taskProgressM,projectRoot,name,command) {
	return function(callBack) {
		org.jinjor.haxemine.server.Service.compileTypeScript(socket,taskProgressM,projectRoot,name,command,callBack);
	};
}
org.jinjor.haxemine.server.Service.createCompileHaxeTask = function(socket,taskProgressM,projectRoot,hxmlPath) {
	return function(callBack) {
		org.jinjor.haxemine.server.Service.compileHaxe(socket,taskProgressM,projectRoot,hxmlPath,callBack);
	};
}
org.jinjor.haxemine.server.Service.compileTypeScript = function(socket,taskProgressM,projectRoot,name,command,callBack) {
	org.jinjor.haxemine.server.Service.compile(org.jinjor.haxemine.server.Mode.TypeScript,socket,taskProgressM,projectRoot,name,command,callBack);
}
org.jinjor.haxemine.server.Service.compileHaxe = function(socket,taskProgressM,projectRoot,hxmlPath,callBack) {
	org.jinjor.haxemine.server.Service.compile(org.jinjor.haxemine.server.Mode.Haxe,socket,taskProgressM,projectRoot,hxmlPath,"haxe " + hxmlPath,callBack);
}
org.jinjor.haxemine.server.Service.compile = function(mode,socket,taskProgressM,projectRoot,taskName,command,callBack) {
	org.jinjor.haxemine.server.Console.print("cwt:" + projectRoot);
	org.jinjor.haxemine.server.Service.childProcess.exec(command,{ cwd : projectRoot},function(err,stdout,stderr) {
		if(err != null) {
			org.jinjor.haxemine.server.Console.print(stderr,command);
			org.jinjor.haxemine.server.Console.print("" + err,"err");
			org.jinjor.haxemine.server.Console.print(stdout,"stdout");
		}
		socket.emit("stdout",stdout);
		var compileErrors = err != null?(function($this) {
			var $r;
			var msg = stderr;
			var messages = msg.split("\n");
			var compileErrors1 = Lambda.array(Lambda.filter(messages,function(message) {
				return message != "";
			}).map(function(message) {
				if(StringTools.startsWith(message,"./")) message = message.substring("./".length);
				return new org.jinjor.haxemine.messages.CompileError(message,mode);
			}));
			$r = compileErrors1;
			return $r;
		}(this)):[];
		taskProgressM.pub(new org.jinjor.haxemine.messages.TaskProgress(taskName,compileErrors));
		callBack(err);
	});
}
org.jinjor.haxemine.server.Service.createRunJasmineTask = function() {
	return function(_callBack) {
		org.jinjor.haxemine.server.Service.runJasmine(_callBack);
	};
}
org.jinjor.haxemine.server.Service.runJasmine = function(_callBack) {
	org.jinjor.haxemine.server.Service.childProcess.exec("phantomjs.exe run.js",function(err,stdout,stderr) {
		if(err != null) org.jinjor.haxemine.server.Console.print(err,"phantom err");
		org.jinjor.haxemine.server.Console.print(stdout,"phantom 1");
		org.jinjor.haxemine.server.Console.print(stderr,"phantom 2");
		_callBack(err);
	});
}
org.jinjor.haxemine.server.Service.getAllFiles = function(projectRoot,mode,_callback) {
	var filter = function(item) {
		return StringTools.endsWith(item,org.jinjor.haxemine.server.Service.getPostfix(mode));
	};
	org.jinjor.haxemine.server.FileUtil.getAllMatchedFiles(projectRoot,filter,function(err,filePaths) {
		if(err != null) _callback(err,null); else {
			var files = new Hash();
			Lambda.foreach(filePaths,function(f) {
				files.set(f,new org.jinjor.haxemine.messages.SourceFile(f));
				return true;
			});
			_callback(null,files);
		}
	});
}
org.jinjor.haxemine.server.Service.prototype = {
	__class__: org.jinjor.haxemine.server.Service
}
org.jinjor.util = {}
org.jinjor.util.Util = function() { }
$hxClasses["org.jinjor.util.Util"] = org.jinjor.util.Util;
org.jinjor.util.Util.__name__ = ["org","jinjor","util","Util"];
org.jinjor.util.Util.or = function(a,b) {
	return a || b;
}
org.jinjor.util.Util.and = function(a,b) {
	return a && b;
}
org.jinjor.util.Util.compareTo = function(a,b) {
	return a < b?-1:a > b?1:0;
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(typeof(JSON) != "undefined") haxe.Json = JSON;
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
js.Node.__filename = __filename;
js.Node.__dirname = __dirname;
js.Node.setTimeout = setTimeout;
js.Node.clearTimeout = clearTimeout;
js.Node.setInterval = setInterval;
js.Node.clearInterval = clearInterval;
js.Node.global = global;
js.Node.process = process;
js.Node.require = require;
js.Node.console = console;
js.Node.module = module;
js.Node.stringify = JSON.stringify;
js.Node.parse = JSON.parse;
js.Node.util = js.Node.require("util");
js.Node.fs = js.Node.require("fs");
js.Node.net = js.Node.require("net");
js.Node.http = js.Node.require("http");
js.Node.https = js.Node.require("https");
js.Node.path = js.Node.require("path");
js.Node.url = js.Node.require("url");
js.Node.os = js.Node.require("os");
js.Node.crypto = js.Node.require("crypto");
js.Node.dns = js.Node.require("dns");
js.Node.queryString = js.Node.require("querystring");
js.Node.assert = js.Node.require("assert");
js.Node.childProcess = js.Node.require("child_process");
js.Node.vm = js.Node.require("vm");
js.Node.tls = js.Node.require("tls");
js.Node.dgram = js.Node.require("dgram");
js.Node.assert = js.Node.require("assert");
js.Node.repl = js.Node.require("repl");
js.Node.cluster = js.Node.require("cluster");
haxe.Serializer.USE_CACHE = false;
haxe.Serializer.USE_ENUM_INDEX = false;
haxe.Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.CODES = null;
js.Lib.onerror = null;
js.NodeC.UTF8 = "utf8";
js.NodeC.ASCII = "ascii";
js.NodeC.BINARY = "binary";
js.NodeC.BASE64 = "base64";
js.NodeC.HEX = "hex";
js.NodeC.EVENT_EVENTEMITTER_NEWLISTENER = "newListener";
js.NodeC.EVENT_EVENTEMITTER_ERROR = "error";
js.NodeC.EVENT_STREAM_DATA = "data";
js.NodeC.EVENT_STREAM_END = "end";
js.NodeC.EVENT_STREAM_ERROR = "error";
js.NodeC.EVENT_STREAM_CLOSE = "close";
js.NodeC.EVENT_STREAM_DRAIN = "drain";
js.NodeC.EVENT_STREAM_CONNECT = "connect";
js.NodeC.EVENT_STREAM_SECURE = "secure";
js.NodeC.EVENT_STREAM_TIMEOUT = "timeout";
js.NodeC.EVENT_STREAM_PIPE = "pipe";
js.NodeC.EVENT_PROCESS_EXIT = "exit";
js.NodeC.EVENT_PROCESS_UNCAUGHTEXCEPTION = "uncaughtException";
js.NodeC.EVENT_PROCESS_SIGINT = "SIGINT";
js.NodeC.EVENT_PROCESS_SIGUSR1 = "SIGUSR1";
js.NodeC.EVENT_CHILDPROCESS_EXIT = "exit";
js.NodeC.EVENT_HTTPSERVER_REQUEST = "request";
js.NodeC.EVENT_HTTPSERVER_CONNECTION = "connection";
js.NodeC.EVENT_HTTPSERVER_CLOSE = "close";
js.NodeC.EVENT_HTTPSERVER_UPGRADE = "upgrade";
js.NodeC.EVENT_HTTPSERVER_CLIENTERROR = "clientError";
js.NodeC.EVENT_HTTPSERVERREQUEST_DATA = "data";
js.NodeC.EVENT_HTTPSERVERREQUEST_END = "end";
js.NodeC.EVENT_CLIENTREQUEST_RESPONSE = "response";
js.NodeC.EVENT_CLIENTRESPONSE_DATA = "data";
js.NodeC.EVENT_CLIENTRESPONSE_END = "end";
js.NodeC.EVENT_NETSERVER_CONNECTION = "connection";
js.NodeC.EVENT_NETSERVER_CLOSE = "close";
js.NodeC.FILE_READ = "r";
js.NodeC.FILE_READ_APPEND = "r+";
js.NodeC.FILE_WRITE = "w";
js.NodeC.FILE_WRITE_APPEND = "a+";
js.NodeC.FILE_READWRITE = "a";
js.NodeC.FILE_READWRITE_APPEND = "a+";
org.jinjor.haxemine.server.FileUtil.async = js.Node.require("async");
org.jinjor.haxemine.server.FileUtil.fs = js.Node.require("fs");
org.jinjor.haxemine.server.HaxemineConfigDao.CONF_FILE = "haxemine.json";
org.jinjor.haxemine.server.HaxemineConfigDao.path = js.Node.require("path");
org.jinjor.haxemine.server.HaxemineConfigDao.fs = js.Node.require("fs");
org.jinjor.haxemine.server.HaxemineConfigDao.readline = js.Node.require("readline");
org.jinjor.haxemine.server.Main.express = js.Node.require("express");
org.jinjor.haxemine.server.Main.fs = js.Node.require("fs");
org.jinjor.haxemine.server.Main.sys = js.Node.require("sys");
org.jinjor.haxemine.server.Main.http = js.Node.require("http");
org.jinjor.haxemine.server.Main.path = js.Node.require("path");
org.jinjor.haxemine.server.Main.readline = js.Node.require("readline");
org.jinjor.haxemine.server.Main.socketio = js.Node.require("socket.io");
org.jinjor.haxemine.server.Main.childProcess = js.Node.require("child_process");
org.jinjor.haxemine.server.Main.async = js.Node.require("async");
org.jinjor.haxemine.server.Main.sourcemap = js.Node.require("source-map-support");
org.jinjor.haxemine.server.OS.os = js.Node.require("os");
org.jinjor.haxemine.server.Service.fs = js.Node.require("fs");
org.jinjor.haxemine.server.Service.childProcess = js.Node.require("child_process");
org.jinjor.haxemine.server.Service.async = js.Node.require("async");
org.jinjor.haxemine.server.Service.path = js.Node.require("path");
org.jinjor.haxemine.server.Main.main();
})();

//@ sourceMappingURL=haxemine.js.map