/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUICompMainTalk from "./FGUICompMainTalk";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUITalkView extends fgui.GComponent {

	public UI_COMP_MAIN:FGUICompMainTalk;
	public in:fgui.Transition;
	public out:fgui.Transition;
	public static URL:string = "ui://fznom2fxpxa50";

	public static packageName:string = "game10001Talk";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUITalkView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("game10001Talk", "TalkView") as FGUITalkView;

			view.makeFullScreen();
			FGUITalkView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUITalkView.instance = null;
	}
	public static hideView():void {
		FGUITalkView.instance && FGUITalkView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUITalkView {
		return <FGUITalkView>(fgui.UIPackage.createObject("game10001Talk", "TalkView"));
	}

	protected onConstruct():void {
		this.UI_COMP_MAIN = <FGUICompMainTalk>(this.getChildAt(0));
		this.in = this.getTransitionAt(0);
		this.out = this.getTransitionAt(1);
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUITalkView.URL, FGUITalkView);