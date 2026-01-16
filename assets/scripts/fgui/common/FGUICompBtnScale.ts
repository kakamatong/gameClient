/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompBtnScale extends fgui.GButton {

	public ctrl_color:fgui.Controller;
	public UI_ICOM:fgui.GLoader;
	public static URL:string = "ui://gj0r6g5icmlt4";

	public static packageName:string = "common";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompBtnScale.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("common", "CompBtnScale") as FGUICompBtnScale;

			view.makeFullScreen();
			FGUICompBtnScale.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompBtnScale.instance = null;
	}
	public static hideView():void {
		FGUICompBtnScale.instance && FGUICompBtnScale.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompBtnScale {
		return <FGUICompBtnScale>(fgui.UIPackage.createObject("common", "CompBtnScale"));
	}

	protected onConstruct():void {
		this.ctrl_color = this.getControllerAt(0);
		this.UI_ICOM = <fgui.GLoader>(this.getChildAt(0));
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUICompBtnScale.URL, FGUICompBtnScale);