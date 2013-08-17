package org.jinjor.haxemine.client.view;

import org.jinjor.haxemine.client.view.Folder;

class FileSelector {
    
    static var template = '
<div id="all-haxe-files">
    <label class="file_selector_dir" ng-click"d(session, name)">{{name}}</label>
    
    <ul ng-repeat="dir in session.dirs">
        <folder session="session" dir="dir"></folder>
    </ul>
</div>
';
    
    static function __init__(){
        HaxemineModule.module.directive('fileselector', function(){
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




