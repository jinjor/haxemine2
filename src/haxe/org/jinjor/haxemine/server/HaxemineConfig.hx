package org.jinjor.haxemine.server;

typedef Hxml = {
    path : String,
    auto : Bool
}
typedef Command = {
    name : String,
    command : String,
    auto : Bool
}

class HaxemineConfig {
  public var port : Int;
  public var mode : String;
  public var hxml : Array<Hxml>;
  public var commands : Array<Command>;
  
  public function new(port, mode, hxml, commands){
      this.port = port;
      this.mode = mode;
      this.hxml = hxml;
      this.commands = commands;
  }
}