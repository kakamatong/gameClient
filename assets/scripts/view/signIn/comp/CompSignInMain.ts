import * as fgui from "fairygui-cc";
import { ViewClass } from '../../../frameworks/Framework';
import FGUICompSignInMain from "../../../fgui/signIn/FGUICompSignInMain";
import { SignIn } from "../../../modules/SignIn";
import { SignInConfig } from "../data/SignInconfig";
import { TipsView } from "../../common/TipsView";
import FGUICompSignItem from "../../../fgui/signIn/FGUICompSignItem";

/**
 * 签到视图
 */
@ViewClass()
export class CompSignInMain extends FGUICompSignInMain { 
    // 签到配置
    private _signInConfig: Array<SignInConfig> = [];
    // 签到状态
    private _signInStatus: Array<number> = [];
    // 当前签到日志
    private _nowIndex: number = 0;
    show(args:any) {
        this.UI_LIST_SIGN.itemRenderer = this.itemRenderer.bind(this);
        this.initData();
    }

    /**
     * 初始化UI
     */
    initUI():void{
        if(!this._nowIndex){
            TipsView.showView({content:`签到数据错误`})
            return;
        }

        this.UI_LIST_SIGN.numItems = this._signInConfig.length;
    }

    /**
     * 初始化数据
     */
    initData():void{
        const funcSignData = (b:boolean, data:any)=>{
            if(!b)return;
            this._signInConfig = data.signInConfig;
            this._signInStatus =data.signStatus;
            this._nowIndex = data.signInIndex;
            this.initUI();
        }
        const req = new SignIn();
        req.reqSignData(funcSignData);
    }

    /**
     * 列表渲染
     * @param index 
     * @param obj 
     */
    itemRenderer(index: number, obj: fgui.GObject):void{
        const config = this._signInConfig[index];
        const item = obj as FGUICompSignItem;
        item.UI_TXT_NUM.text = `x${config.richNums[0]}`
        item.UI_TXT_DAY.text = `第${index + 1}天`
        item.ctrl_icon.selectedIndex = this.getIconIndex(index);
        item.ctrl_geted.selectedIndex = this._signInStatus[index] ? 1 : 0;
        item.ctrl_today.selectedIndex = index == this._nowIndex - 1 ? 1 : 0;
    }

    /**
     * 获取图标索引
     * @param day 
     */
    getIconIndex(day:number):number{
        if(day < 3) return 0;
        if(day < 5) return 1;
        return 2;
    }

    /**
     * 补签按钮点击
     */
    onBtnAdd():void{
        console.log("补签");
    }

    /**
     * 签到按钮点击
     */
    onBtnGet():void{
        console.log("签到");
    }

    /**
     * 多倍签到按钮点击
     */
    onBtnMult():void{
        console.log("多倍签到");
    }

    /**
     * 关闭按钮点击
     */
    onBtnClose(): void {
        CompSignInMain.hideView()
    }
}
fgui.UIObjectFactory.setExtension(CompSignInMain.URL, CompSignInMain);