/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUICompMatchAct from "./FGUICompMatchAct";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUIMatchView extends fgui.GComponent {

	public ctrl_btn_join:fgui.Controller;
	public ctrl_enter:fgui.Controller;
	public UI_BTN_JOIN:fgui.GButton;
	public UI_BTN_CANCEL:fgui.GButton;
	public UI_COMP_ACT:FGUICompMatchAct;
	public UI_BTN_AUTO_CHECK:fgui.GButton;
	public UI_GROUP_AUTO:fgui.GGroup;
	public static URL:string = "ui://y9gp37x6wfqx0";

	public static packageName:string = "match";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUIMatchView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("match", "MatchView") as FGUIMatchView;

			view.makeFullScreen();
			FGUIMatchView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUIMatchView.instance = null;
	}
	public static hideView():void {
		FGUIMatchView.instance && FGUIMatchView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUIMatchView {
		return <FGUIMatchView>(fgui.UIPackage.createObject("match", "MatchView"));
	}

	protected onConstruct():void {
		this.ctrl_btn_join = this.getControllerAt(0);
		this.ctrl_enter = this.getControllerAt(1);
		this.UI_BTN_JOIN = <fgui.GButton>(this.getChildAt(3));
		this.UI_BTN_JOIN.onClick(this.onBtnJoin, this);
		this.UI_BTN_CANCEL = <fgui.GButton>(this.getChildAt(4));
		this.UI_BTN_CANCEL.onClick(this.onBtnCancel, this);
		this.UI_COMP_ACT = <FGUICompMatchAct>(this.getChildAt(5));
		this.UI_BTN_AUTO_CHECK = <fgui.GButton>(this.getChildAt(6));
		this.UI_BTN_AUTO_CHECK.onClick(this.onBtnAutoCheck, this);
		this.UI_GROUP_AUTO = <fgui.GGroup>(this.getChildAt(8));
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
	onBtnJoin():void{};
	onBtnCancel():void{};
	onBtnAutoCheck():void{};
}
fgui.UIObjectFactory.setExtension(FGUIMatchView.URL, FGUIMatchView);