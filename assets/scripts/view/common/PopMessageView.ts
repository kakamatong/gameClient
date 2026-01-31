/**
 * @file PopMessageView.ts
 * @description 弹窗消息视图：通用的确认/取消弹窗组件
 * @category 通用视图
 */

import FGUIPopMessageView from "../../fgui/common/FGUIPopMessageView";
import {ENUM_POP_MESSAGE_TYPE} from '../../datacenter/InterfaceConfig';
import * as fgui from "fairygui-cc";
import { ViewClass } from "../../frameworks/Framework";

/**
 * @class PopMessageView
 * @description 弹窗消息视图，提供通用的确认/取消弹窗功能
 * @category 通用视图
 */
@ViewClass()
export class PopMessageView extends FGUIPopMessageView {

    /** 弹窗数据 */
    private _data:any | null = null;
    /**
     * @description 显示弹窗消息
     * @param data 弹窗配置数据
     */
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

    /**
     * @description 关闭按钮点击事件
     */
    onBtnClose(): void {
        this._data.closeBack && this._data.closeBack()
        PopMessageView.hideView()
    }

    /**
     * @description 取消按钮点击事件
     */
    onBtnCancel(): void {
        this._data.cancelBack && this._data.cancelBack()
        PopMessageView.hideView()
    }

    /**
     * @description 确定按钮点击事件
     */
    onBtnSure(): void {
        this._data.sureBack && this._data.sureBack()
        PopMessageView.hideView()
    }

}
fgui.UIObjectFactory.setExtension(PopMessageView.URL, PopMessageView);