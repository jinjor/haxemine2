package org.jinjor.haxemine.client.view;

import js.Lib;
import org.jinjor.haxemine.messages.SourceFile;
import org.jinjor.haxemine.messages.SaveFileDto;
import org.jinjor.haxemine.messages.SaveM;
import org.jinjor.haxemine.client.view.Folder;

using StringTools;
using Lambda;
using org.jinjor.util.Util;

class FileSelector {
    
    static var template = '
<div id="all-haxe-files">
    <label class="file_selector_dir" ng-click"d(session, name)">{{name}}</label>
    <ul ng-repeat="dir in session.dirs">
    {{dir.name}}{{log(dir.name)}}
        <li ng-repeat="file in dir.files">
            <a ng-click="c(session, file.pathFromProjectRoot)">{{file.shortName}}</a>
        </li>
    </ul>
</div>
';
    
    static function __init__(){
        untyped console.log('FileSelector');
        untyped console.log(HaxemineModule.module);
        HaxemineModule.module.directive('fileselector', function(){
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    session: '='
                },
                template: template,
                link: function(scope, element, attrs) {
                    untyped console.log('0');
                    scope.log = function(f){
                        untyped console.log(f);
                    };
                    scope.c = function(session : Session, path){
                        untyped console.log('2');
                        var file = session.getAllFiles().get(path);
                        session.selectNextFile(file, null);
                    }
                    scope.d = function(session : Session, path){
                        untyped console.log('1');
                        
                        var guessedPackage = path.replace('/', '.');
                        var classPath = js.Lib.window.prompt("create new class", guessedPackage + '.');
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
                                saveNewFile(session.saveM, session, path + '/' + className + '.hx', text);
                            }
                        }
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




