/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompMailTitle extends fgui.GComponent {

	public ctrl_read:fgui.Controller;
	public UI_TXT_TITLE:fgui.GTextField;
	public UI_TXT_TIME:fgui.GTextField;
	public static URL:string = "ui://8lqwicsugd4t1";

	public static packageName:string = "mail";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompMailTitle.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("mail", "CompMailTitle") as FGUICompMailTitle;

			view.makeFullScreen();
			FGUICompMailTitle.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompMailTitle.instance = null;
	}
	public static hideView():void {
		FGUICompMailTitle.instance && FGUICompMailTitle.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompMailTitle {
		return <FGUICompMailTitle>(fgui.UIPackage.createObject("mail", "CompMailTitle"));
	}

	protected onConstruct():void {
		this.ctrl_read = this.getControllerAt(0);
		this.UI_TXT_TITLE = <fgui.GTextField>(this.getChildAt(1));
		this.UI_TXT_TIME = <fgui.GTextField>(this.getChildAt(3));
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUICompMailTitle.URL, FGUICompMailTitle);