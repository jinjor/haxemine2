/// <reference path="models.ts"/>


module views {

    declare var $: any;
    declare var Signal: any;
    declare var Observer: any;
    declare var jsPlumb: any;

    // View ------------------------------------
    //import models = module('models');
    //var NodeCollection = models.NodeCollection;

        
    jsPlumb.importDefaults({
        'PaintStyle':{
            lineWidth:5, strokeStyle:"#ddd", outlineColor:"#333", outlineWidth:1
        },
    });
    var exampleDropOptions = {
        tolerance:"touch",
        hoverClass:"dropHover",
        activeClass:"dragActive"
    };

    var $paramView = function(param: models.Param) {
        var container = $('<li class="param"/>');
        var name = $('<label/>').text(param.name);
        var min = $('<label/>').text(param.min);
        var val = $('<label/>').text(param.value());
        var range = $('<input type="range"/>')
            .attr('min', param.min.toFixed(1))
            .attr('step', param.step)
            .attr('max', param.max)
            .val(param.value())
            .on('change', function(){
                param.value(parseFloat($(this).val()));
            });
        var max = $('<label/>').text(param.max);
        
        Observer(function(){
            val.text(' ' + param.value());
        });
        return container
            .append(name)
            //.append(min)
            .append(range)
            //.append(max)
            .append(val)
    }

    private globalKeyState = false;
    $(document).on("mousedown", (event) => {
        globalKeyState = true;
    });
    $(document).on("mouseup", (event) => {
        globalKeyState = false;
    });
    $(document).on("blur",(event) => {
        globalKeyState = false;
    });


    export class NodeCollectionView {
        
        sourceEndpoints: { [key: string]: any; } = {};
        targetEndpoints: { [key: string]: any; } = {};
        
        endpointSource: any;
        endpointTarget: any;
        
        constructor($body, keyState:any, nodeCollection : models.NodeCollection){
            var that = this;
            
            
            var beforeDrop = function(conn){
                console.log('drop: ' + conn.sourceId + " => " + conn.targetId);
                var source = nodeCollection.get(conn.sourceId);
                var target = nodeCollection.get(conn.targetId);
                nodeCollection.connect(source, target, false);
                return true;
            }
            var beforeDetach = function(conn) {
                console.log('detach: ' + conn.sourceId + " => " + conn.targetId);
                var source = nodeCollection.get(conn.sourceId);
                var target = nodeCollection.get(conn.targetId);
                nodeCollection.disconnect(source, target, false);
                return true;
            }

            this.endpointSource = {
                isSource:true,
                reattach:true,
                isTarget:false,
                //cssClass:'source',
                dropOptions : exampleDropOptions,
                anchor:[0.7, 1, 0, 1],
                beforeDrop: beforeDrop,
                beforeDetach: beforeDetach,
                paintStyle:{
                    radius: 6,
                    fillStyle:"#ddd",
                    outlineColor:"#444",
                    outlineWidth:1
                },
                maxConnections:16,
            }
            this.endpointTarget = {
                isSource:false,
                reattach:true,
                isTarget:true,
                //cssClass:'target',
                dropOptions : exampleDropOptions,
                anchor:[0.3, 1, 0, 1],
                beforeDrop: beforeDrop,
                beforeDetach: beforeDetach,
                paintStyle:{
                    radius: 6,
                    fillStyle:"#111",
                    outlineColor:"#444",
                    outlineWidth:1
                },
                maxConnections:16,
            }
                    
            
            var top = 0;
            var left = 0;
            
            Observer(function(){
                var last = nodeCollection.lastAdded();
                if(last == null){
                    return;
                }
                var el;
                if(last.name == 'scriptProcessor'){
                    el = that.$buttonNodeView(last, keyState, top, left);
                }else{
                    el = that.$nodeView(last, top, left);
                }
                $body.append(el);
                top = (top + 100) % 400;
                left += 100;
            });
            
            Observer(function(){
                var nodes = nodeCollection.lastConnect();
                if(!nodes){
                    return;
                }
                var sourceEp = that.sourceEndpoints[nodes.source.id];
                var targetEp = that.targetEndpoints[nodes.target.id];
                if(sourceEp != null && targetEp != null){
                    jsPlumb.connect({source: sourceEp, target: targetEp});
                }
            });
        }
        
        private createContainer(node, top:number, left:number){
            var label = $('<h3/>').text(node.name);
            return $('<div class="node_view"/>')
                        .attr('id', node.id)
                        .css('position', 'absolute')
                        .css('top', top + 'px')
                        .css('left', left + 'px')
                        .addClass('metal')
                        .addClass('linear')
                        .append(label)
        }
        
        $buttonNodeView(node, keyState:any, top:number, left:number){
            var el = this.createContainer(node, top, left);
            var button = $('<Button/>').text(node.name)
                .on('mousedown', function(){
                    globalKeyState = true;
                    keyState(1);
                }).on('mouseup', function(){
                    globalKeyState = false;
                    keyState(0);
                }).on('mouseenter',function(){
                    if(globalKeyState){
                        keyState(1);
                    }
                }).on('mouseleave',function(){
                    keyState(0);
                });
            el.append(button);
            jsPlumb.draggable(el);
            el.ready(()=>{
                if(node.isSource()){
                    var ep = jsPlumb.addEndpoint(el, {}, this.endpointSource);
                    //ep.bind("maxConnections", maxConnectionsCallback);
                    console.log('Source:' + node.id);
                    this.sourceEndpoints[node.id] = ep;
                }
                if(node.isTarget()){
                    var ep = jsPlumb.addEndpoint(el, {}, this.endpointTarget);
                    //ep.bind("maxConnections", maxConnectionsCallback);
                    console.log('Target:' + node.id);
                    this.targetEndpoints[node.id] = ep;
                }
            });
            
            return el;
        }
        
        $nodeView(node: models.Node, top:number, left:number) {
            
            var ul = node.params.reduce((memo, param) => {
                return memo.append($paramView(param));
            }, $('<ul>'));
            
            var el = this.createContainer(node, top, left).append(ul);
            jsPlumb.draggable(el);
            
            el.ready(()=>{
                if(node.isSource()){
                    var ep = jsPlumb.addEndpoint(el, {}, this.endpointSource);
                    //ep.bind("maxConnections", maxConnectionsCallback);
                    console.log('Source:' + node.id);
                    this.sourceEndpoints[node.id] = ep;
                }
                if(node.isTarget()){
                    var ep = jsPlumb.addEndpoint(el, {}, this.endpointTarget);
                    //ep.bind("maxConnections", maxConnectionsCallback);
                    console.log('Target:' + node.id);
                    this.targetEndpoints[node.id] = ep;
                }
            });
            
            return el;
        }
    }

}