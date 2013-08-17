package org.jinjor.haxemine.client.view;

import org.jinjor.haxemine.client.HaxemineModule;
import org.jinjor.haxemine.client.view.FileSelector;
import org.jinjor.haxemine.client.view.AceEditorView;
import org.jinjor.haxemine.client.view.ViewPanel;

class View {
    
    private static var template = '
<div>
    <menu/>
    <file_selector/>
    <ace_editor/>
    <hr/>
    <view_panel/>
</div>
    ';
    
    static function __init__(){
        HaxemineModule.module.directive('haxemine', function(){
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: template,
                link: function(scope, element, attrs) {
                    scope.ace = untyped ace;
                    scope.socket = untyped io.connect('/');
                    scope.session = new Session(scope.socket);
                }
            }
        });
    }

}