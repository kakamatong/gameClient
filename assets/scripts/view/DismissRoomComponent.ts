import FGUIcompDismissRoom from '../fgui/test/FGUIcompDismissRoom';
import { GameSocketManager } from '../frameworks/gameSocketManager';
import { DataCenter } from '../datacenter/datacenter';
import { GameData } from '../datacenter/gamedata';
import { VoteInfo, VoteDisbandStartData, VoteDisbandUpdateData, VoteDisbandResultData, VOTE_STATUS } from '../datacenter/interfaceGameConfig';
import { Color } from 'cc';
import * as fgui from "fairygui-cc";

/**
 * 投票解散房间组件
 * 继承自FGUIcompDismissRoom，实现投票解散功能
 */
export class DismissRoomComponent extends FGUIcompDismissRoom {
    private _voteId: number = 0; // 投票ID
    private _voteData: VoteDisbandStartData | null = null; // 投票开始数据
    private _currentVotes: VoteInfo[] = []; // 当前投票状态
    private _dismissListItems: fgui.GComponent[] = []; // 投票列表项
    private _countdownTimer: number | null = null; // 倒计时定时器
    private _timeLeft: number = 0; // 剩余时间
    private _countdownText: fgui.GTextField | null = null; // 倒计时显示文本
    private _hasVoted: boolean = false; // 是否已投票

    constructor() {
        super();
        this.init();
    }

    private init() {
        // 监听服务器投票解散相关消息
        GameSocketManager.instance.addServerListen("voteDisbandStart", this.onVoteDisbandStart.bind(this));
        GameSocketManager.instance.addServerListen("voteDisbandUpdate", this.onVoteDisbandUpdate.bind(this));
        GameSocketManager.instance.addServerListen("voteDisbandResult", this.onVoteDisbandResult.bind(this));
        
        // 初始化倒计时显示
        this.initCountdownDisplay();
        
        // 初始化投票列表
        this.initVoteList();
    }

    /**
     * 初始化倒计时显示
     */
    private initCountdownDisplay() {
        // 创建倒计时文本显示
        this._countdownText = new fgui.GTextField();
        this._countdownText.text = "等待中...";
        this._countdownText.fontSize = 18;
        this._countdownText.color = new Color(255, 255, 0, 255); // 黄色
        this._countdownText.setSize(200, 30);
        this._countdownText.x = (this.width - 200) / 2;
        this._countdownText.y = 10;
        this.addChild(this._countdownText);
    }

    /**
     * 初始化投票列表显示
     */
    private initVoteList() {
        // 清空现有列表
        this.UI_LV_DISMISS.removeChildrenToPool();
        this._dismissListItems = [];

        // 如果有投票数据，则根据数据创建列表
        if (this._currentVotes.length > 0) {
            for (let voteInfo of this._currentVotes) {
                const player = this.getPlayerById(voteInfo.userid);
                if (player) {
                    const item = this.createVoteListItem(player, voteInfo.vote);
                    this.UI_LV_DISMISS.addChild(item);
                    this._dismissListItems.push(item);
                }
            }
        } else {
            // 如果没有投票数据，则根据房间玩家创建
            const players = GameData.instance.playerList;
            for (let i = 0; i < players.length; i++) {
                const player = players[i];
                if (player && player.userid) {
                    const item = this.createVoteListItem(player, VOTE_STATUS.NOT_VOTED);
                    this.UI_LV_DISMISS.addChild(item);
                    this._dismissListItems.push(item);
                }
            }
        }
    }

    /**
     * 创建投票列表项
     */
    private createVoteListItem(player: any, voteStatus: number = VOTE_STATUS.NOT_VOTED): fgui.GComponent {
        // 创建简单的列表项组件
        const item = new fgui.GComponent();
        item.setSize(200, 40);

        // 玩家昵称
        const nameText = new fgui.GTextField();
        nameText.text = player.nickname || `玩家${player.userid}`;
        nameText.setSize(100, 30);
        nameText.x = 10;
        nameText.y = 5;
        item.addChild(nameText);

        // 投票状态
        const statusText = new fgui.GTextField();
        statusText.text = this.getVoteStatusText(voteStatus);
        statusText.color = this.getVoteStatusColor(voteStatus);
        statusText.setSize(80, 30);
        statusText.x = 110;
        statusText.y = 5;
        statusText.name = "status_text";
        item.addChild(statusText);

        item.data = player.userid; // 存储玩家ID
        return item;
    }

    /**
     * 获取投票状态文本
     */
    private getVoteStatusText(voteStatus: number): string {
        switch (voteStatus) {
            case VOTE_STATUS.AGREE:
                return "同意";
            case VOTE_STATUS.REFUSE:
                return "拒绝";
            case VOTE_STATUS.NOT_VOTED:
            default:
                return "等待中";
        }
    }

    /**
     * 获取投票状态颜色
     */
    private getVoteStatusColor(voteStatus: number): Color {
        switch (voteStatus) {
            case VOTE_STATUS.AGREE:
                return new Color(0, 255, 0, 255); // 绿色
            case VOTE_STATUS.REFUSE:
                return new Color(255, 0, 0, 255); // 红色
            case VOTE_STATUS.NOT_VOTED:
            default:
                return new Color(153, 153, 153, 255); // 灰色
        }
    }

    /**
     * 根据用户ID获取玩家信息
     */
    private getPlayerById(userid: number): any {
        const players = GameData.instance.playerList;
        for (let player of players) {
            if (player && player.userid === userid) {
                return player;
            }
        }
        return null;
    }

    /**
     * 更新投票列表显示
     */
    private updateVoteList(votes: VoteInfo[]) {
        if (!votes || votes.length === 0) return;

        // 更新当前投票数据
        this._currentVotes = votes;

        for (let i = 0; i < this._dismissListItems.length; i++) {
            const item = this._dismissListItems[i];
            const userid = item.data;
            const statusText = item.getChild("status_text") as fgui.GTextField;

            // 查找对应的投票状态
            const voteInfo = votes.find(v => v.userid === userid);
            const voteStatus = voteInfo ? voteInfo.vote : VOTE_STATUS.NOT_VOTED;

            statusText.text = this.getVoteStatusText(voteStatus);
            statusText.color = this.getVoteStatusColor(voteStatus);
        }
    }

    /**
     * 同意按钮点击事件
     */
    onBtnDismissAgree(): void {
        console.log('同意解散房间');
        this.sendVoteResponse(VOTE_STATUS.AGREE);
    }

    /**
     * 拒绝按钮点击事件
     */
    onBtnDismissRefuse(): void {
        console.log('拒绝解散房间');
        this.sendVoteResponse(VOTE_STATUS.REFUSE);
    }

    /**
     * 发送投票响应到服务器
     */
    private sendVoteResponse(vote: number) {
        if (this._hasVoted) {
            console.log('已经投过票了');
            return;
        }

        const data = {
            voteId: this._voteId,
            agree: vote
        };

        GameSocketManager.instance.sendToServer('voteDisbandResponse', data, (response: any) => {
            if (response && response.code === 0) {
                console.log('投票发送成功');
                this._hasVoted = true;
                // 禁用按钮，防止重复投票
                this.UI_BTN_DISMISS_AGREE.enabled = false;
                this.UI_BTN_DISMISS_REFUSE.enabled = false;
            } else {
                console.error('投票发送失败:', response?.msg || '未知错误');
            }
        });
    }

    /**
     * 处理服务器发送的投票解散开始消息
     */
    private onVoteDisbandStart(data: VoteDisbandStartData) {
        console.log('收到投票解散开始消息:', data);
        
        this._voteId = data.voteId;
        this._voteData = data;
        this._timeLeft = data.timeLeft;
        this._hasVoted = false;
        
        // 更新界面显示
        this.updateCountdown(data.timeLeft);
        this.showVoteInfo(data);
        
        // 启动倒计时
        this.startCountdown();
        
        // 显示投票发起信息
        if (data.initiator) {
            const initiatorName = this.getPlayerNameById(data.initiator);
            console.log(`${initiatorName} 发起了解散房间投票`);
            if (data.reason) {
                console.log(`解散原因: ${data.reason}`);
            }
        }
    }

    /**
     * 处理投票状态更新
     */
    private onVoteDisbandUpdate(data: VoteDisbandUpdateData) {
        console.log('投票状态更新:', data);
        
        this._timeLeft = data.timeLeft;
        this.updateVoteList(data.votes);
        this.updateCountdown(data.timeLeft);
        this.updateVoteProgress(data.agreeCount, data.refuseCount);
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
            this.showResultMessage(`投票通过，房间即将解散\n${data.reason || ''}`, true);
        } else {
            // 投票未通过
            console.log('投票未通过，继续游戏');
            this.showResultMessage(`投票未通过，继续游戏\n${data.reason || ''}`, false);
        }

        // 延时关闭投票界面
        setTimeout(() => {
            this.closeDismissPanel();
        }, 3000);
    }

    /**
     * 显示投票信息
     */
    private showVoteInfo(data: VoteDisbandStartData) {
        // 这里可以显示投票的详细信息，比如需要多少人同意等
        console.log(`房间总人数: ${data.playerCount}, 需要同意人数: ${data.needAgreeCount}`);
    }

    /**
     * 更新投票进度显示
     */
    private updateVoteProgress(agreeCount: number, refuseCount: number) {
        console.log(`当前投票进度 - 同意: ${agreeCount}, 拒绝: ${refuseCount}`);
        // 这里可以更新UI显示投票进度
    }

    /**
     * 启动倒计时
     */
    private startCountdown() {
        this.stopCountdown(); // 先停止之前的倒计时
        
        this._countdownTimer = setInterval(() => {
            this._timeLeft--;
            this.updateCountdown(this._timeLeft);
            
            if (this._timeLeft <= 0) {
                this.stopCountdown();
            }
        }, 1000) as any;
    }

    /**
     * 停止倒计时
     */
    private stopCountdown() {
        if (this._countdownTimer) {
            clearInterval(this._countdownTimer);
            this._countdownTimer = null;
        }
    }

    /**
     * 更新倒计时显示
     */
    private updateCountdown(timeLeft: number) {
        if (this._countdownText) {
            this._countdownText.text = `剩余时间: ${timeLeft}秒`;
            
            // 时间不足时变红色提醒
            if (timeLeft <= 10) {
                this._countdownText.color = new Color(255, 0, 0, 255);
            } else {
                this._countdownText.color = new Color(255, 255, 0, 255);
            }
        }
    }

    /**
     * 根据用户ID获取玩家昵称
     */
    private getPlayerNameById(userid: number): string {
        const players = GameData.instance.playerList;
        for (let player of players) {
            if (player && player.userid === userid) {
                return player.nickname || `玩家${userid}`;
            }
        }
        return `玩家${userid}`;
    }

    /**
     * 显示投票结果消息
     */
    private showResultMessage(message: string, success: boolean) {
        // 这里可以创建一个临时的文本组件来显示结果
        const resultText = new fgui.GTextField();
        resultText.text = message;
        resultText.fontSize = 20;
        resultText.color = success ? new Color(0, 255, 0, 255) : new Color(255, 0, 0, 255);
        resultText.setSize(200, 40);
        resultText.x = this.width / 2 - 100;
        resultText.y = this.height / 2 - 20;
        this.addChild(resultText);

        // 2秒后移除
        setTimeout(() => {
            if (resultText.parent) {
                this.removeChild(resultText);
            }
        }, 2000);
    }

    /**
     * 关闭投票面板
     */
    private closeDismissPanel() {
        // 停止倒计时
        this.stopCountdown();
        
        // 移除服务器监听
        GameSocketManager.instance.removeServerListen("voteDisbandStart");
        GameSocketManager.instance.removeServerListen("voteDisbandUpdate");
        GameSocketManager.instance.removeServerListen("voteDisbandResult");

        // 从父容器中移除
        if (this.parent) {
            this.parent.removeChild(this);
        }
        
        // 释放资源
        this.dispose();
    }

    /**
     * 组件销毁时的清理工作
     */
    dispose(): void {
        // 停止倒计时
        this.stopCountdown();
        
        // 清理监听器
        GameSocketManager.instance.removeServerListen("voteDisbandStart");
        GameSocketManager.instance.removeServerListen("voteDisbandUpdate");
        GameSocketManager.instance.removeServerListen("voteDisbandResult");
        
        // 清理列表项
        this._dismissListItems = [];
        
        super.dispose();
    }
}