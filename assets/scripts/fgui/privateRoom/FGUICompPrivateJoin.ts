/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompPrivateJoin extends fgui.GComponent {

	public UI_BTN_JOIN_1:fgui.GButton;
	public UI_BTN_JOIN_2:fgui.GButton;
	public UI_BTN_JOIN_3:fgui.GButton;
	public UI_BTN_JOIN_4:fgui.GButton;
	public UI_BTN_JOIN_5:fgui.GButton;
	public UI_BTN_JOIN_6:fgui.GButton;
	public UI_BTN_JOIN_7:fgui.GButton;
	public UI_BTN_JOIN_8:fgui.GButton;
	public UI_BTN_JOIN_9:fgui.GButton;
	public UI_BTN_JOIN_CLEAR:fgui.GButton;
	public UI_BTN_JOIN_0:fgui.GButton;
	public UI_BTN_JOIN:fgui.GButton;
	public UI_TXT_ROOMID:fgui.GTextField;
	public static URL:string = "ui://s0qy2rl1nomu2";

	public static packageName:string = "privateRoom";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompPrivateJoin.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("privateRoom", "CompPrivateJoin") as FGUICompPrivateJoin;

			view.makeFullScreen();
			FGUICompPrivateJoin.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompPrivateJoin.instance = null;
	}
	public static hideView():void {
		FGUICompPrivateJoin.instance && FGUICompPrivateJoin.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompPrivateJoin {
		return <FGUICompPrivateJoin>(fgui.UIPackage.createObject("privateRoom", "CompPrivateJoin"));
	}

	protected onConstruct():void {
		this.UI_BTN_JOIN_1 = <fgui.GButton>(this.getChildAt(1));
		this.UI_BTN_JOIN_1.onClick(this.onBtnJoin1, this);
		this.UI_BTN_JOIN_2 = <fgui.GButton>(this.getChildAt(2));
		this.UI_BTN_JOIN_2.onClick(this.onBtnJoin2, this);
		this.UI_BTN_JOIN_3 = <fgui.GButton>(this.getChildAt(3));
		this.UI_BTN_JOIN_3.onClick(this.onBtnJoin3, this);
		this.UI_BTN_JOIN_4 = <fgui.GButton>(this.getChildAt(4));
		this.UI_BTN_JOIN_4.onClick(this.onBtnJoin4, this);
		this.UI_BTN_JOIN_5 = <fgui.GButton>(this.getChildAt(5));
		this.UI_BTN_JOIN_5.onClick(this.onBtnJoin5, this);
		this.UI_BTN_JOIN_6 = <fgui.GButton>(this.getChildAt(6));
		this.UI_BTN_JOIN_6.onClick(this.onBtnJoin6, this);
		this.UI_BTN_JOIN_7 = <fgui.GButton>(this.getChildAt(7));
		this.UI_BTN_JOIN_7.onClick(this.onBtnJoin7, this);
		this.UI_BTN_JOIN_8 = <fgui.GButton>(this.getChildAt(8));
		this.UI_BTN_JOIN_8.onClick(this.onBtnJoin8, this);
		this.UI_BTN_JOIN_9 = <fgui.GButton>(this.getChildAt(9));
		this.UI_BTN_JOIN_9.onClick(this.onBtnJoin9, this);
		this.UI_BTN_JOIN_CLEAR = <fgui.GButton>(this.getChildAt(10));
		this.UI_BTN_JOIN_CLEAR.onClick(this.onBtnJoinClear, this);
		this.UI_BTN_JOIN_0 = <fgui.GButton>(this.getChildAt(11));
		this.UI_BTN_JOIN_0.onClick(this.onBtnJoin0, this);
		this.UI_BTN_JOIN = <fgui.GButton>(this.getChildAt(12));
		this.UI_BTN_JOIN.onClick(this.onBtnJoin, this);
		this.UI_TXT_ROOMID = <fgui.GTextField>(this.getChildAt(13));
	}
	onBtnJoin1():void{};
	onBtnJoin2():void{};
	onBtnJoin3():void{};
	onBtnJoin4():void{};
	onBtnJoin5():void{};
	onBtnJoin6():void{};
	onBtnJoin7():void{};
	onBtnJoin8():void{};
	onBtnJoin9():void{};
	onBtnJoinClear():void{};
	onBtnJoin0():void{};
	onBtnJoin():void{};
}
fgui.UIObjectFactory.setExtension(FGUICompPrivateJoin.URL, FGUICompPrivateJoin);