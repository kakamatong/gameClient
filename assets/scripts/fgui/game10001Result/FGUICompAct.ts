/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompAct extends fgui.GComponent {

	public ctrl_show:fgui.Controller;
	public ctrl_sign:fgui.Controller;
	public act:fgui.Transition;
	public static URL:string = "ui://5x18e99vfnug2";

	public static packageName:string = "game10001Result";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompAct.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("game10001Result", "CompAct") as FGUICompAct;

			view.makeFullScreen();
			FGUICompAct.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompAct.instance = null;
	}
	public static hideView():void {
		FGUICompAct.instance && FGUICompAct.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompAct {
		return <FGUICompAct>(fgui.UIPackage.createObject("game10001Result", "CompAct"));
	}

	protected onConstruct():void {
		this.ctrl_show = this.getControllerAt(0);
		this.ctrl_sign = this.getControllerAt(1);
		this.act = this.getTransitionAt(0);
	}
}
fgui.UIObjectFactory.setExtension(FGUICompAct.URL, FGUICompAct);