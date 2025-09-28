import FGUIUserCenterView from '../../fgui/userCenter/FGUIUserCenterView';
import * as fgui from "fairygui-cc";
import { UserGameRecord } from '../../modules/userGameRecord';
import FGUICompHead from '../../fgui/common/FGUICompHead';
import { DataCenter } from '../../datacenter/datacenter';
import { MiniGameUtils } from '../../frameworks/utils/sdk/miniGameUtils';
import { TipsView } from '../common/tipsView';
import { UserData } from '../../modules/userData';

export class UserCenterView extends FGUIUserCenterView {
    show(data?: any):void{
        const gameRecords = new UserGameRecord()
        const func = (data:any)=>{
            this.UI_TXT_WIN.text = data.win;
            this.UI_TXT_LOSE.text = data.lose;
            this.UI_TXT_DRAW.text = data.draw;
            const rate = data.win / (data.win + data.lose + data.draw) * 100;
            this.UI_TXT_RATE.text = `${rate.toFixed(2)}%`;
        }
        gameRecords.req(func)

        this.updateUserInfo()
        this.createUserInfoBtn()
    }

    updateUserInfo():void{
        this.UI_TXT_NICKNAME.text = DataCenter.instance.userData?.nickname ?? ''
        this.UI_TXT_USERID.text = `${DataCenter.instance.userid ?? 0}`;
        (this.UI_COMP_HEAD as FGUICompHead).UI_LOADER_HEAD.url = DataCenter.instance.headurl
    }

    onBtnClose(): void {
        UserCenterView.hideView()
    }

    createUserInfoBtn(){
        const screenWidth = MiniGameUtils.instance.getSystemInfoSync().screenWidth
        const screenHeight = MiniGameUtils.instance.getSystemInfoSync().screenHeight
        const x = this.UI_BTN_WECHAT.x
        const y = this.UI_BTN_WECHAT.y
        const width = this.UI_BTN_WECHAT.width
        const height = this.UI_BTN_WECHAT.height
        const left = x / fgui.GRoot.inst.width * screenWidth
        const top = y / fgui.GRoot.inst.height * screenHeight
        const width2 = width / fgui.GRoot.inst.width * screenWidth
        const height2 = height / fgui.GRoot.inst.height * screenHeight
        MiniGameUtils.instance.createUserInfoButton({
            left: left,
            top: top,
            width: width2,
            height: height2,
            callBack: (userInfo:any)=>{
                if (userInfo) {
                    TipsView.showView({content:"已更新"})
                    if (DataCenter.instance.userData) {
                        DataCenter.instance.userData.nickname = userInfo.nickName
                        DataCenter.instance.headurl = userInfo.avatarUrl
                        this.updateUserInfo()
                        const userData = new UserData()
                        userData.updateUserNameAndHeadurl(userInfo.nickName, userInfo.avatarUrl)
                    }
                }else{
                    TipsView.showView({content:"用户信息获取失败"})
                    console.log("用户信息获取失败/拒绝授权")
                }
            }

        })
    }

    onBtnWechat(): void {
        
    }

    protected onDestroy(): void {
        super.onDestroy()
        MiniGameUtils.instance.destroyUserInfoButton()
    }
}
fgui.UIObjectFactory.setExtension(UserCenterView.URL, UserCenterView);