import FGUIDisbandVoteView from "../../fgui/privateRoomDisband/FGUIDisbandVoteView";
import * as fgui from "fairygui-cc";

export class DisbandVoteView extends FGUIDisbandVoteView { 
    show(data?:any){
        
    }

    onBtnClose(): void {
        DisbandVoteView.hideView()
    }
}
fgui.UIObjectFactory.setExtension(DisbandVoteView.URL, DisbandVoteView);