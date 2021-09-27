// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var AudioManager = cc.Class({
    extends: cc.Component,

    properties: {

        audioArray: {
            default: [],
            type: cc.AudioSource
        },

    },

    statics: {
        _instance: null,
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        AudioManager._instance = this;
    },

    update (dt) {

    },

    Play:function(index){
        
        for(var i=0; i<this.audioArray.length;i++){
            if(this.audioArray[i].isPlaying)this.audioArray[i].stop();
        }
        this.audioArray[index].play();
    },

    Stop:function(index){
        this.audioArray[index].stop();
    }
});
