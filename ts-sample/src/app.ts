/// <reference path="models.ts"/>
/// <reference path="views.ts"/>
//import models = module('models');
//import views = module('views');


module nodio {
    
    declare var $: any;
    declare var Signal: any;
    declare var Observer: any;
    declare var webkitAudioContext: any;
    
    var nodeCollection = new models.NodeCollection();
    var audioctx = new webkitAudioContext();
    var keyState = Signal(0);

    $(() => {
        
        var nodeCollectionView = new views.NodeCollectionView($('body'), keyState, nodeCollection);

        var osc1 = nodeCollection.oscillatorNode(audioctx, 3, 884);
        //var osc2 = nodeCollection.oscillatorNode(audioctx, 0, 442);
        var button1 = nodeCollection.scriptProcessor(audioctx, keyState);
        var gain1 = nodeCollection.gainNode(audioctx, 0.1);
        var gain2 = nodeCollection.gainNode(audioctx, 0.6);
        var delay1 = nodeCollection.delayNode(audioctx, 0.2);
        //var filter1 = nodeCollection.biquadFilterNode(audioctx, 'lowpass', 2000, 1, 0);
        var dest = nodeCollection.destinationNode(audioctx);
        
    
        //initialize
        setTimeout(() => {
            nodeCollection.connect(osc1, button1, true);
            nodeCollection.connect(button1, gain1, true);
            nodeCollection.connect(gain1, delay1, true);
            nodeCollection.connect(delay1, gain2, true);
            nodeCollection.connect(gain2, delay1, true);
            nodeCollection.connect(delay1, dest, true);
            nodeCollection.connect(gain1, dest, true);
        },3);
    });
    
}

