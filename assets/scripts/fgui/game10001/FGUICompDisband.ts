/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompDisband extends fgui.GComponent {

	public ctrl_btn:fgui.Controller;
	public UI_BTN_REFUSE:fgui.GButton;
	public UI_BTN_AGREE:fgui.GButton;
	public UI_LV_VOTE_INFO:fgui.GList;
	public UI_TXT_LEFT_TIME:fgui.GTextField;
	public UI_TXT_MSG:fgui.GTextField;
	public static URL:string = "ui://2zsfe53xr1yn0";

	public static packageName:string = "game10001";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompDisband.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("game10001", "CompDisband") as FGUICompDisband;

			view.makeFullScreen();
			FGUICompDisband.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompDisband.instance = null;
	}
	public static hideView():void {
		FGUICompDisband.instance && FGUICompDisband.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompDisband {
		return <FGUICompDisband>(fgui.UIPackage.createObject("game10001", "CompDisband"));
	}

	protected onConstruct():void {
		this.ctrl_btn = this.getControllerAt(0);
		this.UI_BTN_REFUSE = <fgui.GButton>(this.getChildAt(1));
		this.UI_BTN_REFUSE.onClick(this.onBtnRefuse, this);
		this.UI_BTN_AGREE = <fgui.GButton>(this.getChildAt(2));
		this.UI_BTN_AGREE.onClick(this.onBtnAgree, this);
		this.UI_LV_VOTE_INFO = <fgui.GList>(this.getChildAt(3));
		this.UI_TXT_LEFT_TIME = <fgui.GTextField>(this.getChildAt(4));
		this.UI_TXT_MSG = <fgui.GTextField>(this.getChildAt(6));
	}
	onBtnRefuse():void{};
	onBtnAgree():void{};
}
fgui.UIObjectFactory.setExtension(FGUICompDisband.URL, FGUICompDisband);