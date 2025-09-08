import { _decorator} from 'cc';
import FGUICompPopMessage from "../../../fgui/common/FGUICompPopMessage";

import * as fgui from "fairygui-cc";

export class CompMessage extends FGUICompPopMessage { 
    private _data:any | null = null;
    show(data?:any){
        this._data = data;
        this.UI_TXT_TITLE.text = data.title ?? "";
        this.UI_TXT_CONTENT.text = data.content ?? "";
    }

    onBtnClose(): void {
        this._data && (this._data.closeBack && this._data.closeBack())
    }

    onBtnCancel(): void {
        this._data && (this._data.closeBack && this._data.cancelBack())
    }

    onBtnSure(): void {
        this._data && (this._data.closeBack && this._data.sureBack())
    }
}
fgui.UIObjectFactory.setExtension(CompMessage.URL, CompMessage);