/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUITipsView extends fgui.GComponent {

	public UI_LV_TIPS:fgui.GList;
	public static URL:string = "ui://gj0r6g5iddz1j";

	public static packageName:string = "common";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUITipsView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("common", "TipsView") as FGUITipsView;

			view.makeFullScreen();
			FGUITipsView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUITipsView.instance = null;
	}
	public static hideView():void {
		FGUITipsView.instance && FGUITipsView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUITipsView {
		return <FGUITipsView>(fgui.UIPackage.createObject("common", "TipsView"));
	}

	protected onConstruct():void {
		this.UI_LV_TIPS = <fgui.GList>(this.getChildAt(0));
	}
}
fgui.UIObjectFactory.setExtension(FGUITipsView.URL, FGUITipsView);