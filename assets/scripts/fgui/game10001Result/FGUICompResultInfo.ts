/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUICompResultInfo extends fgui.GComponent {

	public title:fgui.GTextField;
	public score:fgui.GTextField;
	public static URL:string = "ui://5x18e99vfnug1";

	public static packageName:string = "game10001Result";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompResultInfo.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("game10001Result", "CompResultInfo") as FGUICompResultInfo;

			view.makeFullScreen();
			FGUICompResultInfo.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
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
		this.title = <fgui.GTextField>(this.getChildAt(0));
		this.score = <fgui.GTextField>(this.getChildAt(1));
	}
}
fgui.UIObjectFactory.setExtension(FGUICompResultInfo.URL, FGUICompResultInfo);