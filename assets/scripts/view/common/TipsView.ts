import { _decorator, AssetManager, assetManager} from 'cc';
import FGUITipsView from "../../fgui/common/FGUITipsView";
import FGUICompTips from "../../fgui/common/FGUICompTips";
import * as fgui from "fairygui-cc";
import { ViewClass } from '../../frameworks/Framework';

@ViewClass()
export class TipsView extends FGUITipsView { 
    private _tipList: FGUICompTips[] = [];

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

    protected onDestroy(): void {
        for (let tip of this._tipList) {
            fgui.GTween.kill(tip);
        }
        FGUITipsView.instance = null;
    }
}
fgui.UIObjectFactory.setExtension(TipsView.URL, TipsView);