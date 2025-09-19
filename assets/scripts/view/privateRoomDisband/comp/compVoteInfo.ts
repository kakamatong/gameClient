import FGUICompVoteInfo from "../../../fgui/privateRoomDisband/FGUICompVoteInfo";
import * as fgui from "fairygui-cc";

export class CompVoteInfo extends FGUICompVoteInfo { 
    show(data?:any){
        
    }

    onBtnClose(): void {
        CompVoteInfo.hideView()
    }
}
fgui.UIObjectFactory.setExtension(CompVoteInfo.URL, CompVoteInfo);