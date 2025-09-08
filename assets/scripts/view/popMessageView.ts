import { _decorator} from 'cc';
import FGUIPopMessageView from "../fgui/common/FGUIPopMessageView";
const { ccclass, property } = _decorator;
import * as fgui from "fairygui-cc";
@ccclass('PopMessageView')
export class PopMessageView extends FGUIPopMessageView { 

    show(data:any){
        this.UI_COMP_MAIN.UI_TXT_TITLE.text = data.title ?? "";
        this.UI_COMP_MAIN.UI_TXT_CONTENT.text = data.content ?? "";
    }

    onBtnClose(): void {
        PopMessageView.hideView()
    }
}
fgui.UIObjectFactory.setExtension(PopMessageView.URL, PopMessageView);