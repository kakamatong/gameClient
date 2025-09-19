import FGUICompDisband from "../../../../../fgui/game10001/FGUICompDisband";
import * as fgui from "fairygui-cc";
import { VOTE_STATUS, VoteDisbandResultData, VoteDisbandStartData, VoteDisbandUpdateData, VoteInfo } from "../../../data/interfaceGameConfig";
import { GameData } from "../../../data/gamedata";
import { GameSocketManager } from "../../../../../frameworks/gameSocketManager";
import { DataCenter } from "../../../../../datacenter/datacenter";
import { TipsView } from "../../../../../view/common/tipsView";
import { PopMessageView } from "../../../../../view/common/popMessageView";
import { ENUM_POP_MESSAGE_TYPE } from "../../../../../datacenter/interfaceConfig";
import { Color } from "cc";

export class CompDisband extends FGUICompDisband { 
    private _voteId: number = 0; // 投票ID
    private _voteData: VoteDisbandStartData | null = null; // 投票开始数据
    private _currentVotes: VoteInfo[] = []; // 当前投票状态
    private _timeLeft: number = 0; // 剩余时间
    private _initiator = 0;
    private _scheid:(()=>void) | null = null;
    onConstruct(){
        // 一定要执行父类的接口
        super.onConstruct();
        this._scheid = this.onTimer.bind(this)
        GameSocketManager.instance.addServerListen("voteDisbandStart", this.onVoteDisbandStart.bind(this));
        GameSocketManager.instance.addServerListen("voteDisbandUpdate", this.onVoteDisbandUpdate.bind(this));
        GameSocketManager.instance.addServerListen("voteDisbandResult", this.onVoteDisbandResult.bind(this));
        this.UI_LV_VOTE_INFO.itemRenderer = this.listItemRenderer.bind(this)
    }

    protected onDestroy(): void {
        super.onDestroy();
        GameSocketManager.instance.removeServerListen("voteDisbandUpdate");
        GameSocketManager.instance.removeServerListen("voteDisbandResult");
    }

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

    onBtnClose(): void {
        DisbandVoteView.hideView()
    }

    /**
     * 处理服务器发送的投票解散开始消息
     */
    onVoteDisbandStart(data: VoteDisbandStartData) {
        console.log('收到投票解散开始消息:', data);
        this.visible = true
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

        const comp = this.node.components[0]
        comp.scheduleOnce(()=>{
            this.visible = false
        },1)
    }

    onBtnAgree(): void {
        this.sendVoteResponse(VOTE_STATUS.AGREE);
    }

    onBtnRefuse(): void {
        this.sendVoteResponse(VOTE_STATUS.REFUSE);
    }

    private sendVoteResponse(vote: number) {
        const data = {
            voteId: this._voteId,
            agree: vote
        };

        GameSocketManager.instance.sendToServer('voteDisbandResponse', data, (response: any) => {
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
        
        const comp = this.node.components[0]
        comp.schedule(this._scheid, 1)
    }

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
        const comp = this.node.components[0]
        comp.unschedule(this._scheid)
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
}
fgui.UIObjectFactory.setExtension(CompDisband.URL, CompDisband);