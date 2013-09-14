package org.jinjor.haxemine.client.view;

import org.jinjor.haxemine.messages.SaveFileDto;
import org.jinjor.haxemine.messages.SaveM;
import org.jinjor.haxemine.messages.FileDetail;


using Lambda;

class AceEditorView {
    
    private static var template = '
<div id="editor" reset="reset(session)"/></div>
    ';
    
    static function __init__(){
        HaxemineModule.module.directive('aceeditor', function(){
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    session: '=',
                },
                template: template,
                link: link
            }
        });
    }
    
    private static function link(scope : Dynamic, element, attrs) {
        var editor : Dynamic = untyped ace.edit('editor');
        editor.setTheme("ace/theme/eclipse");
        
        var firstTime = true;
        haxe.Timer.delay(function(){//TODO any smart way else?
            var session : Session = scope.session;
            scope.reset(session);
            session.onEditingFileChange.sub(function(file, line){//FIXME
                if(file == null){
                    return;
                }
                new FileDetailDao().getFile(file.pathFromProjectRoot, function(detail: FileDetail){
                    editor.getSession().setValue(detail.text);
                    editor.getSession().setMode('ace/mode/${detail.mode}');
                    annotateCompileError(editor, session);
                    if(line != null){
                        editor.gotoLine(line);
                    }
                    
                });
            });
        }, 0);
        
        scope.reset = function(session : Session){
            if(firstTime){
                editor.commands.addCommands([{
                    Name : "savefile",
                    bindKey: {
                        win : "Ctrl-S",
                        mac : "Command-S"
                    },
                    exec: function(editor : Dynamic) {
                        session.save(editor.getSession().getValue());
                    }
                },{//TODO Ctrl-Click
                    Name : "jumpToClass",
                    bindKey: {
                        win : "Ctrl-Q",
                        mac : "Command-Q"
                    },
                    exec: function(editor : Dynamic) {
                        var pos = editor.getCursorPosition();
                        var value : String = editor.getSession().getTokenAt(pos.row,pos.column).value;
                        var charCode = value.charCodeAt(0);
                        var startsWithUpper = charCode != null && 65 <= charCode && charCode <= 90;
                        if(!startsWithUpper){
                            return;
                        }
                        var filtered = session.getAllFiles().filter(function(file){
                            var name = file.shortName;
                            var splitted = name.split(switch(session.langMode){
                                case TypeScript: '.ts';
                                case Haxe: '.hx';
                            });
                            return splitted[0] == value;
                        }).array();
                        if(filtered.length == 1){
                            session.selectNextFile(filtered[0], null);
                        }else if(filtered.length > 1){
                            //TODO
                        }
                    }
                },{
                    Name : "toOlder",
                    bindKey: untyped {
                        win : "Alt-Left"
                    },
                    exec: function(editor : Dynamic) {
                        session.selectOlderFile();
                    }
                },{
                    Name : "toNewer",
                    bindKey: untyped {
                        win : "Alt-Right"
                    },
                    exec: function(editor : Dynamic) {
                        session.selectNewerFile();
                    }
                }]);
                firstTime = false;
            }
            
            session.onEditingFileChange.sub(function(file, line){
                new FileDetailDao().getFile(file.pathFromProjectRoot, function(detail: FileDetail){
                    editor.getSession().setValue(detail.text);
                    editor.getSession().setMode('ace/mode/${detail.mode}');
                    annotateCompileError(editor, session);
                    if(line != null){
                        editor.gotoLine(line);
                    }
                    
                });
            });
            session.onLastTaskProgressChanged.sub('AceEditorView.new', function(_){
                annotateCompileError(editor, session);
            });
        };
    }
    
    private static function annotateCompileError(editor, session : Session) {
        var annotations = session.getCompileErrorsByFile(session.getCurrentFile()).map(function(error){
            return {row:error.row-1, text: error.message, type:"error"};
        });
        editor.getSession().setAnnotations(annotations);
    }

}