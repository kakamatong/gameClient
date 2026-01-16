/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUICompMailContent from "./FGUICompMailContent";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUIMailView extends fgui.GComponent {

	public ctrl_have:fgui.Controller;
	public UI_BTN_CLOSE:fgui.GButton;
	public UI_LV_LIST:fgui.GList;
	public UI_COMP_CONTENT:FGUICompMailContent;
	public static URL:string = "ui://8lqwicsugd4t0";

	public static packageName:string = "mail";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUIMailView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("mail", "MailView") as FGUIMailView;

			view.makeFullScreen();
			FGUIMailView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUIMailView.instance = null;
	}
	public static hideView():void {
		FGUIMailView.instance && FGUIMailView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUIMailView {
		return <FGUIMailView>(fgui.UIPackage.createObject("mail", "MailView"));
	}

	protected onConstruct():void {
		this.ctrl_have = this.getControllerAt(0);
		this.UI_BTN_CLOSE = <fgui.GButton>(this.getChildAt(4));
		this.UI_BTN_CLOSE.onClick(this.onBtnClose, this);
		this.UI_LV_LIST = <fgui.GList>(this.getChildAt(5));
		this.UI_COMP_CONTENT = <FGUICompMailContent>(this.getChildAt(8));
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
	onBtnClose():void{};
}
fgui.UIObjectFactory.setExtension(FGUIMailView.URL, FGUIMailView);