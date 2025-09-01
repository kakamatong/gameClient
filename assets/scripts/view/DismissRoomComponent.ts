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
    private _countdownTimer: number | null = null; // 倒计时定时器
    private _timeLeft: number = 0; // 剩余时间
    private _hasVoted: boolean = false; // 是否已投票

    constructor() {
        super();
        this.init();
    }

    private init() {
  
    }

    onEnable(){
        // 监听服务器投票解散相关消息
        GameSocketManager.instance.addServerListen("voteDisbandUpdate", this.onVoteDisbandUpdate.bind(this));
        GameSocketManager.instance.addServerListen("voteDisbandResult", this.onVoteDisbandResult.bind(this));

        // 初始化倒计时显示
        this.initCountdownDisplay();
        this.UI_LV_DISMISS.itemRenderer = this.listItemRenderer.bind(this)
    }

    /**
     * 初始化倒计时显示
     */
    private initCountdownDisplay() {
        this.UI_TXT_LEFT_TIME.text = "等待中...";
        this.UI_TXT_LEFT_TIME.color = new Color(255, 255, 0, 255); // 黄色
    }

    listItemRenderer(index: number, item: fgui.GObject): void { 
        const data = this._currentVotes[index];
        const player = GameData.instance.getPlayerByUserid(data.userid);
        if (player) {
            item.asCom.getChild('UI_TXT_NICKNAME').text = player.nickname || `玩家${player.userid}`;
            item.asCom.getChild('UI_TXT_RESULT').text = this.getVoteStatusText(data.vote);
            (item.asCom.getChild('UI_TXT_RESULT') as fgui.GTextField).color = this.getVoteStatusColor(data.vote)
        }
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
        this.UI_LV_DISMISS.numItems = this._currentVotes.length
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
    onVoteDisbandStart(data: VoteDisbandStartData) {
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
            // 自己发起的投票，隐藏按钮
            if (data.initiator === DataCenter.instance.userid) {
                this.ctrl_agree.selectedIndex = 1
            }
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
        
        const votes = data.votes 
        this._timeLeft = data.timeLeft;
        this.updateVoteList(votes);
        this.updateCountdown(data.timeLeft);
        this.updateVoteProgress(data.agreeCount, data.refuseCount);

        // 自己已经同意，隐藏按钮
        for (let index = 0; index < votes.length; index++) {
            const element = votes[index];
            if(element.userid === DataCenter.instance.userid && element.vote == VOTE_STATUS.AGREE){
                this.ctrl_agree.selectedIndex = 1
            }
        }
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
        if (this.UI_TXT_LEFT_TIME) {
            this.UI_TXT_LEFT_TIME.text = `剩余时间: ${timeLeft}秒`;
            
            // 时间不足时变红色提醒
            if (timeLeft <= 10) {
                this.UI_TXT_LEFT_TIME.color = new Color(255, 0, 0, 255);
            } else {
                this.UI_TXT_LEFT_TIME.color = new Color(255, 255, 0, 255);
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
        GameSocketManager.instance.removeServerListen("voteDisbandUpdate");
        GameSocketManager.instance.removeServerListen("voteDisbandResult");

        
        super.dispose();
    }
}