/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUIMailView extends fgui.GComponent {

	public ctrl_have:fgui.Controller;
	public UI_BTN_CLOSE:fgui.GButton;
	public UI_LV_LIST:fgui.GList;
	public static URL:string = "ui://8lqwicsugd4t0";

	public static packageName:string = "mail";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUIMailView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("mail", "MailView") as FGUIMailView;

			view.makeFullScreen();
			FGUIMailView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUIMailView.instance = null;
	}
	public static hideView():void {
		FGUIMailView.instance && FGUIMailView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUIMailView {
		return <FGUIMailView>(fgui.UIPackage.createObject("mail", "MailView"));
	}

	protected onConstruct():void {
		this.ctrl_have = this.getControllerAt(0);
		this.UI_BTN_CLOSE = <fgui.GButton>(this.getChildAt(4));
		this.UI_BTN_CLOSE.onClick(this.onBtnClose, this);
		this.UI_LV_LIST = <fgui.GList>(this.getChildAt(5));
	}
	onBtnClose():void{};
}
fgui.UIObjectFactory.setExtension(FGUIMailView.URL, FGUIMailView);