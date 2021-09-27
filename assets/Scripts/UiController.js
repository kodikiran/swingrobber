// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var MxPlayerEventManager = require("MxPlayerEventManager");
var ScoreManager = require("ScoreManager");

var UiController = cc.Class({
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
        scoreLabel: {
            default: null,
            type: cc.Label
        },

        gameOverMenu:{
            default: null,
            type: cc.Node,
        },

        inGameMenu:{
            default: null,
            type: cc.Node,
        },

        startMenu:{
            default: null,
            type: cc.Node,
        },

        shieldPowerAdMenu:{
            default:null,
            type:cc.Node,
        },
        pauseMenu:{
            default:null,
            type:cc.Node,
        },
        powerUpButton:{
            default: null,
            type: cc.Node,
        },
        powerUpAdButton:{
            default: null,
            type: cc.Node,
        },
        canCalPauseTime:false,
        pausedTime:0,
        startTime:null,
        endTime:null,
        presentScore:{
            default:null,
            type:cc.Label,
        },
        doubleScore:{
            default:null,
            type:cc.Label,
        },

        instruction: {
            default : null,
            type: cc.Node,
        },

        hasGameStarted:false,


        //PowerUp Related::
        hasPowerUp:false,
        isPowerUpUsed:false,
        adOpportunityNum:0,
        powerUpAdPlayed:false,

    },

    statics: {

        _instance: null,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        UiController._instance = this;

    },

    start () {

        MxPlayerEventManager._instance.MxplayerCheckForRewardeVideos();
        cc.game.on('ShieldPowerUp', this.PowerUpAdPlayedResult,this);
        cc.game.on('powerUpActivated', this.DisablePowerButtons, this);
        //cc.game.on('ShieldPowerUpNotClaimed', this.SkipAd,this);
        //this.ShouldActivate("shieldPowerAdMenu", true);
    },

    update (dt) {
        
        if(this.canCalPauseTime){
            console.log("in calculating pause time");
            this.pausedTime += dt;
        }
        
    },

    UpdateScore:function(score){
        this.scoreLabel.string = score;
    },

    ShouldActivate:function(menuName, isActive){
        switch(menuName){
            case "gameOverMenu":
                this.gameOverMenu.active = isActive;
                break;
            case "inGameMenu":
                this.inGameMenu.active = isActive;
                break;
            case "startMenu":
                this.startMenu.active = isActive;
                break;
            case "shieldPowerAdMenu":
                    this.shieldPowerAdMenu.active = isActive;
                break;
            case "pauseMenu":
                this.pauseMenu.active = isActive;
                break;
            default:

        }
    },

    PauseGame:function(){

        if(Global.GameOver)return;
        
        //console.log("game paused");
        Global.isGamePaused = true;
        cc.director.pause();
        
    },
   
    ResumeGame:function(){

        cc.director.resume();
        Global.isGamePaused = false;
    
    },

    PlayButton:function(){

        Global.isGameOver = false;
        if(MxPlayerEventManager._instance.canShowAd){
            this.ShouldActivate("startMenu",false);
            this.ShouldActivate("shieldPowerAdMenu",true);
            
        }
        else{
            this.ResumeGame();
            this.ShouldActivate("startMenu",false);
            this.ShouldActivate("inGameMenu",true);
            //this.ActivateInstructionCard();
        }
        
    },

    ShieldPowerAdClick:function(){
        MxPlayerEventManager._instance.onShowRewardedVideoAdsStart();
    },
    
    SkipAd:function(){

        console.log("in skip ad funciton");
        this.adOpportunityNum += 1;
        this.ResumeGame();
        this.ShouldActivate("shieldPowerAdMenu",false);
        this.ShouldActivate("inGameMenu",true);
        this.powerUpButton.active = false;
        this.powerUpAdButton.active = true;

        
        //this.ActivateInstructionCard();

    },

    PowerUpAdPlayedResult:function(data){

        console.log("in ppowerupplayeyd function");

        this.ResumeGame();
        this.ShouldActivate("shieldPowerAdMenu",false);
        this.ShouldActivate("inGameMenu",true);
        
        if(data != null && data.result == 1){
            this.powerUpAdPlayed = true;
            this.ActivatingPowerButtons();
            
        }
        else{
            console.log("adnot fullyy seen");
            this.powerUpButton.active = false;
            this.powerUpAdButton.active = true;
        }

        this.adOpportunityNum += 1;

    },

    ActivatingPowerButtons:function(){

        console.log("ad successully watched");

        if(this.adOpportunityNum != 0){
            cc.game.emit("powerUpActivated");
        }
        else{
            this.powerUpButton.active = true;
            this.powerUpAdButton.active = false;
            
        }

    },

    DisablePowerButtons:function(){

        console.log("in disable power buttons");
        this.powerUpButton.active = false;
        this.powerUpAdButton.active = false;

    },

    DoubleTheScoreAdClick:function(){

        MxPlayerEventManager._instance.onShowRewardedVideoAdsEnd();

    },

    GameOver:function(){

        console.log("GameOver fucntion called");
        this.ShouldActivate("inGameMenu",false);
        this.ShouldActivate("pauseMenu",false);
        if(MxPlayerEventManager._instance.canShowAd){
            this.ShouldActivate("gameOverMenu",true);
            this.presentScore.string = ScoreManager._instance.gameScore;
            this.doubleScore.string = ScoreManager._instance.gameScore*2;
        }
        else{
            MxPlayerEventManager._instance.GameExit();
        }
        
    },

    RestartGame:function(){

        //Global.isGameOver = false;
        cc.director.loadScene("MainGame");

    },

    PauseButton:function(){

        this.canCalPauseTime= true;
        this.pausedTime = 0;
        this.startTime = new Date();
        this.PauseGame();
        this.ShouldActivate("inGameMenu",false);
        this.ShouldActivate("pauseMenu",true);

    },

    ResumeButton:function(){

        this.canCalPauseTime= false;
        console.log("paused time"+ this.pausedTime);
        this.endTime = new Date();
  var timeDiff = this.endTime - this.startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds 
  var seconds = Math.round(timeDiff);
        MxPlayerEventManager._instance.SendPuaseEventData(seconds);

        this.ResumeGame();
        this.ShouldActivate("inGameMenu",true);
        this.ShouldActivate("pauseMenu",false);

    },

    ActivateInstructionCard:function(){
        var firstopen = cc.sys.localStorage.getItem("isopen1");
        if(firstopen == null)this.instruction.active = true;
        //else this.instruction.active = true;
    }

});
