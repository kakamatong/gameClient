/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompMatchAct extends fgui.GComponent {

	public ctrl_act_0:fgui.Controller;
	public ctrl_act_1:fgui.Controller;
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
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("match", "CompMatchAct") as FGUICompMatchAct;

			view.makeFullScreen();
			FGUICompMatchAct.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompMatchAct.instance = null;
	}
	public static hideView():void {
		FGUICompMatchAct.instance && FGUICompMatchAct.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompMatchAct {
		return <FGUICompMatchAct>(fgui.UIPackage.createObject("match", "CompMatchAct"));
	}

	protected onConstruct():void {
		this.ctrl_act_0 = this.getControllerAt(0);
		this.ctrl_act_1 = this.getControllerAt(1);
		this.ctrl_act_2 = this.getControllerAt(2);
	}
}
fgui.UIObjectFactory.setExtension(FGUICompMatchAct.URL, FGUICompMatchAct);