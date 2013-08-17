package org.jinjor.haxemine.client.view;

import js.JQuery;
import org.jinjor.haxemine.messages.DoTaskM;

class TaskView {
    
    private static var template = '
<div class="task-view {{c(task)}}" title="{{task.content}}" ng-click="cl(task)">
    {{task.name}}
</div>
    ';
    
    static function __init__(){
        HaxemineModule.module.directive('task', function(){
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    task: '='
                },
                template: template,
                link: function(scope, element, attrs) {
                    var session : Session = scope.session;
                    var task : TaskModel = scope.task;
                    
                    scope.c = function(task : TaskModel) {
                        return switch(task.state){
                            case NONE: '';
                            case WAITING: '';
                            case SUCCESS: 'success';
                            case FAILED: 'failed';
                            case READY : 'ready';
                        };
                    };
                    scope.cl = function(task){
                        if(task.state == TaskModelState.READY){
                            task.setState(TaskModelState.WAITING);
                            session.doTask(task.name);
                        }
                    };
                }
            }
        });
    }

    

}