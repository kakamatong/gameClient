import { _decorator} from 'cc';
import FGUIGameView from '../fgui/test/FGUIGameView';
import { SocketManager } from '../frameworks/socketManager';
import { LogColors } from '../frameworks/framework';
import { DataCenter } from '../datacenter/datacenter'
import { GameData } from '../datacenter/gamedata';
import { SELF_LOCAL } from '../datacenter/interfaceGameConfig';
const { ccclass, property } = _decorator;
@ccclass('GameView')
export class GameView extends FGUIGameView {
    constructor(){
        super();
    }

    onEnable(){
        GameData.instance.maxPlayer = 2;
        SocketManager.instance.sendToServer('connectGame', { code:1 }, this.respConnectGame.bind(this))
        SocketManager.instance.addServerReport("reportGamePlayerInfo", this.onReportGamePlayerInfo.bind(this));
    }

    onDisable(){

    }

    onShow(){
        console.log('TestView onShow');
    }

    onBtnClose(){
        console.log('onBtnClose');
        this.dispose();
    }

    respConnectGame(data: any): void {
        if(data.code == 0){
            console.log(LogColors.green(data.msg));
        }else{
            console.log(LogColors.red(data.msg));
        }
    }

    showPlayerInfo(seat:number):void{
        const playerInfo = GameData.instance.playerList[seat];
        if(playerInfo){
            if(seat == SELF_LOCAL){
                this.UI_TXT_NICKNAME_1.text = playerInfo.nickname;
                this.UI_TXT_USERID_1.text = playerInfo.userid.toString();
            }else if (seat == 2){
                this.UI_TXT_NICKNAME_2.text = playerInfo.nickname;
                this.UI_TXT_USERID_2.text = playerInfo.userid.toString();
            }
        }
    }

    onReportGamePlayerInfo(data: any): void {
        const selfid = DataCenter.instance.userid;
        if(data.userid == selfid){
            GameData.instance.playerList[SELF_LOCAL] = data;
            this.showPlayerInfo(SELF_LOCAL);
        }else{
            const local = GameData.instance.seat2local(data.seat);
            GameData.instance.playerList[local] = data;
            this.showPlayerInfo(local);
        }
    }
    
}
