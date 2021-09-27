// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var MxPlayer = require("MxPlayer");

var GameManager = cc.Class({
    extends: cc.Component,

    editor: {
        executionOrder: -1
    },

    properties: {
        config:null,
        defaultconfig:null,
    },

    statics: {

        _instance: null,

    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.CocosPreInitialization();
        GameManager._instance = this;

    },

    start () {

        this.config = MxPlayer._instance.OnGameInit();
        MxPlayer._instance.GameStart();
        MxPlayer._instance.MxPlayerGameStartData();
        this.defaultConfig = MxPlayer._instance.GameSettings();
        //MxPlayer._instance.ShowStickyAds(this.defaultConfig.stickyBannersEnabled);
        
    },

    // update (dt) {},

    CocosPreInitialization(){

        cc.view.enableAutoFullScreen(false);
        var physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.gravity = cc.v2(0,-980*2);
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

    },

});
