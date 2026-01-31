/**
 * @file TipsView.ts
 * @description 提示视图：显示浮动的提示消息
 * @category 通用视图
 */

import { _decorator, AssetManager, assetManager} from 'cc';
import FGUITipsView from "../../fgui/common/FGUITipsView";
import FGUICompTips from "../../fgui/common/FGUICompTips";
import * as fgui from "fairygui-cc";
import { ViewClass } from '../../frameworks/Framework';

/**
 * @class TipsView
 * @description 提示消息视图，显示浮动提示
 * @category 通用视图
 */
@ViewClass()
export class TipsView extends FGUITipsView {
    /** 提示列表 */
    private _tipList: FGUICompTips[] = [];

    /**
     * @description 显示提示视图
     * @param params 提示配置数据
     */
    public static showView(params?:any):void {
        if(FGUITipsView.instance) {
            FGUITipsView.instance.createTip(params)
            return;
        }
        const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
        fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

            if(error){console.log("loadPackage error", error);return;}
            const view = fgui.UIPackage.createObject("common", "TipsView") as TipsView;

            view.makeFullScreen();
            FGUITipsView.instance = view;
            view.sortingOrder = 9999
            fgui.GRoot.inst.addChild(view);
            view.createTip && view.createTip(params);
        }
        );
    }
    
    /**
     * @description 创建提示消息
     * @param data 提示数据
     */
    createTip(data:any){
        const tip = fgui.UIPackage.createObject("common", "CompTips") as FGUICompTips;
        this._tipList.push(tip);
        tip.title.text = data.content;
        fgui.GTween.to(1,0,1).setDelay(2).setTarget(tip, 'alpha').onComplete(()=>{
            tip && tip.dispose();
            this._tipList = this._tipList.filter(t=>t!==tip);
        })
        this.UI_LV_TIPS.addChild(tip);
    }

    /**
     * @description 销毁视图时的清理工作
     */
    protected onDestroy(): void {
        for (let tip of this._tipList) {
            fgui.GTween.kill(tip);
        }
        this._tipList = [];
        FGUITipsView.instance = null;
    }
}
fgui.UIObjectFactory.setExtension(TipsView.URL, TipsView);