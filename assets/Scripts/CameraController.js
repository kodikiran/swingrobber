// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        player:{
            default:null,
            type:cc.Node,
        },
        xoffset:0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        xoffset = this.node.x - this.player.x
    },

    update (dt) {
        this.FollowPlayer();
    },

    FollowPlayer:function(){

        this.node.x = this.player.x + xoffset;
        
    }
});
