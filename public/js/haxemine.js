(function () { "use strict";
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	matched: function(n) {
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
	,__class__: EReg
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
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
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
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
Lambda.foreach = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(!f(x)) return false;
	}
	return true;
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
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,__class__: List
}
var IMap = function() { }
$hxClasses["IMap"] = IMap;
IMap.__name__ = ["IMap"];
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
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.deleteField = function(o,field) {
	if(!Reflect.hasField(o,field)) return false;
	delete(o[field]);
	return true;
}
var Std = function() { }
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
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
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	__class__: StringBuf
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
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
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
var haxe = {}
haxe.Serializer = function() {
	this.buf = new StringBuf();
	this.cache = new Array();
	this.useCache = haxe.Serializer.USE_CACHE;
	this.useEnumIndex = haxe.Serializer.USE_ENUM_INDEX;
	this.shash = new haxe.ds.StringMap();
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
	serialize: function(v) {
		var _g = Type["typeof"](v);
		var $e = (_g);
		switch( $e[1] ) {
		case 0:
			this.buf.b += "n";
			break;
		case 1:
			if(v == 0) {
				this.buf.b += "z";
				return;
			}
			this.buf.b += "i";
			this.buf.b += Std.string(v);
			break;
		case 2:
			if(Math.isNaN(v)) this.buf.b += "k"; else if(!Math.isFinite(v)) this.buf.b += Std.string(v < 0?"m":"p"); else {
				this.buf.b += "d";
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
				this.buf.b += "a";
				var l = v.length;
				var _g1 = 0;
				while(_g1 < l) {
					var i = _g1++;
					if(v[i] == null) ucount++; else {
						if(ucount > 0) {
							if(ucount == 1) this.buf.b += "n"; else {
								this.buf.b += "u";
								this.buf.b += Std.string(ucount);
							}
							ucount = 0;
						}
						this.serialize(v[i]);
					}
				}
				if(ucount > 0) {
					if(ucount == 1) this.buf.b += "n"; else {
						this.buf.b += "u";
						this.buf.b += Std.string(ucount);
					}
				}
				this.buf.b += "h";
				break;
			case List:
				this.buf.b += "l";
				var v1 = v;
				var $it0 = v1.iterator();
				while( $it0.hasNext() ) {
					var i = $it0.next();
					this.serialize(i);
				}
				this.buf.b += "h";
				break;
			case Date:
				var d = v;
				this.buf.b += "v";
				this.buf.b += Std.string(HxOverrides.dateStr(d));
				break;
			case haxe.ds.StringMap:
				this.buf.b += "b";
				var v1 = v;
				var $it1 = v1.keys();
				while( $it1.hasNext() ) {
					var k = $it1.next();
					this.serializeString(k);
					this.serialize(v1.get(k));
				}
				this.buf.b += "h";
				break;
			case haxe.ds.IntMap:
				this.buf.b += "q";
				var v1 = v;
				var $it2 = v1.keys();
				while( $it2.hasNext() ) {
					var k = $it2.next();
					this.buf.b += ":";
					this.buf.b += Std.string(k);
					this.serialize(v1.get(k));
				}
				this.buf.b += "h";
				break;
			case haxe.ds.ObjectMap:
				this.buf.b += "M";
				var v1 = v;
				var $it3 = v1.keys();
				while( $it3.hasNext() ) {
					var k = $it3.next();
					var id = Reflect.field(k,"__id__");
					Reflect.deleteField(k,"__id__");
					this.serialize(k);
					k.__id__ = id;
					this.serialize(v1.h[k.__id__]);
				}
				this.buf.b += "h";
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
				this.buf.b += "s";
				this.buf.b += Std.string(chars.length);
				this.buf.b += ":";
				this.buf.b += Std.string(chars);
				break;
			default:
				this.cache.pop();
				if(v.hxSerialize != null) {
					this.buf.b += "C";
					this.serializeString(Type.getClassName(c));
					this.cache.push(v);
					v.hxSerialize(this);
					this.buf.b += "g";
				} else {
					this.buf.b += "c";
					this.serializeString(Type.getClassName(c));
					this.cache.push(v);
					this.serializeFields(v);
				}
			}
			break;
		case 4:
			if(this.useCache && this.serializeRef(v)) return;
			this.buf.b += "o";
			this.serializeFields(v);
			break;
		case 7:
			var e = $e[2];
			if(this.useCache && this.serializeRef(v)) return;
			this.cache.pop();
			this.buf.b += Std.string(this.useEnumIndex?"j":"w");
			this.serializeString(Type.getEnumName(e));
			if(this.useEnumIndex) {
				this.buf.b += ":";
				this.buf.b += Std.string(v[1]);
			} else this.serializeString(v[0]);
			this.buf.b += ":";
			var l = v.length;
			this.buf.b += Std.string(l - 2);
			var _g1 = 2;
			while(_g1 < l) {
				var i = _g1++;
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
		this.buf.b += "g";
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0, _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += "r";
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
			this.buf.b += "R";
			this.buf.b += Std.string(x);
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.b += "y";
		s = StringTools.urlEncode(s);
		this.buf.b += Std.string(s.length);
		this.buf.b += ":";
		this.buf.b += Std.string(s);
	}
	,toString: function() {
		return this.buf.b;
	}
	,__class__: haxe.Serializer
}
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe.Timer;
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.prototype = {
	run: function() {
		console.log("run");
	}
	,stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,__class__: haxe.Timer
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
		var _g = this.buf.charCodeAt(this.pos++);
		switch(_g) {
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
			var h = new haxe.ds.StringMap();
			this.cache.push(h);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s = this.unserialize();
				h.set(s,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h = new haxe.ds.IntMap();
			this.cache.push(h);
			var buf = this.buf;
			var c = this.buf.charCodeAt(this.pos++);
			while(c == 58) {
				var i = this.readDigits();
				h.set(i,this.unserialize());
				c = this.buf.charCodeAt(this.pos++);
			}
			if(c != 104) throw "Invalid IntMap format";
			return h;
		case 77:
			var h = new haxe.ds.ObjectMap();
			this.cache.push(h);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s = this.unserialize();
				h.set(s,this.unserialize());
			}
			this.pos++;
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
	,setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_) {
			return null;
		}}; else this.resolver = r;
	}
	,__class__: haxe.Unserializer
}
haxe.ds = {}
haxe.ds.IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe.ds.IntMap;
haxe.ds.IntMap.__name__ = ["haxe","ds","IntMap"];
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,__class__: haxe.ds.IntMap
}
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe.ds.ObjectMap;
haxe.ds.ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.prototype = {
	keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,set: function(key,value) {
		var id = key.__id__ != null?key.__id__:key.__id__ = ++haxe.ds.ObjectMap.count;
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,__class__: haxe.ds.ObjectMap
}
haxe.ds.StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	iterator: function() {
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
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,__class__: haxe.ds.StringMap
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
haxe.io.Bytes.prototype = {
	__class__: haxe.io.Bytes
}
var js = {}
js.Boot = function() { }
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
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
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
js.Browser = function() { }
$hxClasses["js.Browser"] = js.Browser;
js.Browser.__name__ = ["js","Browser"];
js.Lib = function() { }
$hxClasses["js.Lib"] = js.Lib;
js.Lib.__name__ = ["js","Lib"];
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
var org = {}
org.jinjor = {}
org.jinjor.haxemine = {}
org.jinjor.haxemine.client = {}
org.jinjor.haxemine.client.FileDetailDao = function() {
};
$hxClasses["org.jinjor.haxemine.client.FileDetailDao"] = org.jinjor.haxemine.client.FileDetailDao;
org.jinjor.haxemine.client.FileDetailDao.__name__ = ["org","jinjor","haxemine","client","FileDetailDao"];
org.jinjor.haxemine.client.FileDetailDao.prototype = {
	getFile: function(filePath,callBack) {
		$.ajax({ url : "src", data : { fileName : filePath}, type : "GET", success : function(fileDetail) {
			callBack(fileDetail);
		}});
	}
	,__class__: org.jinjor.haxemine.client.FileDetailDao
}
org.jinjor.haxemine.client.HaxemineModule = function() { }
$hxClasses["org.jinjor.haxemine.client.HaxemineModule"] = org.jinjor.haxemine.client.HaxemineModule;
org.jinjor.haxemine.client.HaxemineModule.__name__ = ["org","jinjor","haxemine","client","HaxemineModule"];
org.jinjor.haxemine.client.HaxemineSocket = function(socket,scope) {
	this.socket = socket;
	this.on = function(key,f) {
		socket.on(key,function(data) {
			f(data);
			console.log("receive:" + key);
			eval("scope.$" + "apply()");
		});
	};
	this.emit = $bind(socket,socket.emit);
};
$hxClasses["org.jinjor.haxemine.client.HaxemineSocket"] = org.jinjor.haxemine.client.HaxemineSocket;
org.jinjor.haxemine.client.HaxemineSocket.__name__ = ["org","jinjor","haxemine","client","HaxemineSocket"];
org.jinjor.haxemine.client.HaxemineSocket.prototype = {
	__class__: org.jinjor.haxemine.client.HaxemineSocket
}
org.jinjor.haxemine.client.Main = function() { }
$hxClasses["org.jinjor.haxemine.client.Main"] = org.jinjor.haxemine.client.Main;
org.jinjor.haxemine.client.Main.__name__ = ["org","jinjor","haxemine","client","Main"];
org.jinjor.haxemine.client.Main.main = function() {
}
org.jinjor.haxemine.client.Session = function(socket) {
	var _g = this;
	this.compileErrors = [];
	this.searchResults = [];
	this.dirs = [];
	var that = this;
	this.socket = socket;
	var initialInfoM = new org.jinjor.haxemine.messages.InitialInfoM(socket);
	var allHaxeFilesM = new org.jinjor.haxemine.messages.AllHaxeFilesM(socket);
	var doTasksM = new org.jinjor.haxemine.messages.DoTasksM(socket);
	this.saveM = new org.jinjor.haxemine.messages.SaveM(socket);
	this.doTaskM = new org.jinjor.haxemine.messages.DoTaskM(socket);
	this.taskProgressM = new org.jinjor.haxemine.messages.TaskProgressM(socket);
	this.searchM = new org.jinjor.haxemine.messages.SearchM(socket);
	socket.on("stdout",function(msg) {
		if(msg != "") console.log(msg);
	});
	allHaxeFilesM.sub("Session.new",function(files) {
		_g.setAllFiles(files);
	});
	var onInitialInfoReceived = new org.jinjor.util.Event();
	initialInfoM.sub("Session.new",function(initialInfo) {
		onInitialInfoReceived.pub(initialInfo);
		_g.setAllFiles(initialInfo.allFiles);
	});
	this.taskProgressM.sub("Session.new",function(taskProgress) {
		that.lastTaskProgress = taskProgress;
		_g.onLastTaskProgressChanged.pub(null);
	});
	socket.on("connect",function(_) {
		console.log("connected.");
		_g.connected = true;
	});
	socket.on("disconnect",function(_) {
		console.log("disconnected.");
		_g.connected = false;
	});
	this.editingFiles = new org.jinjor.haxemine.messages.HistoryArray(10,org.jinjor.haxemine.messages.SourceFile.equals);
	this.allFiles = new haxe.ds.StringMap();
	var onSocketConnected = new org.jinjor.util.Event();
	this.onSocketDisconnected = new org.jinjor.util.Event();
	this.onAllFilesChanged = new org.jinjor.util.Event();
	this.onLastTaskProgressChanged = new org.jinjor.util.Event();
	var onSave = new org.jinjor.util.Event();
	this.onSelectView = new org.jinjor.util.Event();
	this.onEditingFileChange = new org.jinjor.util.Event2();
	onSocketConnected.sub("Session.new",function(_) {
		doTasksM.pub(null);
	});
	onInitialInfoReceived.sub("TaskListView.new",function(info) {
		_g.tasks = Lambda.array(info.taskInfos.map(function(taskInfo) {
			return new org.jinjor.haxemine.client.TaskModel(taskInfo.taskName,taskInfo.content,taskInfo.auto,_g.taskProgressM);
		}));
	});
	onSave.sub("Session.new",function(_) {
		var _g1 = 0, _g2 = _g.tasks;
		while(_g1 < _g2.length) {
			var task = _g2[_g1];
			++_g1;
			task.reset();
		}
	});
	var searchResultM = new org.jinjor.haxemine.messages.SearchResultM(socket);
	searchResultM.sub("SearchPanel.new",function(results) {
		_g.searchResults = results;
	});
};
$hxClasses["org.jinjor.haxemine.client.Session"] = org.jinjor.haxemine.client.Session;
org.jinjor.haxemine.client.Session.__name__ = ["org","jinjor","haxemine","client","Session"];
org.jinjor.haxemine.client.Session.prototype = {
	getCompileErrorsByFile: function(file) {
		if(file == null) return new Array();
		return this.getCompileErrors().filter(function(error) {
			return error.originalMessage.indexOf(file.pathFromProjectRoot) == 0 || error.originalMessage.indexOf("./" + file.pathFromProjectRoot) == 0;
		});
	}
	,selectNewerFile: function() {
		if(this.editingFiles.cursorToNewer()) this.onEditingFileChange.pub(this.editingFiles.getCursored(),null);
	}
	,selectOlderFile: function() {
		if(this.editingFiles.cursorToOlder()) this.onEditingFileChange.pub(this.editingFiles.getCursored(),null);
	}
	,selectNextFile: function(file,optLine) {
		if(file == null) return;
		this.editingFiles.add(file);
		this.onEditingFileChange.pub(file,optLine);
	}
	,getCurrentFile: function() {
		return this.editingFiles.getCursored();
	}
	,getAllFiles: function() {
		return this.allFiles;
	}
	,setAllFiles: function(allFiles) {
		this.allFiles = allFiles;
		var dirsHash = new haxe.ds.StringMap();
		var all = allFiles;
		var $it0 = all.keys();
		while( $it0.hasNext() ) {
			var name = $it0.next();
			var dirName = name.substring(0,name.lastIndexOf("/"));
			var f = all.get(name);
			if(dirsHash.exists(dirName)) dirsHash.get(dirName).files.push(f); else {
				var dir = new org.jinjor.haxemine.client.view.Dir(dirName);
				dirsHash.set(dirName,dir);
				dir.files.push(f);
			}
		}
		var dirsArray = Lambda.array(Lambda.map(dirsHash,function(dir) {
			dir.files.sort(function(f1,f2) {
				return org.jinjor.util.Util.compareTo(f1.shortName,f2.shortName);
			});
			return dir;
		}));
		this.dirs = dirsArray;
		this.onAllFilesChanged.pub(null);
	}
	,getCompileErrors: function() {
		return this.lastTaskProgress != null?this.lastTaskProgress.compileErrors:[];
	}
	,doTask: function(word) {
	}
	,search: function(word) {
		this.searchM.pub(word);
		this.searchResults = null;
	}
	,save: function(text) {
		this.saveM.pub(new org.jinjor.haxemine.messages.SaveFileDto(this.getCurrentFile().pathFromProjectRoot,text));
	}
	,__class__: org.jinjor.haxemine.client.Session
}
org.jinjor.haxemine.client.TaskModel = function(name,content,auto,taskProgressM) {
	var _g = this;
	var that = this;
	taskProgressM.sub("TaskModel.new." + name,function(progress) {
		if(name != progress.taskName) return;
		that.state = progress.compileErrors.length <= 0?org.jinjor.haxemine.client.TaskModelState.SUCCESS:org.jinjor.haxemine.client.TaskModelState.FAILED;
		_g.onUpdate.pub(null);
	});
	this.name = name;
	this.content = content;
	this.auto = auto;
	this.onUpdate = new org.jinjor.util.Event();
	this.reset();
};
$hxClasses["org.jinjor.haxemine.client.TaskModel"] = org.jinjor.haxemine.client.TaskModel;
org.jinjor.haxemine.client.TaskModel.__name__ = ["org","jinjor","haxemine","client","TaskModel"];
org.jinjor.haxemine.client.TaskModel.prototype = {
	reset: function() {
		this.state = this.auto?org.jinjor.haxemine.client.TaskModelState.NONE:org.jinjor.haxemine.client.TaskModelState.READY;
	}
	,setState: function(newState) {
		this.state = newState;
		this.onUpdate.pub(null);
	}
	,__class__: org.jinjor.haxemine.client.TaskModel
}
org.jinjor.haxemine.client.TaskModelState = $hxClasses["org.jinjor.haxemine.client.TaskModelState"] = { __ename__ : ["org","jinjor","haxemine","client","TaskModelState"], __constructs__ : ["NONE","SUCCESS","FAILED","READY","WAITING"] }
org.jinjor.haxemine.client.TaskModelState.NONE = ["NONE",0];
org.jinjor.haxemine.client.TaskModelState.NONE.toString = $estr;
org.jinjor.haxemine.client.TaskModelState.NONE.__enum__ = org.jinjor.haxemine.client.TaskModelState;
org.jinjor.haxemine.client.TaskModelState.SUCCESS = ["SUCCESS",1];
org.jinjor.haxemine.client.TaskModelState.SUCCESS.toString = $estr;
org.jinjor.haxemine.client.TaskModelState.SUCCESS.__enum__ = org.jinjor.haxemine.client.TaskModelState;
org.jinjor.haxemine.client.TaskModelState.FAILED = ["FAILED",2];
org.jinjor.haxemine.client.TaskModelState.FAILED.toString = $estr;
org.jinjor.haxemine.client.TaskModelState.FAILED.__enum__ = org.jinjor.haxemine.client.TaskModelState;
org.jinjor.haxemine.client.TaskModelState.READY = ["READY",3];
org.jinjor.haxemine.client.TaskModelState.READY.toString = $estr;
org.jinjor.haxemine.client.TaskModelState.READY.__enum__ = org.jinjor.haxemine.client.TaskModelState;
org.jinjor.haxemine.client.TaskModelState.WAITING = ["WAITING",4];
org.jinjor.haxemine.client.TaskModelState.WAITING.toString = $estr;
org.jinjor.haxemine.client.TaskModelState.WAITING.__enum__ = org.jinjor.haxemine.client.TaskModelState;
org.jinjor.haxemine.client.view = {}
org.jinjor.haxemine.client.view.AceEditorView = function() { }
$hxClasses["org.jinjor.haxemine.client.view.AceEditorView"] = org.jinjor.haxemine.client.view.AceEditorView;
org.jinjor.haxemine.client.view.AceEditorView.__name__ = ["org","jinjor","haxemine","client","view","AceEditorView"];
org.jinjor.haxemine.client.view.AceEditorView.link = function(scope,element,attrs) {
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/eclipse");
	var firstTime = true;
	haxe.Timer.delay(function() {
		var session = scope.session;
		scope.reset(session);
		session.onEditingFileChange.sub(function(file,line) {
			if(file == null) return;
			new org.jinjor.haxemine.client.FileDetailDao().getFile(file.pathFromProjectRoot,function(detail) {
				editor.getSession().setValue(detail.text);
				editor.getSession().setMode("ace/mode/" + detail.mode);
				org.jinjor.haxemine.client.view.AceEditorView.annotateCompileError(editor,session);
				if(line != null) editor.gotoLine(line);
			});
		});
	},0);
	scope.reset = function(session1) {
		if(firstTime) {
			editor.commands.addCommands([{ Name : "savefile", bindKey : { win : "Ctrl-S", mac : "Command-S"}, exec : function(editor1) {
				session1.save(editor1.getSession().getValue());
			}},{ Name : "jumpToClass", bindKey : { win : "Ctrl-Q", mac : "Command-Q"}, exec : function(editor1) {
				var pos = editor1.getCursorPosition();
				var value = editor1.getSession().getTokenAt(pos.row,pos.column).value;
				var charCode = HxOverrides.cca(value,0);
				var startsWithUpper = charCode != null && 65 <= charCode && charCode <= 90;
				if(!startsWithUpper) return;
				var filtered = Lambda.array(Lambda.filter(session1.getAllFiles(),function(file) {
					var name = file.shortName;
					var splitted = name.split((function($this) {
						var $r;
						switch( (session1.langMode)[1] ) {
						case 0:
							$r = ".ts";
							break;
						case 1:
							$r = ".hx";
							break;
						}
						return $r;
					}(this)));
					return splitted[0] == value;
				}));
				if(filtered.length == 1) session1.selectNextFile(filtered[0],null); else if(filtered.length > 1) {
				}
			}},{ Name : "toOlder", bindKey : { win : "Alt-Left"}, exec : function(editor1) {
				session1.selectOlderFile();
			}},{ Name : "toNewer", bindKey : { win : "Alt-Right"}, exec : function(editor1) {
				session1.selectNewerFile();
			}}]);
			firstTime = false;
		}
		session1.onEditingFileChange.sub(function(file,line1) {
			new org.jinjor.haxemine.client.FileDetailDao().getFile(file.pathFromProjectRoot,function(detail) {
				editor.getSession().setValue(detail.text);
				editor.getSession().setMode("ace/mode/" + detail.mode);
				org.jinjor.haxemine.client.view.AceEditorView.annotateCompileError(editor,session1);
				if(line1 != null) editor.gotoLine(line1);
			});
		});
		session1.onLastTaskProgressChanged.sub("AceEditorView.new",function(_) {
			org.jinjor.haxemine.client.view.AceEditorView.annotateCompileError(editor,session1);
		});
	};
}
org.jinjor.haxemine.client.view.AceEditorView.annotateCompileError = function(editor,session) {
	var annotations = Lambda.array(session.getCompileErrorsByFile(session.getCurrentFile()).map(function(error) {
		return { row : error.row - 1, text : error.message, type : "error"};
	}));
	editor.getSession().setAnnotations(annotations);
}
org.jinjor.haxemine.client.view.CompileErrorPanel = function() { }
$hxClasses["org.jinjor.haxemine.client.view.CompileErrorPanel"] = org.jinjor.haxemine.client.view.CompileErrorPanel;
org.jinjor.haxemine.client.view.CompileErrorPanel.__name__ = ["org","jinjor","haxemine","client","view","CompileErrorPanel"];
org.jinjor.haxemine.client.view.Dir = function(name) {
	this.name = name;
	this.files = [];
};
$hxClasses["org.jinjor.haxemine.client.view.Dir"] = org.jinjor.haxemine.client.view.Dir;
org.jinjor.haxemine.client.view.Dir.__name__ = ["org","jinjor","haxemine","client","view","Dir"];
org.jinjor.haxemine.client.view.Dir.prototype = {
	__class__: org.jinjor.haxemine.client.view.Dir
}
org.jinjor.haxemine.client.view.FileSelector = function() { }
$hxClasses["org.jinjor.haxemine.client.view.FileSelector"] = org.jinjor.haxemine.client.view.FileSelector;
org.jinjor.haxemine.client.view.FileSelector.__name__ = ["org","jinjor","haxemine","client","view","FileSelector"];
org.jinjor.haxemine.messages = {}
org.jinjor.haxemine.messages.SaveFileDto = function(fileName,text) {
	this.fileName = fileName;
	this.text = text;
};
$hxClasses["org.jinjor.haxemine.messages.SaveFileDto"] = org.jinjor.haxemine.messages.SaveFileDto;
org.jinjor.haxemine.messages.SaveFileDto.__name__ = ["org","jinjor","haxemine","messages","SaveFileDto"];
org.jinjor.haxemine.messages.SaveFileDto.prototype = {
	__class__: org.jinjor.haxemine.messages.SaveFileDto
}
org.jinjor.haxemine.client.view.Folder = function() { }
$hxClasses["org.jinjor.haxemine.client.view.Folder"] = org.jinjor.haxemine.client.view.Folder;
org.jinjor.haxemine.client.view.Folder.__name__ = ["org","jinjor","haxemine","client","view","Folder"];
org.jinjor.haxemine.client.view.Folder.hasCompileError = function(session,file) {
	var found = false;
	Lambda.foreach(session.getCompileErrors(),function(error) {
		if(session.getAllFiles().get(error.path) == file) {
			found = true;
			return false;
		}
		return true;
	});
	return found;
}
org.jinjor.haxemine.client.view.Folder.saveNewFile = function(saveM,session,pathFromProjectRoot,text) {
	var dup = false;
	var $it0 = ((function(_e) {
		return function() {
			return _e.iterator();
		};
	})(session.getAllFiles()))();
	while( $it0.hasNext() ) {
		var file = $it0.next();
		if(file.pathFromProjectRoot == pathFromProjectRoot) {
			dup = true;
			break;
		}
	}
	if(dup) js.Lib.alert(pathFromProjectRoot + " already exists."); else saveM.pub(new org.jinjor.haxemine.messages.SaveFileDto(pathFromProjectRoot,text));
}
org.jinjor.haxemine.client.view.Menu = function() { }
$hxClasses["org.jinjor.haxemine.client.view.Menu"] = org.jinjor.haxemine.client.view.Menu;
org.jinjor.haxemine.client.view.Menu.__name__ = ["org","jinjor","haxemine","client","view","Menu"];
org.jinjor.haxemine.client.view.SearchPanel = function() { }
$hxClasses["org.jinjor.haxemine.client.view.SearchPanel"] = org.jinjor.haxemine.client.view.SearchPanel;
org.jinjor.haxemine.client.view.SearchPanel.__name__ = ["org","jinjor","haxemine","client","view","SearchPanel"];
org.jinjor.haxemine.client.view.TaskListView = function() { }
$hxClasses["org.jinjor.haxemine.client.view.TaskListView"] = org.jinjor.haxemine.client.view.TaskListView;
org.jinjor.haxemine.client.view.TaskListView.__name__ = ["org","jinjor","haxemine","client","view","TaskListView"];
org.jinjor.haxemine.client.view.TaskView = function() { }
$hxClasses["org.jinjor.haxemine.client.view.TaskView"] = org.jinjor.haxemine.client.view.TaskView;
org.jinjor.haxemine.client.view.TaskView.__name__ = ["org","jinjor","haxemine","client","view","TaskView"];
org.jinjor.haxemine.messages.SocketMessage = function(socket,key) {
	var _g = this;
	console.log(socket);
	this.funcs = new haxe.ds.StringMap();
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
	__class__: org.jinjor.haxemine.messages.SocketMessage
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
org.jinjor.haxemine.messages.AllHaxeFilesM = function(socket) {
	org.jinjor.haxemine.messages.SocketMessage.call(this,socket,"search");
};
$hxClasses["org.jinjor.haxemine.messages.AllHaxeFilesM"] = org.jinjor.haxemine.messages.AllHaxeFilesM;
org.jinjor.haxemine.messages.AllHaxeFilesM.__name__ = ["org","jinjor","haxemine","messages","AllHaxeFilesM"];
org.jinjor.haxemine.messages.AllHaxeFilesM.__super__ = org.jinjor.haxemine.messages.SocketMessage;
org.jinjor.haxemine.messages.AllHaxeFilesM.prototype = $extend(org.jinjor.haxemine.messages.SocketMessage.prototype,{
	__class__: org.jinjor.haxemine.messages.AllHaxeFilesM
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
org.jinjor.haxemine.messages.SaveM = function(socket) {
	org.jinjor.haxemine.messages.SocketMessage.call(this,socket,"save");
};
$hxClasses["org.jinjor.haxemine.messages.SaveM"] = org.jinjor.haxemine.messages.SaveM;
org.jinjor.haxemine.messages.SaveM.__name__ = ["org","jinjor","haxemine","messages","SaveM"];
org.jinjor.haxemine.messages.SaveM.__super__ = org.jinjor.haxemine.messages.SocketMessage;
org.jinjor.haxemine.messages.SaveM.prototype = $extend(org.jinjor.haxemine.messages.SocketMessage.prototype,{
	__class__: org.jinjor.haxemine.messages.SaveM
});
org.jinjor.haxemine.messages.DoTaskM = function(socket) {
	org.jinjor.haxemine.messages.SocketMessage.call(this,socket,"doTask");
};
$hxClasses["org.jinjor.haxemine.messages.DoTaskM"] = org.jinjor.haxemine.messages.DoTaskM;
org.jinjor.haxemine.messages.DoTaskM.__name__ = ["org","jinjor","haxemine","messages","DoTaskM"];
org.jinjor.haxemine.messages.DoTaskM.__super__ = org.jinjor.haxemine.messages.SocketMessage;
org.jinjor.haxemine.messages.DoTaskM.prototype = $extend(org.jinjor.haxemine.messages.SocketMessage.prototype,{
	__class__: org.jinjor.haxemine.messages.DoTaskM
});
org.jinjor.haxemine.messages.TaskProgressM = function(socket) {
	org.jinjor.haxemine.messages.SocketMessage.call(this,socket,"taskProgress");
};
$hxClasses["org.jinjor.haxemine.messages.TaskProgressM"] = org.jinjor.haxemine.messages.TaskProgressM;
org.jinjor.haxemine.messages.TaskProgressM.__name__ = ["org","jinjor","haxemine","messages","TaskProgressM"];
org.jinjor.haxemine.messages.TaskProgressM.__super__ = org.jinjor.haxemine.messages.SocketMessage;
org.jinjor.haxemine.messages.TaskProgressM.prototype = $extend(org.jinjor.haxemine.messages.SocketMessage.prototype,{
	__class__: org.jinjor.haxemine.messages.TaskProgressM
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
org.jinjor.util = {}
org.jinjor.util.Event = function() {
	this.events = new haxe.ds.StringMap();
};
$hxClasses["org.jinjor.util.Event"] = org.jinjor.util.Event;
org.jinjor.util.Event.__name__ = ["org","jinjor","util","Event"];
org.jinjor.util.Event.prototype = {
	pub: function(arg) {
		var $it0 = this.events.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			(this.events.get(key))(arg);
		}
	}
	,sub: function(key,f) {
		this.events.set(key,f);
	}
	,__class__: org.jinjor.util.Event
}
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
	__class__: org.jinjor.haxemine.messages.SourceFile
}
org.jinjor.haxemine.messages.HistoryArray = function(max,equals) {
	this.array = [];
	this.max = max;
	this.equals = equals;
	this.cursor = 0;
};
$hxClasses["org.jinjor.haxemine.messages.HistoryArray"] = org.jinjor.haxemine.messages.HistoryArray;
org.jinjor.haxemine.messages.HistoryArray.__name__ = ["org","jinjor","haxemine","messages","HistoryArray"];
org.jinjor.haxemine.messages.HistoryArray.prototype = {
	getCursored: function() {
		return this.array.length <= 0?null:this.array[this.cursor];
	}
	,add: function(elm) {
		var i = 0;
		while(i < this.array.length) {
			if(this.equals(this.array[i],elm)) {
				this.array.splice(i,1);
				break;
			}
			i++;
		}
		this.array.unshift(elm);
		i = this.array.length - 1;
		while(i > this.max) this.array.pop();
		this.cursor = 0;
		try {
		} catch( e ) {
		}
	}
	,cursorToNewer: function() {
		if(0 < this.cursor) {
			this.cursor = this.cursor - 1;
			return true;
		}
		return false;
	}
	,cursorToOlder: function() {
		if(this.cursor < this.array.length - 1 && this.cursor < this.max - 1) {
			this.cursor = this.cursor + 1;
			return true;
		}
		return false;
	}
	,__class__: org.jinjor.haxemine.messages.HistoryArray
}
org.jinjor.util.Event2 = function() {
	this.events = [];
};
$hxClasses["org.jinjor.util.Event2"] = org.jinjor.util.Event2;
org.jinjor.util.Event2.__name__ = ["org","jinjor","util","Event2"];
org.jinjor.util.Event2.prototype = {
	pub: function(a,b) {
		Lambda.foreach(this.events,function(f) {
			f(a,b);
			return true;
		});
	}
	,sub: function(f) {
		this.events.push(f);
	}
	,__class__: org.jinjor.util.Event2
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
org.jinjor.haxemine.client.view.View = function() { }
$hxClasses["org.jinjor.haxemine.client.view.View"] = org.jinjor.haxemine.client.view.View;
org.jinjor.haxemine.client.view.View.__name__ = ["org","jinjor","haxemine","client","view","View"];
org.jinjor.haxemine.client.view.ViewPanel = function() { }
$hxClasses["org.jinjor.haxemine.client.view.ViewPanel"] = org.jinjor.haxemine.client.view.ViewPanel;
org.jinjor.haxemine.client.view.ViewPanel.__name__ = ["org","jinjor","haxemine","client","view","ViewPanel"];
org.jinjor.haxemine.messages.AllMessages = function(socket) {
	this.doTaskM = new org.jinjor.haxemine.messages.DoTaskM(socket);
	this.taskProgressM = new org.jinjor.haxemine.messages.TaskProgressM(socket);
	this.searchM = new org.jinjor.haxemine.messages.SearchM(socket);
	this.searchResultM = new org.jinjor.haxemine.messages.SearchResultM(socket);
};
$hxClasses["org.jinjor.haxemine.messages.AllMessages"] = org.jinjor.haxemine.messages.AllMessages;
org.jinjor.haxemine.messages.AllMessages.__name__ = ["org","jinjor","haxemine","messages","AllMessages"];
org.jinjor.haxemine.messages.AllMessages.prototype = {
	__class__: org.jinjor.haxemine.messages.AllMessages
}
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
	__class__: org.jinjor.haxemine.messages.CompileError
}
org.jinjor.haxemine.messages.FileDetail = function(text,mode) {
	this.text = text;
	this.mode = mode;
};
$hxClasses["org.jinjor.haxemine.messages.FileDetail"] = org.jinjor.haxemine.messages.FileDetail;
org.jinjor.haxemine.messages.FileDetail.__name__ = ["org","jinjor","haxemine","messages","FileDetail"];
org.jinjor.haxemine.messages.FileDetail.prototype = {
	__class__: org.jinjor.haxemine.messages.FileDetail
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
	__class__: org.jinjor.haxemine.messages.InitialInfoDto
}
org.jinjor.haxemine.messages.SearchResult = function(fileName,row,message) {
	this.fileName = fileName;
	this.row = row;
	this.message = message;
};
$hxClasses["org.jinjor.haxemine.messages.SearchResult"] = org.jinjor.haxemine.messages.SearchResult;
org.jinjor.haxemine.messages.SearchResult.__name__ = ["org","jinjor","haxemine","messages","SearchResult"];
org.jinjor.haxemine.messages.SearchResult.prototype = {
	__class__: org.jinjor.haxemine.messages.SearchResult
}
org.jinjor.haxemine.messages.TaskInfo = function(taskName,content,auto) {
	this.taskName = taskName;
	this.content = content;
	this.auto = auto;
};
$hxClasses["org.jinjor.haxemine.messages.TaskInfo"] = org.jinjor.haxemine.messages.TaskInfo;
org.jinjor.haxemine.messages.TaskInfo.__name__ = ["org","jinjor","haxemine","messages","TaskInfo"];
org.jinjor.haxemine.messages.TaskInfo.prototype = {
	__class__: org.jinjor.haxemine.messages.TaskInfo
}
org.jinjor.haxemine.messages.TaskProgress = function(taskName,compileErrors) {
	this.taskName = taskName;
	this.compileErrors = compileErrors;
};
$hxClasses["org.jinjor.haxemine.messages.TaskProgress"] = org.jinjor.haxemine.messages.TaskProgress;
org.jinjor.haxemine.messages.TaskProgress.__name__ = ["org","jinjor","haxemine","messages","TaskProgress"];
org.jinjor.haxemine.messages.TaskProgress.prototype = {
	__class__: org.jinjor.haxemine.messages.TaskProgress
}
org.jinjor.haxemine.server = {}
org.jinjor.haxemine.server.Mode = $hxClasses["org.jinjor.haxemine.server.Mode"] = { __ename__ : ["org","jinjor","haxemine","server","Mode"], __constructs__ : ["TypeScript","Haxe"] }
org.jinjor.haxemine.server.Mode.TypeScript = ["TypeScript",0];
org.jinjor.haxemine.server.Mode.TypeScript.toString = $estr;
org.jinjor.haxemine.server.Mode.TypeScript.__enum__ = org.jinjor.haxemine.server.Mode;
org.jinjor.haxemine.server.Mode.Haxe = ["Haxe",1];
org.jinjor.haxemine.server.Mode.Haxe.toString = $estr;
org.jinjor.haxemine.server.Mode.Haxe.__enum__ = org.jinjor.haxemine.server.Mode;
org.jinjor.util.ClientUtil = function() { }
$hxClasses["org.jinjor.util.ClientUtil"] = org.jinjor.util.ClientUtil;
org.jinjor.util.ClientUtil.__name__ = ["org","jinjor","util","ClientUtil"];
org.jinjor.util.ClientUtil.fixedSubmit = function(jquery,f) {
	eval("\r\n            jquery.submit(function(){\r\n                f($(this));\r\n                return false;\r\n            });\r\n        ");
	return jquery;
}
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
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
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
var q = window.jQuery;
js.JQuery = q;
console.log("HaxemineModule");
org.jinjor.haxemine.client.HaxemineModule.module = angular.module("haxemine",[]);
org.jinjor.haxemine.client.HaxemineModule.module.directive("aceeditor",function() {
	return { restrict : "E", replace : true, scope : { session : "="}, template : org.jinjor.haxemine.client.view.AceEditorView.template, link : org.jinjor.haxemine.client.view.AceEditorView.link};
});
org.jinjor.haxemine.client.HaxemineModule.module.directive("compileerror",function() {
	return { restrict : "E", replace : true, scope : { session : "="}, template : org.jinjor.haxemine.client.view.CompileErrorPanel.template, link : function(scope,element,attrs) {
		scope.c = function(session,error) {
			var file = session.getAllFiles().get(error.path);
			var row = error.row;
			session.selectNextFile(file,row);
		};
	}};
});
org.jinjor.haxemine.client.HaxemineModule.module.directive("fileselector",function() {
	return { restrict : "E", replace : true, scope : { session : "="}, template : org.jinjor.haxemine.client.view.FileSelector.template, link : function(scope,element,attrs) {
	}};
});
org.jinjor.haxemine.client.HaxemineModule.module.directive("folder",function() {
	return { restrict : "E", replace : true, scope : { session : "=", dir : "="}, template : org.jinjor.haxemine.client.view.Folder.template, link : function(scope,element,attrs) {
		scope.c = function(session,path) {
			var file = session.getAllFiles().get(path);
			session.selectNextFile(file,null);
		};
		scope.d = function(session,path) {
			var guessedPackage = path.replace("/",".");
			var classPath = js.Browser.window.prompt("create new class",guessedPackage + ".");
			if(classPath != null) {
				var splittedClass = classPath.split(".");
				var className = splittedClass[splittedClass.length - 1];
				if(className == "") js.Lib.alert("invalid name"); else {
					var text = "package " + classPath.substring(0,classPath.length - className.length - 1) + ";\r\n\r\nclass " + className + " {\r\n\r\n    public function new() {\r\n        \r\n    }\r\n}";
					org.jinjor.haxemine.client.view.Folder.saveNewFile(session.saveM,session,"" + Std.string(path) + "/" + className + ".hx",text);
				}
			}
		};
		scope.change = function(open) {
			scope.open = open;
		};
		scope.a = function(session,file) {
			session.selectNextFile(file);
		};
	}};
});
org.jinjor.haxemine.client.HaxemineModule.module.directive("menu",function() {
	return { restrict : "E", replace : true, scope : { session : "="}, template : org.jinjor.haxemine.client.view.Menu.template, link : function(scope,element,attrs) {
	}};
});
org.jinjor.haxemine.client.HaxemineModule.module.directive("search",function() {
	return { restrict : "E", replace : true, scope : { session : "="}, template : org.jinjor.haxemine.client.view.SearchPanel.template, link : function(scope,element,attrs) {
		scope.a = function(session,result) {
			var file = session.getAllFiles().get(result.fileName);
			session.selectNextFile(file,result.row);
		};
		scope.s = function(session,word) {
			session.search(word);
		};
	}};
});
org.jinjor.haxemine.client.HaxemineModule.module.directive("tasklist",function() {
	return { restrict : "E", replace : true, scope : { session : "="}, template : org.jinjor.haxemine.client.view.TaskListView.template, link : function(scope,element,attrs) {
	}};
});
org.jinjor.haxemine.client.HaxemineModule.module.directive("task",function() {
	return { restrict : "E", replace : true, scope : { session : "=", task : "="}, template : org.jinjor.haxemine.client.view.TaskView.template, link : function(scope,element,attrs) {
		scope.c = function(session,task) {
			return (function($this) {
				var $r;
				switch( (task.state)[1] ) {
				case 0:
					$r = "";
					break;
				case 4:
					$r = "";
					break;
				case 1:
					$r = "success";
					break;
				case 2:
					$r = "failed";
					break;
				case 3:
					$r = "ready";
					break;
				}
				return $r;
			}(this));
		};
		scope.cl = function(session,task) {
			if(task.state == org.jinjor.haxemine.client.TaskModelState.READY) {
				task.setState(org.jinjor.haxemine.client.TaskModelState.WAITING);
				session.doTask(task.name);
			}
		};
	}};
});
var template = "\r\n<div>\r\n    <menu session=\"session\"></menu>\r\n    <fileselector session=\"session\"></fileselector>\r\n    <div id=\"right\">\r\n        <aceeditor session=\"session\"></aceeditor>\r\n        <hr/>\r\n        <viewpanel session=\"session\"></viewpanel>\r\n    </div>\r\n</div>\r\n        ";
console.log("View");
org.jinjor.haxemine.client.HaxemineModule.module.directive("haxemine",function() {
	return { restrict : "E", replace : true, template : template, link : function(scope,element,attrs) {
		scope.ace = ace;
		scope.socket = io.connect("/");
		scope.session = new org.jinjor.haxemine.client.Session(new org.jinjor.haxemine.client.HaxemineSocket(scope.socket,scope));
	}};
});
org.jinjor.haxemine.client.HaxemineModule.module.directive("viewpanel",function() {
	return { restrict : "E", replace : true, scope : { session : "="}, template : org.jinjor.haxemine.client.view.ViewPanel.template, link : function(scope,element,attrs) {
		var selected = "tasks";
		scope.t = function(name) {
			selected = name;
		};
		scope.selected = function(name) {
			return selected == name?"selected":"";
		};
	}};
});
haxe.Serializer.USE_CACHE = false;
haxe.Serializer.USE_ENUM_INDEX = false;
haxe.Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.ds.ObjectMap.count = 0;
js.Browser.window = typeof window != "undefined" ? window : null;
org.jinjor.haxemine.client.view.AceEditorView.template = "\r\n<div id=\"editor\" reset=\"reset(session)\"/></div>\r\n    ";
org.jinjor.haxemine.client.view.CompileErrorPanel.template = "\r\n<div id=\"compile-error-panel\"/>\r\n    <tasklist session=\"session\"></tasklist>\r\n    <div id=\"compile-errors\">\r\n        <ul>\r\n            <li ng-repeat=\"error in session.getCompileErrors()\">\r\n                <a ng-click=\"c(session, error)\">{{error.originalMessage}}</a>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n</div>\r\n    ";
org.jinjor.haxemine.client.view.FileSelector.template = "\r\n<div id=\"all-haxe-files\">\r\n        <folder session=\"session\" dir=\"dir\" ng-repeat=\"dir in session.dirs\"></folder>\r\n</div>\r\n";
org.jinjor.haxemine.client.view.Folder.template = "\r\n<div class=\"folder\">\r\n    <div>\r\n        <div ng-show=\"open\" class=\"closeMark\" ng-click=\"change(false)\">-</div>\r\n        <div ng-hide=\"open\" class=\"openMark\" ng-click=\"change(true)\">+</div>\r\n        <label class=\"file_selector_dir\">{{dir.name}}</label>\r\n    </div>\r\n    <div ng-show=\"open\">\r\n        <ul>\r\n            <li ng-repeat=\"file in dir.files\">\r\n                <a ng-click=\"c(session, file.pathFromProjectRoot)\">{{file.shortName}}</a>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n</div>\r\n    ";
org.jinjor.haxemine.client.view.Menu.template = "\r\n<nav id=\"menu\">{{session.connected.fds}}\r\n    <label ng-show=\"session.connected\"><!--{{session.projectRoot}}-->Haxemine</label>\r\n    <label ng-show=\"!session.connected\" class=\"disconnected\">Disconnected</label>\r\n</nav>\r\n    ";
org.jinjor.haxemine.client.view.SearchPanel.template = "\r\n<div>\r\n    <form ng-submit=\"s(session, word)\" ng-disabled=\"session.searchWaiting\">\r\n        <input type=\"text\" ng-model=\"word\">\r\n        <input type=\"submit\" value=\"Search\">\r\n    </form>\r\n    <div>\r\n        <div ng-repeat=\"result in session.searchResults\">\r\n            <a ng-click=\"a(session, result)\">{{result.message}}</a>\r\n        </div>\r\n    </div>\r\n</div>\r\n    ";
org.jinjor.haxemine.client.view.TaskListView.template = "\r\n<div id=\"task-list-view\">\r\n    <task session=\"session\" task=\"task\" ng-repeat=\"task in session.tasks\"></task>\r\n</div>\r\n    ";
org.jinjor.haxemine.client.view.TaskView.template = "\r\n<div class=\"task-view {{c(session, task)}}\" title=\"{{task.content}}\" ng-click=\"cl(session, task)\">\r\n    {{task.name}}\r\n</div>\r\n    ";
org.jinjor.haxemine.client.view.ViewPanel.template = "\r\n<div id=\"view_panel\">\r\n    <div id=\"tabsContainer\" >\r\n        <span class=\"view-tab {{selected('tasks')}}\" ng-click=\"t('tasks')\">Tasks</span>\r\n        <span class=\"view-tab {{selected('search')}}\" ng-click=\"t('search')\">Search</span>\r\n    </div>\r\n    <div id=\"panelsContainer\">\r\n        <div ng-show=\"selected('tasks')\">\r\n            <tasklist session=\"session\"></tasklist>\r\n        </div>\r\n        <div ng-show=\"selected('search')\">\r\n            <search session=\"session\"></search>\r\n        </div>\r\n    </div>\r\n</div>\r\n    ";
org.jinjor.haxemine.client.Main.main();
})();

//@ sourceMappingURL=haxemine.js.map