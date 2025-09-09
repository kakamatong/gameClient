/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUIRankView extends fgui.GComponent {

	public mask:fgui.GGraph;
	public UI_LV_RANK:fgui.GList;
	public UI_BTN_CLOSE:fgui.GButton;
	public static URL:string = "ui://2a32uf5yis910";

	public static packageName:string = "rank";

	public static instance:any | null = null;

	public static showView(params?:any):void {
		if(FGUIRankView.instance) {
			console.log("allready show");
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);return;}
			const view = fgui.UIPackage.createObject("rank", "RankView") as FGUIRankView;

			view.makeFullScreen();
			FGUIRankView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
		}
		);
	}

	public static hideView():void {
		FGUIRankView.instance && FGUIRankView.instance.dispose();
		FGUIRankView.instance = null;
	}

	show(data?:any):void{};

	public static createInstance():FGUIRankView {
		return <FGUIRankView>(fgui.UIPackage.createObject("rank", "RankView"));
	}

	protected onConstruct():void {
		this.mask = <fgui.GGraph>(this.getChildAt(0));
		this.UI_LV_RANK = <fgui.GList>(this.getChildAt(2));
		this.UI_BTN_CLOSE = <fgui.GButton>(this.getChildAt(3));
		this.UI_BTN_CLOSE.onClick(this.onBtnClose, this);
	}
	onBtnClose():void{};
}
fgui.UIObjectFactory.setExtension(FGUIRankView.URL, FGUIRankView);