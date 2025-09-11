
import FGUIGameView from '../../../fgui/game10001/FGUIGameView';
import { GameSocketManager } from '../../../frameworks/gameSocketManager';
import { LogColors } from '../../../frameworks/framework';
import { DataCenter } from '../../../datacenter/datacenter'
import { GameData } from '../data/gamedata';
import { SELF_LOCAL ,ENUM_GAME_STEP, PLAYER_ATTITUDE,HAND_FLAG,PLAYER_STATUS,SEAT_2,SEAT_1,ROOM_END_FLAG} from '../data/interfaceGameConfig';
import { Match } from '../../../modules/match';
import { UserStatus } from '../../../modules/userStatus';
import * as fgui from "fairygui-cc";
export class GameView extends FGUIGameView {
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

    }

    onGameStep(data:any):void{
        GameData.instance.gameStep = data.stepid;
    }

    onGamePlayerAttitude(data:any):void{
        const local = GameData.instance.seat2local(data.seat);
        if(data.att == PLAYER_ATTITUDE.THINKING){
            this.onPlayerThinking(local)
        }else if(data.att == PLAYER_ATTITUDE.READY){
            this.showSignReady(local, true)
            this.showThinking(false)
        }else if(data.att == PLAYER_ATTITUDE.OUT_HAND){
            this.showSignReady(local, false)
        }
    }

    onGameOutHand(data:any):void{
        
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
        
    }

    onSvrGameEnd(data:any):void{
        
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
        this.getChild<fgui.GTextField>(`UI_TXT_NICKNAME_${localseat}`).text = player.nickname ?? "";
        this.getChild<fgui.GTextField>(`UI_TXT_ID_${localseat}`).text = player.userid.toString();
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
        if (bshow) {
            this.UI_COMP_THINKING.visible = true;
        }
    }

    onPlayerThinking(localSeat:number):void {
        if (localSeat == SELF_LOCAL) {
            this.UI_GROUP_SELECT.visible = true
        }else{
            this.showThinking(true)
        }
    }

    onBtnBack(): void {
        
    }

    onBtnScissors(): void {
        
    }

    onBtnRock(): void {
        
    }

    onBtnPaper(): void {
    }
}
fgui.UIObjectFactory.setExtension(GameView.URL, GameView);