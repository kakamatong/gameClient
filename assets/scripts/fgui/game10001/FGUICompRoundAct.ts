/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

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
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("game10001", "CompRoundAct") as FGUICompRoundAct;

			view.makeFullScreen();
			FGUICompRoundAct.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
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
}
fgui.UIObjectFactory.setExtension(FGUICompRoundAct.URL, FGUICompRoundAct);