/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUICompMatchAct extends fgui.GComponent {

	public ctrl_act_0:fgui.Controller;
	public ctrl_atc_1:fgui.Controller;
	public ctrl_act_2:fgui.Controller;
	public static URL:string = "ui://y9gp37x6wfqx1";

	public static packageName:string = "match";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompMatchAct.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("match", "CompMatchAct") as FGUICompMatchAct;

			view.makeFullScreen();
			FGUICompMatchAct.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	public static hideView():void {
		FGUICompMatchAct.instance && FGUICompMatchAct.instance.dispose();
		FGUICompMatchAct.instance = null;
	}

	show(data?:any):void{};

	public static createInstance():FGUICompMatchAct {
		return <FGUICompMatchAct>(fgui.UIPackage.createObject("match", "CompMatchAct"));
	}

	protected onConstruct():void {
		this.ctrl_act_0 = this.getControllerAt(0);
		this.ctrl_atc_1 = this.getControllerAt(1);
		this.ctrl_act_2 = this.getControllerAt(2);
	}
}
fgui.UIObjectFactory.setExtension(FGUICompMatchAct.URL, FGUICompMatchAct);