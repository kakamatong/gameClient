
import FGUIGameView from '../../../fgui/game10001/FGUIGameView';
import FGUICompHand from '../../../fgui/game10001/FGUICompHand';
import { GameSocketManager } from '../../../frameworks/gameSocketManager';
import { LogColors } from '../../../frameworks/framework';
import { DataCenter } from '../../../datacenter/datacenter'
import { GameData } from '../data/gamedata';
import { SELF_LOCAL ,ENUM_GAME_STEP, PLAYER_ATTITUDE,HAND_FLAG,PLAYER_STATUS,SEAT_2,SEAT_1,ROOM_END_FLAG, HAND_INDEX} from '../data/interfaceGameConfig';
import { Match } from '../../../modules/match';
import { UserStatus } from '../../../modules/userStatus';
import * as fgui from "fairygui-cc";
import { CompClock } from './comp/compClock';
import { PopMessageView } from '../../../view/common/popMessageView';
import { LobbyView } from '../../../view/lobby/lobbyView';
import { ENUM_POP_MESSAGE_TYPE } from '../../../datacenter/interfaceConfig';
export class GameView extends FGUIGameView {
    private _selectOutHand:number = -1;
    
    onConstruct(){
        super.onConstruct();
        GameData.instance.init();
        GameData.instance.maxPlayer = 2;
        if(DataCenter.instance.shortRoomid){
            GameData.instance.isPrivateRoom = true;
        }
        
        this.initListeners()
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.removeListeners();
    }

    show(data:any){
        // 客户端进入完成
        GameSocketManager.instance.sendToServer("clientReady",{})
        this.ctrl_select.onChanged(this.onChanged, this)
    }

    initListeners(){
        GameSocketManager.instance.addServerListen("roomInfo", this.onRoomInfo.bind(this));
        GameSocketManager.instance.addServerListen("stepId", this.onGameStep.bind(this));
        GameSocketManager.instance.addServerListen("playerAtt", this.onGamePlayerAttitude.bind(this));
        GameSocketManager.instance.addServerListen("outHandInfo", this.onGameOutHand.bind(this));
        GameSocketManager.instance.addServerListen("roundResult", this.onGameRoundResult.bind(this));
        GameSocketManager.instance.addServerListen("roomEnd", this.onRoomEnd.bind(this));
        GameSocketManager.instance.addServerListen("playerInfos", this.onSvrPlayerInfos.bind(this));
        GameSocketManager.instance.addServerListen("gameStart", this.onSvrGameStart.bind(this));
        GameSocketManager.instance.addServerListen("gameEnd", this.onSvrGameEnd.bind(this));
        GameSocketManager.instance.addServerListen("playerEnter", this.onSvrPlayerEnter.bind(this));
        GameSocketManager.instance.addServerListen("playerStatusUpdate", this.onSvrPlayerStatusUpdate.bind(this));
        GameSocketManager.instance.addServerListen("playerLeave", this.onSvrPlayerLeave.bind(this));
        GameSocketManager.instance.addServerListen("gameClock", this.onSvrGameClock.bind(this));
    }

    removeListeners():void{ 
        GameSocketManager.instance.removeServerListen("roomInfo");
        GameSocketManager.instance.removeServerListen("stepId");
        GameSocketManager.instance.removeServerListen("playerAtt");
        GameSocketManager.instance.removeServerListen("outHandInfo");
        GameSocketManager.instance.removeServerListen("roundResult");
        GameSocketManager.instance.removeServerListen("roomEnd");
        GameSocketManager.instance.removeServerListen("playerInfos");
        GameSocketManager.instance.removeServerListen("gameStart");
        GameSocketManager.instance.removeServerListen("gameEnd");
        GameSocketManager.instance.removeServerListen("playerEnter");
        GameSocketManager.instance.removeServerListen("playerStatusUpdate");
        GameSocketManager.instance.removeServerListen("playerLeave");
        GameSocketManager.instance.removeServerListen("gameClock");

    }

    showClock(bshow:boolean, clock?:number):void{
        if (bshow) {
            const compClock = this.UI_COMP_CLOCK as CompClock
            compClock.visible = true;
            compClock.start(clock || 10);
        }else{
            const compClock = this.UI_COMP_CLOCK as CompClock
            compClock.visible = false;
        }
    }

    onSvrGameClock(data:any):void{
        this.showClock(true, data.time)
    }

    onGameStep(data:any):void{
        GameData.instance.gameStep = data.stepid;
    }

    onGamePlayerAttitude(data:any):void{
        const local = GameData.instance.seat2local(data.seat);
        if(data.att == PLAYER_ATTITUDE.THINKING){
            this.onPlayerThinking(local)
        }else if(data.att == PLAYER_ATTITUDE.READY){
            if (local != SELF_LOCAL) {
                this.showSignReady(local, true)
                this.showThinking(false)
            }
        }else if(data.att == PLAYER_ATTITUDE.OUT_HAND){
            // 隐藏时钟
            this.showClock(false)
            // 隐藏准备标签
            this.showSignReady(local, false)
            if (local == SELF_LOCAL) {
                // 隐藏按钮和选择
                this.ctrl_btn.selectedIndex = 0
                this.UI_GROUP_SELECT.visible = false
            }else{
                this.showThinking(false)
            }
            
        }
    }

    showOutHand(local:number, index:number){
        const outHand = this.getChild<FGUICompHand>(`UI_COMP_OUT_HEAD_${local}`)
        outHand.ctrl_head.selectedIndex = index
        outHand.visible = true
    }

    onGameOutHand(data:any):void{
        const local = GameData.instance.seat2local(data.seat);
        const index = HAND_INDEX.indexOf(data.flag)
        this.showOutHand(local, index)
    }

    onGameRoundResult(data:any):void{
        
    }

    onRoomEnd(data:any):void{
        
    }

    onSvrPlayerInfos(data:any):void{
        console.log('onSvrPlayerInfos', data);
        GameData.instance.playerInfos = data.infos;
        for(let i = 0; i < data.infos.length; i++){
            const info = data.infos[i];
            const player = GameData.instance.getPlayerByUserid(info.userid);
            if (player) {
                player.nickname = info.nickname;
                player.headurl = info.headurl;
                player.sex = info.sex;
                player.province = info.province;
                player.city = info.city;
                player.ext = info.ext;
                player.ip = info.ip;
                player.status = info.status;
                const localSeat = GameData.instance.local2seat(player.svrSeat)
                this.showPlayerInfoBySeat(localSeat);
            }
        }
    }

    onSvrGameStart(data:any):void{
        GameData.instance.gameStart = true;
    }

    onSvrGameEnd(data:any):void{
        GameData.instance.gameStart = false;
    }

    onSvrPlayerEnter(data:any):void{
        const selfid = DataCenter.instance.userid;
        const svrSeat = data.seat;
        const userid = data.userid;
        const playerInfo = GameData.instance.getPlayerInfo(userid);
        if(playerInfo){
            playerInfo.svrSeat = svrSeat;
            playerInfo.userid = userid;
            let localSeat = 0
            if (selfid == userid) {
                localSeat = SELF_LOCAL
            }else{
                localSeat = GameData.instance.seat2local(svrSeat);
            }
            GameData.instance.playerList[localSeat] = playerInfo;

            if(GameData.instance.isPrivateRoom){
                if(playerInfo.status == PLAYER_STATUS.ONLINE && selfid == userid){
                    //this.UI_BTN_READY.visible = true;
                }
            }
            this.showPlayerInfoBySeat(localSeat);
        }
    }

    onSvrPlayerStatusUpdate(data:any):void{
        const player = GameData.instance.getPlayerByUserid(data.userid);
        if (player) {
            player.status = data.status;
            this.showPlayerInfoBySeat(GameData.instance.seat2local(player.svrSeat))
        }
    }

    showPlayerInfoBySeat(localseat:number):void{
        const player = GameData.instance.playerList[localseat];
        const nicknanme = this.getChild<fgui.GTextField>(`UI_TXT_NICKNAME_${localseat}`);
        const id = this.getChild<fgui.GTextField>(`UI_TXT_ID_${localseat}`)
        nicknanme.text = player.nickname ?? "";
        id.text = player.userid.toString();
        if (localseat != SELF_LOCAL) {
            if (player.status == PLAYER_STATUS.OFFLINE) {
                this.showOffLine(true)
            }
            this.UI_GROUP_PLAYER_2.visible = true
        }
    }

    showOffLine(bshow:boolean):void{ 
        this.UI_COMP_OFFLINE.visible = bshow;
    }

    onSvrPlayerLeave(data:any):void{
        
    }

    onRoomInfo(data:any):void{
        console.log(data)
        // 展示好友房信息
        if(DataCenter.instance.shortRoomid){
            const shortRoomid = `${DataCenter.instance.shortRoomid}`
            //this.UI_TXT_SHORT_ROOMID.text = shortRoomid.padStart(6, '0')
        }else{
            //this.UI_TXT_SHORT_ROOMID.visible = false
        }
    }

    showSignReady(localSeat:number, bshow:boolean):void{
        this.getChild<fgui.GImage>(`UI_IMG_SIGN_READY_${localSeat}`).visible = bshow
    }

    showThinking(bshow:boolean):void{
        this.UI_COMP_THINKING.visible = bshow;
    }

    onPlayerThinking(localSeat:number):void {
        if (localSeat == SELF_LOCAL) {
            this.UI_GROUP_SELECT.visible = true
        }else{
            this.showThinking(true)
        }
    }

    changeToLobbyView():void{
        if (GameSocketManager.instance.isOpen()) {
            GameSocketManager.instance.close()
        }
        const func = (b:boolean)=>{ 
            if (b) {
                GameView.hideView()
            }
        }
        LobbyView.showView(null, func)
    }

    onBtnBack(): void {
        if (GameData.instance.gameStart) {
            PopMessageView.showView({
                type:ENUM_POP_MESSAGE_TYPE.NUM1SURE,
                content: '游戏进行中，无法返回',
            })
        }else{
            this.changeToLobbyView()
        }
    }

    onBtnScissors(): void {
        
    }

    onBtnRock(): void {
        
    }

    onBtnPaper(): void {
    }

    onBtnSure(): void {
        
        this._selectOutHand = this.ctrl_select.selectedIndex
        GameSocketManager.instance.sendToServer('outHand', { gameid: DataCenter.instance.gameid, roomid: DataCenter.instance.roomid, flag:HAND_INDEX[this._selectOutHand] })
    }

    onChanged(event: any):void{
        if (event.selectedIndex != this._selectOutHand) {
            if (this._selectOutHand != -1) {
                this.ctrl_btn.selectedIndex = 2
            }else{
                this.ctrl_btn.selectedIndex = 1
            }
        }
    }
}
fgui.UIObjectFactory.setExtension(GameView.URL, GameView);