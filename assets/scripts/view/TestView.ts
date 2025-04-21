import { _decorator} from 'cc';
import FGUITestView from '../fgui/test/FGUITestView';
import { SocketManager } from '../frameworks/socketManager';
import {Auth} from '../modules/auth';
import * as fgui from 'fairygui-cc';

import { Login } from '../login/login';
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
        const login = new Login();
        login.start(func);
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
