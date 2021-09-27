var MxPlayer = cc.Class({
    extends: cc.Component,

    properties: {
       statictesting : true,
    },
    statics: {
        _instance: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        MxPlayer._instance = this;
    },

    start () {

    },

    // update (dt) {},

    OnGameInit : function(){
        try {
            if (typeof gameManager !== 'undefined') {
                const gameConfigString = gameManager.onGameInit()
                var config = JSON.parse(gameConfigString)
                //console.log('in mxplayer class');
                const {userId, gameId, roomId, highestScore, gameMode, isFirstOpen} = config
                cc.sys.localStorage.setItem('userID', config.userId);
                cc.sys.localStorage.setItem('gameID', config.gameId);
                cc.sys.localStorage.setItem('roomID', config.roomId);
                return config;

                //const {userId, gameId, roomId, highestScore, gameMode, isFirstOpen} = this.config
            }
        } catch (e) {
            console.log("Error Parsing Config")
        }
    },

    GameSettings: function(){
        var defaultConfig = {
            default:null,
            reviveScore: 0,
            reviveEnabled: true,
            reviveLives: 1,
            reviveAdExistsDefault: true,
            autoAd: true,
            noDieScore: 10,
            stickyBannersEnabled: true,
            speed : 300
            };
            //return defaultConfig;
        if (typeof gameManager !== 'undefined') {
            try {
                var gameSettingString = gameManager.getGameSettings()
                var configlocal = JSON.parse(gameSettingString)
                return configlocal
            } catch (e) {
                return defaultConfig
            }
        } else {
            
            return defaultConfig;
        }
    },

    GameStart: function(){
        if (typeof gameManager !== 'undefined') {
            try {
               
                gameManager.onGameStart()
            } catch (e) {
                gameManager.onError(e.stack.toString())
            }
        }
    },

    ShowStickyAds: function(stickyBannersEnabled){
        if (stickyBannersEnabled === true && typeof gameManager !== 'undefined' && typeof gameManager.showStickyAds === 'function') {
            cc.game.on('adShown', () => {
                /* do something when ad is shown after showStickyAds call */
                console.log("showing sticky ads");
            })
            cc.game.on('adNotShown', () => {
                /* do something when ad is not shown after showStickyAds call */
            })
            gameManager.showStickyAds('bottom')
        }
    },

    MxPlayerGameStartData: function(){
        //console.log("called game start event");
        var isopen = cc.sys.localStorage.getItem("isopen1");
        var type = "first";
        if(isopen != null){

            type = "new"

        }
        else{

            //cc.sys.localStorage.setItem("isopen","first");

        }
        if (typeof gameManager !== 'undefined') {
            try {
                var obj = {
                    userID: String(cc.sys.localStorage.getItem('userID')),
                    gameID: String(cc.sys.localStorage.getItem('gameID')),
                    roomID: String(cc.sys.localStorage.getItem('roomID')),
                    startType: type,
                }
                var data = JSON.stringify(obj)
                gameManager.onTrack('gameStart', data)
            } catch (e) {
                gameManager.onError(e.stack.toString())
            }
        }
    },

});