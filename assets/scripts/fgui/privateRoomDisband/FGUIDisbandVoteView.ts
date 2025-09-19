/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUIDisbandVoteView extends fgui.GComponent {

	public ctrl_btn:fgui.Controller;
	public UI_BTN_REFUSE:fgui.GButton;
	public UI_BTN_AGREE:fgui.GButton;
	public UI_LV_PLAYER:fgui.GList;
	public UI_TXT_LEFT_TIME:fgui.GTextField;
	public UI_TXT_MSG:fgui.GTextField;
	public static URL:string = "ui://2md577f1r1yn0";

	public static packageName:string = "privateRoomDisband";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUIDisbandVoteView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("privateRoomDisband", "DisbandVoteView") as FGUIDisbandVoteView;

			view.makeFullScreen();
			FGUIDisbandVoteView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUIDisbandVoteView.instance = null;
	}
	public static hideView():void {
		FGUIDisbandVoteView.instance && FGUIDisbandVoteView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUIDisbandVoteView {
		return <FGUIDisbandVoteView>(fgui.UIPackage.createObject("privateRoomDisband", "DisbandVoteView"));
	}

	protected onConstruct():void {
		this.ctrl_btn = this.getControllerAt(0);
		this.UI_BTN_REFUSE = <fgui.GButton>(this.getChildAt(1));
		this.UI_BTN_REFUSE.onClick(this.onBtnRefuse, this);
		this.UI_BTN_AGREE = <fgui.GButton>(this.getChildAt(2));
		this.UI_BTN_AGREE.onClick(this.onBtnAgree, this);
		this.UI_LV_PLAYER = <fgui.GList>(this.getChildAt(3));
		this.UI_TXT_LEFT_TIME = <fgui.GTextField>(this.getChildAt(4));
		this.UI_TXT_MSG = <fgui.GTextField>(this.getChildAt(6));
	}
	onBtnRefuse():void{};
	onBtnAgree():void{};
}
fgui.UIObjectFactory.setExtension(FGUIDisbandVoteView.URL, FGUIDisbandVoteView);