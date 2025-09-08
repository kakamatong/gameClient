import { _decorator} from 'cc';
import FGUIPopMessageView from "../fgui/common/FGUIPopMessageView";
const { ccclass, property } = _decorator;

@ccclass('PopMessageView')
export class PopMessageView extends FGUIPopMessageView { 
    onShow(data:any){
        this.UI_COMP_MAIN.UI_TXT_TITLE = data.title ?? "";
        this.UI_COMP_MAIN.UI_TXT_CONTENT = data.content ?? "";
    }
}
