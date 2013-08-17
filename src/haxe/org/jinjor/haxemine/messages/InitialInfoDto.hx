package org.jinjor.haxemine.messages;

import org.jinjor.haxemine.server.Mode;

class InitialInfoDto {
        
    public var mode: Mode;
    public var projectRoot : String;
    public var allFiles : Hash<SourceFile>;
    public var taskInfos : Array<TaskInfo>;
    public var searchEnabled : Bool;

    public function new(mode: Mode, projectRoot, allFiles, taskInfos, searchEnabled) {
        this.projectRoot = projectRoot;
        this.allFiles = allFiles;
        this.taskInfos = taskInfos;
        this.searchEnabled = searchEnabled;
    }

}