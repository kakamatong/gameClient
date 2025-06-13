import { _decorator} from 'cc';
import FGUIGameView from '../fgui/test/FGUIGameView';
import { SocketManager } from '../frameworks/socketManager';
import { LogColors } from '../frameworks/framework';
import { DataCenter } from '../datacenter/datacenter'
import { GameData } from '../datacenter/gamedata';
import { SELF_LOCAL ,ENUM_GAME_STEP, PLAYER_ATTITUDE,HAND_FLAG,PLAYER_STATUS} from '../datacenter/interfaceGameConfig';
import { UIManager } from '../frameworks/uimanager';
const { ccclass, property } = _decorator;
@ccclass('GameView')
export class GameView extends FGUIGameView {
    private _selectOutHand:number = 0;
    constructor(){
        super();
    }

    onEnable(){
        GameData.instance.maxPlayer = 2;
        SocketManager.instance.sendToServer('connectGame', { code:1 }, this.respConnectGame.bind(this))
        SocketManager.instance.addServerReport("reportGamePlayerInfo", this.onReportGamePlayerInfo.bind(this));
        SocketManager.instance.addServerReport("reportGameStep", this.onReportGameStep.bind(this));
        SocketManager.instance.addServerReport("reportGamePlayerAttitude", this.onReportGamePlayerAttitude.bind(this));
        SocketManager.instance.addServerReport("reportGameOutHand", this.onReportGameOutHand.bind(this));
        SocketManager.instance.addServerReport("reportGameRoundResult", this.onReportGameRoundResult.bind(this));
    }

    onReportGameRoundResult(data: any): void {
        console.log('onReportGameRoundResult', data);

        if(data.info.seat == GameData.instance.getSelfSeat()){
            this.UI_TXT_GAME_MSG.text = '本局胜利';
        }else{
            this.UI_TXT_GAME_MSG.text = '本局失败';
        }
    }

    onDisable(){
        SocketManager.instance.removeServerReport("reportGamePlayerInfo");
        SocketManager.instance.removeServerReport("reportGameStep");
        SocketManager.instance.removeServerReport("reportGamePlayerAttitude");
        SocketManager.instance.removeServerReport("reportGameOutHand");
        SocketManager.instance.removeServerReport("reportGameRoundResult");
    }

    onShow(){
        console.log('TestView onShow');
    }

    onBtnClose(){
        console.log('onBtnClose');
        //this.dispose();
        UIManager.instance.hideView('GameView');
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
                this.UI_TXT_STATUS_1.text = this.getPlayerStatusText(playerInfo.status);
            }else if (seat == 2){
                this.UI_TXT_NICKNAME_2.text = playerInfo.nickname;
                this.UI_TXT_USERID_2.text = playerInfo.userid.toString();
                this.UI_TXT_STATUS_2.text = this.getPlayerStatusText(playerInfo.status);
            }
        }
    }

    getPlayerStatusText(status:number):string{
        switch(status){
            case PLAYER_STATUS.LOADING:
                return '加载中';
            case PLAYER_STATUS.OFFLINE:
                return '离线';
            case PLAYER_STATUS.PLAYING:
                return '游戏中';
            default:
                return '未知';
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

    onReportGameStep(data: any): void {
        GameData.instance.gameStep = data.stepid;
        switch(GameData.instance.gameStep){
            case ENUM_GAME_STEP.START:
                this.UI_TXT_GAME_STEP.text = '游戏阶段：开始';
                break;
            case ENUM_GAME_STEP.OUT_HAND:
                this.UI_TXT_GAME_STEP.text = '游戏阶段：出招';
                break;
            case ENUM_GAME_STEP.ROUND_END:
                this.UI_TXT_GAME_STEP.text = '游戏阶段：回合结束';
                break;
            case ENUM_GAME_STEP.GAME_END:
                this.UI_TXT_GAME_STEP.text = '游戏阶段：游戏结束';
                break;
        }
    }

    onReportGamePlayerAttitude(data: any): void {
        console.log('onReportGamePlayerAttitude', data);
        const local = GameData.instance.seat2local(data.seat);
        const player = GameData.instance.getPlayerBySeat(data.seat);
        if(local == SELF_LOCAL){
            if(data.att == PLAYER_ATTITUDE.THINKING){
                this.ctrl_out.setSelectedIndex(1);
            }else if(data.att == PLAYER_ATTITUDE.READY){
                this.ctrl_out.setSelectedIndex(0);
            }else if(data.att == PLAYER_ATTITUDE.OUT_HAND){
                this.ctrl_out.setSelectedIndex(0);
            }

        }else if(local == 2){
            if(data.att == PLAYER_ATTITUDE.THINKING){
                this.UI_TXT_OUT_HAND_2.text = '思考';
            }else if(data.att == PLAYER_ATTITUDE.READY){
                this.UI_TXT_OUT_HAND_2.text = '准备';
            }else if(data.att == PLAYER_ATTITUDE.OUT_HAND){
                //this.UI_TXT_OUT_HAND_2.text = '出招';
            }
        }
    }

    getOutHandCNName(flag:number):string{
        if(flag == HAND_FLAG.ROCK){
            return '石头';
        }else if(flag == HAND_FLAG.PAPER){
            return '剪刀';
        }else if(flag == HAND_FLAG.SCISSORS){
            return '布';
        }
        return '';
    }

    onBtnPaper(){
        console.log('onBtnPaper');
        this.UI_TXT_OUT_HAND_1.text = this.getOutHandCNName(HAND_FLAG.PAPER);
        this._selectOutHand = HAND_FLAG.PAPER;
    }

    onBtnRock(){
        console.log('onBtnRock');
        this.UI_TXT_OUT_HAND_1.text = this.getOutHandCNName(HAND_FLAG.ROCK);
        this._selectOutHand = HAND_FLAG.ROCK;
    }

    onBtnScissors(){
        console.log('onBtnScissors');
        this.UI_TXT_OUT_HAND_1.text = this.getOutHandCNName(HAND_FLAG.SCISSORS);
        this._selectOutHand = HAND_FLAG.SCISSORS;
    }

    onBtnSure(){
        console.log('onBtnSure');
        SocketManager.instance.sendToServer('gameOutHand', { gameid: DataCenter.instance.gameid, roomid: DataCenter.instance.roomid, flag:this._selectOutHand })
    }

    onReportGameOutHand(data: any): void {
        console.log('onReportGameOutHand', data);
        const local = GameData.instance.seat2local(data.seat);
        if(local == SELF_LOCAL){
            this.UI_TXT_OUT_HAND_1.text = this.getOutHandCNName(data.flag);
        }else if(local == 2){
            this.UI_TXT_OUT_HAND_2.text = this.getOutHandCNName(data.flag);
        }
    }
    
}
