import FGUIPopMessageView from "../../fgui/common/FGUIPopMessageView";
import {ENUM_POP_MESSAGE_TYPE} from '../../datacenter/InterfaceConfig';
import * as fgui from "fairygui-cc";

export class PopMessageView extends FGUIPopMessageView { 

    private _data:any | null = null;
    show(data:any){
        this._data = data;
        const data2 = {
            type: data.type ?? ENUM_POP_MESSAGE_TYPE.NUM0,
            title: data.title ?? "温馨提示",
            content: data.content ?? "",
            closeBack: this.onBtnClose.bind(this) ?? null,
            cancelBack: this.onBtnCancel.bind(this) ?? null,
            sureBack: this.onBtnSure.bind(this) ?? null
        }
        this.UI_COMP_MAIN.show(data2)
    }

    onBtnClose(): void {
        this._data.closeBack && this._data.closeBack()
        PopMessageView.hideView()
    }

    onBtnCancel(): void {
        this._data.cancelBack && this._data.cancelBack()
        PopMessageView.hideView()
    }

    onBtnSure(): void {
        this._data.sureBack && this._data.sureBack()
        PopMessageView.hideView()
    }

}
fgui.UIObjectFactory.setExtension(PopMessageView.URL, PopMessageView);