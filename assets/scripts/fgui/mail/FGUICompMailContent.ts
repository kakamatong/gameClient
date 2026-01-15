/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompMailContent extends fgui.GComponent {

	public UI_BTN_CLOSE:fgui.GButton;
	public title:fgui.GTextField;
	public static URL:string = "ui://8lqwicsugd4t2";

	public static packageName:string = "mail";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompMailContent.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("mail", "CompMailContent") as FGUICompMailContent;

			view.makeFullScreen();
			FGUICompMailContent.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompMailContent.instance = null;
	}
	public static hideView():void {
		FGUICompMailContent.instance && FGUICompMailContent.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompMailContent {
		return <FGUICompMailContent>(fgui.UIPackage.createObject("mail", "CompMailContent"));
	}

	protected onConstruct():void {
		this.UI_BTN_CLOSE = <fgui.GButton>(this.getChildAt(1));
		this.UI_BTN_CLOSE.onClick(this.onBtnClose, this);
		this.title = <fgui.GTextField>(this.getChildAt(3));
	}
	onBtnClose():void{};
}
fgui.UIObjectFactory.setExtension(FGUICompMailContent.URL, FGUICompMailContent);