
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
            
        }else if(data.att == PLAYER_ATTITUDE.READY){
            this.showSignReady(local)
        }else if(data.att == PLAYER_ATTITUDE.OUT_HAND){
            
        }
    }

    onGameOutHand(data:any):void{
        
    }

    onGameRoundResult(data:any):void{
        
    }

    onRoomEnd(data:any):void{
        
    }

    onSvrPlayerInfos(data:any):void{
        
    }

    onSvrGameStart(data:any):void{
        
    }

    onSvrGameEnd(data:any):void{
        
    }

    onSvrPlayerEnter(data:any):void{
        
    }

    onSvrPlayerStatusUpdate(data:any):void{
        
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

    showSignReady(localSeat:number):void{
        this.getChild<fgui.GImage>(`UI_IMG_SIGN_READY_${localSeat}`).visible = true
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