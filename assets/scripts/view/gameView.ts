import { _decorator, Color} from 'cc';
import FGUIGameView from '../fgui/test/FGUIGameView';
import { GameSocketManager } from '../frameworks/gameSocketManager';
import { LogColors } from '../frameworks/framework';
import { DataCenter } from '../datacenter/datacenter'
import { GameData } from '../datacenter/gamedata';
import { SELF_LOCAL ,ENUM_GAME_STEP, PLAYER_ATTITUDE,HAND_FLAG,PLAYER_STATUS,SEAT_2,SEAT_1,ROOM_END_FLAG} from '../datacenter/interfaceGameConfig';
import { UIManager } from '../frameworks/uimanager'
import { Match } from '../modules/match';
import { UserStatus } from '../modules/userStatus';
import { DismissRoomComponent } from './DismissRoomComponent';
import * as fgui from "fairygui-cc";
const { ccclass, property } = _decorator;
@ccclass('GameView')
export class GameView extends FGUIGameView {
    private _selectOutHand:number = 0;
    private _isPrivateRoom:boolean = false;
    private _dismissRoomPanel: DismissRoomComponent | null = null; // 投票解散面板
    constructor(){
        super();
    }

    onEnable(){
        super.onEnable();
        GameData.instance.init();
        GameData.instance.maxPlayer = 2;
        if(DataCenter.instance.shortRoomid){
            this._isPrivateRoom = true;
            // 私人房显示解散按钮
            this.UI_BTN_DISMISS_ROOM.visible = true;
        } else {
            // 非私人房隐藏解散按钮
            this.UI_BTN_DISMISS_ROOM.visible = false;
        }
        GameSocketManager.instance.sendToServer("clientReady",{})
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
        // 投票解散相关消息监听
        GameSocketManager.instance.addServerListen("voteDisbandStart", this.onVoteDisbandStart.bind(this));
        GameSocketManager.instance.addServerListen("voteDisbandUpdate", this.onVoteDisbandUpdate.bind(this));
        GameSocketManager.instance.addServerListen("voteDisbandResult", this.onVoteDisbandResult.bind(this));
    }

    onDisable(){
        super.onDisable();
        GameSocketManager.instance.removeServerListen("roomInfo");
        //GameSocketManager.instance.removeServerListen("reportGamePlayerInfo");
        GameSocketManager.instance.removeServerListen("stepId");
        GameSocketManager.instance.removeServerListen("playerAtt");
        GameSocketManager.instance.removeServerListen("outHandInfo");
        GameSocketManager.instance.removeServerListen("roundResult");
        GameSocketManager.instance.removeServerListen("roomEnd");
        GameSocketManager.instance.removeServerListen("playerInfos");
        GameSocketManager.instance.removeServerListen("gameStart");
        GameSocketManager.instance.removeServerListen("gameEnd");
        GameSocketManager.instance.removeServerListen("playerStatusUpdate");
        GameSocketManager.instance.removeServerListen("playerLeave");
        // 移除投票解散相关消息监听
        GameSocketManager.instance.removeServerListen("voteDisbandStart");
        GameSocketManager.instance.removeServerListen("voteDisbandUpdate");
        GameSocketManager.instance.removeServerListen("voteDisbandResult");
        
        // 清理投票解散面板
        this.clearDismissRoomPanel();
    }

    hideHead(localseat:number){
        this.getChild<fgui.GTextField>(`UI_TXT_NICKNAME_${localseat}`).visible = false
        this.getChild<fgui.GTextField>(`UI_TXT_USERID_${localseat}`).visible = false
        this.getChild<fgui.GTextField>(`UI_TXT_STATUS_${localseat}`).visible = false
    }

    onSvrPlayerLeave(data:any){
        const localSeat = GameData.instance.seat2local(data.seat);
        GameData.instance.playerList.splice(localSeat, 1)
        this.hideHead(localSeat)
    }

    onSvrPlayerStatusUpdate(data:any){
        const player = GameData.instance.getPlayerByUserid(data.userid);
        if (player) {
            player.status = data.status;
        }
    }

    onSvrPlayerEnter(data:any){
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

            if(this._isPrivateRoom){
                if(playerInfo.status == PLAYER_STATUS.ONLINE && selfid == userid){
                    this.UI_BTN_READY.visible = true;
                }
            }
            this.showPlayerInfoBySeat(localSeat);
        }

        
    }

    onSvrPlayerInfos(data:any){
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

    //房间销毁
    onRoomEnd(data:any){
        GameData.instance.roomEnd = true;
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

    // 房间信息
    onRoomInfo(data:any){
        console.log(data)
        if(DataCenter.instance.shortRoomid){
            const shortRoomid = `${DataCenter.instance.shortRoomid}`
            this.UI_TXT_SHORT_ROOMID.text = shortRoomid.padStart(6, '0')
        }else{
            this.UI_TXT_SHORT_ROOMID.visible = false
        }
        //this.dealSeatInfo(data);
    }

    reqUserStatus(){
        const userStatus = new UserStatus()
        userStatus.req()
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

        if(!this._isPrivateRoom){
            this.UI_BTN_CONTINUE.visible = true
        }
        
        this.reqUserStatus()
    }

    onShow(){
        console.log('TestView onShow');
    }

    onBtnClose(){
        console.log('onBtnClose');
        if (this._isPrivateRoom) {
            if (!GameData.instance.roomEnd) {
                if (GameData.instance.gameStart) {
                    console.log('游戏中无法退出');
                }else{
                    GameSocketManager.instance.sendToServer("leaveRoom", {flag:1});
                }
            }
        }
        UIManager.instance.hideView('GameView');
    }

    // 显示玩家信息
    showPlayerInfoBySeat(localseat:number):void{
        const player = GameData.instance.playerList[localseat];
        this.getChild<fgui.GTextField>(`UI_TXT_NICKNAME_${localseat}`).text = player.nickname ?? "";
        this.getChild<fgui.GTextField>(`UI_TXT_USERID_${localseat}`).text = player.userid.toString();
        this.getChild<fgui.GTextField>(`UI_TXT_STATUS_${localseat}`).text = this.getPlayerStatusText(player.status ?? 0);
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
        GameSocketManager.instance.sendToServer('outHand', { gameid: DataCenter.instance.gameid, roomid: DataCenter.instance.roomid, flag:this._selectOutHand })
    }

    onSvrGameStart(data:any): void { 
        GameData.instance.gameStart = true;
    }

    onSvrGameEnd(data:any): void { 
        GameData.instance.gameStart = false;
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
    
    onBtnReady(): void {
        const func = (res:any)=>{
            if (res.code) {
                console.log(res.msg)
                this.UI_BTN_READY.visible = false;
            }
        }
        GameSocketManager.instance.sendToServer('gameReady',{ready:1}, func)
    }

    /**
     * 解散房间按钮点击事件
     * 发起投票解散房间
     */
    onBtnDismissRoom(): void {
        console.log('点击解散房间按钮');
        
        if (!this._isPrivateRoom) {
            console.log('非私人房，无法解散');
            return;
        }

        if (this._dismissRoomPanel) {
            console.log('投票解散面板已存在');
            return;
        }

        // 发起解散房间投票请求
        const data = {
            reason: "玩家发起解散" // 解散原因（可选）
        };

        GameSocketManager.instance.sendToServer('voteDisbandRoom', data, (response: any) => {
            if (response && response.code === 0) {
                console.log('发起解散投票成功');
                //this.showDismissRoomPanel();
            } else {
                console.error('发起解散投票失败:', response?.msg || '未知错误');
                // 可以显示错误提示
                this.showErrorMessage(response?.msg || '发起解散投票失败');
            }
        });
    }

    /**
     * 显示投票解散面板
     */
    private showDismissRoomPanel() {
        if (this._dismissRoomPanel) {
            return;
        }

        // 使用fgui.UIPackage.createObject创建投票解散组件
        const dismissPanel = fgui.UIPackage.createObject('test', 'compDismissRoom', DismissRoomComponent) as DismissRoomComponent;
        if (dismissPanel) {
            this._dismissRoomPanel = dismissPanel;
            
            // 设置面板位置（居中显示）
            dismissPanel.x = this.width - dismissPanel.width
            dismissPanel.y = 0
            
            // 添加到当前视图
            this.addChild(dismissPanel);
            console.log('投票解散面板已显示');
        } else {
            console.error('创建投票解散面板失败');
        }

        return dismissPanel
    }

    /**
     * 显示错误消息
     */
    private showErrorMessage(message: string): void {
        // 创建临时文本组件显示错误信息
        const errorText = new fgui.GTextField();
        errorText.text = message;
        errorText.fontSize = 16;
        errorText.color = new Color(255, 0, 0, 255); // 红色
        errorText.setSize(200, 30);
        errorText.x = (this.width - 200) / 2;
        errorText.y = (this.height - 30) / 2;
        this.addChild(errorText);

        // 2秒后移除
        setTimeout(() => {
            if (errorText.parent) {
                this.removeChild(errorText);
            }
        }, 2000);
    }

    /**
     * 清理投票解散面板
     */
    private clearDismissRoomPanel(): void {
        if (this._dismissRoomPanel) {
            if (this._dismissRoomPanel.parent) {
                this.removeChild(this._dismissRoomPanel);
            }
            this._dismissRoomPanel.dispose();
            this._dismissRoomPanel = null;
        }
    }

    /**
     * 处理服务器发起的投票解散消息
     */
    private onVoteDisbandStart(data: any): void {
        console.log('收到解散房间投票发起消息:', data);
        
        // 如果不是自己发起的投票，则显示投票面板
        if (data.initiator !== DataCenter.instance.userid) {
            const pan = this.showDismissRoomPanel();
            pan && pan.onVoteDisbandStart(data)
        }
    }

    /**
     * 处理投票解散状态更新
     */
    private onVoteDisbandUpdate(data: any): void {
        console.log('收到投票解散状态更新:', data);
        
        // 如果投票面板存在，则更新显示
        if (this._dismissRoomPanel) {
            // 这里可以向投票面板发送消息，但是DismissRoomComponent已经监听了这个消息
            // 所以这里不需要做额外的处理
        }
    }

    /**
     * 处理投票解散结果
     */
    private onVoteDisbandResult(data: any): void {
        console.log('收到投票解散结果:', data);
        
        if (data.result === 1) {
            // 投票通过，房间将被解散
            console.log('投票通过，房间即将解散');
            
            // 显示成功消息
            this.showErrorMessage('投票通过，房间即将解散');
            
            // 延时关闭游戏界面，返回大厅
            setTimeout(() => {
                this.onBtnClose();
            }, 3000);
        } else {
            // 投票未通过
            console.log('投票未通过，继续游戏');
            this.showErrorMessage('投票未通过，继续游戏');
        }
        
        // 清理投票面板
        setTimeout(() => {
            this.clearDismissRoomPanel();
        }, 2000);
    }
}
