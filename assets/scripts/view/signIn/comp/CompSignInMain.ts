import * as fgui from "fairygui-cc";
import { ViewClass } from '../../../frameworks/Framework';
import FGUICompSignInMain from "../../../fgui/signIn/FGUICompSignInMain";

/**
 * 签到视图
 */
@ViewClass()
export class CompSignInMain extends FGUICompSignInMain { 
    show(args:any) {
        this.UI_LIST_SIGN.itemRenderer = this.itemRenderer.bind(this);
    }

    itemRenderer(index: number, obj: fgui.GObject):void{
        
    }

    /**
     * 补签按钮点击
     */
    onBtnAdd():void{
        console.log("补签");
    }

    /**
     * 签到按钮点击
     */
    onBtnGet():void{
        console.log("签到");
    }

    /**
     * 多倍签到按钮点击
     */
    onBtnMult():void{
        console.log("多倍签到");
    }

    /**
     * 关闭按钮点击
     */
    onBtnClose(): void {
        CompSignInMain.hideView()
    }
}
fgui.UIObjectFactory.setExtension(CompSignInMain.URL, CompSignInMain);