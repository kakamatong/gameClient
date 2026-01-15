/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompResultInfo extends fgui.GComponent {

	public UI_TXT_NICKNAME:fgui.GTextField;
	public UI_TXT_SCORE:fgui.GTextField;
	public UI_TXT_ID:fgui.GTextField;
	public static URL:string = "ui://5x18e99vfnug1";

	public static packageName:string = "game10001Result";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompResultInfo.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("game10001Result", "CompResultInfo") as FGUICompResultInfo;

			view.makeFullScreen();
			FGUICompResultInfo.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompResultInfo.instance = null;
	}
	public static hideView():void {
		FGUICompResultInfo.instance && FGUICompResultInfo.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompResultInfo {
		return <FGUICompResultInfo>(fgui.UIPackage.createObject("game10001Result", "CompResultInfo"));
	}

	protected onConstruct():void {
		this.UI_TXT_NICKNAME = <fgui.GTextField>(this.getChildAt(0));
		this.UI_TXT_SCORE = <fgui.GTextField>(this.getChildAt(1));
		this.UI_TXT_ID = <fgui.GTextField>(this.getChildAt(2));
	}
}
fgui.UIObjectFactory.setExtension(FGUICompResultInfo.URL, FGUICompResultInfo);