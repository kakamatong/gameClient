
import FGUICompPlayerHead from '../../../../../fgui/game10001/FGUICompPlayerHead';
import * as fgui from "fairygui-cc";
import { HorizontalTextAlignment } from 'cc';
export class CompPlayerHead extends FGUICompPlayerHead {
    protected onConstruct(){
        super.onConstruct();
        this.initUI()
    }

    initUI(){
        if (this.ctrl_pos.selectedIndex == 0) {
            this.UI_TXT_ID.pivotX = 0
            this.UI_TXT_ID.pivotY = 0
            this.UI_TXT_ID.align = HorizontalTextAlignment.LEFT
            this.UI_TXT_NICKNAME.pivotX = 0
            this.UI_TXT_NICKNAME.pivotY = 0
            this.UI_TXT_NICKNAME.align = HorizontalTextAlignment.LEFT
        }else{
            this.UI_TXT_ID.pivotX = 1
            this.UI_TXT_ID.pivotY = 0
            this.UI_TXT_ID.align = HorizontalTextAlignment.RIGHT
            this.UI_TXT_NICKNAME.pivotX = 1
            this.UI_TXT_NICKNAME.pivotY = 0
            this.UI_TXT_NICKNAME.align = HorizontalTextAlignment.RIGHT
        }
    }
}
fgui.UIObjectFactory.setExtension(CompPlayerHead.URL, CompPlayerHead);