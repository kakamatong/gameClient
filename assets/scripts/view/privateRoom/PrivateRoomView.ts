import FGUIPrivateRoomView from "../../fgui/privateRoom/FGUIPrivateRoomView";
import * as fgui from "fairygui-cc";
import { ViewClass } from "../../frameworks/Framework";

@ViewClass()
export class PrivateRoomView extends FGUIPrivateRoomView { 
    show(data?:any){
        this.UI_COMP_CREATE.show(data)
        this.UI_COMP_JOIN.show(data)
    }

    onBtnClose(): void {
        PrivateRoomView.hideView()
    }
}
fgui.UIObjectFactory.setExtension(PrivateRoomView.URL, PrivateRoomView);