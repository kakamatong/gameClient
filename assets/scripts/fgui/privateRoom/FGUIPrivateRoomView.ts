/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUICompPrivateCreate from "./FGUICompPrivateCreate";
import FGUICompPrivateJoin from "./FGUICompPrivateJoin";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUIPrivateRoomView extends fgui.GComponent {

	public ctrl_private:fgui.Controller;
	public UI_COMP_CREATE:FGUICompPrivateCreate;
	public UI_COMP_JOIN:FGUICompPrivateJoin;
	public UI_BTN_CLOSE:fgui.GButton;
	public static URL:string = "ui://s0qy2rl1nomu0";

	public static packageName:string = "privateRoom";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUIPrivateRoomView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("privateRoom", "PrivateRoomView") as FGUIPrivateRoomView;

			view.makeFullScreen();
			FGUIPrivateRoomView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUIPrivateRoomView.instance = null;
	}
	public static hideView():void {
		FGUIPrivateRoomView.instance && FGUIPrivateRoomView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUIPrivateRoomView {
		return <FGUIPrivateRoomView>(fgui.UIPackage.createObject("privateRoom", "PrivateRoomView"));
	}

	protected onConstruct():void {
		this.ctrl_private = this.getControllerAt(0);
		this.UI_COMP_CREATE = <FGUICompPrivateCreate>(this.getChildAt(4));
		this.UI_COMP_JOIN = <FGUICompPrivateJoin>(this.getChildAt(5));
		this.UI_BTN_CLOSE = <fgui.GButton>(this.getChildAt(6));
		this.UI_BTN_CLOSE.onClick(this.onBtnClose, this);
	}
	onBtnClose():void{};
}
fgui.UIObjectFactory.setExtension(FGUIPrivateRoomView.URL, FGUIPrivateRoomView);