// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var ScoreManager = require("ScoreManager");
var UiController = require("UiController");
var AudioManager = require("AudioManager");
var MxPlayerEventManager = require("MxPlayerEventManager");


var Chain = require("Chain");
cc.Class({
    extends: cc.Component,

    properties: {
        
        playerState:0,

        //state 0: can start throwing hook:idle
        // state 1: increasing rope::
        //state 2 : swinging
        //state 3: mving to the end
        //state 4: do nothing
        //state 5: dead
        //state 6:Power up

        speedOfBackMovement:-10,
        chain:{
            default:null,
            type:Chain,
        },
        chainEndPosition:{
            default:null,
            type:cc.Node,
        },

        validTouch:true,
        swing:false,
        anim :null,

        animationNames:{
            default:[],
            type:[cc.String],
        },
        isTouchUsed:false,
        platformBelowNode:null,
        

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        cc.game.on("touchBegan", this.OnTouched, this);
        cc.game.on("touchEnded", this.OnTouchEnded,this);

        //cc.game.on("touchMoved", this.OnTouched,this);
        // cc.game.on("swing", this.Swing,this);
        //cc.game.on("CanHook",this.CanHook, this);

        cc.game.on("swingOver",this.ReachingSurfaceAnimation,this);
        cc.game.on("movePlayerToEnd",this.MovePlayerToEnd,this);
        cc.game.on("useJetPack",this.StartUsingJetPack,this);

        this.anim = this.getComponent(cc.Animation);
        



    },


    start () {

        this.CheckForPlatformBelow();
        this.CheckForPlatformEnd();
        UiController._instance.PauseGame();
        //this.PowerUpUsed();
        
    },


    update (dt) {


        if(this.playerState == 5)return;
        if(this.playerState == 0){
            //can throw hook:idle
            
        }
        else if(this.playerState == 1){
            //increase rope:
            this.node.x += this.speedOfBackMovement * dt;
            if(this.CheckForPlatformBelow() == 0){
                this.PlayerDead();
            }
        }
        else if(this.playerState == 2){
            //swinging
            this.FollowChainEnd()
        }
        else if(this.playerState == 3){
            //move to end::
            this.node.x += 200*dt;
            if(this.CheckForPlatformEnd() == 0){
                //this.playerState = 0; //reached end so player is idle
                //cc.game.emit("spawnnew");
                AudioManager._instance.Stop(0);
                this.SetPlayerState(0);
                console.log("changed to idle");
            }
            
        }

    },


    OnTouched:function(event){
        
        this.isTouchNotUsed = true;
        if(Global.isGamePaused || Global.isGameOver)return;
        if(this.playerState != 0)return;//if idle can throw hook

        this.chain.OnHooked(this.node.getPosition());
        this.SetPlayerState(1);// this.playerState = 1; //chain is hooked and increasing:
        AudioManager._instance.Play(1);
        //this.anim.play(this.animationNames[this.playerState]);
        //console.log("touch started");

    },


    OnTouchEnded:function(event){

        
        if(Global.isGamePaused || Global.isGameOver)return;
        if(this.playerState != 1)return; //if not increaing rope state return;
        this.chain.OnRelease();
        this.SetPlayerState(2)//this.playerState = 2; //player is swinging after release
        AudioManager._instance.Stop(1);
        //console.log("touch ended");
    },


    FollowChainEnd:function(){

        var finalCoordinates = this.chainEndPosition.parent.convertToWorldSpaceAR(this.chainEndPosition.getPosition())
        finalCoordinates = this.node.parent.convertToNodeSpaceAR(finalCoordinates)
        this.node.setPosition(finalCoordinates);

    },

    
    CheckForPlatformBelow:function(){
        var rayDist = 160;
        var p1 = this.node.parent.convertToWorldSpaceAR(this.node.getPosition());
        var p2 = this.node.parent.convertToWorldSpaceAR(this.node.getPosition().add(cc.v3(0,-1*rayDist,0)));

        

        var results;
         results = cc.director.getPhysicsManager().rayCast(p1, p2, cc.RayCastType.All);
         for (var i = 0; i <results.length; i ++) {
            
            //console.log("in check ");

            var result = results [i];
            var collider = result.collider;
            if(collider.tag == 1){//platform tag
                platformBelowNode = collider.node;
                //console.log("safelylanded");
                return  1;
            }
            var point = result.point;
            var normal = result.normal;
            var fraction = result.fraction;
        }

        //console.log("Game over");
        return 0;
    },


    CheckForPlatformEnd:function(){
        var rayDist = 160;

        var temp = this.node.getPosition();
        temp.x += 60;
        var p1 = this.node.parent.convertToWorldSpaceAR(temp);

        temp = this.node.getPosition().add(cc.v3(0,-1*rayDist,0));
        temp.x += 60;
        var p2 = this.node.parent.convertToWorldSpaceAR(temp);
        
        

        //console.log("in check ");

        var results = cc.director.getPhysicsManager().rayCast(p1, p2, cc.RayCastType.All);
         for (var i = 0; i <results.length; i ++) {
            

            var result = results [i];
            var collider = result.collider;
            if(collider.tag == 1){//platform tag
                
                //console.log("safelylanded");
                //console.log("found a platform below");
                return  1;
            }
            var point = result.point;
            var normal = result.normal;
            var fraction = result.fraction;
        }
        return 0;
    },


    CheckIfDeadElseMove:function(event){
        if(this.CheckForPlatformBelow()== 0){
            this.PlayerDead();
        }
        else{

            if(this.playerState == 5)return;
            //platformBelowNode.destroy();;
            platformBelowNode.getComponent("ThornDestroyer")?.DestroyThorns();
            /*if(this.thornDestroyer != null){
                console.log("thorn destroyer is not null");
            }*/
            console.log("safely landed")
            AudioManager._instance.Play(2);
            ScoreManager._instance.UpdateScore(1);
            //this.playerState = 3;
            cc.game.emit("attach");
            //this.SetPlayerState(3);

        }
    },

    PlayerDead:function(){
        if(this.playerState == 5)return;
        
        this.chain.getComponent("Chain").SetRopeInitials();
        this.SetPlayerState(5);

        this.PlayDeathAnimation();
        Global.isGameOver = true;
        //this.playerState = 4;
    },

    ReachingSurfaceAnimation:function(){
        
        this.SetPlayerState(4);
        cc.tween(this.node)
        .to(0.3,{y:0},{easing:"quartIn"})       
        .call(()=>{this.CheckIfDeadElseMove()})
        .start();
    },


    PlayDeathAnimation:function(){
        // cc.tween(this.node)
        console.log("player dead");

        cc.tween(this.node).by(0.7,{y:-1400},{easing:"quadIn"}).call(()=>{AudioManager._instance.Play(3);UiController._instance.GameOver();}).start();
    },


    MovePlayerToEnd:function(){
        //play walking forward sounds;;
        AudioManager._instance.Play(0);
        this.SetPlayerState(3);
    },


    SetPlayerState(state){

        this.playerState = state;
        if(state == 5 || state == 6)state -= 1;
        if(state < this.animationNames.length){
            //console.log(state);
            
            this.anim.play(this.animationNames[state]);
        }

    },


    PowerUpButtonClicked:function(){
        if(this.playerState != 0)return;
        cc.game.emit("powerUpActivated");
        
    },
    ShieldPowerAdClick:function(){
        if(this.playerState != 0)return;
        MxPlayerEventManager._instance.onShowRewardedVideoAdsStart();
    },
    
    StartUsingJetPack:function(data){
        ScoreManager._instance.UpdateScore(10);
        finalDestinationX = this.node.parent.convertToNodeSpaceAR(data.pos).x;
        //console.log("data "+ finalDestinationX);

        this.SetPlayerState(6);//PowerUp mode;;
        this.PowerUpTweenAnimation(finalDestinationX);
    },

    PowerUpTweenAnimation:function(finalDestinationX){
        cc.tween(this.node)
        .to(3,{x:finalDestinationX})
        .call(()=>{this.ReachingSurfaceAnimation();})
        .start()
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {

        if(otherCollider.tag == 5){
            
            this.PlayerDead();
        }
    },
    onCollisionEnter: function (other, self) {
        if(other.tag == 5){
            this.PlayerDead();
        }
    },

});
