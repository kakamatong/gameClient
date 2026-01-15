/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompClock extends fgui.GComponent {

	public title:fgui.GTextField;
	public act:fgui.Transition;
	public static URL:string = "ui://2zsfe53xqaf26";

	public static packageName:string = "game10001";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompClock.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("game10001", "CompClock") as FGUICompClock;

			view.makeFullScreen();
			FGUICompClock.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompClock.instance = null;
	}
	public static hideView():void {
		FGUICompClock.instance && FGUICompClock.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompClock {
		return <FGUICompClock>(fgui.UIPackage.createObject("game10001", "CompClock"));
	}

	protected onConstruct():void {
		this.title = <fgui.GTextField>(this.getChildAt(1));
		this.act = this.getTransitionAt(0);
	}
}
fgui.UIObjectFactory.setExtension(FGUICompClock.URL, FGUICompClock);