package org.jinjor.haxemine.client;

import org.jinjor.haxemine.messages.Socket;

class HaxemineSocket {
    
    private var socket : Dynamic;
    public var on : String -> (Dynamic -> Void) -> Void;
    public var emit : String -> Dynamic -> Void;

    public function new(socket: Socket, scope) {
        this.socket = socket;
        this.on = function(key, f){
            socket.on(key, function(data){
                f(data);
                untyped console.log('receive:' + key);
                js.Lib.eval('scope.$$apply()');
            });
        };
        this.emit = socket.emit;
    }

}