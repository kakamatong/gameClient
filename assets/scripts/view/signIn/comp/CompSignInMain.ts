import * as fgui from "fairygui-cc";
import { LogColors, ViewClass } from '../../../frameworks/Framework';
import FGUICompSignInMain from "../../../fgui/signIn/FGUICompSignInMain";
import { SignIn } from "../../../modules/SignIn";
import { SignInConfig } from "../data/SignInconfig";
import { TipsView } from "../../common/TipsView";
import FGUICompSignItem from "../../../fgui/signIn/FGUICompSignItem";
import { SignInView } from "../SignInView";
import { UserRiches } from "../../../modules/UserRiches";
import { AwardView } from "../../award/AwardView";

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
    // 签到模块
    private _reqSign: SignIn | null = null

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
        this.UI_LIST_SIGN.scrollToView(this._nowIndex - 1, true)

        if(this._signInStatus[this._nowIndex - 1] > 0){
            this.ctrl_geted.selectedIndex = 1;
        }
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

        this._reqSign = new SignIn();
        this._reqSign.reqSignData(funcSignData);
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
    onBtnFill():void{
        console.log("补签");
        const func = (b:boolean, data:any) =>{
            console.log(b, data);
            if(!b){
                TipsView.showView({content:`签到失败`})
                return;
            }
            console.log(LogColors.green("补签成功"))
            // todo: 更新签到数据
            this._signInStatus = data.status;
            this.initUI();
            // 用户财富
            const userRiches = new UserRiches()
            userRiches.req()
            this.showAward({awards:data.awards, noticeid:data.noticeid})
        }
        this._reqSign && this._reqSign.reqFillSignIn(func)
    }

    /**
     * 显示奖励
     * @param data 签到奖励数据
     */
    showAward(data:{awards:{richTypes:number[], richNums:number[]}, noticeid:number}):void{
        const newData = {
            ids: data.awards.richTypes,
            nums: data.awards.richNums,
            noticeid: data.noticeid
        }
        AwardView.showView(newData)
    }

    /**
     * 签到按钮点击
     */
    onBtnGet():void{
        this.signIn(0)
    }

    /**
     * 多倍签到按钮点击
     */
    onBtnMult():void{
        console.log("多倍签到");
        this.signIn(1)
    }

    /**
     * 签到
     * @param mult 签到倍数，0为普通签到，1为多倍签到
     */
    signIn(mult:number):void{
        const func = (b:boolean, data:any) =>{
            console.log(b, data);
            if(!b){
                TipsView.showView({content:`签到失败`})
                return;
            }
            console.log(LogColors.green("签到成功"))
            // todo: 更新签到数据
            this._signInStatus = data.status;
            this.initUI();
            // 用户财富
            const userRiches = new UserRiches()
            userRiches.req()
            this.showAward({awards:data.awards, noticeid:data.noticeid})
        }
        this._reqSign && this._reqSign.reqSignIn(mult,func)
    }

    /**
     * 关闭按钮点击
     */
    onBtnClose(): void {
        SignInView.hideView()
    }
}
fgui.UIObjectFactory.setExtension(CompSignInMain.URL, CompSignInMain);