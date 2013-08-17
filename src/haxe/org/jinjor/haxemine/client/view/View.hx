package org.jinjor.haxemine.client.view;

import org.jinjor.haxemine.client.HaxemineModule;

import org.jinjor.haxemine.client.view.AceEditorView;
import org.jinjor.haxemine.client.view.ViewPanel;
import org.jinjor.haxemine.client.view.Menu;
import org.jinjor.haxemine.client.view.FileSelector;

class View {
    
    static function __init__(){
        
        var template = '
<div>
    <menu session="session"></menu>
    <fileselector session="session"></fileselector>
    <div id="right">
        <aceeditor session="session"></aceeditor>
        <hr/>
        <viewpanel session="session"></viewpanel>
    </div>
</div>
        ';
        
        untyped console.log("View");
        HaxemineModule.module.directive('haxemine', function(){
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: template,
                link: function(scope, element, attrs) {
                    scope.ace = untyped ace;
                    scope.socket = untyped io.connect('/');
                    scope.session = new Session(new HaxemineSocket(scope.socket, scope));
                }
            }
        });
    }

}