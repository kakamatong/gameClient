import FGUIPrivateRoomView from "../../fgui/privateRoom/FGUIPrivateRoomView";
import * as fgui from "fairygui-cc";

export class PrivateRoomView extends FGUIPrivateRoomView { 
    show(data?:any){
        
    }

    onBtnClose(): void {
        PrivateRoomView.hideView()
    }
}
fgui.UIObjectFactory.setExtension(PrivateRoomView.URL, PrivateRoomView);