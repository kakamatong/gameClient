/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUIPlayerInfoView extends fgui.GComponent {

	public UI_BG_MASK:fgui.GGraph;
	public UI_COMP_HEAD:fgui.GComponent;
	public UI_TXT_NICKNAME:fgui.GTextField;
	public UI_TXT_USERID:fgui.GTextField;
	public UI_TXT_WIN:fgui.GTextField;
	public UI_TXT_LOSE:fgui.GTextField;
	public UI_TXT_DRAW:fgui.GTextField;
	public UI_TXT_RATE:fgui.GTextField;
	public UI_TXT_CP:fgui.GTextField;
	public static URL:string = "ui://nhq4h2n4bp6f0";

	public static packageName:string = "game10001PlayerInfo";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUIPlayerInfoView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("game10001PlayerInfo", "PlayerInfoView") as FGUIPlayerInfoView;

			view.makeFullScreen();
			FGUIPlayerInfoView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUIPlayerInfoView.instance = null;
	}
	public static hideView():void {
		FGUIPlayerInfoView.instance && FGUIPlayerInfoView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUIPlayerInfoView {
		return <FGUIPlayerInfoView>(fgui.UIPackage.createObject("game10001PlayerInfo", "PlayerInfoView"));
	}

	protected onConstruct():void {
		this.UI_BG_MASK = <fgui.GGraph>(this.getChildAt(0));
		this.UI_COMP_HEAD = <fgui.GComponent>(this.getChildAt(4));
		this.UI_TXT_NICKNAME = <fgui.GTextField>(this.getChildAt(5));
		this.UI_TXT_USERID = <fgui.GTextField>(this.getChildAt(6));
		this.UI_TXT_WIN = <fgui.GTextField>(this.getChildAt(12));
		this.UI_TXT_LOSE = <fgui.GTextField>(this.getChildAt(13));
		this.UI_TXT_DRAW = <fgui.GTextField>(this.getChildAt(14));
		this.UI_TXT_RATE = <fgui.GTextField>(this.getChildAt(15));
		this.UI_TXT_CP = <fgui.GTextField>(this.getChildAt(17));
	}
}
fgui.UIObjectFactory.setExtension(FGUIPlayerInfoView.URL, FGUIPlayerInfoView);