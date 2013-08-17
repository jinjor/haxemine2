package org.jinjor.haxemine.client.view;

import org.jinjor.haxemine.messages.SearchM;
import org.jinjor.haxemine.messages.SearchResult;
import org.jinjor.haxemine.messages.SearchResultM;

using org.jinjor.util.ClientUtil;

class SearchPanel {
    
    private static var template = '
<div>
    <form ng-submit="s(session, word)" ng-disabled="session.searchWaiting">
        <input type="text" ng-model="word">
        <input type="submit" value="Search">
    </form>
    <div>
        <div>
            <a ng-repeat="result in session.searchResults" ng-click="a(session, result)">result.message</a>
        </div>
    </div>
</div>
    ';
    
    static function __init__(){
        HaxemineModule.module.directive('search', function(){
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    session: '='
                },
                template: template,
                link: function(scope, element, attrs) {
                    scope.a = function(session : Session, result){
                        var file = session.getAllFiles().get(result.fileName);
                        session.selectNextFile(file, result.row);
                    };
                    scope.s = function(session : Session, word){
                        trace(word);
                        session.search(word);
                    };
                }
            }
        });
    }


}