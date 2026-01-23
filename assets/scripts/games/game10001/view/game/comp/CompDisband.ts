import FGUICompDisband from "../../../../../fgui/game10001/FGUICompDisband";
import * as fgui from "fairygui-cc";
import { VOTE_STATUS, VoteDisbandResultData, VoteDisbandStartData, VoteDisbandUpdateData, VoteInfo } from "../../../data/InterfaceGameConfig";
import { GameData } from "../../../data/Gamedata";
import { GameSocketManager } from "../../../../../frameworks/GameSocketManager";
import { DataCenter } from "../../../../../datacenter/Datacenter";
import { TipsView } from "../../../../../view/common/TipsView";
import { PopMessageView } from "../../../../../view/common/PopMessageView";
import { ENUM_POP_MESSAGE_TYPE } from "../../../../../datacenter/InterfaceConfig";
import { Color } from "cc";
import { SprotoVoteDisbandResult, SprotoVoteDisbandStart, SprotoVoteDisbandUpdate } from "../../../../../../types/protocol/game10001/s2c";
import { ViewClass } from "db://assets/scripts/frameworks/Framework";
import { SprotoVoteDisbandResponse } from "db://assets/types/protocol/game10001/c2s";

/**
 * 解散房间投票组件
 * 用于处理房间解散投票的UI显示和交互，包括发起投票、显示投票状态、处理投票结果等功能
 */
@ViewClass()
export class CompDisband extends FGUICompDisband {
    private _voteId: number = 0; // 投票ID
    private _voteData: VoteDisbandStartData | null = null; // 投票开始数据
    private _currentVotes: VoteInfo[] = []; // 当前投票状态
    private _timeLeft: number = 0; // 剩余时间
    private _initiator = 0; // 投票发起者用户ID
    private _scheid:(()=>void) | null = null; // 倒计时调度回调函数

    /**
     * 组件初始化
     * 设置监听器、绑定列表渲染器、初始化定时器回调
     */
    onConstruct(){
        // 一定要执行父类的接口
        super.onConstruct();
        this._scheid = this.onTimer.bind(this)
        GameSocketManager.instance.addServerListen(SprotoVoteDisbandStart, this.onVoteDisbandStart.bind(this));
        GameSocketManager.instance.addServerListen(SprotoVoteDisbandUpdate, this.onVoteDisbandUpdate.bind(this));
        GameSocketManager.instance.addServerListen(SprotoVoteDisbandResult, this.onVoteDisbandResult.bind(this));
        this.UI_LV_VOTE_INFO.itemRenderer = this.listItemRenderer.bind(this)
    }

    /**
     * 组件销毁
     * 移除服务器消息监听器
     */
    protected onDestroy(): void {
        super.onDestroy();
        GameSocketManager.instance.removeServerListen(SprotoVoteDisbandStart);
        GameSocketManager.instance.removeServerListen(SprotoVoteDisbandUpdate);
        GameSocketManager.instance.removeServerListen(SprotoVoteDisbandResult);
    }

    /**
     * 投票列表项渲染器
     * @param index 列表项索引
     * @param item 列表项对象
     */
    listItemRenderer(index: number, item: fgui.GObject): void {
        const data = this._currentVotes[index];
        const player = GameData.instance.getPlayerByUserid(data.userid);
        if (player) {
            item.asCom.getChild('UI_TXT_NICKNAME').text = player.nickname || `玩家${player.userid}`;
            const headNode = item.asCom.getChild('UI_COMP_HEAD');
            const head = headNode.asCom.getChild('UI_LOADER_HEAD') as fgui.GLoader;
            head.url = GameData.instance.getHeadurl(GameData.instance.local2seat(player.svrSeat));
            if (this._initiator == data.userid) {
                item.asCom.getController('ctrl_result').selectedIndex = 3;
            }else{
                item.asCom.getController('ctrl_result').selectedIndex = this.getVoteStatusText(data.vote);
            }
        }
    }

    /**
     * 获取投票状态对应的控制器索引
     * @param voteStatus 投票状态枚举值
     * @returns 控制器selectedIndex值：0-未投票，1-同意，2-拒绝
     */
    private getVoteStatusText(voteStatus: number): number {
        switch (voteStatus) {
            case VOTE_STATUS.AGREE:
                return 1;
            case VOTE_STATUS.REFUSE:
                return 2;
            case VOTE_STATUS.NOT_VOTED:
            default:
                return 0;
        }
    }

    /**
     * 处理服务器发送的投票解散开始消息
     */
    onVoteDisbandStart(data: VoteDisbandStartData) {
        console.log('收到投票解散开始消息:', data);
        this.visible = true
        this.ctrl_btn.selectedIndex = 0 // 初始化
        this._voteId = data.voteId;
        this._voteData = data;
        this._timeLeft = data.timeLeft - Math.ceil(new Date().getTime() / 1000);
        
        // 更新界面显示
        this.updateCountdown(this._timeLeft);
        
        // 启动倒计时
        this.startCountdown();
        
        // 显示投票发起信息
        if (data.initiator) {
            this._initiator = data.initiator;
        }
    }

    /**
     * 处理投票状态更新
     */
    private onVoteDisbandUpdate(data: VoteDisbandUpdateData) {
        console.log('投票状态更新:', data);
        
        const votes = data.votes 
        this._timeLeft = data.timeLeft - Math.ceil(new Date().getTime() / 1000);;
        this.updateVoteList(votes);
        this.updateCountdown(this._timeLeft);

        // 自己已经同意，隐藏按钮
        for (let index = 0; index < votes.length; index++) {
            const element = votes[index];
            if(element.userid === DataCenter.instance.userid && element.vote == VOTE_STATUS.AGREE){
                this.ctrl_btn.selectedIndex = 1
            }
        }
    }

    /**
     * 更新投票列表显示
     */
    private updateVoteList(votes: VoteInfo[]) {
        if (!votes || votes.length === 0) return;

        // 更新当前投票数据
        this._currentVotes = votes;
        this.UI_LV_VOTE_INFO.numItems = this._currentVotes.length
    }

    /**
     * 处理投票解散结果
     */
    private onVoteDisbandResult(data: VoteDisbandResultData) {
        console.log('投票解散结果:', data);
        
        // 停止倒计时
        this.stopCountdown();
        
        // 更新最终投票状态
        this.updateVoteList(data.votes);
        
        if (data.result === 1) {
            // 投票通过，房间将被解散
            console.log('投票通过，房间即将解散');
            PopMessageView.showView({
                content: '投票通过，房间已解散',
                type:ENUM_POP_MESSAGE_TYPE.NUM1SURE
            });
        } else {
            // 投票未通过
            console.log('投票未通过，继续游戏');
            TipsView.showView({
                content: '投票未通过，请继续游戏',
            });
        }

        this.scheduleOnce(()=>{
            this.visible = false
        },1)
    }

    /**
     * 同意解散按钮点击事件
     * 发送同意投票请求到服务器
     */
    onBtnAgree(): void {
        this.sendVoteResponse(VOTE_STATUS.AGREE);
    }

    /**
     * 拒绝解散按钮点击事件
     * 发送拒绝投票请求到服务器
     */
    onBtnRefuse(): void {
        this.sendVoteResponse(VOTE_STATUS.REFUSE);
    }

    /**
     * 发送投票响应到服务器
     * @param vote 投票状态：同意或拒绝
     */
    private sendVoteResponse(vote: number) {
        const data = {
            voteId: this._voteId,
            agree: vote
        };

        GameSocketManager.instance.sendToServer(SprotoVoteDisbandResponse, data, (response: any) => {
            if (response && response.code === 1) {
                console.log('投票发送成功');
            } else {
                console.error('投票发送失败:', response?.msg || '未知错误');
            }
        });
    }

    /**
     * 启动倒计时
     */
    private startCountdown() {
        this.stopCountdown(); // 先停止之前的倒计时
        
        this._scheid && this.schedule(this._scheid, 1)
    }

    /**
     * 倒计时定时器回调
     * 每秒执行一次，更新剩余时间并检查是否超时
     */
    onTimer(){
        this._timeLeft--;
        this.updateCountdown(this._timeLeft);

        if (this._timeLeft <= 0) {
            this.stopCountdown();
        }
    }

    /**
     * 停止倒计时
     */
    private stopCountdown() {
        this._scheid && this.unschedule(this._scheid)
    }

    /**
     * 更新倒计时显示
     */
    private updateCountdown(timeLeft: number) {
        if (this.UI_TXT_LEFT_TIME) {
            this.UI_TXT_LEFT_TIME.text = `${timeLeft}`;
            
            // 时间不足时变红色提醒
            if (timeLeft <= 10) {
                this.UI_TXT_LEFT_TIME.color = new Color(255, 0, 0, 255);
            } else {
                this.UI_TXT_LEFT_TIME.color = new Color(255, 255, 0, 255);
            }
        }
    }
}
fgui.UIObjectFactory.setExtension(CompDisband.URL, CompDisband);