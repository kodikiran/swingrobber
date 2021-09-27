// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        //
        thorns:{
            default: [],
            type: cc.Node,
        },
        //
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    start () {

    },

    DestroyThorns:function(){
        for(var i=0;i<this.thorns.length;i++){
            this.thorns[i].destroy();
        }
    },

    // update (dt) {},
});
