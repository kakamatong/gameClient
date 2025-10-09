/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUICompBtnSound extends fgui.GButton {

	public ctrl_status:fgui.Controller;
	public static URL:string = "ui://1zcuqn2bpr8n1";

	public static packageName:string = "userCenter";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompBtnSound.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("userCenter", "CompBtnSound") as FGUICompBtnSound;

			view.makeFullScreen();
			FGUICompBtnSound.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompBtnSound.instance = null;
	}
	public static hideView():void {
		FGUICompBtnSound.instance && FGUICompBtnSound.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompBtnSound {
		return <FGUICompBtnSound>(fgui.UIPackage.createObject("userCenter", "CompBtnSound"));
	}

	protected onConstruct():void {
		this.ctrl_status = this.getControllerAt(1);
	}
}
fgui.UIObjectFactory.setExtension(FGUICompBtnSound.URL, FGUICompBtnSound);