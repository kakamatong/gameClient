/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompItem extends fgui.GComponent {

	public UI_TXT_TALK:fgui.GTextField;
	public UI_TXT_SPEED:fgui.GTextField;
	public static URL:string = "ui://fznom2fxpxa52";

	public static packageName:string = "game10001Talk";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompItem.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("game10001Talk", "CompItem") as FGUICompItem;

			view.makeFullScreen();
			FGUICompItem.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompItem.instance = null;
	}
	public static hideView():void {
		FGUICompItem.instance && FGUICompItem.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompItem {
		return <FGUICompItem>(fgui.UIPackage.createObject("game10001Talk", "CompItem"));
	}

	protected onConstruct():void {
		this.UI_TXT_TALK = <fgui.GTextField>(this.getChildAt(0));
		this.UI_TXT_SPEED = <fgui.GTextField>(this.getChildAt(2));
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUICompItem.URL, FGUICompItem);