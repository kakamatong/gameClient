import { _decorator} from 'cc';
import FGUILobbyView from '../../fgui/lobby/FGUILobbyView';
import * as fgui from "fairygui-cc";
import { AddEventListener, RemoveEventListener } from '../../frameworks/framework';
import { DataCenter } from '../../datacenter/datacenter';
import { AuthList } from '../../modules/authList';
import { ACCOUNT_INFO, Login } from '../../frameworks/login/login';
import { LobbySocketManager } from '../../frameworks/lobbySocketManager';
import { Auth } from '../../modules/auth';
const { ccclass, property } = _decorator;

@ccclass('LobbyView')
export class LobbyView extends FGUILobbyView {

    private _node1: fgui.GObject | null = null;
    private _node2: fgui.GObject | null = null;
    private _node3: fgui.GObject | null = null;
    private _node4: fgui.GObject | null = null;


    onConstruct(){
        super.onConstruct();
        this.initListeners();
        this.initUI();
        this.checkAutoLogin()
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

    checkAutoLogin(){
        this.startLogin()
    }

    startLogin():void{
        this.checkAuthList((success)=>{
            if(success){
                this.login();
            }
        })
    }

    checkAuthList(callBack?:(success:boolean)=>void){
        AuthList.instance.req((success:boolean, data?:any)=>{
            if(success){
                console.log('authList:', data);
            }
            callBack?.(success);
        })
    }

    login(){
        const func = (b:boolean, data?:any)=>{
            console.log('login callback:', b);
            if(b){
                DataCenter.instance.setLoginInfo(data);
                this.onBtnCon()
            }
        }

        const urlParams = new URLSearchParams(window.location.search);
        const acc = urlParams.get('userid') ?? "wlj001"
        const pwd = urlParams.get('pwd') ?? "wlj123456"

        const loginInfo = DataCenter.instance.getLoginInfo();
        const accInfo: ACCOUNT_INFO = {
            username: acc,
            password: pwd,
            server: loginInfo?.server ?? (this.getAuthAddr() ?? "")
        };
        const login = new Login();
        login.start(accInfo, DataCenter.instance.loginList, func);
    }

    onBtnCon(): void {
        if(LobbySocketManager.instance.isOpen()){
            LobbySocketManager.instance.close()
            setTimeout(()=>{
                Auth.instance.req();
            }, 500)
        }else{
            Auth.instance.req();
        }
    }

    getAuthAddr(): string | undefined{
        const authList = DataCenter.instance.authList;
        const keys = Object.keys(authList);
        if (keys.length === 0) return undefined;
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return randomKey;
    }

    updateUserInfo():void{
        this.UI_COMP_TOP.UI_TXT_NICKNAME.text = DataCenter.instance.userData?.nickname ?? ''
        this.UI_COMP_TOP.UI_TXT_USERID.text = `${DataCenter.instance.userData?.userid ?? 0}`
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

    onBtnTest(): void {
        fgui.GRoot.inst.showTooltips("123456")
    }

    runBgAct(): void {
        //this.UI_COMP_BG_ACT.runBgAct()
    }

    onUpdate():void{
        //console.log("1")
        if (!this._node1 || !this._node2 || !this._node3 || !this._node4) {
            return
        }
        this._node1.x = this._node1.x - 1
        this._node1.y = this._node1.y - 1

        this._node2.x = this._node2.x - 1
        this._node2.y = this._node2.y - 1

        this._node3.x = this._node3.x - 1
        this._node3.y = this._node3.y - 1

        this._node4.x = this._node4.x - 1
        this._node4.y = this._node4.y - 1

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