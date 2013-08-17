package org.jinjor.haxemine.client.view;

import js.Lib;
import org.jinjor.haxemine.messages.SourceFile;
import org.jinjor.haxemine.messages.SaveFileDto;
import org.jinjor.haxemine.messages.SaveM;

using StringTools;
using Lambda;
using org.jinjor.util.Util;

class FileSelector {
    
    static var template = '
<div id="all-haxe-files">
    <label class="file_selector_dir" ng-click"d(name)">{{name}}</label>
    <ul ng-repeat="dir in dirs()">
        <li ng-repeat="file in files">
            <a ng-click="c(file.pathFromProjectRoot)">{{file.shortName}}</a>
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
                    /*
                    
                    var session : Session = scope.session;
                    var saveM = new SaveM(scope.socket);
                    session.onAllFilesChanged.sub('FileSelector.new', function(_){
                        js.Lib.eval("scope.$apply()");
                    });
                    scope.dirs = function(){
                        var dirsHash = new Hash<Dir>();
                        var all : Hash<Dynamic> = session.getAllFiles();//
                        for(name in all.keys()){
                            var dirName = name.substring(0, name.lastIndexOf('/'));
                            var f = all.get(name);
                            if(dirsHash.exists(dirName)){
                                dirsHash.get(dirName).files.push(f);
                            }else{
                                var dir = new Dir(dirName);
                                dirsHash.set(dirName, dir);
                                dir.files.push(f);
                            }
                        }
                
                        var dirsArray : Array<Dir> = dirsHash.map(function(dir){
                            dir.files.sort(function(f1, f2){
                                return f1.shortName.compareTo(f2.shortName);
                            });
                            return dir;
                        }).array();
                        dirsArray.sort(function(d1, d2){
                            return d1.name.compareTo(d2.name);
                        });
                        return dirsArray;
                    };
                    scope.c = function(path){
                        var file = session.getAllFiles().get(path);
                        session.selectNextFile(file, null);
                    }
                    scope.d = function(path){
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
                                saveNewFile(saveM, session, path + '/' + className + '.hx', text);
                            }
                        }
                    };
                    */
                    
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

private class Dir {
    
    public var name : String;
    public var files : Array<SourceFile>;
    
    public function new(name){
        this.name = name;
        this.files = [];
    }
    
    
}


