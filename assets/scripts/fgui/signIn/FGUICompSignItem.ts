/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompSignItem extends fgui.GComponent {

	public ctrl_geted:fgui.Controller;
	public ctrl_today:fgui.Controller;
	public ctrl_icon:fgui.Controller;
	public UI_LOADER_ICON:fgui.GLoader;
	public UI_TXT_DAY:fgui.GTextField;
	public UI_TXT_NUM:fgui.GTextField;
	public UI_BTN_FILL:fgui.GButton;
	public static URL:string = "ui://cytsuqelbbyt5";

	public static packageName:string = "signIn";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompSignItem.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("signIn", "CompSignItem") as FGUICompSignItem;

			view.makeFullScreen();
			FGUICompSignItem.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompSignItem.instance = null;
	}
	public static hideView():void {
		FGUICompSignItem.instance && FGUICompSignItem.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompSignItem {
		return <FGUICompSignItem>(fgui.UIPackage.createObject("signIn", "CompSignItem"));
	}

	protected onConstruct():void {
		this.ctrl_geted = this.getControllerAt(0);
		this.ctrl_today = this.getControllerAt(1);
		this.ctrl_icon = this.getControllerAt(2);
		this.UI_LOADER_ICON = <fgui.GLoader>(this.getChildAt(1));
		this.UI_TXT_DAY = <fgui.GTextField>(this.getChildAt(2));
		this.UI_TXT_NUM = <fgui.GTextField>(this.getChildAt(3));
		this.UI_BTN_FILL = <fgui.GButton>(this.getChildAt(5));
		this.UI_BTN_FILL.onClick(this.onBtnFill, this);
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
	onBtnFill():void{};
}
fgui.UIObjectFactory.setExtension(FGUICompSignItem.URL, FGUICompSignItem);