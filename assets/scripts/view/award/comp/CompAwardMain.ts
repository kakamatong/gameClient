import FGUICompAwardMain from "../../../fgui/award/FGUICompAwardMain";
import { ViewClass } from "../../../frameworks/Framework";
import * as fgui from "fairygui-cc";

@ViewClass()
export class CompAwardMain extends FGUICompAwardMain { 
    show(args:any):void{
        this.initUI();
    }

    initUI():void{
        
    }
}
fgui.UIObjectFactory.setExtension(CompAwardMain.URL, CompAwardMain);