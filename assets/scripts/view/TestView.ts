import { _decorator} from 'cc';
import FGUITestView from '../fgui/test/FGUITestView';
import { SocketManager } from '../frameworks/socketManager';
import {Auth} from '../modules/auth';
import * as fgui from 'fairygui-cc';

import { Login, ACCOUNT_INFO } from '../login/login';
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
    }

    onDisable(){
        console.log('TestView onDisable');
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
}
