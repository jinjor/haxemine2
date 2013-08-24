package org.jinjor.haxemine.client;

import js.Lib;
import org.jinjor.haxemine.messages.CompileError;
import org.jinjor.haxemine.messages.SourceFile;
import org.jinjor.haxemine.messages.HistoryArray;
import org.jinjor.haxemine.messages.FileDetail;
import org.jinjor.haxemine.messages.SaveFileDto;
import org.jinjor.haxemine.messages.InitialInfoDto;
import org.jinjor.haxemine.messages.TaskProgress;
import org.jinjor.haxemine.messages.SearchResult;

import org.jinjor.haxemine.messages.SaveM;
import org.jinjor.haxemine.messages.InitialInfoM;
import org.jinjor.haxemine.messages.AllHaxeFilesM;
import org.jinjor.haxemine.messages.DoTaskM;
import org.jinjor.haxemine.messages.DoTasksM;
import org.jinjor.haxemine.messages.TaskProgressM;
import org.jinjor.haxemine.messages.SearchM;
import org.jinjor.haxemine.messages.SearchResultM;

import org.jinjor.haxemine.server.Mode;

import org.jinjor.haxemine.client.view.Dir;//TODO



using Lambda;
using org.jinjor.util.Util;
import org.jinjor.util.Event;
import org.jinjor.util.Event2;

class Session {

    var socket : HaxemineSocket;
    var onSocketConnected : Event<Void>;
    var onSocketDisconnected : Event<Void>;
    var onInitialInfoReceived : Event<InitialInfoDto>;
    var onAllFilesChanged : Event<Void>;
    public var onLastTaskProgressChanged : Event<Void>;
    var onSave : Event<Void>;
    var onSelectView : Event<String>;
    
    public var onEditingFileChange : Event2<SourceFile, Int>;
    public var currentFileDetail : FileDetail;
    
    public var doTaskM :DoTaskM;
    public var taskProgressM : TaskProgressM;
    public var searchM : SearchM;
    public var saveM : SaveM;//TODO

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
    
    public var dirs :Array<Dir>;
    
    public function new(socket:HaxemineSocket){
        
        compileErrors = [];
        searchResults = [];
        dirs = [];
        
        var that = this;
        this.socket = socket;
        var initialInfoM = new InitialInfoM(socket);
        var allHaxeFilesM = new AllHaxeFilesM(socket);
        var doTasksM = new DoTasksM(socket);
        saveM = new SaveM(socket);
        doTaskM = new DoTaskM(socket);
        taskProgressM = new TaskProgressM(socket);
        searchM = new SearchM(socket.socket);
        
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
        });
        
        var searchResultM = new SearchResultM(socket);
        searchResultM.sub('SearchPanel.new', function(results : Array<SearchResult>){
            this.searchResults = results;
        });
    }
    
    public function save(text) {
        this.saveM.pub(new SaveFileDto(getCurrentFile().pathFromProjectRoot, text));
    }
    
    public function search(word) {
        searchM.pub(word);
        this.searchResults = null;
    }
    public function doTask(word) {
    }

    public function getCompileErrors() : Array<CompileError> {
        return if(lastTaskProgress != null) lastTaskProgress.compileErrors else [];
    }

    private function setAllFiles(allFiles : Hash<SourceFile>){
        
        this.allFiles = allFiles;
        
        var dirsHash = new Hash<Dir>();
        var all = allFiles;
        
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
        
        this.dirs = dirsArray;
        
        this.onAllFilesChanged.pub(null);
    }
    public function getAllFiles() : Hash<SourceFile>{
        return allFiles;
    }

    public function getCurrentFile() : SourceFile {
        return editingFiles.getCursored();
    }
    public function selectNextFile(file: SourceFile, ?optLine : Int) {
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
            || error.originalMessage.indexOf('./${file.pathFromProjectRoot}') == 0;
        });
    }
    
}