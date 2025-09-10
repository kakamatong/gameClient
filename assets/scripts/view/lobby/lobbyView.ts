
import FGUILobbyView from '../../fgui/lobby/FGUILobbyView';
import * as fgui from "fairygui-cc";
import { AddEventListener, RemoveEventListener } from '../../frameworks/framework';
import { DataCenter } from '../../datacenter/datacenter';
import {ConnectSvr} from '../../modules/connectSvr';
import { PopMessageView } from '../common/popMessageView';
import {ENUM_POP_MESSAGE_TYPE} from '../../datacenter/interfaceConfig';
import { TipsView } from '../common/tipsView';
import { LobbySocketManager } from '../../frameworks/lobbySocketManager';
import { Rank } from '../../modules/rank';
import { RankView } from '../rank/rankView';
import { LoadingView } from '../common/loadingView';
export class LobbyView extends FGUILobbyView {

    private _node1: fgui.GObject | null = null;
    private _node2: fgui.GObject | null = null;
    private _node3: fgui.GObject | null = null;
    private _node4: fgui.GObject | null = null;

    onConstruct(){
        super.onConstruct();
        this.initListeners();
        this.initUI();
        this.startLogin();
    }

    initListeners(){
        AddEventListener('userData',this.onUserInfo, this);
        AddEventListener('userStatus',this.onUserStatus, this);
        AddEventListener('userRichs',this.onUserRiches, this);
    }

    onDestroy(){
        super.onDestroy();
        RemoveEventListener('userData', this.onUserInfo);
        RemoveEventListener('userStatus', this.onUserStatus);
        RemoveEventListener('userRichs', this.onUserRiches);
    }

    initUI(){ 
        this._node1 = this.UI_COMP_BG_ACT.UI_COMP_BG_ACT_1
        this._node2 = this.UI_COMP_BG_ACT.UI_COMP_BG_ACT_2
        this._node3 = this.UI_COMP_BG_ACT.UI_COMP_BG_ACT_3
        this._node4 = this.UI_COMP_BG_ACT.UI_COMP_BG_ACT_4
    }

    startLogin(){
        const func = (b:boolean) => { 
            if (!b) {
                const func1 = ()=>{
                    this.startLogin()
                }
                PopMessageView.showView({title:'温馨提示', content:'登入失败,是否重新登入？', type:ENUM_POP_MESSAGE_TYPE.NUM1SURE, sureBack: func1})
            }
        }
        ConnectSvr.instance.checkAutoLogin(func)
    }

    updateUserInfo():void{
        this.UI_COMP_TOP.UI_TXT_NICKNAME.text = DataCenter.instance.userData?.nickname ?? ''
        this.UI_COMP_TOP.UI_TXT_USERID.text = `${DataCenter.instance.userid ?? 0}`
    }

    onUserInfo(data:any):void{
        console.log("userData",data)
        this.updateUserInfo()
    }

    onUserStatus(data:any):void{
        console.log("userStatus",data)
    }

    onUserRiches(data:any):void{
        console.log("userRiches",data)
    }

    onDisable(){
        super.onDisable();
    }

    onBtnMatchRoom(): void {
    }

    onBtnPrivateRoom(): void {
        
    }

    onBtnMails(): void {
        //LoadingView.showView({content:"测试"});
    }

    onBtnRank(): void {
        const func = (b:boolean, data:any) => { 
            if (b) {
                RankView.showView(data)
            }else{
                TipsView.showView({content:`拉取排行榜数据失败`})
            }
        }
        const rank = new Rank()
        rank.req(func)
    }

    onUpdate():void{
        if (!this._node1 || !this._node2 || !this._node3 || !this._node4) {
            return
        }
        const d = 0.5
        this._node1.x = this._node1.x - d
        this._node1.y = this._node1.y - d

        this._node2.x = this._node2.x - d
        this._node2.y = this._node2.y - d

        this._node3.x = this._node3.x - d
        this._node3.y = this._node3.y - d

        this._node4.x = this._node4.x - d
        this._node4.y = this._node4.y - d

        if (this._node1.x < -1530) {
            this._node1.x = 210
            this._node1.y = 902
        }

        if (this._node2.x < -1530) {
            this._node2.x = 210
            this._node2.y = 902
        }

        if (this._node3.x < -1530) {
            this._node3.x = 210
            this._node3.y = 902
        }

        if (this._node4.x < -1530) {
            this._node4.x = 210
            this._node4.y = 902
        }
    }

}
// 继承出来的对象，必须重写
fgui.UIObjectFactory.setExtension(LobbyView.URL, LobbyView);