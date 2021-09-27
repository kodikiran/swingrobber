// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var ScoreManager = require("ScoreManager");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        platforms:{
            default: [],
            type: cc.Prefab,
        },
        previousPlatform:{
            default:null,
            type:cc.Node,
        },
        middlePlatform:{
            default:null,
            type:cc.Node,
        },
        currentPlatform:{
            default:null,
            type:cc.Node,
        },
        mainPlatform:{

            default:null,
            type:cc.Node,

        },
        spawnedPlatforms:{
            default:[],
            type:cc.Node,
        },
        powerUpTimeSpawnedPlatforms:[],
        /*prevPlatform:null,
        curPlatform:null,
        midPlatform:null,*/
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        cc.game.on("spawnnew",this.SpawnNewPlatform, this);
        cc.game.on("attach",this.AttachToCurrentPlatform,this);
        cc.game.on("powerUpActivated", this.SpawnPlatformsDuringPowerUp,this);

    },

    // update (dt) {},

    SpawnNewPlatform:function(isPowerUp){

        if(Global.isGameOver)return;

        var curPos = this.spawnedPlatforms[this.spawnedPlatforms.length-1].getPosition();
        var Gap = Math.round(this.GetRandom(300,400));
        curPos.x += Math.round(this.GetRandom(100,400));
        curPos.x += Gap;


        //

        var index = Math.round(this.GetRandom(0,this.platforms.length-1));
        if(isPowerUp) index =Math.round(this.GetRandom(0,2));
        //console.log("index" + index);
        this.spawnedPlatforms.push(this.CreateNewPlatform(curPos,index));
        //
        
    },

    CreateNewPlatform:function(pos,index){

        var newCurrentPlatform = cc.instantiate(this.platforms[index]);
        newCurrentPlatform.parent = this.node;
        newCurrentPlatform.setPosition(pos);
        return newCurrentPlatform;

    },

    AttachToCurrentPlatform:function(){

        /*this.middlePlatform?.destroy();
        var newPos = this.previousPlatform.width/2 + this.currentPlatform.width/2;
        newPos = this.currentPlatform.x - newPos;*/

        while(this.spawnedPlatforms.length >= 2){
            var firstplatform = this.spawnedPlatforms.shift();
            firstplatform?.destroy();
        }
        var combinedWidth = this.mainPlatform.width/2 + this.spawnedPlatforms[0].width/2;
        var newPos = this.spawnedPlatforms[0].x - combinedWidth + 50;
        //console.log("newPos" + newPos);
        //this.previousPlatform.x = newPos;
        cc.tween(this.mainPlatform)
        .to(0.6,{x:newPos})
        .call(()=>{cc.game.emit("movePlayerToEnd");cc.game.emit("spawnnew");})
        .start();

    },


    GetRandom: function(min, max){

        return Math.random() * (max - min) + min;

    },

    SpawnPlatformsDuringPowerUp:function(){
        //console.log("spawned five platforms");

        for(var i =0;i<5; i++){

            this.SpawnNewPlatform(true);

        }
        var lastPos = this.spawnedPlatforms[this.spawnedPlatforms.length-1].getPosition();
        //console.log("lastposxbefore "+ lastPos.x);

        var lastPos = this.node.convertToWorldSpaceAR(lastPos);
        //console.log("lastposx "+ lastPos.x);
        cc.game.emit("useJetPack",{pos:lastPos});

    },
});
