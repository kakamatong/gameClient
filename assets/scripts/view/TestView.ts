import { _decorator} from 'cc';
import FGUITestView from '../fgui/test/FGUITestView';
import {AddEventListener,RemoveEventListener, LogColors} from '../frameworks/framework'
import {Auth} from '../modules/auth';
import {Match} from '../modules/match';
import { SocketManager } from '../frameworks/socketManager';
import * as fgui from 'fairygui-cc';

import { Login, ACCOUNT_INFO } from '../login/login';
import { DataCenter } from '../datacenter/datacenter';
const { ccclass, property } = _decorator;
@ccclass('TestView')
export class TestView extends FGUITestView {
    private _gameid = 0;
    private _roomid = 0;
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
        this.dispose();
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
        this.UI_TXT_USER_STATUS.text = `${data.status}`
    }

    updateUserStatus(data:any){
        this.UI_TXT_USER_STATUS.text = `${data.status}`
    }

    onReportMatch(data:any){
        if(data.code == 0){
            // 匹配成功
            this._gameid = data.gameid;
            this._roomid = data.roomid;
            console.log(LogColors.green('匹配成功'));
        }
    }

    onBtnEnterGame(): void {
        SocketManager.instance.sendToServer('connectGame', { code:1 }, this.respConnectGame.bind(this))
    }

    respConnectGame(data: any): void {
        if(data.code == 0){
            console.log(LogColors.green(data.msg));
        }else{
            console.log(LogColors.red(data.msg));
        }
    }

    onBtnReady():void {
        SocketManager.instance.sendToServer('gameReady', { gameid: this._gameid, roomid: this._roomid }, this.respReady.bind(this))
    }

    respReady(data: any): void {
        if(data.code == 0){
            console.log(LogColors.green(data.msg));
        }else{
            console.log(LogColors.red(data.msg));
        }
    }
}
