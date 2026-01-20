import FGUIAwardView from "../../fgui/award/FGUIAwardView";
import { PackageLoad, ViewClass } from "../../frameworks/Framework";
import * as fgui from "fairygui-cc";

@ViewClass()
@PackageLoad(['props'])
export class AwardView extends FGUIAwardView { 

    show(args:any):void{
        this.UI_COMP_MAIN.show(args);
        this.initUI();
    }

    initUI():void{
        this.UI_BG.onClick(this.onBGClick, this);
    }

    onBGClick():void{
        AwardView.hideView();
    }
}

fgui.UIObjectFactory.setExtension(AwardView.URL, AwardView);