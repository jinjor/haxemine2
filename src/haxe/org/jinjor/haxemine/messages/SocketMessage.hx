package org.jinjor.haxemine.messages;

import org.jinjor.haxemine.client.HaxemineSocket;

class SocketMessage<T> {
    
    public var pub : T -> Void;
    public var sub : String -> (T -> Void) -> Void;
    var funcs : Map<String, T -> Void>;
    
    public function new(socket : HaxemineSocket, key : String) {
        untyped console.log(socket);
        this.funcs = new Map();
        this.pub = function(data : T){
            socket.emit(key, haxe.Serializer.run(data));
        };
        this.sub = function(subKey : String, f : T -> Void){
            if(!funcs.exists(subKey)){
                funcs.set(subKey, f);
                socket.on(key, function(data){
                    f(haxe.Unserializer.run(data));
                });
            }
        };
        
    }

}