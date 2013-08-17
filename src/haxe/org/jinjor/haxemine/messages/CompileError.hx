package org.jinjor.haxemine.messages;

import org.jinjor.haxemine.server.Mode;

class CompileError {
    
    private static function parseHaxeCompileErrorMessage(message){
        var elms = message.split(':');
        trace(elms);        
        return {
          path: elms[0],
          row: Std.parseInt(elms[1]),
          message: elms[elms.length-1]
        };//TODO
    }
    private static function parseTypeScriptCompileErrorMessage(message: String){
        //C:/NodeJS/haxemine/ts-sample/src/views.ts (17,21): Expected ')'
        var elms = message.split(':');
        var r = ~/.*\(([0-9]+),([0-9]+)\):.*/;
        untyped console.log(r.match(message));
        
        return {
          path: elms[0],//FIXME
          row: Std.parseInt(r.matched(1)),
          column : Std.parseInt(r.matched(2)),
          message: elms[elms.length-1]
        };//TODO
    }
    
    public var originalMessage : String;
    public var path : String;
    public var row : Int;
    public var message : String;
    
    public function new(originalMessage, mode: Mode){
        this.originalMessage = originalMessage;
        var parsed = switch(mode){
            case TypeScript: parseTypeScriptCompileErrorMessage(originalMessage);
            case Haxe: parseHaxeCompileErrorMessage(originalMessage);
        }
        this.path = parsed.path;
        this.row = parsed.row;
        this.message = parsed.message;
    }
    
    
}