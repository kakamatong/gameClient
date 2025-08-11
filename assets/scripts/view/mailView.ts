import { _decorator} from 'cc';
import FGUIMailView from '../fgui/test/FGUIMailView';
import { UIManager } from '../frameworks/uimanager'

const { ccclass, property } = _decorator;
@ccclass('MailView')
export class MailView extends FGUIMailView {
    constructor(){
        super();
    }

    onEnable(){
        super.onEnable();
        this.initUI();
    }

    onDisable(){
        super.onDisable();
    }

    show(data:any){
        
    }

    initUI(){

    }

    onShow(){
        console.log('TestView onShow');
    }

    onBtnClose(){
        console.log('onBtnClose');
        //this.dispose();
        UIManager.instance.hideView('MailView');
    }
}
