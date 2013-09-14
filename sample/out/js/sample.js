(function () { "use strict";
var org = {}
org.jinjor = {}
org.jinjor.haxeminesample = {}
org.jinjor.haxeminesample.Main = function() { }
org.jinjor.haxeminesample.Main.main = function() {
	console.log("Hello.");
	org.jinjor.haxeminesample.Main.sub();
	new org.jinjor.haxeminesample.util.Util3();
}
org.jinjor.haxeminesample.Main.sub = function() {
}
org.jinjor.haxeminesample.util = {}
org.jinjor.haxeminesample.util.Util = function() { }
org.jinjor.haxeminesample.util.Util.join = function(a,b) {
	if(a.charAt(a.length - 1) == "/" && b.charAt(0) == "/") return a + b.substring(1); else if(a.charAt(a.length - 1) != "/" && b.charAt(0) != "/") return a + "/" + b; else return a + b;
}
org.jinjor.haxeminesample.util.Util2 = function() { }
org.jinjor.haxeminesample.util.Util2.join = function(a,b) {
	if(a.charAt(a.length - 1) == "/" && b.charAt(0) == "/") return a + b.substring(1); else if(a.charAt(a.length - 1) != "/" && b.charAt(0) != "/") return a + "/" + b; else return a + b;
}
org.jinjor.haxeminesample.util.Util3 = function() {
};
org.jinjor.haxeminesample.Main.main();
})();

//@ sourceMappingURL=sample.js.map