import FGUIUserCenterView from '../../fgui/userCenter/FGUIUserCenterView';
import * as fgui from "fairygui-cc";
import { UserGameRecord } from '../../modules/userGameRecord';
import FGUICompHead from '../../fgui/common/FGUICompHead';
import { DataCenter } from '../../datacenter/Datacenter';
import { MiniGameUtils } from '../../frameworks/utils/sdk/MiniGameUtils';
import { TipsView } from '../common/tipsView';
import { UserData } from '../../modules/userData';
import { DispatchEvent } from '../../frameworks/Framework';
import { AudioSourceComponent, SpriteFrame, sys } from 'cc';
import { ENUM_POP_MESSAGE_TYPE, LOCAL_KEY, RICH_TYPE } from '../../datacenter/InterfaceConfig';
import { PopMessageView } from '../common/popMessageView';
import { RevokeAccount } from '../../modules/revokeAccount';
import { LobbySocketManager } from '../../frameworks/LobbySocketManager';

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
        this.updateSound()
    }

    updateSound():void{ 
        this.updateBgSound()
        this.updateEffectSound()
    }

    updateBgSound():void{
        let open = 1;
        const localKey = sys.localStorage.getItem(LOCAL_KEY.BG_MUSIC_OPEN)
        if (localKey === null || localKey === undefined || localKey === '') {
            open = 1
        }else{
            open = parseInt(localKey)
        }

        this.UI_BTN_BGMUSIC.ctrl_status.selectedIndex = open
    }

    updateEffectSound():void{ 
        let open = 1;
        const localKey = sys.localStorage.getItem(LOCAL_KEY.EFFECT_SOUND_OPEN)
        if (localKey === null || localKey === undefined || localKey === '') {
            open = 1
        }else{
            open = parseInt(localKey)
        }
        this.UI_BTN_EFFECT.ctrl_status.selectedIndex = open
    }


    updateUserInfo():void{
        this.UI_TXT_NICKNAME.text = DataCenter.instance.userData?.nickname ?? ''
        this.UI_TXT_USERID.text = `${DataCenter.instance.userid ?? 0}`;
        (this.UI_COMP_HEAD as FGUICompHead).UI_LOADER_HEAD.url = DataCenter.instance.headurl
        const cp = DataCenter.instance.getRichByType(RICH_TYPE.COMBAT_POWER) ?? {richType:RICH_TYPE.COMBAT_POWER, richNums:0}
        this.UI_TXT_CP.text =`${cp.richNums}`
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
                        const rou = `?type=${DataCenter.instance.userid}.jpg`
                        const headUrl = userInfo.avatarUrl + rou
                        DataCenter.instance.userData.nickname = userInfo.nickName
                        DataCenter.instance.headurl = headUrl
                        this.updateUserInfo()
                        const userData = new UserData()
                        userData.updateUserNameAndHeadurl(userInfo.nickName, headUrl)
                        DispatchEvent('userData',DataCenter.instance.userData)
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

    onBtnDelAcc(): void {
        const func2 = ()=>{
            const func3 = (data:any)=>{
                if (data.code === 1) {
                    TipsView.showView({content:"申请注销成功"})
                }else if (data.code === 2) {
                    const func4 = ()=>{ 
                        const func5 = (data:any)=>{
                            if (data.code === 1) {
                                TipsView.showView({content:"申请取消成功"})
                            }else{
                                TipsView.showView({content:"申请取消失败"})
                            }
                        }
                        const revokeCancel = new RevokeAccount()
                        revokeCancel.reqCancelRevokeAccount(func5)
                    }
                    PopMessageView.showView({title:'温馨提示', content:'已经在注销流程中，是否申请取消', type:ENUM_POP_MESSAGE_TYPE.NUM2, sureBack: func4})
                }else if (data.code === 3) { 
                    TipsView.showView({content:"注销成功, 请重新打开"})
                    LobbySocketManager.instance.close()
                }
                else{
                    TipsView.showView({content:"申请注销失败"})
                }
                
            }
            const revoke = new RevokeAccount()
            revoke.reqRevokeAccount(func3)
        }
        PopMessageView.showView({title:'温馨提示', content:'注销账号将会清除所有游戏数据，且有15天冷静期，15天后点击此按钮可立马注销，确实注销账号？', type:ENUM_POP_MESSAGE_TYPE.NUM2, sureBack: func2})
    }

    onBtnBgmusic(): void {
        let open = 1;
        const localKey = sys.localStorage.getItem(LOCAL_KEY.BG_MUSIC_OPEN)
        if (localKey === null || localKey === undefined || localKey === '') {
            open = 1
        }else{
            open = parseInt(localKey)
        }

        const as = fgui.GRoot.inst.node.getComponent(AudioSourceComponent)
        if (open) {
            as && (as.volume = 0)
            sys.localStorage.setItem(LOCAL_KEY.BG_MUSIC_OPEN, 0)
        }else{
            as && (as.volume = 1)
            sys.localStorage.setItem(LOCAL_KEY.BG_MUSIC_OPEN, 1)
        }

        this.updateBgSound()
    }

    onBtnEffect(): void {
        let open = 1;
        const localKey = sys.localStorage.getItem(LOCAL_KEY.EFFECT_SOUND_OPEN)
        if (localKey === null || localKey === undefined || localKey === '') {
            open = 1
        }else{
            open = parseInt(localKey)
        }

        if (open) {
            fgui.GRoot.inst.volumeScale = 0
            sys.localStorage.setItem(LOCAL_KEY.EFFECT_SOUND_OPEN, 0)
        }else{
            fgui.GRoot.inst.volumeScale = 1
            sys.localStorage.setItem(LOCAL_KEY.EFFECT_SOUND_OPEN, 1)
        }
        this.updateEffectSound()
    }

    protected onDestroy(): void {
        super.onDestroy()
        MiniGameUtils.instance.destroyUserInfoButton()
    }
}
fgui.UIObjectFactory.setExtension(UserCenterView.URL, UserCenterView);