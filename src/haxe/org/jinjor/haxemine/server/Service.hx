package org.jinjor.haxemine.server;

import js.Node;
import org.jinjor.haxemine.messages.SearchResult;
import org.jinjor.haxemine.messages.FileDetail;
import org.jinjor.haxemine.messages.SourceFile;
import org.jinjor.haxemine.messages.TaskProgress;
import org.jinjor.haxemine.messages.CompileError;
import org.jinjor.haxemine.messages.SaveM;
import org.jinjor.haxemine.messages.AllHaxeFilesM;
import org.jinjor.haxemine.messages.TaskProgressM;

using Lambda;
using StringTools;
using org.jinjor.util.Util;


class Service {
    
    static var fs  : Dynamic    = Node.require('fs');
    static var childProcess : Dynamic = Node.require('child_process');
    static var async : Dynamic = Node.require('async');
    static var path : Dynamic = Node.require('path');

    private function new() {
    }
    private static function getPostfix(mode : Mode){
        return switch(mode){
            case TypeScript : '.ts';
            case Haxe : '.hx';
        }
    }
    
    public static function save(mode: Mode, projectRoot : String, data, allHaxeFilesM : AllHaxeFilesM, socket:Dynamic){
        var _path = '$projectRoot/${data.fileName}';
        var isNew = !path.existsSync(_path);
        saveToSrc(fs, _path, data.text);
        if(isNew){
            getAllFiles(projectRoot, mode, function(err, files){
                if(err != null){
                    trace(err);
                    throw err;
                }
                allHaxeFilesM.pub(files);
            });
        }
        socket.emit('stdout', 'saved');
    }
    
    public static function doTask(conf : HaxemineConfig, projectRoot, socket, taskProgressM : TaskProgressM, taskName : String){
        var tasks = conf.hxml.filter(function(hxml){
            return hxml.path == taskName;
        }).map(function(hxml){
            var task = createCompileHaxeTask(socket, taskProgressM, projectRoot, hxml.path);
            return task;
        });
        async.series(tasks, function(){});
    }
          
    public static function doAutoTasks(conf : HaxemineConfig, projectRoot, socket, taskProgressM : TaskProgressM){
        var tasks : Array<Dynamic -> Void> = if(conf.mode == 'typescript'){
            conf.commands.filter(function(command){
                return command.auto != null && command.auto;
            }).map(function(command){
                var task = createCompileTypeScriptTask(socket, taskProgressM, projectRoot, 'typescript_beta', command.command);
                return task;
            });
        }else{
            conf.hxml.filter(function(hxml){
                return hxml.auto != null && hxml.auto;
            }).map(function(hxml){
                var task = createCompileHaxeTask(socket, taskProgressM, projectRoot, hxml.path);
                return task;
            });
        }

        //tasks.push(createRunJasmineTask());
        async.series(tasks, function(){});
    }
    
    public static function searchWord(word : String, mode:Mode, cb : Dynamic -> Array<SearchResult> -> Void) {
        if(!OS.isWin()){
            throw 'search unsupported .';
        }else{
            var command = 'findstr /N /S $word *${getPostfix(mode)}';
            Console.print(command);
            childProcess.exec(command, function(err, stdout:String, stderr){
                if(err != null){
                    cb(null, []);
                }else{
                    var messages = stdout.split('\n');
                    var results = messages.filter(function(message){
                        return message != '';
                    }).map(function(message){
                        trace(message);
                        var fileName = message.split(':')[0].replace('\\', '/');
                        var row = Std.parseInt(message.split(':')[1]);
                        return new SearchResult(fileName, row, message);
                    });
                    cb(null, results);
                }
            });
        }
    }
    
    public static function findFromSrc(fileName : String) : FileDetail {
      //untyped console.log(fileName);
      var editorMode = if(fileName.endsWith('.ts')){
          'typescript';
      }else{
          'haxe';
      }
      return new FileDetail(fs.readFileSync(fileName, "utf8"), editorMode);
    }
    public static function saveToSrc(fs, fileName, text){
        fs.writeFileSync(fileName, text, "utf8");
    }
    
    private static function createCompileTypeScriptTask(socket, taskProgressM : TaskProgressM, projectRoot, name, command){
      return function(callBack){
        compileTypeScript(socket, taskProgressM, projectRoot, name, command, callBack);
      };
    }
    private static function createCompileHaxeTask(socket, taskProgressM : TaskProgressM, projectRoot, hxmlPath){
      return function(callBack){
        compileHaxe(socket, taskProgressM, projectRoot, hxmlPath, callBack);
      };
    }
    private static function compileTypeScript(socket, taskProgressM : TaskProgressM, projectRoot : String, name, command, callBack){
      compile(Mode.TypeScript, socket, taskProgressM, projectRoot, name, command, callBack);//TODO
    }
    private static function compileHaxe(socket, taskProgressM : TaskProgressM, projectRoot : String, hxmlPath, callBack){
      compile(Mode.Haxe, socket, taskProgressM, projectRoot, hxmlPath, 'haxe $hxmlPath', callBack);
    }
    
    private static function compile(mode:Mode, socket, taskProgressM : TaskProgressM, projectRoot : String, taskName, command, callBack){
      Console.print('cwt:$projectRoot');
      childProcess.exec(command, {
        cwd: projectRoot
      },function(err, stdout, stderr){
          if(err != null){
             Console.print(stderr, command);
             Console.print('$err', 'err');
             Console.print(stdout, 'stdout');
          }
        socket.emit('stdout', stdout);
        
        var compileErrors = if(err != null){
            var msg = stderr;
            
            var messages = msg.split('\n');
            var compileErrors = messages.filter(function(message){
                return message != '';
            }).map(function(message){
                if(message.startsWith('./')){
                    message = message.substring('./'.length);
                }
                return new CompileError(message, mode);
            });
            compileErrors;
        }else{
            [];
        }
        taskProgressM.pub(new TaskProgress(taskName, compileErrors));
        callBack(err);
      });
    }
    
    
    private static function createRunJasmineTask(){//FIXME config may be required
      return function(_callBack){
        runJasmine(_callBack);
      };
    }
    
    private static function runJasmine(_callBack){//FIXME
        childProcess.exec('phantomjs.exe run.js', function(err, stdout:String, stderr){
            if(err != null){
                Console.print(err, 'phantom err');
            }
            Console.print(stdout, 'phantom 1');
            Console.print(stderr, 'phantom 2');
            
            _callBack(err);
        });
    }
    
    //---------------------------

    
    
    public static function getAllFiles(projectRoot : String, mode: Mode,
        _callback : Dynamic -> Map<String, SourceFile> -> Void){
        var filter = function(item : String){
            return item.endsWith(getPostfix(mode));
        };
        FileUtil.getAllMatchedFiles(projectRoot, filter, function(err, filePaths){
            if(err != null){
                _callback(err, null);
            }else{
                var files = new Map<String, SourceFile>();
                filePaths.foreach(function(f){
                    files.set(f, new SourceFile(f));
                    return true;
                });
                _callback(null, files);
            }
        });
    }
    
    

}