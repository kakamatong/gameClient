/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUICompBtnScale from "./FGUICompBtnScale";

export default class FGUICompPopMessage extends fgui.GComponent {

	public ctrl_btn_type:fgui.Controller;
	public UI_BTN_CLOSE:fgui.GButton;
	public UI_BTN_SURE:FGUICompBtnScale;
	public UI_BTN_CANCEL:FGUICompBtnScale;
	public UI_TXT_TITLE:fgui.GTextField;
	public UI_TXT_CONTENT:fgui.GTextField;
	public static URL:string = "ui://gj0r6g5imuz3g";

	public static packageName:string = "common";

	public static instance:any | null = null;

	public static showView(params?:any):void {
		if(FGUICompPopMessage.instance) {
			console.log("allready show");
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);return;}
			const view = fgui.UIPackage.createObject("common", "CompPopMessage") as FGUICompPopMessage;

			view.makeFullScreen();
			FGUICompPopMessage.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
		}
		);
	}

	public static hideView():void {
		FGUICompPopMessage.instance && FGUICompPopMessage.instance.dispose();
		FGUICompPopMessage.instance = null;
	}
	show(data?:any):void{};
	public static createInstance():FGUICompPopMessage {
		return <FGUICompPopMessage>(fgui.UIPackage.createObject("common", "CompPopMessage"));
	}

	protected onConstruct():void {
		this.ctrl_btn_type = this.getControllerAt(0);
		this.UI_BTN_CLOSE = <fgui.GButton>(this.getChildAt(1));
		this.UI_BTN_CLOSE.onClick(this.onBtnClose, this);
		this.UI_BTN_SURE = <FGUICompBtnScale>(this.getChildAt(2));
		this.UI_BTN_SURE.onClick(this.onBtnSure, this);
		this.UI_BTN_CANCEL = <FGUICompBtnScale>(this.getChildAt(3));
		this.UI_BTN_CANCEL.onClick(this.onBtnCancel, this);
		this.UI_TXT_TITLE = <fgui.GTextField>(this.getChildAt(4));
		this.UI_TXT_CONTENT = <fgui.GTextField>(this.getChildAt(5));
	}
	onBtnClose():void{};
	onBtnSure():void{};
	onBtnCancel():void{};
}
fgui.UIObjectFactory.setExtension(FGUICompPopMessage.URL, FGUICompPopMessage);