package org.jinjor.haxemine.client;

class HaxemineSocket {
    
    public var on : String -> (Dynamic -> Void) -> Void;

    public function new(socket, scope) {
        this.on = function(key, f){
            socket.on(key, function(data){
                f(data);
                untyped console.log('receive:' + key);
                js.Lib.eval('scope.$apply()');
            });
        }
    }

}