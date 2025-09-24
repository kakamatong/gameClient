/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUILoginView extends fgui.GComponent {

	public UI_BTN_START:fgui.GButton;
	public static URL:string = "ui://0xt8xx657ivz0";

	public static packageName:string = "login";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUILoginView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("login", "LoginView") as FGUILoginView;

			view.makeFullScreen();
			FGUILoginView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUILoginView.instance = null;
	}
	public static hideView():void {
		FGUILoginView.instance && FGUILoginView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUILoginView {
		return <FGUILoginView>(fgui.UIPackage.createObject("login", "LoginView"));
	}

	protected onConstruct():void {
		this.UI_BTN_START = <fgui.GButton>(this.getChildAt(8));
		this.UI_BTN_START.onClick(this.onBtnStart, this);
	}
	onBtnStart():void{};
}
fgui.UIObjectFactory.setExtension(FGUILoginView.URL, FGUILoginView);