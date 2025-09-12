/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUICompHand extends fgui.GComponent {

	public ctrl_head:fgui.Controller;
	public static URL:string = "ui://2zsfe53xfolo3";

	public static packageName:string = "game10001";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompHand.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("game10001", "CompHand") as FGUICompHand;

			view.makeFullScreen();
			FGUICompHand.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompHand.instance = null;
	}
	public static hideView():void {
		FGUICompHand.instance && FGUICompHand.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompHand {
		return <FGUICompHand>(fgui.UIPackage.createObject("game10001", "CompHand"));
	}

	protected onConstruct():void {
		this.ctrl_head = this.getControllerAt(0);
	}
}
fgui.UIObjectFactory.setExtension(FGUICompHand.URL, FGUICompHand);