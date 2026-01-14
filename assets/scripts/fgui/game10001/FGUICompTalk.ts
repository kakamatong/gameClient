/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUICompTalk extends fgui.GComponent {

	public ctrl_pos:fgui.Controller;
	public UI_BG_0:fgui.GImage;
	public UI_BG_1:fgui.GImage;
	public UI_BG_2:fgui.GImage;
	public UI_TXT_0:fgui.GTextField;
	public UI_TXT_1:fgui.GTextField;
	public UI_TXT_2:fgui.GTextField;
	public static URL:string = "ui://2zsfe53xpxa5n";

	public static packageName:string = "game10001";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompTalk.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("game10001", "CompTalk") as FGUICompTalk;

			view.makeFullScreen();
			FGUICompTalk.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompTalk.instance = null;
	}
	public static hideView():void {
		FGUICompTalk.instance && FGUICompTalk.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompTalk {
		return <FGUICompTalk>(fgui.UIPackage.createObject("game10001", "CompTalk"));
	}

	protected onConstruct():void {
		this.ctrl_pos = this.getControllerAt(0);
		this.UI_BG_0 = <fgui.GImage>(this.getChildAt(0));
		this.UI_BG_1 = <fgui.GImage>(this.getChildAt(1));
		this.UI_BG_2 = <fgui.GImage>(this.getChildAt(2));
		this.UI_TXT_0 = <fgui.GTextField>(this.getChildAt(3));
		this.UI_TXT_1 = <fgui.GTextField>(this.getChildAt(4));
		this.UI_TXT_2 = <fgui.GTextField>(this.getChildAt(5));
	}
}
fgui.UIObjectFactory.setExtension(FGUICompTalk.URL, FGUICompTalk);