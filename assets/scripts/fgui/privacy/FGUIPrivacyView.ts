/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUIPrivacyView extends fgui.GComponent {

	public UI_BTN_REFUSE:fgui.GButton;
	public UI_BTN_AGREE:fgui.GButton;
	public UI_BTN_PRIVACY:fgui.GButton;
	public UI_BTN_USER:fgui.GButton;
	public static URL:string = "ui://0b8bc4vt7ivz0";

	public static packageName:string = "privacy";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUIPrivacyView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("privacy", "PrivacyView") as FGUIPrivacyView;

			view.makeFullScreen();
			FGUIPrivacyView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUIPrivacyView.instance = null;
	}
	public static hideView():void {
		FGUIPrivacyView.instance && FGUIPrivacyView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUIPrivacyView {
		return <FGUIPrivacyView>(fgui.UIPackage.createObject("privacy", "PrivacyView"));
	}

	protected onConstruct():void {
		this.UI_BTN_REFUSE = <fgui.GButton>(this.getChildAt(1));
		this.UI_BTN_REFUSE.onClick(this.onBtnRefuse, this);
		this.UI_BTN_AGREE = <fgui.GButton>(this.getChildAt(2));
		this.UI_BTN_AGREE.onClick(this.onBtnAgree, this);
		this.UI_BTN_PRIVACY = <fgui.GButton>(this.getChildAt(5));
		this.UI_BTN_PRIVACY.onClick(this.onBtnPrivacy, this);
		this.UI_BTN_USER = <fgui.GButton>(this.getChildAt(6));
		this.UI_BTN_USER.onClick(this.onBtnUser, this);
	}
	onBtnRefuse():void{};
	onBtnAgree():void{};
	onBtnPrivacy():void{};
	onBtnUser():void{};
}
fgui.UIObjectFactory.setExtension(FGUIPrivacyView.URL, FGUIPrivacyView);