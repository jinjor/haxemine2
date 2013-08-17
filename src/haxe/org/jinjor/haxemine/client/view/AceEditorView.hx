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
                    session: '='
                },
                template: template,
                link: function(scope, element, attrs) {
                    var editor : Dynamic = untyped ace.edit('editor');
                    editor.setTheme("ace/theme/eclipse");
                    
                    var firstTime = true;
                    scope.reset = function(session : Session){
                        if(firstTime){
                            
                            editor.commands.addCommands([{
                                Name : "savefile",
                                bindKey: {
                                    win : "Ctrl-S",
                                    mac : "Command-S"
                                },
                                exec: function(editor) {
                                    session.save(editor.getSession().getValue());
                                }
                            },{//TODO Ctrl-Click
                                Name : "jumpToClass",
                                bindKey: {
                                    win : "Ctrl-Q",
                                    mac : "Command-Q"
                                },
                                exec: function(editor) {
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
                                bindKey: {
                                    win : "Alt-Left"
                                },
                                exec: function(editor) {
                                    session.selectOlderFile();
                                }
                            },{
                                Name : "toNewer",
                                bindKey: {
                                    win : "Alt-Right"
                                },
                                exec: function(editor) {
                                    session.selectNewerFile();
                                }
                            }]);
                            firstTime = false;
                        }
                        
                        annotateCompileError(editor, session);

                        new FileDetailDao().getFile(session.editingFile.pathFromProjectRoot, function(detail: FileDetail){
                            editor.getSession().setValue(detail.text);
                            editor.getSession().setMode("ace/mode/" + detail.mode);
                            annotateCompileError(editor, session);
                            if(session.editingLine != null){
                                editor.gotoLine(session.editingLine);
                            }
                        });
                        
                    }
                }
            }
        });
    }
    
    private static function annotateCompileError(editor, session : Session) {
        var annotations = session.getCompileErrorsByFile(session.getCurrentFile()).map(function(error){
            return {row:error.row-1, text: error.message, type:"error"};
        }).array();
        editor.getSession().setAnnotations(annotations);
        
    }

}