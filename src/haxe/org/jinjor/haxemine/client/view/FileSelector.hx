package org.jinjor.haxemine.client.view;

import org.jinjor.haxemine.client.view.Folder;

class FileSelector {
    
    static var template = '
<div id="all-haxe-files">
        <folder session="session" dir="dir" ng-repeat="dir in session.dirs"></folder>
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




