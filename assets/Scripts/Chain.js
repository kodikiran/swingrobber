// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var Chain = cc.Class({
    extends: cc.Component,

    properties: {

        hooked:false,
        released:false,
        swinging:false,
        player:{
            default:null,
            type:cc.Node,
        },
        hookPosition:cc.v2(0,0),
        heightScaleSpeed: 100,
        sprite:{
            default:null,
            type:cc.Sprite,
        },
        chainEnd:{
            default:null,
            type:cc.Node,
        },

        startingLength:50,
        chainstate:0,
        chainOffset:cc.v2(30,-70),
        //chain state 0:: idle
        // 1:: hooked and increasing
        //2:: swinging
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {


    },

    update (dt) {
        //if(this.hooked && !this.swinging){
        if(this.chainstate == 1){
            this.node.width += this.heightScaleSpeed*dt;
        }
    },

    OnHooked:function(pos){
        
        pos.x += this.chainOffset.x;
        pos.y += this.chainOffset.y;
        this.hookPosition = pos;
        this.node.position = pos;
        this.node.width += this.startingLength;
        //this.hooked = true;
       // this.swinging = false;

        this.chainstate = 1;//chain is hooked and expanding;

        this.sprite.enabled = true;
        

    },

    OnRelease:function(){

        //this.swinging=true;
        this.chainstate = 2; //chain is swinging
        
        //update chainEnd position::
        var worldplayerPosition = this.player.parent.convertToWorldSpaceAR(this.player.getPosition());
        worldplayerPosition.x += this.chainOffset.x;
        worldplayerPosition.y += this.chainOffset.y;
        var finalCoordinates = this.node.convertToNodeSpaceAR(worldplayerPosition);
        this.chainEnd.setPosition(finalCoordinates);
        this.SwingAnimation();
        


    },

    OnReachedSurface:function(){
        cc.game.emit("reachedSurface");
    },
    
    SwingAnimation:function(){

        cc.tween(this.node)
        .by(.7,{angle:210},{easing:"sineInOut"})
        .call(()=>{cc.game.emit('swingOver');this.SetRopeInitials()})
        .start();

    },

    SetRopeInitials:function(){
        
        this.chainstate = 0; //chain state is idle;
        //this.OnReachedSurface();
        this.node.angle = 0;
        this.node.width = 0;
        this.sprite.enabled = false;

    },



});
