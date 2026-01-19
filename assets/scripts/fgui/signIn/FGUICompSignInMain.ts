/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompSignInMain extends fgui.GComponent {

	public UI_LIST_SIGN:fgui.GList;
	public UI_BTN_GET:fgui.GButton;
	public UI_BTN_MULT:fgui.GButton;
	public static URL:string = "ui://cytsuqelbbyt4";

	public static packageName:string = "signIn";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompSignInMain.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("signIn", "CompSignInMain") as FGUICompSignInMain;

			view.makeFullScreen();
			FGUICompSignInMain.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompSignInMain.instance = null;
	}
	public static hideView():void {
		FGUICompSignInMain.instance && FGUICompSignInMain.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompSignInMain {
		return <FGUICompSignInMain>(fgui.UIPackage.createObject("signIn", "CompSignInMain"));
	}

	protected onConstruct():void {
		this.UI_LIST_SIGN = <fgui.GList>(this.getChildAt(2));
		this.UI_BTN_GET = <fgui.GButton>(this.getChildAt(3));
		this.UI_BTN_GET.onClick(this.onBtnGet, this);
		this.UI_BTN_MULT = <fgui.GButton>(this.getChildAt(4));
		this.UI_BTN_MULT.onClick(this.onBtnMult, this);
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
	onBtnGet():void{};
	onBtnMult():void{};
}
fgui.UIObjectFactory.setExtension(FGUICompSignInMain.URL, FGUICompSignInMain);