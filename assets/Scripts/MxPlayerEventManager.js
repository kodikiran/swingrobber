// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var ScoreManager = require("ScoreManager");
var encryption = require("encryption_1");
var GameManager = require("GameManager");


var MxPlayerEventManager = cc.Class({
    extends: cc.Component,

    properties: {

        canShowAd:false,
        adtype:0,
        currenttime: 0,
        adGameStartClaimed : 0,
        adGameEndClaimed : 0,
        adGameStartShown : 0,
        adGameEndShown : 0,
        speedIncrement:20,
        score:0,
        gamePlayTime:0,
        highScore:0,
        bgm: {
            default: null,
            type: cc.AudioSource
        },
        
    },

    statics: {
        _instance: null,
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        MxPlayerEventManager._instance = this;
        cc.game.on('rewardAdsExist', this.onRewardedAdsCheck,this);
        cc.game.on('onAdPlayed', this.adPlayed,this);
    },

    start () {

       // this.MxplayerCheckForRewardeVideos();
    },

    SendPuaseEventData: function(pausedTime){
        if (typeof gameManager !== 'undefined') {
            try {
                var obj = {
                    userID: String(cc.sys.localStorage.getItem('userID')),
                    gameID: String(cc.sys.localStorage.getItem('gameID')),
                    roomID: String(cc.sys.localStorage.getItem('roomID')),
                    currentTime: Math.floor(pausedTime),
                    
                    //playTime : Math.floor(this.gamePlayTime),
                    //speedFromconfig : GameManager._instance.defaultConfig.speed,
                }
                var data = JSON.stringify(obj)
                //console.log(data);
                gameManager.onTrack('gamePause', data)
            } catch (e) {
                gameManager.onError(e.stack.toString())
            }
        }
    },

    MxplayerCheckForRewardeVideos: function(){
        
        if (typeof gameManager !== 'undefined' && 
            typeof gameManager.onCheckRewardedVideoAds === 'function'
        ) {
        try {
            gameManager.onCheckRewardedVideoAds('rewardAdsExist')
        } catch (e) {
            gameManager.onError(e.stack.toString())
        }
        }
    },

    onRewardedAdsCheck: function (result) {
        if (result.status === 0) {
            this.canShowAd = true;

        } else {

            this.canShowAd = false;
            
        }
    },

    MxPlayerGameOver:function(){
        this.GetNewHighScore();
        
        this.MxPlayerGameEndData();
        if (typeof gameManager !== 'undefined') {
            var obj = {
                userID: String(cc.sys.localStorage.getItem('userID')),
                gameID: String(cc.sys.localStorage.getItem('gameID')), 
                roomID: String(cc.sys.localStorage.getItem('roomID')),
                
                score: this.score,
                highScore: this.highScore,
                //lastLevel: lastLevel,
                //info: encryption.getInfo(lastLevel, this.gameplayTimeInSecond, reviveCount), // only for level based games
                info: encryption.getInfo(this.score,Math.round(this.gamePlayTime),0) // for other games
            }
            try {
                var score = JSON.stringify(obj)
                gameManager.onGameOver(score)
            } catch (e) {
               // console.log("no game manager");
                gameManager.onError(e.stack.toString())
            }
        }
    },

    onShowRewardedVideoAdsStart:function(){
        this.bgm?.pause();
        this.MxPlayerGameadclicked("start");
        this.adtype = 0;
        this.adGameStartShown = 1;
        this.MxPlayerGameadshown("start");
        if (typeof gameManager !== 'undefined' && 
            typeof gameManager.onShowRewardedVideoAds === 'function'
        ) {
            try {
                gameManager.onShowRewardedVideoAds('onAdPlayed', null)
            } catch (e) {
                gameManager.onError(e.stack.toString())
            }
        }

    },


    onShowRewardedVideoAdsEnd:function(){
        this.bgm?.pause();
        this.MxPlayerGameadclicked("end");
        this.adtype = 1;
        var positiontemp = "end";
        this.adGameEndShown = 1;
        this.MxPlayerGameadshown(positiontemp);
        if (typeof gameManager !== 'undefined' && 
            typeof gameManager.onShowRewardedVideoAds === 'function'
        ) {
            try {
                gameManager.onShowRewardedVideoAds('onAdPlayed', null)
            } catch (e) {
                gameManager.onError(e.stack.toString())
            }
        }
    },

    MxPlayerGameEndData: function(){
        console.log("called game end event");

        if (typeof gameManager !== 'undefined') {
            try {
                var obj = {
                    userID: String(cc.sys.localStorage.getItem('userID')),
                    gameID: String(cc.sys.localStorage.getItem('gameID')),
                    roomID: String(cc.sys.localStorage.getItem('roomID')),
                    
                    currentScore: this.score,
                    highScore: this.highScore,
                    playTime : Math.floor(this.gamePlayTime),
                    adGameStartOpportunity:1,
                    adGameStartShown: this.adGameStartShown,
                    adGameStartClaimed:this.adGameStartClaimed,
                    adGameEndOpportunity:1,
                    adGameEndShown: this.adGameEndShown,
                    adGameEndClaimed:this.adGameEndClaimed,
                    adGamePowerupClaimed:0,
                    
                    //speedFromconfig : GameManager._instance.defaultConfig.speed,
                }
                var data = JSON.stringify(obj)
                //console.log(data);
                gameManager.onTrack('gameExit', data)
            } catch (e) {
                gameManager.onError(e.stack.toString())
            }
        }
    },

    MxPlayerGameadclaimed: function(positiontemp){
        console.log("called game end event");

        if (typeof gameManager !== 'undefined') {
            try {
                var obj = {
                    userID: String(cc.sys.localStorage.getItem('userID')),
                    gameID: String(cc.sys.localStorage.getItem('gameID')),
                    roomID: String(cc.sys.localStorage.getItem('roomID')),
                    
                    autoPlayed: 0,
                    position: positiontemp, 
                    //speedFromconfig : GameManager._instance.defaultConfig.speed,
                }
                var data = JSON.stringify(obj)
                //console.log(data);
                gameManager.onTrack('gameAdClaimed', data)
            } catch (e) {
                gameManager.onError(e.stack.toString())
            }
        }
    },

    MxPlayerGameadclicked: function(positiontemp){
        console.log("called game end event");

        if (typeof gameManager !== 'undefined') {
            try {
                var obj = {
                    userID: String(cc.sys.localStorage.getItem('userID')),
                    gameID: String(cc.sys.localStorage.getItem('gameID')),
                    
                    roomID: String(cc.sys.localStorage.getItem('roomID')),
                    
                    autoPlayed: 0,
                    position: positiontemp, 
                    //speedFromconfig : GameManager._instance.defaultConfig.speed,
                }
                var data = JSON.stringify(obj)
                //console.log(data);
                gameManager.onTrack('gameAdClicked', data)
            } catch (e) {
                gameManager.onError(e.stack.toString())
            }
        }
    },

    MxPlayerGameadshown: function(positiontemp){

        //console.log("called game end event");
        if (typeof gameManager !== 'undefined') {
            try {
                var obj = {
                    userID: String(cc.sys.localStorage.getItem('userID')),
                    gameID: String(cc.sys.localStorage.getItem('gameID')),
                    roomID: String(cc.sys.localStorage.getItem('roomID')),
                    
                    position: positiontemp, 
                    //speedFromconfig : GameManager._instance.defaultConfig.speed,
                }
                var data = JSON.stringify(obj)
                //console.log(data);
                gameManager.onTrack('gameAdShown', data)
            } catch (e) {
                gameManager.onError(e.stack.toString())
            }
        }

    },


    adPlayed: function (result) {
        var positiontemp = "start";
        if(this.adtype == 1)positiontemp = "end";
        this.MxPlayerGameadclaimed(positiontemp);
        this.canShowAd =false;
        this.MxplayerCheckForRewardeVideos();
        if (result.status === 0) {
            if(this.adtype == 0){
                this.adGameStartClaimed = 1;
                cc.game.emit("ShieldPowerUp", {result: 1});
            }
            else{
                //double the score::
                this.adGameEndClaimed = 1;
                this.score = ScoreManager._instance.gameScore*2;
                this.MxPlayerGameOver();
            }
            
        } else {

            if(this.adtype == 1){

                console.log(this.gamePlayTime);
                this.score = ScoreManager._instance.gameScore
                this.MxPlayerGameOver();

            }
            else{

                cc.game.emit('ShieldPowerUp', {result: 0});
            }

        }
        this.bgm?.play();
        
    },

    
    update (dt) {
        if(Global.isPaused || Global.isGameOver){
            return;
        }
        this.gamePlayTime += dt;
        
    },

    GetNewHighScore(){

        this.highScore = GameManager._instance.config.highestScore;
        if(this.score > this.highScore)this.highScore = this.score;
        console.log("highscore " + this.highScore);

    },

    GameExit:function(){
        this.score = ScoreManager._instance.gameScore
        this.MxPlayerGameOver();

    }
});
