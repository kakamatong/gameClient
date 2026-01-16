/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUICompRich from "./FGUICompRich";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompTop extends fgui.GComponent {

	public UI_COMP_HEAD:fgui.GComponent;
	public UI_TXT_NICKNAME:fgui.GTextField;
	public UI_TXT_USERID:fgui.GTextField;
	public UI_COMP_SILVER:FGUICompRich;
	public static URL:string = "ui://gv22rev3cveva";

	public static packageName:string = "lobby";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompTop.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("lobby", "CompTop") as FGUICompTop;

			view.makeFullScreen();
			FGUICompTop.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompTop.instance = null;
	}
	public static hideView():void {
		FGUICompTop.instance && FGUICompTop.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompTop {
		return <FGUICompTop>(fgui.UIPackage.createObject("lobby", "CompTop"));
	}

	protected onConstruct():void {
		this.UI_COMP_HEAD = <fgui.GComponent>(this.getChildAt(1));
		this.UI_TXT_NICKNAME = <fgui.GTextField>(this.getChildAt(2));
		this.UI_TXT_USERID = <fgui.GTextField>(this.getChildAt(3));
		this.UI_COMP_SILVER = <FGUICompRich>(this.getChildAt(4));
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUICompTop.URL, FGUICompTop);