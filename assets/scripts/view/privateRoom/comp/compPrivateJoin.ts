import FGUICompPrivateJoin from "../../../fgui/privateRoom/FGUICompPrivateJoin";
import * as fgui from "fairygui-cc";

export class CompPrivateJoin extends FGUICompPrivateJoin { 
    show(data?:any){
        
    }

    onBtnClose(): void {
        CompPrivateJoin.hideView()
    }
}
fgui.UIObjectFactory.setExtension(CompPrivateJoin.URL, CompPrivateJoin);