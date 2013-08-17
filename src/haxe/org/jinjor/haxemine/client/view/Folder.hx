package org.jinjor.haxemine.client.view;

import js.JQuery;
using Lambda;

class Folder {
    
    private static var template = '
<div class="folder"/>
    <div>
        <div ng-show="open" class="closeMark" ng-click="change(false)">-</div>
        <div ng-show="!open" class="openMark" ng-click="change(true)">+</div>
        <label class="file_selector_dir">{{}}</label>
    </div>
    <div ng-show="open">
        <ul>
            <li ng-repeat="file in files">
                <a click="c(file)">{{file.name}}</a>
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
                    socket: '='
                    session: '='
                },
                template: template,
                link: function(scope, element, attrs) {
                    session.onInitialInfoReceived.sub('TaskListView.new', function(info : InitialInfoDto) {
                        scope.tasks = info.taskInfos.map(function(taskInfo) {
                            return new TaskModel(taskInfo.taskName, taskInfo.content, taskInfo.auto, taskProgressM);
                        });
                        scope.$apply();
                    });
                    scope.change = function(open){
                        scope.open = open;
                    }
                }
            }
        });
    }
    

    

}