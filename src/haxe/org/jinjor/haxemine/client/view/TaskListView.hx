package org.jinjor.haxemine.client.view;

import org.jinjor.haxemine.messages.InitialInfoDto;
import org.jinjor.haxemine.messages.DoTaskM;
import org.jinjor.haxemine.messages.TaskProgressM;
import org.jinjor.haxemine.client.view.TaskView;

using Lambda;

class TaskListView {
    
    private static var template = '
<div id="task-list-view"/>
    <task session="session" task="task" ng-repeat="task in session.tasks"/>
</div>
    ';
    
    static function __init__(){
        HaxemineModule.module.directive('tasklist', function(){
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    session: '='
                },
                template: template,
                link: function(scope, element, attrs) {
                }
            }
        });
    }

}