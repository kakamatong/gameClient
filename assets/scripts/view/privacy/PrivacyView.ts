/**
 * @file PrivacyView.ts
 * @description 隐私协议视图：处理用户隐私协议授权
 * @category 隐私视图
 */

import FGUIPrivacyView from '../../fgui/privacy/FGUIPrivacyView';
import * as fgui from "fairygui-cc";
import { MiniGameUtils } from '../../frameworks/utils/sdk/MiniGameUtils';
import { ViewClass } from '../../frameworks/Framework';

/**
 * @class PrivacyView
 * @description 隐私协议视图，处理用户隐私协议授权
 * @category 隐私视图
 */
@ViewClass()
export class PrivacyView extends FGUIPrivacyView {
    /** 解析函数 */
    private _resolve:Function | null = null;

    /**
     * @description 显示隐私协议视图
     * @param data 视图数据
     */
    show(data?: any):void{
        this._resolve = data.resolvefunc
        this._resolve && this._resolve({event:'exposureAuthorization'})
    }

    /**
     * @description 同意协议按钮点击事件
     */
    onBtnAgree(): void {
        this._resolve && this._resolve({event:'agree'})
        PrivacyView.hideView()
    }

    /**
     * @description 拒绝协议按钮点击事件
     */
    onBtnRefuse(): void {
        this._resolve && this._resolve({event:'disagree'})
        PrivacyView.hideView()
    }

    /**
     * @description 查看隐私协议按钮点击事件
     */
    onBtnPrivacy(): void {
        // 跳转隐私协议
        MiniGameUtils.instance.openPrivacyContract()
    }
}
fgui.UIObjectFactory.setExtension(PrivacyView.URL, PrivacyView);