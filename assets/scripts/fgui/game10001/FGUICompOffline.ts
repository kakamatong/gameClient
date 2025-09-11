/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUICompOffline extends fgui.GComponent {

	public act:fgui.Transition;
	public static URL:string = "ui://2zsfe53xqaf2a";

	public static packageName:string = "game10001";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompOffline.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("game10001", "CompOffline") as FGUICompOffline;

			view.makeFullScreen();
			FGUICompOffline.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	public static hideView():void {
		FGUICompOffline.instance && FGUICompOffline.instance.dispose();
		FGUICompOffline.instance = null;
	}

	show(data?:any):void{};

	public static createInstance():FGUICompOffline {
		return <FGUICompOffline>(fgui.UIPackage.createObject("game10001", "CompOffline"));
	}

	protected onConstruct():void {
		this.act = this.getTransitionAt(0);
	}
}
fgui.UIObjectFactory.setExtension(FGUICompOffline.URL, FGUICompOffline);