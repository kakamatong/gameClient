/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompRoundAct extends fgui.GComponent {

	public title:fgui.GTextField;
	public act:fgui.Transition;
	public act2:fgui.Transition;
	public static URL:string = "ui://2zsfe53xkw9ii";

	public static packageName:string = "game10001";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompRoundAct.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("game10001", "CompRoundAct") as FGUICompRoundAct;

			view.makeFullScreen();
			FGUICompRoundAct.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompRoundAct.instance = null;
	}
	public static hideView():void {
		FGUICompRoundAct.instance && FGUICompRoundAct.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompRoundAct {
		return <FGUICompRoundAct>(fgui.UIPackage.createObject("game10001", "CompRoundAct"));
	}

	protected onConstruct():void {
		this.title = <fgui.GTextField>(this.getChildAt(0));
		this.act = this.getTransitionAt(0);
		this.act2 = this.getTransitionAt(1);
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUICompRoundAct.URL, FGUICompRoundAct);