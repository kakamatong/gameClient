import { _decorator} from 'cc';
import FGUIGameView from '../fgui/test/FGUIGameView';
import { GameSocketManager } from '../frameworks/gameSocketManager';
import { LogColors } from '../frameworks/framework';
import { DataCenter } from '../datacenter/datacenter'
import { GameData } from '../datacenter/gamedata';
import { SELF_LOCAL ,ENUM_GAME_STEP, PLAYER_ATTITUDE,HAND_FLAG,PLAYER_STATUS,SEAT_2,SEAT_1,ROOM_END_FLAG} from '../datacenter/interfaceGameConfig';
import { UIManager } from '../frameworks/uimanager'
import { Match } from '../modules/match';
const { ccclass, property } = _decorator;
@ccclass('GameView')
export class GameView extends FGUIGameView {
    private _selectOutHand:number = 0;
    constructor(){
        super();
    }

    onEnable(){
        super.onEnable();
        GameData.instance.maxPlayer = 2;
        GameSocketManager.instance.sendServer("room","clientReady",{})
        GameSocketManager.instance.addServerListen("roomInfo", this.onRoomInfo.bind(this));
        GameSocketManager.instance.addServerListen("gameStep", this.onGameStep.bind(this));
        GameSocketManager.instance.addServerListen("gamePlayerAttitude", this.onGamePlayerAttitude.bind(this));
        GameSocketManager.instance.addServerListen("gameOutHand", this.onGameOutHand.bind(this));
        GameSocketManager.instance.addServerListen("gameRoundResult", this.onGameRoundResult.bind(this));
        GameSocketManager.instance.addServerListen("roomEnd", this.onRoomEnd.bind(this));
    }

    onDisable(){
        super.onDisable();
        GameSocketManager.instance.removeServerListen("roomInfo");
        //GameSocketManager.instance.removeServerListen("reportGamePlayerInfo");
        GameSocketManager.instance.removeServerListen("gameStep");
        GameSocketManager.instance.removeServerListen("gamePlayerAttitude");
        GameSocketManager.instance.removeServerListen("gameOutHand");
        GameSocketManager.instance.removeServerListen("gameRoundResult");
        GameSocketManager.instance.removeServerListen("roomEnd");
    }

    //房间销毁
    onRoomEnd(data:any){
        const msg = "房间销毁"
        if(data.code == ROOM_END_FLAG.GAME_END){
            console.log("游戏结束 " + msg)
        }else if(data.code == ROOM_END_FLAG.OUT_TIME_WAITING){
            console.log("等待超时 " + msg)
            this.onBtnClose()
        }else if(data.code == ROOM_END_FLAG.OUT_TIME_PLAYING){
            console.log("游戏超时 " + msg)
            this.onBtnClose()
        }
    }

    dealSeatInfo(data:any){
        const selfid = DataCenter.instance.userid;
        for(let i = 0; i < data.playerids.length; i++){
            const userid = data.playerids[i];
            const svrSeat = i + 1
            if (userid == selfid) {
                GameData.instance.playerList[SELF_LOCAL] = {
                    userid:userid,
                    svrSeat: svrSeat
                }
            }
        }

        for(let i = 0; i < data.playerids.length; i++){
            const userid = data.playerids[i];
            const svrSeat = i + 1
            if (userid != selfid) {
                const localSeat = GameData.instance.seat2local(i + 1);
                GameData.instance.playerList[localSeat] = {
                    userid:userid,
                    svrSeat: svrSeat
                }
            }
        }
    }

    // 房间信息
    onRoomInfo(data:any){
        console.log(data)
        this.dealSeatInfo(data);
        this.showPlayerInfo();
    }

    // 游戏回合结果
    onGameRoundResult(data: any): void {
        console.log('******************onGameRoundResult', data);
        console.log('selfSeat ', GameData.instance.getSelfSeat())
        const selfSeat = GameData.instance.getSelfSeat()
        if (data.info && data.info.length > 0){
            for (let i = 0; i < data.info.length; i++){
                const info = data.info[i];
                if(info.seat == selfSeat){
                    if(info.endResult == 1){
                        console.log(LogColors.green("本局胜利"))
                        this.UI_TXT_GAME_MSG.text = '本局胜利';
                    }else if(info.endResult == 2){
                        console.log(LogColors.green("本局平"))
                        this.UI_TXT_GAME_MSG.text = '本局平';
                    }else{
                        console.log(LogColors.red("本局失败"))
                        this.UI_TXT_GAME_MSG.text = '本局失败';
                    }
                    break
                }
            }
        }

        this.UI_BTN_CONTINUE.visible = true
    }

    onShow(){
        console.log('TestView onShow');
    }

    onBtnClose(){
        console.log('onBtnClose');
        //this.dispose();
        UIManager.instance.hideView('GameView');
    }

    // 显示玩家信息
    showPlayerInfo():void{
        const players = GameData.instance.playerList;
        for(let i = 1; i <= players.length; i++){
            const playerInfo = players[i];
            if(i == SEAT_1){
                this.UI_TXT_NICKNAME_1.text = playerInfo.nickname ?? "";
                this.UI_TXT_USERID_1.text = playerInfo.userid.toString();
                this.UI_TXT_STATUS_1.text = this.getPlayerStatusText(playerInfo.status ?? 0);
            }else if (i == SEAT_2){
                this.UI_TXT_NICKNAME_2.text = playerInfo.nickname ?? "";
                this.UI_TXT_USERID_2.text = playerInfo.userid.toString();
                this.UI_TXT_STATUS_2.text = this.getPlayerStatusText(playerInfo.status ?? 0);
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

    // 游戏阶段
    onGameStep(data: any): void {
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

    // 游戏玩家状态
    onGamePlayerAttitude(data: any): void {
        console.log('onGamePlayerAttitude', data);
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
            return '布';
        }else if(flag == HAND_FLAG.SCISSORS){
            return '剪刀';
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
        GameSocketManager.instance.sendServer('logic','gameOutHand', { gameid: DataCenter.instance.gameid, roomid: DataCenter.instance.roomid, flag:this._selectOutHand })
    }

    onGameOutHand(data: any): void {
        console.log('onGameOutHand', data);
        const local = GameData.instance.seat2local(data.seat);
        if(local == SELF_LOCAL){
            this.UI_TXT_OUT_HAND_1.text = this.getOutHandCNName(data.flag);
        }else if(local == 2){
            this.UI_TXT_OUT_HAND_2.text = this.getOutHandCNName(data.flag);
        }
    }

    onBtnContinue(){
        Match.instance.req();
        UIManager.instance.hideView('GameView');
    }
    
}
