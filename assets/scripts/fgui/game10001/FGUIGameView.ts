/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUIGameView extends fgui.GComponent {

	public UI_BTN_BACK:fgui.GButton;
	public UI_TXT_NICKNAME:fgui.GTextField;
	public UI_TXT_ID:fgui.GTextField;
	public UI_GROUP_PLAYER_2:fgui.GGroup;
	public UI_TXT_NICKNAME_2:fgui.GTextField;
	public UI_TXT_ID_2:fgui.GTextField;
	public UI_GROUP_PLAYER_1:fgui.GGroup;
	public static URL:string = "ui://2zsfe53xis911";

	public static packageName:string = "game10001";

	public static instance:any | null = null;

	public static showView(params?:any):void {
		if(FGUIGameView.instance) {
			console.log("allready show");
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);return;}
			const view = fgui.UIPackage.createObject("game10001", "GameView") as FGUIGameView;

			view.makeFullScreen();
			FGUIGameView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
		}
		);
	}

	public static hideView():void {
		FGUIGameView.instance && FGUIGameView.instance.dispose();
		FGUIGameView.instance = null;
	}

	show(data?:any):void{};

	public static createInstance():FGUIGameView {
		return <FGUIGameView>(fgui.UIPackage.createObject("game10001", "GameView"));
	}

	protected onConstruct():void {
		this.UI_BTN_BACK = <fgui.GButton>(this.getChildAt(1));
		this.UI_BTN_BACK.onClick(this.onBtnBack, this);
		this.UI_TXT_NICKNAME = <fgui.GTextField>(this.getChildAt(4));
		this.UI_TXT_ID = <fgui.GTextField>(this.getChildAt(5));
		this.UI_GROUP_PLAYER_2 = <fgui.GGroup>(this.getChildAt(6));
		this.UI_TXT_NICKNAME_2 = <fgui.GTextField>(this.getChildAt(9));
		this.UI_TXT_ID_2 = <fgui.GTextField>(this.getChildAt(10));
		this.UI_GROUP_PLAYER_1 = <fgui.GGroup>(this.getChildAt(11));
	}
	onBtnBack():void{};
}
fgui.UIObjectFactory.setExtension(FGUIGameView.URL, FGUIGameView);