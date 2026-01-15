/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompThinkAct extends fgui.GComponent {

	public act:fgui.Transition;
	public static URL:string = "ui://2zsfe53xqaf28";

	public static packageName:string = "game10001";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompThinkAct.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("game10001", "CompThinkAct") as FGUICompThinkAct;

			view.makeFullScreen();
			FGUICompThinkAct.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompThinkAct.instance = null;
	}
	public static hideView():void {
		FGUICompThinkAct.instance && FGUICompThinkAct.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompThinkAct {
		return <FGUICompThinkAct>(fgui.UIPackage.createObject("game10001", "CompThinkAct"));
	}

	protected onConstruct():void {
		this.act = this.getTransitionAt(0);
	}
}
fgui.UIObjectFactory.setExtension(FGUICompThinkAct.URL, FGUICompThinkAct);