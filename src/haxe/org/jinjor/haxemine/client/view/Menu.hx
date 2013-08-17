package org.jinjor.haxemine.client.view;

import org.jinjor.haxemine.messages.InitialInfoDto;

class Menu {
    
        private static var template = '
<nav id="menu"/>{{session.connected.fds}}
    <label ng-show="session.connected"><!--{{session.projectRoot}}-->Haxemine</label>
    <label ng-show="!session.connected" class="disconnected">Disconnected</label>
</nav>
    ';
    
    static function __init__(){
        HaxemineModule.module.directive('menu', function(){
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