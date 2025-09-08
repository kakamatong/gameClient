/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUImailTitle extends fgui.GComponent {

	public ctrl_read:fgui.Controller;
	public title:fgui.GTextField;
	public static URL:string = "ui://ljshfpzyeatn6";

	public static packageName:string = "test";

	public static instance:any | null = null;

	public static showView(params?:any):void {
		if(FGUImailTitle.instance) {
			console.log("allready show");
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);return;}
			const view = fgui.UIPackage.createObject("test", "mailTitle") as FGUImailTitle;

			view.makeFullScreen();
			FGUImailTitle.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
		}
		);
	}

	public static hideView():void {
		FGUImailTitle.instance && FGUImailTitle.instance.dispose();
		FGUImailTitle.instance = null;
	}
	show(data?:any):void{};
	public static createInstance():FGUImailTitle {
		return <FGUImailTitle>(fgui.UIPackage.createObject("test", "mailTitle"));
	}

	protected onConstruct():void {
		this.ctrl_read = this.getControllerAt(0);
		this.title = <fgui.GTextField>(this.getChildAt(0));
	}
}
fgui.UIObjectFactory.setExtension(FGUImailTitle.URL, FGUImailTitle);