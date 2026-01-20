import FGUIAwardView from "../../fgui/award/FGUIAwardView";
import { PackageLoad, ViewClass } from "../../frameworks/Framework";
import * as fgui from "fairygui-cc";
import { AwardConfig } from "./data/AwardConfig";

@ViewClass()
@PackageLoad(['props'])
export class AwardView extends FGUIAwardView { 

    show(args:AwardConfig):void{
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