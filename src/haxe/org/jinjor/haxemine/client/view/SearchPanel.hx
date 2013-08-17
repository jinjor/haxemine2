package org.jinjor.haxemine.client.view;

import org.jinjor.haxemine.messages.SearchM;
import org.jinjor.haxemine.messages.SearchResult;
import org.jinjor.haxemine.messages.SearchResultM;

using org.jinjor.util.ClientUtil;

class SearchPanel {
    
    private static var template = '
<div>
    <form ng-submit="s()" ng-disabled="session.searchWaiting">
        <input type="text" ng-model="word">
        <input type="submit" value="Search">
    </form>
    <div>
        <div><a ng-repeat="session.saerchResults" ng-click="a()">result.message</a></div>
    </div>
</div>
    ';
    
    static function __init__(){
        HaxemineModule.module.directive('file_selector', function(){
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    socket: '=',
                    session: '='
                },
                template: template,
                link: function(scope, element, attrs) {
                    var session : Session = scope.session;
                    scope.a = function(result){
                        var file = session.getAllFiles().get(result.fileName);
                        session.selectNextFile(file, result.row);
                    };
                    scope.s = function(){
                        session.search(scope.word);
                    };
                }
            }
        });
    }


}