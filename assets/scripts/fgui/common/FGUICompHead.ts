/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUICompHead extends fgui.GComponent {

	public UI_LOADER_HEAD:fgui.GLoader;
	public static URL:string = "ui://gj0r6g5icvev9";

	public static packageName:string = "common";

	public static instance:any | null = null;

	public static showView(params?:any):void {
		if(FGUICompHead.instance) {
			console.log("allready show");
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);return;}
			const view = fgui.UIPackage.createObject("common", "CompHead") as FGUICompHead;

			view.makeFullScreen();
			FGUICompHead.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
		}
		);
	}

	public static hideView():void {
		FGUICompHead.instance && FGUICompHead.instance.dispose();
		FGUICompHead.instance = null;
	}
	show(data?:any):void{};
	public static createInstance():FGUICompHead {
		return <FGUICompHead>(fgui.UIPackage.createObject("common", "CompHead"));
	}

	protected onConstruct():void {
		this.UI_LOADER_HEAD = <fgui.GLoader>(this.getChildAt(1));
	}
}
fgui.UIObjectFactory.setExtension(FGUICompHead.URL, FGUICompHead);