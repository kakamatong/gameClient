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
import { MiniGameUtils } from "../../../frameworks/utils/sdk/MiniGameUtils";
import { REWORD_VIDEOAD_CODE } from "../../../frameworks/config/Config";
import { LoadingView } from "../../common/LoadingView";

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

        SignIn.instance.reqSignData(funcSignData);
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
        item.ctrl_geted.selectedIndex = this._signInStatus[index] ? 1 : (index >= this._nowIndex - 1 ? 0 : 2);
        item.ctrl_today.selectedIndex = index == this._nowIndex - 1 ? 1 : 0;

        item.clearClick()
        item.UI_BTN_FILL.onClick(()=>{
            this.onBtnFill(index + 1)
        });
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
    onBtnFill(index:number):void{
        console.log("补签");
        this.playAdVideo(()=>{
            this.fillSignIn(index)
        })
    }

    /**
     * 显示奖励
     * @param data 签到奖励数据
     */
    showAward(data:{awards:{richTypes:number[], richNums:number[], richNums2:number[]}, noticeid:number}, mult:number):void{
        const nums = mult == 1 ? data.awards.richNums2 : data.awards.richNums;
        const newData = {
            ids: data.awards.richTypes,
            nums: nums,
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
        this.playAdVideo(()=>{
            this.signIn(1)
        })
    }

    /**
     * 播放广告视频
     * @param successCallBack 
     */
    playAdVideo(successCallBack:()=>void):void{
        LoadingView.showView({content:"载入中...", time:12});
        MiniGameUtils.instance.showRewardedVideoAd("adunit-21e58350c401d5b6", (code:number)=>{
            LoadingView.hideView();
            console.log(code);
            if(code == REWORD_VIDEOAD_CODE.SUCCESS){
                successCallBack()
            }else if(code == REWORD_VIDEOAD_CODE.NOT_OVER){
                TipsView.showView({content:`看完视频才能获取奖励哦`})
            }else{
                TipsView.showView({content:`视频广告播放失败`})
            }
        })
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
            UserRiches.instance.req()
            this.showAward({awards:data.awards, noticeid:data.noticeid}, mult)
        }
        SignIn.instance.reqSignIn(mult,func)
    }

    /**
     * 补签
     * @param index 天数标识
     */
    fillSignIn(index:number):void{
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
            UserRiches.instance.req()
            this.showAward({awards:data.awards, noticeid:data.noticeid}, 0)
        }
        SignIn.instance.reqFillSignIn(index,func)
    }

    /**
     * 关闭按钮点击
     */
    onBtnClose(): void {
        SignInView.hideView()
    }
}
fgui.UIObjectFactory.setExtension(CompSignInMain.URL, CompSignInMain);