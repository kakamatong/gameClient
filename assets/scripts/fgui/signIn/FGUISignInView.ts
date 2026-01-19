/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUICompSignInMain from "./FGUICompSignInMain";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUISignInView extends fgui.GComponent {

	public UI_MAIN_NODE:FGUICompSignInMain;
	public static URL:string = "ui://cytsuqelbbyt3";

	public static packageName:string = "signIn";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUISignInView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("signIn", "SignInView") as FGUISignInView;

			view.makeFullScreen();
			FGUISignInView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUISignInView.instance = null;
	}
	public static hideView():void {
		FGUISignInView.instance && FGUISignInView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUISignInView {
		return <FGUISignInView>(fgui.UIPackage.createObject("signIn", "SignInView"));
	}

	protected onConstruct():void {
		this.UI_MAIN_NODE = <FGUICompSignInMain>(this.getChildAt(1));
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUISignInView.URL, FGUISignInView);