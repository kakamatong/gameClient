import FGUICompMailContent from "../../../fgui/mail/FGUICompMailContent";
import * as fgui from "fairygui-cc";

export class CompMailContent extends FGUICompMailContent { 
    onBtnClose(): void {
        this.visible =false
    }
}
fgui.UIObjectFactory.setExtension(CompMailContent.URL, CompMailContent);