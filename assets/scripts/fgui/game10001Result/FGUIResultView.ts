/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUICompAct from "./FGUICompAct";

export default class FGUIResultView extends fgui.GComponent {

	public ctrl_flag:fgui.Controller;
	public UI_BTN_CON:fgui.GButton;
	public UI_BTN_BACK:fgui.GButton;
	public UI_LV_GAME_INFO:fgui.GList;
	public UI_GROP_RESULT:fgui.GGroup;
	public UI_COMP_ACT:FGUICompAct;
	public act:fgui.Transition;
	public static URL:string = "ui://5x18e99vfnug0";

	public static packageName:string = "game10001Result";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUIResultView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("game10001Result", "ResultView") as FGUIResultView;

			view.makeFullScreen();
			FGUIResultView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUIResultView.instance = null;
	}
	public static hideView():void {
		FGUIResultView.instance && FGUIResultView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUIResultView {
		return <FGUIResultView>(fgui.UIPackage.createObject("game10001Result", "ResultView"));
	}

	protected onConstruct():void {
		this.ctrl_flag = this.getControllerAt(0);
		this.UI_BTN_CON = <fgui.GButton>(this.getChildAt(1));
		this.UI_BTN_CON.onClick(this.onBtnCon, this);
		this.UI_BTN_BACK = <fgui.GButton>(this.getChildAt(2));
		this.UI_BTN_BACK.onClick(this.onBtnBack, this);
		this.UI_LV_GAME_INFO = <fgui.GList>(this.getChildAt(3));
		this.UI_GROP_RESULT = <fgui.GGroup>(this.getChildAt(4));
		this.UI_COMP_ACT = <FGUICompAct>(this.getChildAt(5));
		this.act = this.getTransitionAt(0);
	}
	onBtnCon():void{};
	onBtnBack():void{};
}
fgui.UIObjectFactory.setExtension(FGUIResultView.URL, FGUIResultView);