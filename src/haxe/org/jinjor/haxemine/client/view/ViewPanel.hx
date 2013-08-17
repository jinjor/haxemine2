package org.jinjor.haxemine.client.view;

import js.JQuery;

import org.jinjor.haxemine.messages.AllMessages;
import org.jinjor.haxemine.client.view.TaskListView;
import org.jinjor.haxemine.client.view.CompileErrorPanel;
import org.jinjor.haxemine.client.view.SearchPanel;

class ViewPanel {
    
    private static var template = '
<div id="view_panel">
    <div id="tabsContainer" >
        <span class="view-tab {{selected(\'tasks\')}}" ng-click="t(\'tasks\')">Tasks</span>
        <span class="view-tab {{selected(\'search\')}}" ng-click="t(\'search\')">Search</span>
    </div>
    <div id="panelsContainer">
        <div ng-show="selected(\'tasks\')">
            <tasklist session="session"></tasklist>
        </div>
        <div ng-show="selected(\'search\')">
            <search session="session"></search>
        </div>
    </div>
</div>
    ';
    
    static function __init__(){
        HaxemineModule.module.directive('viewpanel', function(){
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    session: '='
                },
                template: template,
                link: function(scope, element, attrs) {
                    var selected = 'tasks';
                    scope.t = function(name){
                        selected = name;
                    };
                    scope.selected = function(name){
                        return selected == name ? 'selected' : '';
                    };
                }
            }
        });
    }

}