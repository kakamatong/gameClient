/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompMainTalk extends fgui.GComponent {

	public UI_LIST_TALK:fgui.GList;
	public static URL:string = "ui://fznom2fxpxa51";

	public static packageName:string = "game10001Talk";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompMainTalk.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("game10001Talk", "CompMainTalk") as FGUICompMainTalk;

			view.makeFullScreen();
			FGUICompMainTalk.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompMainTalk.instance = null;
	}
	public static hideView():void {
		FGUICompMainTalk.instance && FGUICompMainTalk.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompMainTalk {
		return <FGUICompMainTalk>(fgui.UIPackage.createObject("game10001Talk", "CompMainTalk"));
	}

	protected onConstruct():void {
		this.UI_LIST_TALK = <fgui.GList>(this.getChildAt(1));
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUICompMainTalk.URL, FGUICompMainTalk);