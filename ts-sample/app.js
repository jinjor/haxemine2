var models;
(function (models) {
    var Param = (function () {
        function Param(name, min, max, step, value) {
            this.name = name;
            this.min = min;
            this.max = max;
            this.step = step;
            this.value = value;
        }
        return Param;
    })();
    models.Param = Param;    
    var _nodeId = 0;
    var createNodeId = function () {
        return 'Node' + _nodeId++;
    };
    var Node = (function () {
        function Node(name, params, node) {
            this.name = name;
            this.params = params;
            this.outs = [];
            var id = createNodeId();
            this.node = node;
            this.id = id;
        }
        Node.prototype.connect = function (target) {
            console.log('try: ' + this.id + ' -> ' + target.id);
            for(var i = 0; i < this.outs.length; i++) {
                if(this.outs[i] == target.id) {
                    console.log(this.id + ' is already connected to ' + target.id);
                    return false;
                }
            }
            this.outs.push(target.id);
            console.log('connect: ' + this.id + ' -> ' + target.id);
            this.node.connect(target.node);
            return true;
        };
        Node.prototype.disconnect = function () {
            this.node.disconnect();
            var outs = this.outs;
            this.outs = [];
            return outs;
        };
        Node.prototype.isSource = function () {
            return this.node.numberOfOutputs > 0;
        };
        Node.prototype.isTarget = function () {
            return this.node.numberOfInputs > 0;
        };
        return Node;
    })();
    models.Node = Node;    
    var NodeCollection = (function () {
        function NodeCollection() {
            this.nodeMap = {
            };
            this.lastAdded = Signal();
            this.lastConnect = Signal();
            this.lastDisconnect = Signal();
        }
        NodeCollection.prototype.add = function (node) {
            this.nodeMap[node.id] = node;
            this.lastAdded(node);
        };
        NodeCollection.prototype.gainNode = function (context, val) {
            var node = context.createGain();
            var gain = Signal(val);
            Observer(function () {
                var sig = gain();
                node.gain.value = sig;
            });
            var _node = new Node('gain', [
                new Param('gain', 0.0, 1, 0.01, gain)
            ], node);
            this.add(_node);
            return _node;
        };
        NodeCollection.prototype.oscillatorNode = function (context, type, freq) {
            var node = context.createOscillator();
            var type = Signal(type);
            Observer(function () {
                node.type = type();
            });
            var freq = Signal(freq);
            Observer(function () {
                node.frequency.value = freq();
            });
            var _node = new Node('oscillator', [
                new Param('type', 0, 3, 1, type), 
                new Param('freq', 60.0, 2000.0, 0.1, freq)
            ], node);
            this.add(_node);
            _node.node.start(0);
            return _node;
        };
        NodeCollection.prototype.biquadFilterNode = function (context, type, freq, q, gain) {
            var node = context.createBiquadFilter();
            console.log(node);
            var useGain = false;
            if(type == 'lowpass') {
            } else if(type == 'highpass') {
            } else if(type == 'bandpass') {
            } else if(type == 'lowshelf') {
                useGain = true;
            } else if(type == 'highshelf') {
                useGain = true;
            } else if(type == 'peaking') {
                useGain = true;
            } else if(type == 'notch') {
            } else if(type == 'allpass') {
            } else {
                throw '!';
            }
            var freq = Signal(freq);
            Observer(function () {
                node.frequency.value = freq();
            });
            var q = Signal(q);
            Observer(function () {
                node.Q = q();
            });
            var params = [
                new Param('freq', 60.0, 4000.0, 0.1, freq), 
                new Param('q', 0.001, 10, 0.001, q), 
                
            ];
            if(useGain) {
                var gain = Signal(gain);
                Observer(function () {
                    node.gain = gain();
                });
                params.push(new Param('gain', -40, 40, 0.1, gain));
            }
            var _node = new Node('filter[' + type + ']', params, node);
            this.add(_node);
            return _node;
        };
        NodeCollection.prototype.delayNode = function (context, val) {
            var node = context.createDelay();
            var delay = Signal(val);
            Observer(function () {
                var sig = delay();
                node.delayTime.value = sig;
            });
            var _node = new Node('delay', [
                new Param('time', 0.0, 0.5, 0.01, delay)
            ], node);
            this.add(_node);
            return _node;
        };
        NodeCollection.prototype.scriptProcessor = function (context, keyState) {
            var bufsize = 1024;
            var node = context.createScriptProcessor(bufsize);
            var gain = Signal(function () {
                return keyState();
            });
            node.onaudioprocess = function (ev) {
                var o1 = ev.outputBuffer.getChannelData(0);
                var o2 = ev.outputBuffer.getChannelData(1);
                var i1 = ev.inputBuffer.getChannelData(0);
                var i2 = ev.inputBuffer.getChannelData(1);
                var _gain = gain();
                for(var i = 0; i < bufsize; ++i) {
                    o1[i] = i1[i] * _gain;
                    o2[i] = i2[i] * _gain;
                }
            };
            var _node = new Node('scriptProcessor', [
                new Param('value', 0, 1, 0, keyState)
            ], node);
            this.add(_node);
            return _node;
        };
        NodeCollection.prototype.destinationNode = function (context) {
            var node = context.destination;
            var _node = new Node('destination', [], node);
            this.add(_node);
            return _node;
        };
        NodeCollection.prototype.connect = function (source, target, render) {
            if(source.connect(target)) {
                if(render) {
                    this.lastConnect({
                        source: source,
                        target: target
                    });
                }
            } else {
                alert('failed.');
            }
        };
        NodeCollection.prototype.disconnect = function (source, target, render) {
            var outs = source.disconnect();
            for(var o in outs) {
                if(o != target.id) {
                    source.connect(this.nodeMap[o]);
                }
            }
            if(render) {
                this.lastDisconnect({
                    source: source,
                    target: target
                });
            }
        };
        NodeCollection.prototype.get = function (index) {
            return this.nodeMap[index];
        };
        return NodeCollection;
    })();
    models.NodeCollection = NodeCollection;    
})(models || (models = {}));
var views;
(function (views) {
    jsPlumb.importDefaults({
        'PaintStyle': {
            lineWidth: 5,
            strokeStyle: "#ddd",
            outlineColor: "#333",
            outlineWidth: 1
        }
    });
    var exampleDropOptions = {
        tolerance: "touch",
        hoverClass: "dropHover",
        activeClass: "dragActive"
    };
    var $paramView = function (param) {
        var container = $('<li class="param"/>');
        var name = $('<label/>').text(param.name);
        var min = $('<label/>').text(param.min);
        var val = $('<label/>').text(param.value());
        var range = $('<input type="range"/>').attr('min', param.min.toFixed(1)).attr('step', param.step).attr('max', param.max).val(param.value()).on('change', function () {
            param.value(parseFloat($(this).val()));
        });
        var max = $('<label/>').text(param.max);
        Observer(function () {
            val.text(' ' + param.value());
        });
        return container.append(name).append(range).append(val);
    };
    views.globalKeyState = false;
    $(document).on("mousedown", function (event) {
        views.globalKeyState = true;
    });
    $(document).on("mouseup", function (event) {
        views.globalKeyState = false;
    });
    $(document).on("blur", function (event) {
        views.globalKeyState = false;
    });
    var NodeCollectionView = (function () {
        function NodeCollectionView($body, keyState, nodeCollection) {
            this.sourceEndpoints = {
            };
            this.targetEndpoints = {
            };
            var that = this;
            var beforeDrop = function (conn) {
                console.log('drop: ' + conn.sourceId + " => " + conn.targetId);
                var source = nodeCollection.get(conn.sourceId);
                var target = nodeCollection.get(conn.targetId);
                nodeCollection.connect(source, target, false);
                return true;
            };
            var beforeDetach = function (conn) {
                console.log('detach: ' + conn.sourceId + " => " + conn.targetId);
                var source = nodeCollection.get(conn.sourceId);
                var target = nodeCollection.get(conn.targetId);
                nodeCollection.disconnect(source, target, false);
                return true;
            };
            this.endpointSource = {
                isSource: true,
                reattach: true,
                isTarget: false,
                dropOptions: exampleDropOptions,
                anchor: [
                    0.7, 
                    1, 
                    0, 
                    1
                ],
                beforeDrop: beforeDrop,
                beforeDetach: beforeDetach,
                paintStyle: {
                    radius: 6,
                    fillStyle: "#ddd",
                    outlineColor: "#444",
                    outlineWidth: 1
                },
                maxConnections: 16
            };
            this.endpointTarget = {
                isSource: false,
                reattach: true,
                isTarget: true,
                dropOptions: exampleDropOptions,
                anchor: [
                    0.3, 
                    1, 
                    0, 
                    1
                ],
                beforeDrop: beforeDrop,
                beforeDetach: beforeDetach,
                paintStyle: {
                    radius: 6,
                    fillStyle: "#111",
                    outlineColor: "#444",
                    outlineWidth: 1
                },
                maxConnections: 16
            };
            var top = 0;
            var left = 0;
            Observer(function () {
                var last = nodeCollection.lastAdded();
                if(last == null) {
                    return;
                }
                var el;
                if(last.name == 'scriptProcessor') {
                    el = that.$buttonNodeView(last, keyState, top, left);
                } else {
                    el = that.$nodeView(last, top, left);
                }
                $body.append(el);
                top = (top + 100) % 400;
                left += 100;
            });
            Observer(function () {
                var nodes = nodeCollection.lastConnect();
                if(!nodes) {
                    return;
                }
                var sourceEp = that.sourceEndpoints[nodes.source.id];
                var targetEp = that.targetEndpoints[nodes.target.id];
                if(sourceEp != null && targetEp != null) {
                    jsPlumb.connect({
                        source: sourceEp,
                        target: targetEp
                    });
                }
            });
        }
        NodeCollectionView.prototype.createContainer = function (node, top, left) {
            var label = $('<h3/>').text(node.name);
            return $('<div class="node_view"/>').attr('id', node.id).css('position', 'absolute').css('top', top + 'px').css('left', left + 'px').addClass('metal').addClass('linear').append(label);
        };
        NodeCollectionView.prototype.$buttonNodeView = function (node, keyState, top, left) {
            var _this = this;
            var el = this.createContainer(node, top, left);
            var button = $('<Button/>').text(node.name).on('mousedown', function () {
                views.globalKeyState = true;
                keyState(1);
            }).on('mouseup', function () {
                views.globalKeyState = false;
                keyState(0);
            }).on('mouseenter', function () {
                if(views.globalKeyState) {
                    keyState(1);
                }
            }).on('mouseleave', function () {
                keyState(0);
            });
            el.append(button);
            jsPlumb.draggable(el);
            el.ready(function () {
                if(node.isSource()) {
                    var ep = jsPlumb.addEndpoint(el, {
                    }, _this.endpointSource);
                    console.log('Source:' + node.id);
                    _this.sourceEndpoints[node.id] = ep;
                }
                if(node.isTarget()) {
                    var ep = jsPlumb.addEndpoint(el, {
                    }, _this.endpointTarget);
                    console.log('Target:' + node.id);
                    _this.targetEndpoints[node.id] = ep;
                }
            });
            return el;
        };
        NodeCollectionView.prototype.$nodeView = function (node, top, left) {
            var _this = this;
            var ul = node.params.reduce(function (memo, param) {
                return memo.append($paramView(param));
            }, $('<ul>'));
            var el = this.createContainer(node, top, left).append(ul);
            jsPlumb.draggable(el);
            el.ready(function () {
                if(node.isSource()) {
                    var ep = jsPlumb.addEndpoint(el, {
                    }, _this.endpointSource);
                    console.log('Source:' + node.id);
                    _this.sourceEndpoints[node.id] = ep;
                }
                if(node.isTarget()) {
                    var ep = jsPlumb.addEndpoint(el, {
                    }, _this.endpointTarget);
                    console.log('Target:' + node.id);
                    _this.targetEndpoints[node.id] = ep;
                }
            });
            return el;
        };
        return NodeCollectionView;
    })();
    views.NodeCollectionView = NodeCollectionView;    
})(views || (views = {}));
//@ sourceMappingURL=app.js.map
