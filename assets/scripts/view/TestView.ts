import { _decorator} from 'cc';
import FGUITestView from '../fgui/test/FGUITestView';
import {AddEventListener,RemoveEventListener, LogColors} from '../frameworks/framework'
import {Auth} from '../modules/auth';
import {Match} from '../modules/match';
import { SocketManager } from '../frameworks/socketManager';
import { UIManager } from '../frameworks/uimanager';

import { Login, ACCOUNT_INFO } from '../login/login';
import { DataCenter } from '../datacenter/datacenter';
import { ENUM_USER_STATUS } from '../datacenter/interfaceConfig';
const { ccclass, property } = _decorator;
@ccclass('TestView')
export class TestView extends FGUITestView {
    constructor(){
        super();
        console.log('TestView constructor');
        //this.UI_BTN_LOGIN.on(fgui.Event.CLICK, this.onBtnLogin, this);
    }

    onEnable(){
        console.log('TestView onEnable');
        //this.UI_BTN_LOGIN.on(fgui.Event.CLICK, this.onBtnLogin, this);
        //this.UI_BTN_LOGIN.onClick(this.onBtnLogin, this);
        AddEventListener('userData',this.showUserInfo, this);
        AddEventListener('userStatus',this.showUserStatus, this);
        SocketManager.instance.addServerReport("reportUserStatus", this.updateUserStatus.bind(this));
        SocketManager.instance.addServerReport("reportMatch", this.onReportMatch.bind(this));
    }

    onDisable(){
        console.log('TestView onDisable');
        RemoveEventListener('userData', this.showUserInfo);
        RemoveEventListener('userStatus', this.showUserStatus);
        SocketManager.instance.removeServerReport("reportUserStatus");
        SocketManager.instance.removeServerReport("reportMatch");
    }

    onShow(){
        console.log('TestView onShow');
    }

    onBtnLogin(){
        console.log('onBtnLogin');
        const func = (b:boolean)=>{
            console.log('login callback:', b);
        }
        const acc = this.UI_INPUT_ACC.text ?? "";
        const pwd = this.UI_INPUT_PASS.text ?? "";
        const accInfo: ACCOUNT_INFO = {
            username: acc,
            password: pwd,
        };
        const login = new Login();
        login.start(accInfo,func);
    }

    onBtnClose(){
        console.log('onBtnClose');
        //this.dispose();
        UIManager.instance.hideView('TestView');
    }

    onDestroy(){
        console.log('TestView onDestroy');
    }
    
    onBtnCon(): void {
        const auth = new Auth();
        auth.req();
    }

    onBtnMatch(): void {
        const match = new Match();
        match.req();
    }

    showUserInfo(data:any){
        this.UI_TXT_NICKNAME.text = data.nickname;
        this.UI_TXT_USERID.text =`${DataCenter.instance.userid}`
        
    }

    showUserStatus(data:any){
        this.UI_TXT_USER_STATUS.text = this.getStatusText(data.status)
        if (data.status == ENUM_USER_STATUS.GAMEING){
            DataCenter.instance.gameid = data.gameid;
            DataCenter.instance.roomid = data.roomid;
            console.log(LogColors.green('返回房间'));

            UIManager.instance.showView('GameView');
        }else{

        }
    }

    updateUserStatus(data:any){
        this.UI_TXT_USER_STATUS.text = this.getStatusText(data.status)
    }

    onReportMatch(data:any){
        if(data.code == 0){
            DataCenter.instance.gameid = data.gameid;
            DataCenter.instance.roomid = data.roomid;
            console.log(LogColors.green('匹配成功'));

            UIManager.instance.showView('GameView');
        }
    }

    onBtnShow(): void {
        UIManager.instance.showView('GameView');
    }

    getStatusText(status:number):string{
        switch(status){
            case ENUM_USER_STATUS.GAMEING:
                return '游戏中';
            case ENUM_USER_STATUS.MATCHING:
                return '匹配中';
            case ENUM_USER_STATUS.READY:
                return '准备中';
            case ENUM_USER_STATUS.OFFLINE:
                return '离线';
            case ENUM_USER_STATUS.ONLINE:
                return '在线';
            case ENUM_USER_STATUS.TEAMING:
                return '匹配中';
            case ENUM_USER_STATUS.WATCH:
                return '观战中';
            case ENUM_USER_STATUS.DISCONNECT:
                return '断线';
            default:
                return '未知';
        }
        return '';
    }
}
