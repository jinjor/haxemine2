package org.jinjor.haxemine.client;

class HaxemineModule {

    public static var module: Dynamic;
    static function __init__(){
        module = untyped angular.module('haxemine', []);
    }

}