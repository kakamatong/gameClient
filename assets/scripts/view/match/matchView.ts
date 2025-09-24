
import FGUIMatchView from '../../fgui/match/FGUIMatchView';
import * as fgui from "fairygui-cc";
import { Match } from '../../modules/match';
import { ENUM_POP_MESSAGE_TYPE, LOCAL_KEY } from '../../datacenter/interfaceConfig';
import { PopMessageView } from '../common/popMessageView';
import { LobbySocketManager } from '../../frameworks/lobbySocketManager';
import { DataCenter } from '../../datacenter/datacenter';
import { LogColors } from '../../frameworks/framework';
import { TipsView } from '../common/tipsView';
import {CompMatchAct} from './comp/compMatchAct';
import { sys } from 'cc';
export class MatchView extends FGUIMatchView {
    private _checkID:number = 0;
    private _beCheck:boolean = false;
    show(data:any){
        this.ctrl_btn_join.selectedIndex = 0;
        LobbySocketManager.instance.addServerListen("matchOnSure", this.onSvrMatchOnSure.bind(this));
        LobbySocketManager.instance.addServerListen("matchOnSureFail", this.onSvrMatchOnSureFail.bind(this));
        const bauto = sys.localStorage.getItem(LOCAL_KEY.MATCH_AUTO_JOIN);
        if (bauto == 'true') {
            this.UI_BTN_AUTO_CHECK.selected = true; 
        }else if (bauto == 'false') {
            this.UI_BTN_AUTO_CHECK.selected = false; 
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        LobbySocketManager.instance.removeServerListen("matchOnSure");
        LobbySocketManager.instance.removeServerListen("matchOnSureFail");
    }

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
            LobbySocketManager.instance.sendToServer('matchOnSure', {
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
            this.node.components[0].schedule(()=>{
                this.showLeftTime(data.endTime ?? 0)
            },1)

            if (this.UI_BTN_AUTO_CHECK.selected) {
                this.onBtnJoin()
            }
        }
    }

    onBtnAutoCheck(): void {
        if (this.UI_BTN_AUTO_CHECK.selected) {
            sys.localStorage.setItem(LOCAL_KEY.MATCH_AUTO_JOIN, 'true');
        }else{
            sys.localStorage.setItem(LOCAL_KEY.MATCH_AUTO_JOIN, 'false');
        }
    }

    showLeftTime(endTime:number){
        const timeNow = Math.floor(Date.now() / 1000)
        const dt = endTime - timeNow
        if (dt < 0) {
            return
        }
        this.updateCancelBtn(dt)
    }

    updateCancelBtn(n:number){
        this.UI_BTN_CANCEL.title = `取消(${n}s)`
    }

    onSvrMatchOnSureFail(data:any){
        TipsView.showView({content:data.msg})
        MatchView.hideView()
    }

    stopAct(){
        (this.UI_COMP_ACT as CompMatchAct).stopSche();
        (this.UI_COMP_ACT as CompMatchAct).success();
    }
    
    onBtnJoin(): void {
        const callBack = (data:any)=>{ 
            if (data.code = 1) {
                this.ctrl_enter.selectedIndex = 1;
            }
        }
        LobbySocketManager.instance.sendToServer('matchOnSure', {
            id: this._checkID,
            sure: true
        },callBack)
    }
}
fgui.UIObjectFactory.setExtension(MatchView.URL, MatchView);