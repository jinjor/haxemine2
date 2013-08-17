package org.jinjor.haxemine.client.view;

import org.jinjor.haxemine.messages.DoTaskM;
import org.jinjor.haxemine.messages.TaskProgressM;


using Lambda;

class CompileErrorPanel {

    private static var template = '
<div id="compile-error-panel"/>
    <tasklist session="session"></tasklist>
    <div id="compile-errors">
        <ul>
            <li ng-repeat="error in session.getCompileErrors()">
                <a ng-click="c(session, error)">{{error.originalMessage}}</a>
            </li>
        </ul>
    </div>
</div>
    ';
    
    static function __init__(){
        HaxemineModule.module.directive('compileerror', function(){
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    session: '='
                },
                template: template,
                link: function(scope, element, attrs) {
                    scope.c = function(session : Session, error){
                        var file = session.getAllFiles().get(error.path);
                        var row = error.row;
                        session.selectNextFile(file, row);
                    };
                }
            }
        });
    }

    
}