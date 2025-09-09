import FGUICompPopMessage from "../../../fgui/common/FGUICompPopMessage";
import {ENUM_POP_MESSAGE_TYPE} from '../../../datacenter/interfaceConfig';
import * as fgui from "fairygui-cc";

export class CompMessage extends FGUICompPopMessage { 
    private _data:any | null = null;
    show(data?:any){
        this._data = data;
        this.ctrl_btn_type.selectedIndex = data.type ?? ENUM_POP_MESSAGE_TYPE.NUM2; // 默认为2个按钮
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