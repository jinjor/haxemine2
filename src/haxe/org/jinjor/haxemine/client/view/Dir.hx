package org.jinjor.haxemine.client.view;

import org.jinjor.haxemine.messages.SourceFile;

class Dir {

    public var name : String;
    public var files : Array<SourceFile>;
    
    public function new(name){
        this.name = name;
        this.files = [];
    }

}