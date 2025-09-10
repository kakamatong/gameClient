/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUIdismissInfo extends fgui.GComponent {

	public UI_TXT_NICKNAME:fgui.GTextField;
	public UI_TXT_RESULT:fgui.GTextField;
	public static URL:string = "ui://ljshfpzynhct8";

	public static packageName:string = "test";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUIdismissInfo.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("test", "dismissInfo") as FGUIdismissInfo;

			view.makeFullScreen();
			FGUIdismissInfo.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	public static hideView():void {
		FGUIdismissInfo.instance && FGUIdismissInfo.instance.dispose();
		FGUIdismissInfo.instance = null;
	}

	show(data?:any):void{};

	public static createInstance():FGUIdismissInfo {
		return <FGUIdismissInfo>(fgui.UIPackage.createObject("test", "dismissInfo"));
	}

	protected onConstruct():void {
		this.UI_TXT_NICKNAME = <fgui.GTextField>(this.getChildAt(0));
		this.UI_TXT_RESULT = <fgui.GTextField>(this.getChildAt(1));
	}
}
fgui.UIObjectFactory.setExtension(FGUIdismissInfo.URL, FGUIdismissInfo);