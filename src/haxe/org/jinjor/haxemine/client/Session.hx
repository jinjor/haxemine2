package org.jinjor.haxemine.client;

import js.Lib;
import org.jinjor.haxemine.messages.CompileError;
import org.jinjor.haxemine.messages.SourceFile;
import org.jinjor.haxemine.messages.HistoryArray;
import org.jinjor.haxemine.messages.FileDetail;
import org.jinjor.haxemine.messages.SaveFileDto;
import org.jinjor.haxemine.messages.InitialInfoDto;
import org.jinjor.haxemine.messages.TaskProgress;

import org.jinjor.haxemine.messages.SaveM;
import org.jinjor.haxemine.messages.InitialInfoM;
import org.jinjor.haxemine.messages.AllHaxeFilesM;
import org.jinjor.haxemine.messages.DoTaskM;
import org.jinjor.haxemine.messages.DoTasksM;
import org.jinjor.haxemine.messages.TaskProgressM;

import org.jinjor.haxemine.server.Mode;


using Lambda;
using org.jinjor.util.Util;
import org.jinjor.util.Event;
import org.jinjor.util.Event2;

class Session {

    public var socket : HaxemineSocket;

    public var editingFiles : HistoryArray<SourceFile>;
    public var allFiles : Hash<SourceFile>;
    public var fileToLoad : SourceFile;
    public var lastTaskProgress : TaskProgress;
    public var tasks : Array<TaskModel>;
    public var langMode : Mode;
    public var connected : Bool;
    public var editingFile : SourceFile;
    public var editingLine : Int;
    
    public var compileErrors : Array<CompileError>;
    public var searchResults : Array<Dynamic>;
    
    private var onSocketConnected : Event<Void>;
    private var onSocketDisconnected : Event<Void>;
    private var onInitialInfoReceived : Event<InitialInfoDto>;
    private var onAllFilesChanged : Event<Void>;
    private var onLastTaskProgressChanged : Event<Void>;
    private var onSave : Event<Void>;
    private var onSelectView : Event<String>;
    private var onEditingFileChange : Event2<SourceFile, Int>;
    
    var saveM : SaveM;
    
    public function new(socket:HaxemineSocket){
        saveM = new SaveM(socket);
        compileErrors = [];
        searchResults = null;
        
        var that = this;
        this.socket = socket;
        var initialInfoM = new InitialInfoM(socket);
        var allHaxeFilesM = new AllHaxeFilesM(socket);
        var doTasksM = new DoTasksM(socket);
        var taskProgressM = new TaskProgressM(socket);
        
        socket.on('stdout', function(msg : Dynamic) {
            if(msg != ''){
                trace(msg);//View
            }
        });
        allHaxeFilesM.sub('Session.new', function(files) {
            setAllFiles(files);
        });
        initialInfoM.sub('Session.new', function(initialInfo) {
            onInitialInfoReceived.pub(initialInfo);
            setAllFiles(initialInfo.allFiles);
        });
        taskProgressM.sub('Session.new', function(taskProgress) {//TODO ここじゃない
            that.lastTaskProgress = taskProgress;
            onLastTaskProgressChanged.pub(null);
        });
        socket.on('connect', function(_) {
            trace("connected.");//View
            connected = true;
        });
        socket.on('disconnect', function(_){
            trace("disconnected.");//View
            connected = false;
        });
        this.editingFiles = new HistoryArray<SourceFile>(10, SourceFile.equals);
        this.allFiles = new Hash();
        
        this.onSocketConnected = new Event();
        this.onSocketDisconnected = new Event();
        this.onInitialInfoReceived = new Event();
        this.onAllFilesChanged = new Event();
        this.onLastTaskProgressChanged = new Event();
        this.onSave = new Event();
        this.onSelectView = new Event();
        this.onEditingFileChange = new Event2();
        
        this.onSocketConnected.sub('Session.new', function(_){
            doTasksM.pub(null);
        });
        
        this.onInitialInfoReceived.sub('TaskListView.new', function(info : InitialInfoDto) {
            this.tasks = info.taskInfos.map(function(taskInfo) {
                return new TaskModel(taskInfo.taskName, taskInfo.content, taskInfo.auto, taskProgressM);
            }).array();
        });
        this.onSave.sub('TaskView.new.${task.name}', function(_) {
            for(task in tasks){
                task.reset();
            }
            js.Lib.eval('scope.$apply()');
        });
    }
    
    public function save(text) {
        this.saveM.pub(new SaveFileDto(getCurrentFile().pathFromProjectRoot, text));
    }
    
    public function search(word) {
        this.searchResults = null;
        this.searchResults = [];//TODO
    }
    public function doTask(word) {
    }

    public function getCompileErrors() : Array<CompileError> {
        return if(lastTaskProgress != null) lastTaskProgress.compileErrors else [];
    }
    

    private function setAllFiles(allFiles : Hash<SourceFile>){
        this.allFiles = allFiles;
        this.onAllFilesChanged.pub(null);
    }
    public function getAllFiles() : Hash<SourceFile>{
        return allFiles;
    }
    

    public function getCurrentFile() : SourceFile {
        return editingFiles.getCursored();
    }
    public function selectNextFile(file: SourceFile, optLine : Int) {
        if(file == null){
            return;
        }
        editingFiles.add(file);
        onEditingFileChange.pub(file, optLine);
    }
    public function selectOlderFile() {
        if(editingFiles.cursorToOlder()){
            onEditingFileChange.pub(editingFiles.getCursored(), null);
        }
    }
    public function selectNewerFile() {
        if(editingFiles.cursorToNewer()){
            onEditingFileChange.pub(editingFiles.getCursored(), null);
        }
    }

    public function getCompileErrorsByFile(file : SourceFile) : List<CompileError> {
        if(file == null){
            return new List();
        }
        return getCompileErrors().filter(function(error){
            return error.originalMessage.indexOf(file.pathFromProjectRoot) == 0
            || error.originalMessage.indexOf('./' + file.pathFromProjectRoot) == 0;
        });
    }
    
}