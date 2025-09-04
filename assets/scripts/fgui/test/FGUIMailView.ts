/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUIMailView extends fgui.GComponent {

	public ctrl_get:fgui.Controller;
	public ctrl_award:fgui.Controller;
	public UI_BTN_CLOSE:fgui.GButton;
	public UI_LV_MAILS:fgui.GList;
	public UI_TXT_CONTENT:fgui.GTextField;
	public UI_BTN_GET:fgui.GButton;
	public static URL:string = "ui://ljshfpzyeatn5";

	public static packageName:string = "test";

	public static instance:any | null = null;

	public static showView(params?:any):void {
		if(FGUIMailView.instance) {
			console.log("allready show");
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);return;}
			const view = fgui.UIPackage.createObject("test", "MailView");

			view.makeFullScreen();
			FGUIMailView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
		}
		);
	}

	public static hideView():void {
		FGUIMailView.instance && undefined.instance.dispose();
	}
	public static createInstance():FGUIMailView {
		return <FGUIMailView>(fgui.UIPackage.createObject("test", "MailView"));
	}

	protected onConstruct():void {
		this.ctrl_get = this.getControllerAt(0);
		this.ctrl_award = this.getControllerAt(1);
		this.UI_BTN_CLOSE = <fgui.GButton>(this.getChildAt(1));
		this.UI_BTN_CLOSE.onClick(this.onBtnClose, this);
		this.UI_LV_MAILS = <fgui.GList>(this.getChildAt(2));
		this.UI_TXT_CONTENT = <fgui.GTextField>(this.getChildAt(3));
		this.UI_BTN_GET = <fgui.GButton>(this.getChildAt(4));
		this.UI_BTN_GET.onClick(this.onBtnGet, this);
	}
	onBtnClose():void{};
	onBtnGet():void{};
}
fgui.UIObjectFactory.setExtension(FGUIMailView.URL, FGUIMailView);