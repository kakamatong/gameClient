/**
 * @file MatchView.ts
 * @description 匹配视图：处理游戏匹配流程
 * @category 匹配视图
 */

import FGUIMatchView from '../../fgui/match/FGUIMatchView';
import * as fgui from "fairygui-cc";
import { Match } from '../../modules/Match';
import { ENUM_POP_MESSAGE_TYPE, LOCAL_KEY } from '../../datacenter/InterfaceConfig';
import { PopMessageView } from '../common/PopMessageView';
import { LobbySocketManager } from '../../frameworks/LobbySocketManager';
import { DataCenter } from '../../datacenter/Datacenter';
import { LogColors, ViewClass } from '../../frameworks/Framework';
import { TipsView } from '../common/TipsView';
import {CompMatchAct} from './comp/CompMatchAct';
import { sys } from 'cc';
import { SprotoMatchOnSure, SprotoMatchOnSureFail } from '../../../types/protocol/lobby/s2c';

/**
 * @class MatchView
 * @description 匹配视图，处理游戏匹配流程
 * @category 匹配视图
 */
@ViewClass()
export class MatchView extends FGUIMatchView {
    /** 匹配确认ID */
    private _checkID:number = 0;
    /** 是否被匹配到 */
    private _beCheck:boolean = false;

    /**
     * @description 显示匹配视图
     * @param data 视图数据
     */
    show(data:any){
        this.ctrl_btn_join.selectedIndex = 0;
        LobbySocketManager.instance.addServerListen(SprotoMatchOnSure, this.onSvrMatchOnSure.bind(this));
        LobbySocketManager.instance.addServerListen(SprotoMatchOnSureFail, this.onSvrMatchOnSureFail.bind(this));
        const bauto = sys.localStorage.getItem(LOCAL_KEY.MATCH_AUTO_JOIN);
        if (bauto == 'true') {
            this.UI_BTN_AUTO_CHECK.selected = true; 
        }else if (bauto == 'false') {
            this.UI_BTN_AUTO_CHECK.selected = false; 
        }
    }

    /**
     * @description 销毁视图时的清理工作
     */
    protected onDestroy(): void {
        super.onDestroy();
        LobbySocketManager.instance.removeServerListen(SprotoMatchOnSure);
        LobbySocketManager.instance.removeServerListen(SprotoMatchOnSureFail);
    }

    /**
     * @description 取消匹配按钮点击事件
     */
    onBtnCancel(): void {
        if (this._beCheck) {
            const callBack = (data:any)=>{ 
                if (data.code = 1) {
                    MatchView.hideView()
                }else{
                    TipsView.showView({content:"错误"})
                    MatchView.hideView()
                }
            }
            LobbySocketManager.instance.sendToServer(SprotoMatchOnSure, {
                id: this._checkID,
                sure: false
            },callBack)
        }else{
            const func = (b:boolean, data?:any)=>{
                if (b) {
                    // 显示匹配view
                    MatchView.hideView();
                }else{
                    PopMessageView.showView({title:'温馨提示', content:'离开匹配失败！', type:ENUM_POP_MESSAGE_TYPE.NUM1SURE})
                }
            }
            Match.instance.reqLeave(func);
        }
    }

    /**
     * @description 处理服务器匹配确认消息
     * @param data 匹配确认数据
     */
    onSvrMatchOnSure(data:any){
        this._beCheck = true
        let selfReady = false;
        if(data.readys && data.readys.length > 0){
            for(let i = 0; i < data.readys.length; i++){
                const userid = data.readys[i];
                if(userid == DataCenter.instance.userid){
                    console.log(LogColors.red('已准备'));
                    selfReady = true;
                    this.ctrl_enter.selectedIndex = 1;
                    this.stopAct()
                    break
                }
            }
        }

        if (!selfReady) {
            this._checkID = data.id;
            this.ctrl_btn_join.selectedIndex = 1;
            this.ctrl_enter.selectedIndex = 2;
            this.stopAct()
            this.showLeftTime(data.endTime ?? 0)
            this.schedule(()=>{
                this.showLeftTime(data.endTime ?? 0)
            },1)

            if (this.UI_BTN_AUTO_CHECK.selected) {
                this.onBtnJoin()
            }
        }
    }

    /**
     * @description 自动匹配复选框状态改变
     */
    onBtnAutoCheck(): void {
        if (this.UI_BTN_AUTO_CHECK.selected) {
            sys.localStorage.setItem(LOCAL_KEY.MATCH_AUTO_JOIN, 'true');
        }else{
            sys.localStorage.setItem(LOCAL_KEY.MATCH_AUTO_JOIN, 'false');
        }
    }

    /**
     * @description 显示剩余倒计时
     * @param endTime 结束时间戳
     */
    showLeftTime(endTime:number){
        const timeNow = Math.floor(Date.now() / 1000)
        const dt = endTime - timeNow
        if (dt < 0) {
            return
        }
        this.updateCancelBtn(dt)
    }

    /**
     * @description 更新取消按钮文本
     * @param n 剩余秒数
     */
    updateCancelBtn(n:number){
        this.UI_BTN_CANCEL.title = `取消(${n}s)`
    }

    /**
     * @description 处理服务器匹配确认失败消息
     * @param data 失败消息数据
     */
    onSvrMatchOnSureFail(data:any){
        TipsView.showView({content:data.msg})
        MatchView.hideView()
    }

    /**
     * @description 停止匹配动画
     */
    stopAct(){
        (this.UI_COMP_ACT as CompMatchAct).stopSche();
        (this.UI_COMP_ACT as CompMatchAct).success();
    }

    /**
     * @description 确认加入匹配按钮点击事件
     */
    onBtnJoin(): void {
        const callBack = (data:any)=>{ 
            if (data.code = 1) {
                this.ctrl_enter.selectedIndex = 1;
            }
        }
        LobbySocketManager.instance.sendToServer(SprotoMatchOnSure, {
            id: this._checkID,
            sure: true
        },callBack)
    }
}
fgui.UIObjectFactory.setExtension(MatchView.URL, MatchView);