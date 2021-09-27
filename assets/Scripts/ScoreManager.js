var ScoreManager = cc.Class({
    extends: cc.Component,

    properties: {
        gameScore:0,
        scoreUI:{
            default:null,
            type:cc.Label,
        }
    },

    statics: {
        _instance: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ScoreManager._instance = this;
    },

    start () {

    },

    // update (dt) {},

    UpdateScore:function(deltaScore){
        this.gameScore += deltaScore;
        this.scoreUI.string = this.gameScore;
        console.log("score" + this.gameScore);
    },
});
