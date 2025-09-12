/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUICompBtnScale extends fgui.GButton {

	public ctrl_color:fgui.Controller;
	public UI_ICOM:fgui.GLoader;
	public static URL:string = "ui://gj0r6g5icmlt4";

	public static packageName:string = "common";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompBtnScale.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("common", "CompBtnScale") as FGUICompBtnScale;

			view.makeFullScreen();
			FGUICompBtnScale.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompBtnScale.instance = null;
	}
	public static hideView():void {
		FGUICompBtnScale.instance && FGUICompBtnScale.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompBtnScale {
		return <FGUICompBtnScale>(fgui.UIPackage.createObject("common", "CompBtnScale"));
	}

	protected onConstruct():void {
		this.ctrl_color = this.getControllerAt(0);
		this.UI_ICOM = <fgui.GLoader>(this.getChildAt(0));
	}
}
fgui.UIObjectFactory.setExtension(FGUICompBtnScale.URL, FGUICompBtnScale);