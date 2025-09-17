import FGUICompPrivateCreate from "../../../fgui/privateRoom/FGUICompPrivateCreate";
import * as fgui from "fairygui-cc";

export class CompPrivateCreate extends FGUICompPrivateCreate { 
    show(data?:any){
        
    }

    onBtnClose(): void {
        CompPrivateCreate.hideView()
    }
}
fgui.UIObjectFactory.setExtension(CompPrivateCreate.URL, CompPrivateCreate);