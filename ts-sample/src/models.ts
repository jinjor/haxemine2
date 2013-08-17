module models {
    
    declare var $: any;
    declare var Signal: any;
    declare var Observer: any;
    declare var webkitAudioContext: any;
    declare var Audio: any;
    
    // Model ------------------------------------
    
    export class Param{
        constructor(
            public name:string,
            public min:number,
            public max:number,
            public step:number,
            public value:any){
        }
    }
    
    var _nodeId = 0;
    var createNodeId = function(){
        return 'Node' + _nodeId++
    }
    export class Node {
        public id: string;
        public node: any;
        private outs : string[] = [];
        
        constructor(public name : string, public params : Param[], node: any){
            var id = createNodeId();
            this.node = node;
            this.id = id;
        }
        connect(target : Node) : bool {
            console.log('try: ' + this.id + ' -> ' + target.id);
            for(var i = 0; i < this.outs.length; i++){
                if(this.outs[i] == target.id){
                    console.log(this.id + ' is already connected to ' + target.id);
                    return false;
                }
            }
            this.outs.push(target.id);
            console.log('connect: ' + this.id + ' -> ' + target.id);
            this.node.connect(target.node);
            return true;
        }
        disconnect() : string[] {
            this.node.disconnect();
            var outs = this.outs;
            this.outs = [];
            return outs;
        }
        isSource(): bool {
            return this.node.numberOfOutputs > 0;
        }
        isTarget(): bool {
            return this.node.numberOfInputs > 0;
        }
    }
    
    export class NodeCollection {
        private nodeMap: { [key: string]: Node; } = {};
        lastAdded: any = Signal();
        lastConnect: any = Signal();
        lastDisconnect: any = Signal();
        
        private add(node){
            this.nodeMap[node.id] = node;
            this.lastAdded(node)
        }
        gainNode(context, val){
            var node = context.createGain();
            var gain = Signal(val);
            Observer(function(){
                var sig = gain();
                node.gain.value = sig;
            });
            var _node = new Node('gain', [new Param('gain', 0.0, 1, 0.01, gain)], node);
            this.add(_node);
            return _node
        }
        oscillatorNode(context, type, freq){
            var node = context.createOscillator();
            var type = Signal(type);
            Observer(function(){
                node.type = type();
            });
            var freq = Signal(freq);
            Observer(function(){
                node.frequency.value = freq();
            });
            var _node = new Node('oscillator', [
                new Param('type', 0, 3, 1, type),
                new Param('freq', 60.0, 2000.0, 0.1, freq)
            ], node);
            this.add(_node);
            _node.node.start(0);
            return _node
        }
        biquadFilterNode(context, type:String, freq, q, gain){
            var node = context.createBiquadFilter();
            console.log(node);
            
            var useGain = false;
            if(type == 'lowpass'){
            }else if(type == 'highpass'){
            }else if(type == 'bandpass'){
            }else if(type == 'lowshelf'){
                useGain = true;
            }else if(type == 'highshelf'){
                useGain = true;
            }else if(type == 'peaking'){
                useGain = true;
            }else if(type == 'notch'){
            }else if(type == 'allpass'){
            }else {
                throw '!';
            }
            
            var freq = Signal(freq);
            Observer(function(){
                node.frequency.value = freq();
            });
            var q = Signal(q);
            Observer(function(){
                node.Q = q();
            });
            var params = [
                new Param('freq', 60.0, 4000.0, 0.1, freq),
                new Param('q', 0.001, 10, 0.001, q),//TODO log 0.0001 - 1000
            ]
            if(useGain){
                var gain = Signal(gain);
                Observer(function(){
                    node.gain = gain();
                });
                params.push(new Param('gain', -40, 40, 0.1, gain));
            }
            var _node = new Node('filter[' + type + ']', params, node);
            this.add(_node);
            return _node
        }
        delayNode(context, val){
            var node = context.createDelay();
            var delay = Signal(val);
            Observer(function(){
                var sig = delay();
                node.delayTime.value = sig;
            });
            var _node = new Node('delay', [new Param('time', 0.0, 0.5, 0.01, delay)], node);
            this.add(_node);
            return _node
        }
        scriptProcessor(context, keyState){
            var bufsize = 1024;
            var node = context.createScriptProcessor(bufsize);
            var gain = Signal(function(){
                return keyState();//とりあえず0/1
            });
            node.onaudioprocess = (ev) => {
                var o1 = ev.outputBuffer.getChannelData(0);
                var o2 = ev.outputBuffer.getChannelData(1);
                var i1 = ev.inputBuffer.getChannelData(0);
                var i2 = ev.inputBuffer.getChannelData(1);
                var _gain = gain();
                for(var i = 0; i < bufsize; ++i){
                    o1[i] = i1[i] * _gain;
                    o2[i] = i2[i] * _gain;
                }
            }
            var _node = new Node('scriptProcessor',
                [new Param('value', 0, 1, 0, keyState)], node);//てきとう
            this.add(_node);
            return _node
        }
        destinationNode(context){
            var node = context.destination
            var _node = new Node('destination', [], node);
            this.add(_node);
            return _node
        }
        
        connect(source: Node, target: Node, render : bool){
            
            if(source.connect(target)){
                if(render){
                    this.lastConnect({
                        source: source,
                        target: target
                    });
                }
            }else{
                alert('failed.');
            }
        }
        disconnect(source: Node, target: Node, render : bool){
            // cannot disconnect to one target
            var outs = source.disconnect();
            // reconnect others
            for(var o in outs){
                if(o != target.id){
                    source.connect(this.nodeMap[o]);
                }
            }
            if(render){
                this.lastDisconnect({
                    source: source,
                    target: target
                });
            }
        }
        get(index : string) : Node {
            return this.nodeMap[index];
        }
    }
    

}