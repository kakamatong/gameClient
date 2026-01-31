/**
 * @file PrivateRoomView.ts
 * @description 私密房间视图：私密房间的创建和加入
 * @category 私密房间视图
 */

import FGUIPrivateRoomView from "../../fgui/privateRoom/FGUIPrivateRoomView";
import * as fgui from "fairygui-cc";
import { ViewClass } from "../../frameworks/Framework";

/**
 * @class PrivateRoomView
 * @description 私密房间视图，私密房间的创建和加入
 * @category 私密房间视图
 */
@ViewClass()
export class PrivateRoomView extends FGUIPrivateRoomView {
    /**
     * @description 显示私密房间视图
     * @param data 视图数据
     */
    show(data?:any){
        this.UI_COMP_CREATE.show(data)
        this.UI_COMP_JOIN.show(data)
    }

    /**
     * @description 关闭按钮点击事件
     */
    onBtnClose(): void {
        PrivateRoomView.hideView()
    }
}
fgui.UIObjectFactory.setExtension(PrivateRoomView.URL, PrivateRoomView);