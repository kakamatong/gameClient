/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUICompTop extends fgui.GComponent {

	public UI_COMP_HEAD:fgui.GComponent;
	public UI_TXT_NICKNAME:fgui.GTextField;
	public UI_TXT_USERID:fgui.GTextField;
	public static URL:string = "ui://gv22rev3cveva";

	public static packageName:string = "lobby";

	public static instance:any | null = null;

	public static showView(params?:any):void {
		if(FGUICompTop.instance) {
			console.log("allready show");
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);return;}
			const view = fgui.UIPackage.createObject("lobby", "CompTop") as FGUICompTop;

			view.makeFullScreen();
			FGUICompTop.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
		}
		);
	}

	public static hideView():void {
		FGUICompTop.instance && FGUICompTop.instance.dispose();
		FGUICompTop.instance = null;
	}

	show(data?:any):void{};

	public static createInstance():FGUICompTop {
		return <FGUICompTop>(fgui.UIPackage.createObject("lobby", "CompTop"));
	}

	protected onConstruct():void {
		this.UI_COMP_HEAD = <fgui.GComponent>(this.getChildAt(1));
		this.UI_TXT_NICKNAME = <fgui.GTextField>(this.getChildAt(2));
		this.UI_TXT_USERID = <fgui.GTextField>(this.getChildAt(3));
	}
}
fgui.UIObjectFactory.setExtension(FGUICompTop.URL, FGUICompTop);