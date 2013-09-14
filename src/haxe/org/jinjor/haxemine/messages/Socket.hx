package org.jinjor.haxemine.messages;

extern class Socket {

    public function emit(key: String, data: String) : Void;
    public function on(key: String, f: Dynamic -> Void): Void;

}