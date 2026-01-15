/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUICompOffline from "./FGUICompOffline";
import FGUICompThinkAct from "./FGUICompThinkAct";
import FGUICompTalk from "./FGUICompTalk";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompPlayerHead extends fgui.GComponent {

	public ctrl_pos:fgui.Controller;
	public ctrl_localSeat:fgui.Controller;
	public UI_COMP_HEAD:fgui.GComponent;
	public UI_TXT_WINLOSE:fgui.GTextField;
	public UI_TXT_NICKNAME:fgui.GTextField;
	public UI_TXT_ID:fgui.GTextField;
	public UI_COMP_OFFLINE:FGUICompOffline;
	public UI_COMP_THINKING:FGUICompThinkAct;
	public UI_COMP_TALK:FGUICompTalk;
	public static URL:string = "ui://2zsfe53xgk14j";

	public static packageName:string = "game10001";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompPlayerHead.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("game10001", "CompPlayerHead") as FGUICompPlayerHead;

			view.makeFullScreen();
			FGUICompPlayerHead.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompPlayerHead.instance = null;
	}
	public static hideView():void {
		FGUICompPlayerHead.instance && FGUICompPlayerHead.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompPlayerHead {
		return <FGUICompPlayerHead>(fgui.UIPackage.createObject("game10001", "CompPlayerHead"));
	}

	protected onConstruct():void {
		this.ctrl_pos = this.getControllerAt(0);
		this.ctrl_localSeat = this.getControllerAt(1);
		this.UI_COMP_HEAD = <fgui.GComponent>(this.getChildAt(1));
		this.UI_TXT_WINLOSE = <fgui.GTextField>(this.getChildAt(2));
		this.UI_TXT_NICKNAME = <fgui.GTextField>(this.getChildAt(3));
		this.UI_TXT_ID = <fgui.GTextField>(this.getChildAt(4));
		this.UI_COMP_OFFLINE = <FGUICompOffline>(this.getChildAt(5));
		this.UI_COMP_THINKING = <FGUICompThinkAct>(this.getChildAt(6));
		this.UI_COMP_TALK = <FGUICompTalk>(this.getChildAt(7));
	}
}
fgui.UIObjectFactory.setExtension(FGUICompPlayerHead.URL, FGUICompPlayerHead);