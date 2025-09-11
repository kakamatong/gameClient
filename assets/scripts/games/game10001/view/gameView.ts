
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
        
    }

    onGamePlayerAttitude(data:any):void{
        
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