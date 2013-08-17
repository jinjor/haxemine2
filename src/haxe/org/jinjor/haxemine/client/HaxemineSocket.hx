package org.jinjor.haxemine.client;

class HaxemineSocket {
    
    public var on : String -> (Dynamic -> Void) -> Void;

    public function new(socket, scope) {
        this.on = function(key, f){
            socket.on(key, function(data){
                f(data);
                js.Lib.eval('scope.$apply()');
            });
        }
    }

}