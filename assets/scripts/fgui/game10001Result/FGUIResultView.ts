/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUICompAct from "./FGUICompAct";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUIResultView extends fgui.GComponent {

	public ctrl_flag:fgui.Controller;
	public ctrl_btn:fgui.Controller;
	public ctrl_roomType:fgui.Controller;
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
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("game10001Result", "ResultView") as FGUIResultView;

			view.makeFullScreen();
			FGUIResultView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
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
		this.ctrl_btn = this.getControllerAt(1);
		this.ctrl_roomType = this.getControllerAt(2);
		this.UI_BTN_CON = <fgui.GButton>(this.getChildAt(2));
		this.UI_BTN_CON.onClick(this.onBtnCon, this);
		this.UI_BTN_BACK = <fgui.GButton>(this.getChildAt(3));
		this.UI_BTN_BACK.onClick(this.onBtnBack, this);
		this.UI_LV_GAME_INFO = <fgui.GList>(this.getChildAt(4));
		this.UI_GROP_RESULT = <fgui.GGroup>(this.getChildAt(6));
		this.UI_COMP_ACT = <FGUICompAct>(this.getChildAt(7));
		this.act = this.getTransitionAt(0);
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
	onBtnCon():void{};
	onBtnBack():void{};
}
fgui.UIObjectFactory.setExtension(FGUIResultView.URL, FGUIResultView);