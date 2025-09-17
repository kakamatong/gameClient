/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUICompPrivateCreate extends fgui.GComponent {

	public UI_BTN_CREATE:fgui.GButton;
	public static URL:string = "ui://s0qy2rl1nomu1";

	public static packageName:string = "privateRoom";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompPrivateCreate.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("privateRoom", "CompPrivateCreate") as FGUICompPrivateCreate;

			view.makeFullScreen();
			FGUICompPrivateCreate.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompPrivateCreate.instance = null;
	}
	public static hideView():void {
		FGUICompPrivateCreate.instance && FGUICompPrivateCreate.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompPrivateCreate {
		return <FGUICompPrivateCreate>(fgui.UIPackage.createObject("privateRoom", "CompPrivateCreate"));
	}

	protected onConstruct():void {
		this.UI_BTN_CREATE = <fgui.GButton>(this.getChildAt(0));
		this.UI_BTN_CREATE.onClick(this.onBtnCreate, this);
	}
	onBtnCreate():void{};
}
fgui.UIObjectFactory.setExtension(FGUICompPrivateCreate.URL, FGUICompPrivateCreate);