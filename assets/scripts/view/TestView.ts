import { _decorator} from 'cc';
import FGUITestView from '../fgui/test/FGUITestView';
import * as fgui from 'fairygui-cc';
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
    }

    onBtnClose(){
        console.log('onBtnClose');
        this.dispose();
    }

    onDestroy(){
        console.log('TestView onDestroy');
    }
    
}
