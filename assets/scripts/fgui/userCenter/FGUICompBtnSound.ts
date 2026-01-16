/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompBtnSound extends fgui.GButton {

	public ctrl_status:fgui.Controller;
	public static URL:string = "ui://1zcuqn2bpr8n1";

	public static packageName:string = "userCenter";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompBtnSound.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("userCenter", "CompBtnSound") as FGUICompBtnSound;

			view.makeFullScreen();
			FGUICompBtnSound.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompBtnSound.instance = null;
	}
	public static hideView():void {
		FGUICompBtnSound.instance && FGUICompBtnSound.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompBtnSound {
		return <FGUICompBtnSound>(fgui.UIPackage.createObject("userCenter", "CompBtnSound"));
	}

	protected onConstruct():void {
		this.ctrl_status = this.getControllerAt(1);
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUICompBtnSound.URL, FGUICompBtnSound);