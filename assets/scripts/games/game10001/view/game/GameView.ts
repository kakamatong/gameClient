
import FGUIGameView from '../../../../fgui/game10001/FGUIGameView';
import FGUICompHand from '../../../../fgui/game10001/FGUICompHand';
import { GameSocketManager } from '../../../../frameworks/GameSocketManager';
import { AddEventListener, ChangeScene, LogColors, RemoveEventListener, ScheduleOnce } from '../../../../frameworks/Framework';
import { DataCenter } from '../../../../datacenter/Datacenter'
import { GameData } from '../../data/Gamedata';
import { SELF_LOCAL , PLAYER_ATTITUDE,PLAYER_STATUS,SEAT_2,ROOM_END_FLAG, HAND_INDEX, ROOM_TYPE, CTRL_BTN_INDEX, GAME_MODE_TXT, SEAT_1} from '../../data/InterfaceGameConfig';
import * as fgui from "fairygui-cc";
import { CompClock } from './comp/CompClock';
import { PopMessageView } from '../../../../view/common/PopMessageView';
import { ENUM_POP_MESSAGE_TYPE, RICH_TYPE } from '../../../../datacenter/InterfaceConfig';
import { ResultView } from '../result/ResultView';
import { UserStatus } from '../../../../modules/UserStatus';
import { MatchView } from '../../../../view/match/MatchView';
import { Match } from '../../../../modules/Match';
import { LobbySocketManager } from '../../../../frameworks/LobbySocketManager';
import { AuthGame } from '../../../../modules/AuthGame';
import FGUICompHead from '../../../../fgui/common/FGUICompHead';
import { SpriteFrame } from 'cc';
import { TotalResultView } from '../result/TotalResultView';
import { PlayerInfoView } from '../playerInfo/PlayerInfoView';
import { MiniGameUtils } from 'db://assets/scripts/frameworks/utils/sdk/MiniGameUtils';
export class GameView extends FGUIGameView {
    private _selectOutHand:number = -1;
    
    onConstruct(){
        super.onConstruct();
        this.init()
        this.initListeners()
    }

    init(){
        GameData.instance.init();
        GameData.instance.maxPlayer = 2;
        this._selectOutHand = -1
        if(DataCenter.instance.shortRoomid){
            GameData.instance.isPrivateRoom = true;
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.removeListeners();
    }

    show(data:any){
        // 客户端进入完成
        GameSocketManager.instance.sendToServer("clientReady",{})
        this.ctrl_select.onChanged(this.onChanged, this)
        if (GameData.instance.isPrivateRoom) {
            this.ctrl_roomtype.selectedIndex = ROOM_TYPE.PRIVATE
        }

        // 玩家头像点击
        this.UI_COMP_HEAD_1.onClick(this.onHeadClick1, this)
        this.UI_COMP_HEAD_2.onClick(this.onHeadClick2, this)
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
        GameSocketManager.instance.addServerListen("privateInfo", this.onSvrPrivateInfo.bind(this));
        GameSocketManager.instance.addServerListen("totalResult", this.onSvrTotalResult.bind(this));
        GameSocketManager.instance.addServerListen("gameRecord", this.onSvrGameRecord.bind(this));
        LobbySocketManager.instance.addServerListen("gameRoomReady", this.onSvrGameRoomReady.bind(this));
        AddEventListener('gameSocketDisconnect',this.onGameSocketDisconnect, this);
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
        GameSocketManager.instance.removeServerListen("privateInfo");
        GameSocketManager.instance.removeServerListen("totalResult");
        GameSocketManager.instance.removeServerListen("gameRecord");
        LobbySocketManager.instance.removeServerListen("gameRoomReady");
        RemoveEventListener('gameSocketDisconnect', this.onGameSocketDisconnect);
    }

    onHeadClick1(): void {
        const player = GameData.instance.getPlayerByLocal(SEAT_1)
        if (player) {
            PlayerInfoView.showView({userid:player.userid, cp: player.cp})
        }
    }

    onHeadClick2(): void {
        const player = GameData.instance.getPlayerByLocal(SEAT_2)
        if (player) {
            PlayerInfoView.showView({userid:player.userid, cp: player.cp})
        }
    }

    onSvrGameRecord(data:any) {
        GameData.instance.record = data
    }

    onSvrTotalResult(data:any){
        const time = 1

        ScheduleOnce(this.node.components[0],()=>{
            TotalResultView.showView(data)
        }, time)
    }

    onSvrPrivateInfo(data:any){
        if (!data) {
            return
        }
        if (GameData.instance.isPrivateRoom) {
            if (data.maxCnt === 9999) {
                this.UI_TXT_PROGRESS.text = `第${data.nowCnt ?? 0}局 无限局`
            }else{
                this.UI_TXT_PROGRESS.text = `第${data.nowCnt ?? 0}局 共${data.maxCnt ?? 0}局`
            }
            GameData.instance.privateMaxCnt = data.maxCnt
            GameData.instance.privateNowCnt = data.nowCnt
            
            //this.UI_TXT_RULE.text = `${GAME_MODE_TXT[data.mode]}`
            this.showWinLost(JSON.parse(data.ext))
        }
    }

    showWinLost(data:any){
        if (data && data.length > 0) {
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                const localSeat = GameData.instance.seat2local(index + 1)
                this.getChild<fgui.GLabel>(`UI_TXT_WINLOSE_${localSeat}`).text = `胜:${element.win ?? 0}`
            }
        }
    }

    onGameSocketDisconnect(): void { 
        if (!GameData.instance.gameStart) {
            return
        }
        PopMessageView.showView({
            content: "游戏已断开，返回大厅",
            type: ENUM_POP_MESSAGE_TYPE.NUM1SURE,
            sureBack: () => {
                this.changeToLobbyScene()
            }
        })
    }

    showClock(bshow:boolean, clock?:number):void{
        if (bshow) {
            if (clock && clock > 99) {
                clock = 99;
            }
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
            }else{
                 this.UI_GROUP_SELECT.visible = true
            }
        }else if(data.att == PLAYER_ATTITUDE.OUT_HAND){
            // 隐藏时钟
            this.showClock(false)
            // 隐藏准备标签
            this.showSignReady(local, false)
            if (local == SELF_LOCAL) {
                // 隐藏按钮和选择
                this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.NONE
                this.UI_GROUP_SELECT.visible = false
            }else{
                this.showThinking(false)
            }
            
        }
    }

    showOutHand(local:number, index:number){
        const outHand = this.getChild<FGUICompHand>(`UI_COMP_OUT_HEND_${local}`)
        outHand.ctrl_head.selectedIndex = index
        outHand.visible = true
    }

    hideOutHand(local:number){
        const outHand = this.getChild<FGUICompHand>(`UI_COMP_OUT_HEND_${local}`)
        outHand.visible = false
    }

    onGameOutHand(data:any):void{
        const local = GameData.instance.seat2local(data.seat);
        const index = HAND_INDEX.indexOf(data.flag)
        this._selectOutHand = index
        this.showOutHand(local, index)
    }

    playOutHandAct(){
        for (let index = 0; index < GameData.instance.maxPlayer; index++) {
            const outHand = this.getChild<FGUICompHand>(`UI_COMP_OUT_HEND_${index + 1}`)
            outHand.act.play()
        }
    }

    onGameRoundResult(data:any):void{
        this.playOutHandAct()
        // 有下一回合，不展示结果
        if (data.continue) {
            return
        }
        const scoreData:Array<{userid:number, cpData:any, nickname:string}> = []
        if (data.score) {
            const scores = JSON.parse(data.score)
            if (GameData.instance.isPrivateRoom) {
                this.showWinLost(scores)
            }
            if (scores && scores.length > 0) {
                for (let index = 0; index < scores.length; index++) {
                    const element = scores[index];
                    const player = GameData.instance.getPlayerBySeat(index + 1)
                    scoreData.push({
                        userid: player?.userid ?? 0,
                        cpData: element,
                        nickname: player?.nickname ?? ''
                    })
                    
                    if (player?.userid === DataCenter.instance.userid && !GameData.instance.isPrivateRoom) {
                        DataCenter.instance.addRichByType(RICH_TYPE.COMBAT_POWER, element.dcp)
                    }
                }
            }
        }

        const selfSeat = GameData.instance.getSelfSeat()
        if (data.info && data.info.length > 0){
            for (let i = 0; i < data.info.length; i++){
                const info = data.info[i];
                if(info.seat == selfSeat){
                    const func = ()=>{
                        this.onBtnContinue()
                    }
                    ScheduleOnce(this.node.components[0],()=>{
                        ResultView.showView({flag: info.endResult, continueFunc:func, scores: scoreData})
                    }, 1)
                    break
                }
            }
        }

        const userStatus = new UserStatus()
        userStatus.req()

        // 显示继续游戏
        if (GameData.instance.isPrivateRoom) {
            this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.NONE;
        }else{
            this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.CONTINUE;
        }
    }

    clear():void{
        for (let index = 0; index < GameData.instance.maxPlayer; index++) {
            this.hideOutHand(index + 1)
        }
        this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.NONE
        this._selectOutHand = -1
    }

    // 继续游戏
    onBtnContinue(): void {
        if (GameData.instance.gameStart) {
            return
        }
        
        if (GameData.instance.isPrivateRoom) {
            this.onBtnReady()
        }else{
            this.startMatch()
        }
    }

    startMatch(){
        const func = (b:boolean, data?:any)=>{
            if (b) {
                // 显示匹配view
                MatchView.showView();
            }else{
                if (data && data.gameid && data.roomid) {
                    const func2 =()=>{
                        //返回房间
                    }
                    PopMessageView.showView({title:'温馨提示', content:'您已经在房间中，是否返回？', type:ENUM_POP_MESSAGE_TYPE.NUM2, sureBack: func2})
                }
            }
        }
        Match.instance.req(0,func);
    }

    // 游戏区匹配：连接游戏服务
    connectToGame(addr:string, gameid:number, roomid:string){
        const callBack = (success:boolean)=>{
            if(success){
                //this.changeToGameScene()
                this.clear()
                this.init()
                GameSocketManager.instance.sendToServer("clientReady",{})
            }
        }
        AuthGame.instance.req(addr,gameid, roomid, callBack);
    }

    // 游戏区匹配：收到房间准备就绪
    onSvrGameRoomReady(data:any):void{
        console.log("gameRoomReady",data)
        MatchView.hideView();
        DataCenter.instance.gameid = data.gameid;
        DataCenter.instance.roomid = data.roomid;
        DataCenter.instance.gameAddr = data.addr;
        DataCenter.instance.shortRoomid = 0 // 匹配房
        console.log(LogColors.green('游戏房间准备完成'));
        this.connectToGame(data.addr, data.gameid, data.roomid);
    }

    onRoomEnd(data:any):void{
        const msg = "房间销毁"
        if(data.code == ROOM_END_FLAG.GAME_END){
            console.log("游戏结束 " + msg)
        }else if(data.code == ROOM_END_FLAG.OUT_TIME_WAITING){
            console.log("等待超时 " + msg)
            PopMessageView.showView({
                content: "等待超时",
                type: ENUM_POP_MESSAGE_TYPE.NUM1SURE,
                sureBack: () => {
                    this.changeToLobbyScene()
                },
                closeBack:() => {
                    this.changeToLobbyScene()
                }
            })
        }else if(data.code == ROOM_END_FLAG.OUT_TIME_PLAYING){
            console.log("游戏超时 " + msg)
            PopMessageView.showView({
                content: "游戏超时",
                type: ENUM_POP_MESSAGE_TYPE.NUM1SURE,
                sureBack: () => {
                    this.changeToLobbyScene()
                },
                closeBack:() => {
                    this.changeToLobbyScene()
                }
            })
        }else if(data.code == ROOM_END_FLAG.OWNER_DISBAND){
            let endMsg = "房主已经解散房间"
            if (GameData.instance.owner ==DataCenter.instance.userid) {
                endMsg = "您已经解散房间"
            }
            PopMessageView.showView({
                content: endMsg,
                type: ENUM_POP_MESSAGE_TYPE.NUM1SURE,
                sureBack: () => {
                    this.changeToLobbyScene()
                },
                closeBack:() => {
                    this.changeToLobbyScene()
                }
            })
        }else if(data.code == ROOM_END_FLAG.VOTE_DISBAND){
            console.log("投票解散 " + msg)
            //this.onBtnClose()

        }
    }

    onSvrPlayerInfos(data:any):void{
        console.log('onSvrPlayerInfos', data);
        // 先存到playerInfos里面
        // enter 的时候在从里面取出来，放到playerlist里面去
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
                player.cp = info.cp ?? 0;
                const localSeat = GameData.instance.local2seat(player.svrSeat)
                this.showPlayerInfoBySeat(localSeat);
            }
        }
    }

    onSvrGameStart(data:any):void{
        GameData.instance.gameStart = true;

        // 非重连情况
        if (!data.brelink) {
            if (data.roundNum == 1) {
                this.UI_COMP_GAME_START.act.play(()=>{
                    this.UI_COMP_GAME_START.visible = false;
                    this.UI_COMP_ROUND_ACT.title.text = `Round ${data.roundNum}`
                    this.UI_COMP_ROUND_ACT.visible = true;
                    this.UI_COMP_ROUND_ACT.act.play(()=>{
                        this.UI_COMP_ROUND_ACT.visible = false;
                    })
                })
                this.UI_COMP_GAME_START.visible = true;
            }else{
                this.UI_COMP_ROUND_ACT.title.text = `Round ${data.roundNum}`
                this.UI_COMP_ROUND_ACT.visible = true;
                this.UI_COMP_ROUND_ACT.act2.play(()=>{
                    this.UI_COMP_ROUND_ACT.visible = false;
                })
            }
            

            // 第几回合
            this.clear()
        }

        for (let index = 0; index < GameData.instance.maxPlayer; index++) {
            this.showSignReady(index + 1, false)
        }
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
                    this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.READY;
                }

                this.checkShowInviteBtn()
            }
            this.showPlayerInfoBySeat(localSeat);
        }
    }

    onSvrPlayerStatusUpdate(data:any):void{
        const player = GameData.instance.getPlayerByUserid(data.userid);
        if (player) {
            player.status = data.status;
            this.showPlayerInfoBySeat(GameData.instance.seat2local(player.svrSeat))
            if (data.userid == DataCenter.instance.userid && data.status == PLAYER_STATUS.ONLINE) {
                this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.READY;
            }
        }
    }

    showPlayerInfoBySeat(localseat:number):void{
        const player = GameData.instance.playerList[localseat];
        const nicknanme = this.getChild<fgui.GTextField>(`UI_TXT_NICKNAME_${localseat}`);
        const id = this.getChild<fgui.GTextField>(`UI_TXT_ID_${localseat}`)
        const head = this.getChild<FGUICompHead>(`UI_COMP_HEAD_${localseat}`)
        //const head = this.UI_COMP_HEAD_1
        nicknanme.text = player.nickname ?? "";
        id.text = player.userid.toString();
        const headurl = GameData.instance.getHeadurl(localseat)
        head.UI_LOADER_HEAD.url = headurl

        if (localseat != SELF_LOCAL) {
            if (player.status == PLAYER_STATUS.OFFLINE) {
                this.showOffLine(true)
            }else{
                this.showOffLine(false)
            }
            this.UI_GROUP_PLAYER_2.visible = true
        }

        if (player.status == PLAYER_STATUS.READY) {
            this.showSignReady(localseat, true)
        }
    }

    showOffLine(bshow:boolean):void{ 
        this.UI_COMP_OFFLINE.visible = bshow;
    }

    hideHead(localseat:number){
        if (localseat == SEAT_2) {
            this.UI_GROUP_PLAYER_2.visible = false
        }
    }

    onSvrPlayerLeave(data:any):void{
        const localSeat = GameData.instance.seat2local(data.seat);
        GameData.instance.playerList.splice(localSeat, 1)
        this.hideHead(localSeat)
        this.checkShowInviteBtn()
    }

    onRoomInfo(data:any):void{
        console.log(data)
        GameData.instance.owner = data.owner;
        // 展示好友房信息
        if(data.shortRoomid){
            const shortRoomid = `${data.shortRoomid}`
            this.UI_TXT_ROOMID.text = '房间号:' + shortRoomid.padStart(6, '0')
        }

        if (GameData.instance.isPrivateRoom && data.gameData && data.gameData != '') {
            const gameData = JSON.parse(data.gameData)
            if (gameData && gameData.rule != '') {
                const rule = JSON.parse(gameData.rule)
                this.UI_TXT_RULE.text = `${GAME_MODE_TXT[rule.mode]}`
            }
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
            this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.SURE
        }else{
            this.showThinking(true)
        }
    }

    changeToLobbyScene():void{
        if (GameSocketManager.instance.isOpen()) {
            GameSocketManager.instance.close()
        }
        ChangeScene('LobbyScene')
    }

    onBtnBack(): void {
        // 如果房间的socket已经断开，直接退出
        if (!GameSocketManager.instance.isOpen()) {
            return this.changeToLobbyScene()
        }
        // 私人房退出 需要发送协议
        if (GameData.instance.isPrivateRoom) {
            if (!GameData.instance.roomEnd) {
                if (GameData.instance.gameStart) {
                    console.log('游戏中无法退出');
                }else{
                    GameSocketManager.instance.sendToServer("leaveRoom", {flag:1});
                }
            }
        }

        if (GameData.instance.gameStart) {
            PopMessageView.showView({
                type:ENUM_POP_MESSAGE_TYPE.NUM1SURE,
                content: '游戏进行中，无法返回',
            })
        }else{
            this.changeToLobbyScene()
        }
    }

    onBtnReady(): void {
        const func = (res:any)=>{
            if (res.code) {
                console.log(res.msg)
                //this.UI_BTN_READY.visible = false;
                this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.NONE;
            }
        }
        GameSocketManager.instance.sendToServer('gameReady',{ready:1}, func)
        this.clear()
    }

    onBtnChange():void{
        GameSocketManager.instance.sendToServer('outHand', { gameid: DataCenter.instance.gameid, roomid: DataCenter.instance.roomid, flag:HAND_INDEX[this.ctrl_select.selectedIndex] })
    }

    onBtnScissors(): void {
        
    }

    onBtnRock(): void {
        
    }

    onBtnPaper(): void {
    }

    startDisband():void{ 
        // 发起解散房间投票请求
        const data = {
            reason: "玩家发起解散" // 解散原因（可选）
        };

        GameSocketManager.instance.sendToServer('voteDisbandRoom', data, (response: any) => {
            if (response && response.code === 1) {
                console.log('发起解散投票成功');
            } else {
                console.error('发起解散投票失败:', response?.msg || '未知错误');
            }
        });
    }

    onBtnDisband(): void {
        // 如果房间的socket已经断开，直接退出
        if (!GameSocketManager.instance.isOpen()) {
            return this.changeToLobbyScene()
        }
        if (GameData.instance.owner == DataCenter.instance.userid) {
            if (GameData.instance.gameStart || GameData.instance.privateNowCnt > 0) {
                this.startDisband()
            }else{
                PopMessageView.showView({
                    content: "解散后将无法返回此房间",
                    type: ENUM_POP_MESSAGE_TYPE.NUM1SURE,
                    sureBack: () => {
                        this.startDisband()
                    }
                })
            }
            
        }else{
            if (GameData.instance.gameStart || GameData.instance.privateNowCnt > 0) {
                this.startDisband()
            }else{
                PopMessageView.showView({
                    type:ENUM_POP_MESSAGE_TYPE.NUM1SURE,
                    content: '非房主只能在游戏开始后，发起解散',
                })

            }
        }
    }

    onBtnSure(): void {
        GameSocketManager.instance.sendToServer('outHand', { gameid: DataCenter.instance.gameid, roomid: DataCenter.instance.roomid, flag:HAND_INDEX[this.ctrl_select.selectedIndex] })
    }

    showInviteBtn(bshow:boolean):void{ 
        this.UI_BTN_INVITE.visible = bshow
    }

    /**
     * 检测是否显示邀请按钮
     * @param bshow 
     */
    checkShowInviteBtn():void{
        if (!GameData.instance.isPrivateRoom) {
            this.showInviteBtn(false)
            return
        }

        if (GameData.instance.gameStart) {
            this.showInviteBtn(false)
            return
        }

        if (GameData.instance.privateNowCnt > 0 ) {
            this.showInviteBtn(false)
            return
        }

        const playerCnt = GameData.instance.getPlayerCnt()
        if (playerCnt >= GameData.instance.maxPlayer ) {
            this.showInviteBtn(false)
            return 
        }
        this.showInviteBtn(true)
    }

    async drawInviteInfo():Promise<string>{
        return new Promise<string>(async (resolve, reject) => {
            // 邀请好友
            const bgUrl = 'https://qiudaoyu-miniapp.oss-cn-hangzhou.aliyuncs.com/share/10001/invitebg.jpg'
            const width = 776
            const height = 621
            const bg = await MiniGameUtils.instance.loadImage(bgUrl)
            const canvas = MiniGameUtils.instance.getCanvas()
            if (!canvas) {
                reject()
                return
            }
            canvas.width = width
            canvas.height = height
            const canvasContext = MiniGameUtils.instance.getCanvasContext()
            if (!canvasContext) {
                reject()
                return
            }

            canvasContext.globalCompositeOperation = "source-over";
            canvasContext.clearRect(0, 0, width, height);
            canvasContext.drawImage(bg, 0, 0, width, height);

            const head = await MiniGameUtils.instance.loadImage(DataCenter.instance.headurl)
            const headWidth = 160
            const headHeight = 160
            canvasContext.drawImage(head, width * 0.1, height * 0.7, headWidth, headHeight);

            canvasContext.font = "bold 36px Arial";
            canvasContext.fillStyle = '#993300';
            canvasContext.textAlign = "left"
            canvasContext.fillText(DataCenter.instance.userData?.nickname || "", width * 0.1 + headWidth + 10, height * 0.8 + 10);
            canvasContext.fillText(`${DataCenter.instance.userid || 0}`, width * 0.1 + headWidth + 10, height * 0.8 + 50);
            MiniGameUtils.instance.makeCanvasImage({filename:"invite"}).then((res:string) => { 
                console.log(res)
                resolve(res)
            }).catch((err:any) => {
                reject(err)
            })
        })
    }

    /**
     * 邀请好友
     */
    onBtnInvite(): void {
        this.drawInviteInfo().then((res:string) => { 
            MiniGameUtils.instance.shareAppMessage({
                title: `房间号：${DataCenter.instance.shortRoomid} 点击加入 速来战`,
                imageUrl: res,
                query: `gameid=${10001}&roomid=${DataCenter.instance.shortRoomid}`
            })
        }).catch((err:any) => { 
            console.log(err)
        })
    }

    onChanged(event: any):void{
        if (event.selectedIndex != this._selectOutHand) {
            if (this._selectOutHand != -1) {
                this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.CHANGE
            }else{
                this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.SURE
            }
        }
    }
}
fgui.UIObjectFactory.setExtension(GameView.URL, GameView);