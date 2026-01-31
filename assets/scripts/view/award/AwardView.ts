/**
 * @file AwardView.ts
 * @description 奖励视图：显示获得的奖励
 * @category 奖励视图
 */

import FGUIAwardView from "../../fgui/award/FGUIAwardView";
import { PackageLoad, ViewClass } from "../../frameworks/Framework";
import * as fgui from "fairygui-cc";
import { AwardConfig } from "./data/AwardConfig";

/**
 * @class AwardView
 * @description 奖励视图，显示用户获得的奖励
 * @category 奖励视图
 */
@ViewClass()
@PackageLoad(['props'])
export class AwardView extends FGUIAwardView {

    /**
     * @description 显示奖励视图
     * @param args 奖励配置数据
     */
    show(args:AwardConfig):void{
        this.UI_COMP_MAIN.show(args);
        this.initUI();
    }

    /**
     * @description 初始化UI
     */
    initUI():void{
        this.UI_BG.onClick(this.onBGClick, this);
    }

    /**
     * @description 背景点击事件，关闭奖励视图
     */
    onBGClick():void{
        AwardView.hideView();
    }
}

fgui.UIObjectFactory.setExtension(AwardView.URL, AwardView);