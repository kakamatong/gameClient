import FGUICompGameMain from '../../../../../fgui/game10001/FGUICompGameMain';
import FGUICompHand from '../../../../../fgui/game10001/FGUICompHand';
import { GameSocketManager } from '../../../../../frameworks/GameSocketManager';
import { AddEventListener, ChangeScene, LogColors, RemoveEventListener, ViewClass } from '../../../../../frameworks/Framework';
import { DataCenter } from '../../../../../datacenter/Datacenter'
import { GameData } from '../../../data/Gamedata';
import { SELF_LOCAL , PLAYER_ATTITUDE,PLAYER_STATUS,SEAT_2,ROOM_END_FLAG, HAND_INDEX, ROOM_TYPE, CTRL_BTN_INDEX, GAME_MODE_TXT, SEAT_1, ROOM_PLAYER_INDEX, HAND_SOUND_NAME, FORWARD_MESSAGE_TYPE} from '../../../data/InterfaceGameConfig';
import * as fgui from "fairygui-cc";
import { CompClock } from './CompClock';
import { PopMessageView } from '../../../../../view/common/PopMessageView';
import { ENUM_POP_MESSAGE_TYPE, RICH_TYPE } from '../../../../../datacenter/InterfaceConfig';
import { FW_EVENT_NAMES } from '../../../../../frameworks/config/Config';
import { ResultView } from '../../result/ResultView';
import { UserStatus } from '../../../../../modules/UserStatus';
import { MatchView } from '../../../../../view/match/MatchView';
import { Match } from '../../../../../modules/Match';
import { LobbySocketManager } from '../../../../../frameworks/LobbySocketManager';
import { AuthGame } from '../../../../../modules/AuthGame';
import FGUICompHead from '../../../../../fgui/common/FGUICompHead';
import { TotalResultView } from '../../result/TotalResultView';
import { MiniGameUtils } from '../../../../../frameworks/utils/sdk/MiniGameUtils';
import { CompPlayerHead } from './CompPlayerHead';
import { SoundManager } from '../../../../../frameworks/SoundManager';
import { SprotoForwardMessage, SprotoGameClock, SprotoGameEnd, SprotoGameRecord, SprotoGameStart, SprotoOutHandInfo, SprotoPlayerAtt, SprotoPlayerEnter, SprotoPlayerInfos, SprotoPlayerLeave, SprotoPlayerStatusUpdate, SprotoPrivateInfo, SprotoRoomEnd, SprotoRoomInfo, SprotoRoundResult, SprotoStepId, SprotoTalk, SprotoTotalResult } from '../../../../../../types/protocol/game10001/s2c';
import { SprotoClientReady, SprotoGameReady, SprotoLeaveRoom, SprotoOutHand, SprotoVoteDisbandRoom } from '../../../../../../types/protocol/game10001/c2s';
import { SprotoGameRoomReady } from '../../../../../../types/protocol/lobby/s2c';
import { TALK_LIST } from '../../talk/TalkConfig';
import { TalkView } from '../../talk/TalkView';

/**
 * 游戏主体组件
 */
@ViewClass({ curveScreenAdapt: true })
export class CompGameMain extends FGUICompGameMain {
    private _selectOutHand: number = -1;

    /**
     * 组件构造完成时的初始化
     */
    onConstruct() {
        super.onConstruct();
        this.init();
        this.initListeners();

        // 客户端进入完成
        GameSocketManager.instance.sendToServer(SprotoClientReady, {})
        this.ctrl_select.onChanged(this.onChanged, this)
        if (GameData.instance.isPrivateRoom) {
            this.ctrl_roomtype.selectedIndex = ROOM_TYPE.PRIVATE
        }
    }

    /**
     * 初始化游戏数据
     */
    init() {
        GameData.instance.init();
        GameData.instance.maxPlayer = 2;
        this._selectOutHand = -1
        if (DataCenter.instance.shortRoomid) {
            GameData.instance.isPrivateRoom = true;
        }
    }

    /**
     * 初始化所有服务器消息监听器
     */
    initListeners() {
        GameSocketManager.instance.addServerListen(SprotoRoomInfo, this.onRoomInfo.bind(this));
        GameSocketManager.instance.addServerListen(SprotoStepId, this.onGameStep.bind(this));
        GameSocketManager.instance.addServerListen(SprotoPlayerAtt, this.onGamePlayerAttitude.bind(this));
        GameSocketManager.instance.addServerListen(SprotoOutHandInfo, this.onGameOutHand.bind(this));
        GameSocketManager.instance.addServerListen(SprotoRoundResult, this.onGameRoundResult.bind(this));
        GameSocketManager.instance.addServerListen(SprotoRoomEnd, this.onRoomEnd.bind(this));
        GameSocketManager.instance.addServerListen(SprotoPlayerInfos, this.onSvrPlayerInfos.bind(this));
        GameSocketManager.instance.addServerListen(SprotoGameStart, this.onSvrGameStart.bind(this));
        GameSocketManager.instance.addServerListen(SprotoGameEnd, this.onSvrGameEnd.bind(this));
        GameSocketManager.instance.addServerListen(SprotoPlayerEnter, this.onSvrPlayerEnter.bind(this));
        GameSocketManager.instance.addServerListen(SprotoPlayerStatusUpdate, this.onSvrPlayerStatusUpdate.bind(this));
        GameSocketManager.instance.addServerListen(SprotoPlayerLeave, this.onSvrPlayerLeave.bind(this));
        GameSocketManager.instance.addServerListen(SprotoGameClock, this.onSvrGameClock.bind(this));
        GameSocketManager.instance.addServerListen(SprotoPrivateInfo, this.onSvrPrivateInfo.bind(this));
        GameSocketManager.instance.addServerListen(SprotoTotalResult, this.onSvrTotalResult.bind(this));
        GameSocketManager.instance.addServerListen(SprotoGameRecord, this.onSvrGameRecord.bind(this));
        GameSocketManager.instance.addServerListen(SprotoForwardMessage, this.onSvrForwardMessage.bind(this));
        GameSocketManager.instance.addServerListen(SprotoTalk, this.onSvrTalk.bind(this));
        LobbySocketManager.instance.addServerListen(SprotoGameRoomReady, this.onSvrGameRoomReady.bind(this));
        AddEventListener(FW_EVENT_NAMES.GAME_SOCKET_DISCONNECT, this.onGameSocketDisconnect, this);
    }

    /**
     * 组件销毁时的清理
     */
    onDestroy() {
        super.onDestroy();
        this.removeListeners();
    }

    /**
     * 移除所有服务器消息监听器
     */
    removeListeners(): void {
        GameSocketManager.instance.removeServerListen(SprotoRoomInfo);
        GameSocketManager.instance.removeServerListen(SprotoStepId);
        GameSocketManager.instance.removeServerListen(SprotoPlayerAtt);
        GameSocketManager.instance.removeServerListen(SprotoOutHandInfo);
        GameSocketManager.instance.removeServerListen(SprotoRoundResult);
        GameSocketManager.instance.removeServerListen(SprotoRoomEnd);
        GameSocketManager.instance.removeServerListen(SprotoPlayerInfos);
        GameSocketManager.instance.removeServerListen(SprotoGameStart);
        GameSocketManager.instance.removeServerListen(SprotoGameEnd);
        GameSocketManager.instance.removeServerListen(SprotoPlayerEnter);
        GameSocketManager.instance.removeServerListen(SprotoPlayerStatusUpdate);
        GameSocketManager.instance.removeServerListen(SprotoPlayerLeave);
        GameSocketManager.instance.removeServerListen(SprotoGameClock);
        GameSocketManager.instance.removeServerListen(SprotoPrivateInfo);
        GameSocketManager.instance.removeServerListen(SprotoTotalResult);
        GameSocketManager.instance.removeServerListen(SprotoGameRecord);
        LobbySocketManager.instance.removeServerListen(SprotoGameRoomReady);
        GameSocketManager.instance.removeServerListen(SprotoForwardMessage);
        GameSocketManager.instance.removeServerListen(SprotoTalk);
        RemoveEventListener(FW_EVENT_NAMES.GAME_SOCKET_DISCONNECT, this.onGameSocketDisconnect);
    }

    /**
     * 服务器消息转发处理
     * @param data 转发消息数据
     */
    onSvrForwardMessage(data: SprotoForwardMessage.Request) {
        console.log(data)
        this.forwardMessage(data)
    }

    /**
     * 游戏记录处理
     * @param data 游戏记录数据
     */
    onSvrGameRecord(data: any) {
        GameData.instance.record = data
    }

    /**
     * 总结果处理
     * @param data 总结果数据
     */
    onSvrTotalResult(data: any) {
        const time = 1.2
        this.scheduleOnce(() => {
            TotalResultView.showView(data)
        }, time)
    }

    /**
     * 私人房信息处理
     * @param data 私人房数据
     */
    onSvrPrivateInfo(data: any) {
        if (!data) {
            return
        }
        if (GameData.instance.isPrivateRoom) {
            if (data.maxCnt === 9999) {
                this.UI_TXT_PROGRESS.text = `第${data.nowCnt ?? 0}局 无限局`
            } else {
                this.UI_TXT_PROGRESS.text = `第${data.nowCnt ?? 0}局 共${data.maxCnt ?? 0}局`
            }
            GameData.instance.privateMaxCnt = data.maxCnt
            GameData.instance.privateNowCnt = data.nowCnt

            //this.UI_TXT_RULE.text = `${GAME_MODE_TXT[data.mode]}`
            this.showWinLost(JSON.parse(data.ext))
        }
    }

    /**
     * 显示胜负战绩
     * @param data 胜负数据
     */
    showWinLost(data: any) {
        if (data && data.length > 0) {
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                const localSeat = GameData.instance.seat2local(index + 1)
                const playerNode = this.getChild<CompPlayerHead>(`UI_COMP_PLAYER_${localSeat}`)
                playerNode.UI_TXT_WINLOSE.text = `胜:${element.win ?? 0}`
            }
        }
    }

    /**
     * 游戏断开连接处理
     */
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

    /**
     * 显示或隐藏倒计时
     * @param bshow 是否显示
     * @param clock 倒计时时间
     */
    showClock(bshow: boolean, clock?: number): void {
        if (bshow) {
            if (clock && clock > 99) {
                clock = 99;
            }
            const compClock = this.UI_COMP_CLOCK as CompClock
            compClock.visible = true;
            compClock.start(clock || 10);
        } else {
            const compClock = this.UI_COMP_CLOCK as CompClock
            compClock.visible = false;
        }
    }

    // 处理转发协议
    forwardMessage(data: SprotoForwardMessage.Request) {
        const type = data.type
    }

    /**
     * 服务器聊天消息处理
     * @param data 聊天数据
     */
    onSvrTalk(data: SprotoTalk.Request): void {
        this.showTalk(data)
    }

    /**
     * 显示聊天消息
     * @param data 聊天数据
     */
    showTalk(data: SprotoTalk.Request): void {
        const id = data.id
        const userid = data.from
        const player = GameData.instance.getPlayerByUserid(userid);
        if (!player) return
        const localSeat = GameData.instance.seat2local(player.svrSeat)
        const talkData = TALK_LIST.find((item) => item.id == id)
        if (!talkData) return
        const playerNode = this.getChild<CompPlayerHead>(`UI_COMP_PLAYER_${localSeat}`);
        playerNode.showMsg(talkData.msg)
    }

    /**
     * 游戏时钟处理
     * @param data 时钟数据
     */
    onSvrGameClock(data: any): void {
        this.showClock(true, data.time)
    }

    /**
     * 游戏步骤处理
     * @param data 步骤数据
     */
    onGameStep(data: any): void {
        GameData.instance.gameStep = data.stepid;
    }

    /**
     * 玩家姿态处理
     * @param data 姿态数据
     */
    onGamePlayerAttitude(data: any): void {
        const local = GameData.instance.seat2local(data.seat);
        if (data.att == PLAYER_ATTITUDE.THINKING) {
            this.onPlayerThinking(local)
        } else if (data.att == PLAYER_ATTITUDE.READY) {
            if (local != SELF_LOCAL) {
                this.showSignReady(local, true)
                this.showThinking(local, false)
            } else {
                this.UI_GROUP_SELECT.visible = true
            }
        } else if (data.att == PLAYER_ATTITUDE.OUT_HAND) {
            // 隐藏时钟
            this.showClock(false)
            // 隐藏准备标签
            this.showSignReady(local, false)
            if (local == SELF_LOCAL) {
                // 隐藏按钮和选择
                this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.NONE
                this.UI_GROUP_SELECT.visible = false
            } else {
                this.showThinking(local, false)
            }

        }
    }

    /**
     * 显示玩家出牌手势
     * @param local 本地座位号
     * @param index 手势索引
     */
    showOutHand(local: number, index: number) {
        const outHand = this.getChild<FGUICompHand>(`UI_COMP_OUT_HEND_${local}`)
        outHand.ctrl_head.selectedIndex = index
        outHand.visible = true
    }

    /**
     * 隐藏玩家出牌手势
     * @param local 本地座位号
     */
    hideOutHand(local: number) {
        const outHand = this.getChild<FGUICompHand>(`UI_COMP_OUT_HEND_${local}`)
        outHand.visible = false
    }

    /**
     * 游戏出牌处理
     * @param data 出牌数据
     */
    onGameOutHand(data: any): void {
        const local = GameData.instance.seat2local(data.seat);
        const index = HAND_INDEX.indexOf(data.flag)
        this._selectOutHand = index
        this.showOutHand(local, index)
    }

    /**
     * 播放出牌动画
     */
    playOutHandAct() {
        for (let index = 0; index < GameData.instance.maxPlayer; index++) {
            const outHand = this.getChild<FGUICompHand>(`UI_COMP_OUT_HEND_${index + 1}`)
            outHand.act.play()
        }
    }

    /**
     * 播放音效
     * @param info 音效信息
     */
    playSound(info: any) {
        const len = info?.length ?? 0
        if (len == 0) {
            return
        }
        for (let index = 0; index < len; index++) {
            const element = info[index];
            const outHand = this.getChild<FGUICompHand>(`UI_COMP_OUT_HEND_${element.seat}`)
            if (!outHand) {
                continue
            }
            const sound = this.getSoundName(element.outHand)
            SoundManager.instance.playSoundEffect2(outHand, sound)
        }
    }

    /**
     * 获取音效名称
     * @param index 手势索引
     * @returns 音效名称
     */
    getSoundName(index: number): string {
        return HAND_SOUND_NAME[index]
    }

    /**
     * 游戏回合结果处理
     * @param data 回合结果数据
     */
    onGameRoundResult(data: any): void {
        this.playOutHandAct()
        this.playSound(data.info)
        // 有下一回合，不展示结果
        if (data.continue) {
            return
        }
        const scoreData: Array<{ userid: number, cpData: any, nickname: string }> = []
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
        if (data.info && data.info.length > 0) {
            for (let i = 0; i < data.info.length; i++) {
                const info = data.info[i];
                if (info.seat == selfSeat) {
                    const func = () => {
                        this.onBtnContinue()
                    }
                    this.scheduleOnce(() => {
                        ResultView.showView({ flag: info.endResult, continueFunc: func, scores: scoreData })
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
        } else {
            this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.CONTINUE;
        }
    }

    /**
     * 清除游戏状态
     */
    clear(): void {
        for (let index = 0; index < GameData.instance.maxPlayer; index++) {
            this.hideOutHand(index + 1)
        }
        this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.NONE
        this._selectOutHand = -1
    }

    /**
     * 继续游戏按钮处理
     */
    onBtnContinue(): void {
        if (GameData.instance.gameStart) {
            return
        }

        if (GameData.instance.isPrivateRoom) {
            this.onBtnReady()
        } else {
            this.startMatch()
        }
    }

    /**
     * 开始匹配
     */
    startMatch() {
        const func = (b: boolean, data?: any) => {
            if (b) {
                // 显示匹配view
                MatchView.showView();
            } else {
                if (data && data.gameid && data.roomid) {
                    const func2 = () => {
                        //返回房间
                    }
                    PopMessageView.showView({ title: '温馨提示', content: '您已经在房间中，是否返回？', type: ENUM_POP_MESSAGE_TYPE.NUM2, sureBack: func2 })
                }
            }
        }
        Match.instance.req(0, func);
    }

    /**
     * 连接到游戏服务器
     * @param addr 游戏服务器地址
     * @param gameid 游戏ID
     * @param roomid 房间ID
     */
    connectToGame(addr: string, gameid: number, roomid: string) {
        const callBack = (success: boolean) => {
            if (success) {
                //this.changeToGameScene()
                this.clear()
                this.init()
                GameSocketManager.instance.sendToServer(SprotoClientReady, {})
            }
        }
        AuthGame.instance.req(addr, gameid, roomid, callBack);
    }

    /**
     * 游戏房间准备就绪处理
     * @param data 房间数据
     */
    onSvrGameRoomReady(data: any): void {
        console.log("gameRoomReady", data)
        MatchView.hideView();
        DataCenter.instance.gameid = data.gameid;
        DataCenter.instance.roomid = data.roomid;
        DataCenter.instance.gameAddr = data.addr;
        DataCenter.instance.shortRoomid = 0 // 匹配房
        console.log(LogColors.green('游戏房间准备完成'));
        this.connectToGame(data.addr, data.gameid, data.roomid);
    }

    /**
     * 房间结束处理
     * @param data 结束数据
     */
    onRoomEnd(data: any): void {
        const msg = "房间销毁"
        if (data.code == ROOM_END_FLAG.GAME_END) {
            console.log("游戏结束 " + msg)
        } else if (data.code == ROOM_END_FLAG.OUT_TIME_WAITING) {
            console.log("等待超时 " + msg)
            PopMessageView.showView({
                content: "等待超时",
                type: ENUM_POP_MESSAGE_TYPE.NUM1SURE,
                sureBack: () => {
                    this.changeToLobbyScene()
                },
                closeBack: () => {
                    this.changeToLobbyScene()
                }
            })
        } else if (data.code == ROOM_END_FLAG.OUT_TIME_PLAYING) {
            console.log("游戏超时 " + msg)
            PopMessageView.showView({
                content: "游戏超时",
                type: ENUM_POP_MESSAGE_TYPE.NUM1SURE,
                sureBack: () => {
                    this.changeToLobbyScene()
                },
                closeBack: () => {
                    this.changeToLobbyScene()
                }
            })
        } else if (data.code == ROOM_END_FLAG.OWNER_DISBAND) {
            let endMsg = "房主已经解散房间"
            if (GameData.instance.owner == DataCenter.instance.userid) {
                endMsg = "您已经解散房间"
            }
            PopMessageView.showView({
                content: endMsg,
                type: ENUM_POP_MESSAGE_TYPE.NUM1SURE,
                sureBack: () => {
                    this.changeToLobbyScene()
                },
                closeBack: () => {
                    this.changeToLobbyScene()
                }
            })
        } else if (data.code == ROOM_END_FLAG.VOTE_DISBAND) {
            console.log("投票解散 " + msg)
            //this.onBtnClose()

        }
    }

    /**
     * 玩家信息处理
     * @param data 玩家信息数据
     */
    onSvrPlayerInfos(data: any): void {
        console.log('onSvrPlayerInfos', data);
        // 先存到playerInfos里面
        // enter 的时候在从里面取出来，放到playerlist里面去
        GameData.instance.playerInfos = data.infos;
        for (let i = 0; i < data.infos.length; i++) {
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
                const localSeat = GameData.instance.seat2local(player.svrSeat)
                this.showPlayerInfoBySeat(localSeat);
            }
        }
    }

    /**
     * 游戏开始处理
     * @param data 游戏开始数据
     */
    onSvrGameStart(data: any): void {
        GameData.instance.gameStart = true;

        // 非重连情况
        if (!data.brelink) {
            if (data.roundNum == 1) {
                this.UI_COMP_GAME_START.act.play(() => {
                    this.UI_COMP_GAME_START.visible = false;
                    this.UI_COMP_ROUND_ACT.title.text = `Round ${data.roundNum}`
                    this.UI_COMP_ROUND_ACT.visible = true;
                    this.UI_COMP_ROUND_ACT.act.play(() => {
                        this.UI_COMP_ROUND_ACT.visible = false;
                    })
                })
                this.UI_COMP_GAME_START.visible = true;
            } else {
                this.UI_COMP_ROUND_ACT.title.text = `Round ${data.roundNum}`
                this.UI_COMP_ROUND_ACT.visible = true;
                this.UI_COMP_ROUND_ACT.act2.play(() => {
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

    /**
     * 游戏结束处理
     * @param data 游戏结束数据
     */
    onSvrGameEnd(data: any): void {
        GameData.instance.gameStart = false;
    }

    /**
     * 玩家进入处理
     * @param data 进入数据
     */
    onSvrPlayerEnter(data: any): void {
        const selfid = DataCenter.instance.userid;
        const svrSeat = data.seat;
        const userid = data.userid;
        const playerInfo = GameData.instance.getPlayerInfo(userid);
        if (playerInfo) {
            playerInfo.svrSeat = svrSeat;
            playerInfo.userid = userid;
            let localSeat = 0
            if (selfid == userid) {
                localSeat = SELF_LOCAL
            } else {
                localSeat = GameData.instance.seat2local(svrSeat);
            }
            GameData.instance.playerList[localSeat] = playerInfo;

            if (GameData.instance.isPrivateRoom) {
                if (playerInfo.status == PLAYER_STATUS.ONLINE && selfid == userid) {
                    this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.READY;
                }

                this.checkShowInviteBtn()
            }
            this.showPlayerInfoBySeat(localSeat);
        }
    }

    /**
     * 玩家状态更新处理
     * @param data 状态数据
     */
    onSvrPlayerStatusUpdate(data: any): void {
        const player = GameData.instance.getPlayerByUserid(data.userid);
        if (player) {
            player.status = data.status;
            this.showPlayerInfoBySeat(GameData.instance.seat2local(player.svrSeat))
            if (data.userid == DataCenter.instance.userid && data.status == PLAYER_STATUS.ONLINE) {
                this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.READY;
            }
        }
    }

    /**
     * 根据座位显示玩家信息
     * @param localseat 本地座位号
     */
    showPlayerInfoBySeat(localseat: number): void {
        const playerNode = this.getChild<CompPlayerHead>(`UI_COMP_PLAYER_${localseat}`);
        const player = GameData.instance.playerList[localseat];
        const nicknanme = playerNode.UI_TXT_NICKNAME
        const id = playerNode.UI_TXT_ID
        const head = playerNode.UI_COMP_HEAD as FGUICompHead
        nicknanme.text = player.nickname ?? "";
        id.text = player.userid.toString();
        const headurl = GameData.instance.getHeadurl(localseat)
        head.UI_LOADER_HEAD.url = headurl

        if (localseat != SELF_LOCAL) {
            if (player.status == PLAYER_STATUS.OFFLINE) {
                playerNode.UI_COMP_OFFLINE.visible = true
            } else {
                playerNode.UI_COMP_OFFLINE.visible = false
            }
            playerNode.visible = true
        }

        if (player.status == PLAYER_STATUS.READY) {
            this.showSignReady(localseat, true)
        }
    }

    /**
     * 隐藏玩家头像
     * @param localseat 本地座位号
     */
    hideHead(localseat: number) {
        const playerNode = this.getChild<CompPlayerHead>(`UI_COMP_PLAYER_${localseat}`);
        if (localseat != SEAT_1) {
            playerNode.visible = false
        }
    }

    /**
     * 玩家离开处理
     * @param data 离开数据
     */
    onSvrPlayerLeave(data: any): void {
        const localSeat = GameData.instance.seat2local(data.seat);
        GameData.instance.playerList.splice(localSeat, 1)
        this.hideHead(localSeat)
        this.checkShowInviteBtn()
    }

    /**
     * 房间信息处理
     * @param data 房间数据
     */
    onRoomInfo(data: any): void {
        console.log(data)
        GameData.instance.owner = data.owner;
        // 展示好友房信息
        if (data.shortRoomid) {
            const shortRoomid = `${data.shortRoomid}`
            this.UI_TXT_ROOMID.text = '房间号:' + shortRoomid.padStart(6, '0')
        }

        if (GameData.instance.isPrivateRoom && data.gameData && data.gameData != '') {
            const gameData = JSON.parse(data.gameData)
            if (gameData && gameData.rule != '') {
                const rule = JSON.parse(gameData.rule)
                this.UI_TXT_RULE.text = `${GAME_MODE_TXT[rule.mode]}`
                // 重新赋值房间人数
                GameData.instance.maxPlayer = rule.playerCnt

            }
        } else {
            GameData.instance.maxPlayer = data.playerids.length ?? 2
        }
        this.ctrl_playerCnt.selectedIndex = ROOM_PLAYER_INDEX[GameData.instance.maxPlayer] || 0
    }

    /**
     * 显示准备标识
     * @param localSeat 本地座位号
     * @param bshow 是否显示
     */
    showSignReady(localSeat: number, bshow: boolean): void {
        this.getChild<fgui.GImage>(`UI_IMG_SIGN_READY_${localSeat}`).visible = bshow
    }

    /**
     * 显示思考状态
     * @param localSeat 本地座位号
     * @param bshow 是否显示
     */
    showThinking(localSeat: number, bshow: boolean): void {
        const playerNode = this.getChild<CompPlayerHead>(`UI_COMP_PLAYER_${localSeat}`)
        playerNode.UI_COMP_THINKING.visible = bshow

    }

    /**
     * 玩家思考处理
     * @param localSeat 本地座位号
     */
    onPlayerThinking(localSeat: number): void {
        if (localSeat == SELF_LOCAL) {
            this.UI_GROUP_SELECT.visible = true
            this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.SURE
        } else {
            this.showThinking(localSeat, true)
        }
    }

    /**
     * 切换到大厅场景
     */
    changeToLobbyScene(): void {
        if (GameSocketManager.instance.isOpen()) {
            GameSocketManager.instance.close()
        }
        ChangeScene('LobbyScene')
    }

    /**
     * 返回按钮处理
     */
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
                } else {
                    GameSocketManager.instance.sendToServer(SprotoLeaveRoom, { flag: 1 });
                }
            }
        }

        if (GameData.instance.gameStart) {
            PopMessageView.showView({
                type: ENUM_POP_MESSAGE_TYPE.NUM1SURE,
                content: '游戏进行中，无法返回',
            })
        } else {
            this.changeToLobbyScene()
        }
    }

    /**
     * 准备按钮处理
     */
    onBtnReady(): void {
        const func = (res: any) => {
            if (res.code) {
                console.log(res.msg)
                //this.UI_BTN_READY.visible = false;
                this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.NONE;
            }
        }
        GameSocketManager.instance.sendToServer(SprotoGameReady, { ready: 1 }, func)
        this.clear()
    }

    /**
     * 更改出牌按钮处理
     */
    onBtnChange(): void {
        GameSocketManager.instance.sendToServer(SprotoOutHand, { gameid: DataCenter.instance.gameid, roomid: DataCenter.instance.roomid, flag: HAND_INDEX[this.ctrl_select.selectedIndex] })
    }

    /**
     * 剪刀按钮处理
     */
    onBtnScissors(): void {

    }

    /**
     * 石头按钮处理
     */
    onBtnRock(): void {

    }

    /**
     * 布按钮处理
     */
    onBtnPaper(): void {
    }

    /**
     * 开始解散房间投票
     */
    startDisband(): void {
        // 发起解散房间投票请求
        const data = {
            reason: "玩家发起解散" // 解散原因（可选）
        };

        GameSocketManager.instance.sendToServer(SprotoVoteDisbandRoom, data, (response: any) => {
            if (response && response.code === 1) {
                console.log('发起解散投票成功');
            } else {
                console.error('发起解散投票失败:', response?.msg || '未知错误');
            }
        });
    }

    /**
     * 解散房间按钮处理
     */
    onBtnDisband(): void {
        // 如果房间的socket已经断开，直接退出
        if (!GameSocketManager.instance.isOpen()) {
            return this.changeToLobbyScene()
        }
        if (GameData.instance.owner == DataCenter.instance.userid) {
            if (GameData.instance.gameStart || GameData.instance.privateNowCnt > 0) {
                this.startDisband()
            } else {
                PopMessageView.showView({
                    content: "解散后将无法返回此房间",
                    type: ENUM_POP_MESSAGE_TYPE.NUM1SURE,
                    sureBack: () => {
                        this.startDisband()
                    }
                })
            }

        } else {
            if (GameData.instance.gameStart || GameData.instance.privateNowCnt > 0) {
                this.startDisband()
            } else {
                PopMessageView.showView({
                    type: ENUM_POP_MESSAGE_TYPE.NUM1SURE,
                    content: '非房主只能在游戏开始后，发起解散',
                })

            }
        }
    }

    /**
     * 确定按钮处理
     */
    onBtnSure(): void {
        GameSocketManager.instance.sendToServer(SprotoOutHand, { gameid: DataCenter.instance.gameid, roomid: DataCenter.instance.roomid, flag: HAND_INDEX[this.ctrl_select.selectedIndex] })
    }

    /**
     * 显示邀请按钮
     * @param bshow 是否显示
     */
    showInviteBtn(bshow: boolean): void {
        this.UI_BTN_INVITE.visible = bshow
    }

    /**
     * 检测是否显示邀请按钮
     * @param bshow
     */
    checkShowInviteBtn(): void {
        if (!GameData.instance.isPrivateRoom) {
            this.showInviteBtn(false)
            return
        }

        if (GameData.instance.gameStart) {
            this.showInviteBtn(false)
            return
        }

        if (GameData.instance.privateNowCnt > 0) {
            this.showInviteBtn(false)
            return
        }

        const playerCnt = GameData.instance.getPlayerCnt()
        if (playerCnt >= GameData.instance.maxPlayer) {
            this.showInviteBtn(false)
            return
        }
        this.showInviteBtn(true)
    }

    /**
     * 绘制邀请图片
     * @returns 图片路径
     */
    async drawInviteInfo(): Promise<string> {
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
            MiniGameUtils.instance.makeCanvasImage({ filename: "invite" }).then((res: string) => {
                console.log(res)
                resolve(res)
            }).catch((err: any) => {
                reject(err)
            })
        })
    }

    /**
     * 邀请好友
     */
    onBtnInvite(): void {
        this.drawInviteInfo().then((res: string) => {
            MiniGameUtils.instance.shareAppMessage({
                title: `房间号：${DataCenter.instance.shortRoomid} 点击加入 速来战`,
                imageUrl: res,
                query: `gameid=${10001}&roomid=${DataCenter.instance.shortRoomid}`
            })
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /**
     * 聊天
     */
    onBtnTalk(): void {
        TalkView.showView()
    }

    /**
     * 选择器变化处理
     * @param event 变化事件
     */
    onChanged(event: any): void {
        if (event.selectedIndex != this._selectOutHand) {
            if (this._selectOutHand != -1) {
                this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.CHANGE
            } else {
                this.ctrl_btn.selectedIndex = CTRL_BTN_INDEX.SURE
            }
        }
    }
}
fgui.UIObjectFactory.setExtension(CompGameMain.URL, CompGameMain);