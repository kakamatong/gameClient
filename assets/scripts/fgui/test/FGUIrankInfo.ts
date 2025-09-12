/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUIrankInfo extends fgui.GComponent {

	public UI_TXT_RANK:fgui.GTextField;
	public UI_TXT_NAME:fgui.GTextField;
	public UI_TXT_SCORE:fgui.GTextField;
	public static URL:string = "ui://ljshfpzyeo9b4";

	public static packageName:string = "test";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUIrankInfo.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("test", "rankInfo") as FGUIrankInfo;

			view.makeFullScreen();
			FGUIrankInfo.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUIrankInfo.instance = null;
	}
	public static hideView():void {
		FGUIrankInfo.instance && FGUIrankInfo.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUIrankInfo {
		return <FGUIrankInfo>(fgui.UIPackage.createObject("test", "rankInfo"));
	}

	protected onConstruct():void {
		this.UI_TXT_RANK = <fgui.GTextField>(this.getChildAt(0));
		this.UI_TXT_NAME = <fgui.GTextField>(this.getChildAt(1));
		this.UI_TXT_SCORE = <fgui.GTextField>(this.getChildAt(2));
	}
}
fgui.UIObjectFactory.setExtension(FGUIrankInfo.URL, FGUIrankInfo);