/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUICompMailTitle extends fgui.GComponent {

	public ctrl_read:fgui.Controller;
	public UI_TXT_TITLE:fgui.GTextField;
	public UI_TXT_TIME:fgui.GTextField;
	public static URL:string = "ui://8lqwicsugd4t1";

	public static packageName:string = "mail";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompMailTitle.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("mail", "CompMailTitle") as FGUICompMailTitle;

			view.makeFullScreen();
			FGUICompMailTitle.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompMailTitle.instance = null;
	}
	public static hideView():void {
		FGUICompMailTitle.instance && FGUICompMailTitle.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompMailTitle {
		return <FGUICompMailTitle>(fgui.UIPackage.createObject("mail", "CompMailTitle"));
	}

	protected onConstruct():void {
		this.ctrl_read = this.getControllerAt(0);
		this.UI_TXT_TITLE = <fgui.GTextField>(this.getChildAt(1));
		this.UI_TXT_TIME = <fgui.GTextField>(this.getChildAt(3));
	}
}
fgui.UIObjectFactory.setExtension(FGUICompMailTitle.URL, FGUICompMailTitle);