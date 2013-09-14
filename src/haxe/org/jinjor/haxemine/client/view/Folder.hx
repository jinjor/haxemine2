package org.jinjor.haxemine.client.view;

import org.jinjor.haxemine.messages.SourceFile;
import js.Lib;
import js.Browser;

import org.jinjor.haxemine.messages.SourceFile;
import org.jinjor.haxemine.messages.SaveFileDto;
import org.jinjor.haxemine.messages.SaveM;
import org.jinjor.haxemine.client.view.Folder;

using StringTools;
using Lambda;
using org.jinjor.util.Util;

using Lambda;

class Folder {
    
    private static var template = '
<div class="folder">
    <div>
        <div ng-show="open" class="closeMark" ng-click="change(false)">-</div>
        <div ng-hide="open" class="openMark" ng-click="change(true)">+</div>
        <label class="file_selector_dir">{{dir.name}}</label>
    </div>
    <div ng-show="open">
        <ul>
            <li ng-repeat="file in dir.files">
                <a ng-click="c(session, file.pathFromProjectRoot)">{{file.shortName}}</a>
            </li>
        </ul>
    </div>
</div>
    ';
    
    static function __init__(){
        HaxemineModule.module.directive('folder', function(){
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    session: '=',
                    dir: '='
                },
                template: template,
                link: function(scope, element, attrs) {
                    scope.c = function(session : Session, path){
                        var file = session.getAllFiles().get(path);
                        session.selectNextFile(file, null);
                    };
                    scope.d = function(session : Session, path){
                        var guessedPackage = path.replace('/', '.');
                        var classPath = Browser.window.prompt("create new class", guessedPackage + '.');
                        if(classPath != null){
                            var splittedClass = classPath.split('.');
                            var className = splittedClass[splittedClass.length-1];
                            if(className == ''){
                                Lib.alert('invalid name');
                            }else{
                                var text =
'package ${classPath.substring(0, classPath.length - className.length - 1)};

class ${className} {

    public function new() {
        
    }
}';
                                saveNewFile(session.saveM, session, '$path/${className}.hx', text);
                            }
                        }
                    };
                    scope.change = function(open){
                        scope.open = open;
                    };
                    scope.a = function(session : Session, file : SourceFile){
                        session.selectNextFile(file);
                    };
                }
            }
        });
    }
    

    private static function hasCompileError(session : Session, file : SourceFile) : Bool{
        var found = false;
        session.getCompileErrors().foreach(function(error){
            if(session.getAllFiles().get(error.path) == file){
                found = true;
                return false;
            }
            return true;
        });
        return found;
    }
    
    private static function saveNewFile(saveM, session : Session, pathFromProjectRoot : String, text : String){
        var dup = false;
        for(file in session.getAllFiles()){
            if(file.pathFromProjectRoot == pathFromProjectRoot){
                dup = true;
                break;
            }
        }
        if(dup){
            Lib.alert(pathFromProjectRoot + ' already exists.');
        }else{
            saveM.pub(new SaveFileDto(pathFromProjectRoot, text));
        }
    }

}