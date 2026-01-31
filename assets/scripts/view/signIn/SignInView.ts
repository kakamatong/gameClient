/**
 * @file SignInView.ts
 * @description 签到视图：签到功能的主视图
 * @category 签到视图
 */

import * as fgui from "fairygui-cc";
import { PackageLoad, ViewClass } from '../../frameworks/Framework';
import FGUISignInView from "../../fgui/signIn/FGUISignInView";

/**
 * @class SignInView
 * @description 签到视图，显示签到界面
 * @category 签到视图
 */
@PackageLoad(['props'])
@ViewClass()
export class SignInView extends FGUISignInView {
    /**
     * @description 显示签到视图
     * @param args 视图参数
     */
    show(args:any) {
        this.UI_MAIN_NODE.show(args)
    }
}
fgui.UIObjectFactory.setExtension(SignInView.URL, SignInView);