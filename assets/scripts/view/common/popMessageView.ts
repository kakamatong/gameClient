import { _decorator} from 'cc';
import FGUIPopMessageView from "../../fgui/common/FGUIPopMessageView";

import * as fgui from "fairygui-cc";

export class PopMessageView extends FGUIPopMessageView { 

    private _data:any | null = null;
    show(data:any){
        this._data = data;
        const data2 = {
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
    }

    onBtnSure(): void {
        this._data.sureBack && this._data.sureBack()
    }

}
fgui.UIObjectFactory.setExtension(PopMessageView.URL, PopMessageView);