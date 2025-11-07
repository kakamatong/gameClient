import FGUIUserCenterView from '../../fgui/userCenter/FGUIUserCenterView';
import * as fgui from "fairygui-cc";
import { UserGameRecord } from '../../modules/UserGameRecord';
import FGUICompHead from '../../fgui/common/FGUICompHead';
import { DataCenter } from '../../datacenter/Datacenter';
import { MiniGameUtils } from '../../frameworks/utils/sdk/MiniGameUtils';
import { TipsView } from '../common/TipsView';
import { UserData } from '../../modules/UserData';
import { DispatchEvent } from '../../frameworks/Framework';
import { ENUM_POP_MESSAGE_TYPE, RICH_TYPE } from '../../datacenter/InterfaceConfig';
import { PopMessageView } from '../common/PopMessageView';
import { RevokeAccount } from '../../modules/RevokeAccount';
import { LobbySocketManager } from '../../frameworks/LobbySocketManager';
import { SoundManager } from '../../frameworks/SoundManager';

/**
 * @class UserCenterView
 * @description 用户中心界面视图类，继承自FGUI生成的FGUIUserCenterView类
 * @extends FGUIUserCenterView
 */
export class UserCenterView extends FGUIUserCenterView {
    /**
     * @method show
     * @description 显示用户中心界面时的初始化操作
     * @param {any} data - 传递给界面的数据
     */
    show(data?: any):void{
        // 请求用户游戏记录数据
        const gameRecords = new UserGameRecord()
        const func = (data:any)=>{
            // 更新胜场、败场、平局和胜率显示
            this.UI_TXT_WIN.text = data.win;
            this.UI_TXT_LOSE.text = data.lose;
            this.UI_TXT_DRAW.text = data.draw;
            const total = data.win + data.lose + data.draw;
            if (total) {
                const rate = data.win / (total) * 100;
                this.UI_TXT_RATE.text = `${rate.toFixed(1)}%`;
            }else{
                this.UI_TXT_RATE.text = `--`;
            }
            
        }
        gameRecords.req(DataCenter.instance.userid, func)

        // 更新用户信息和声音设置
        this.updateUserInfo()
        this.createUserInfoBtn()
        this.updateSound()
    }

    /**
     * @method updateSound
     * @description 更新声音设置显示状态
     */
    updateSound():void{ 
        // 获取背景音乐和音效的开关状态
        const bOpenMusic = SoundManager.instance.getSoundMusicOpen();
        const bOpenEffect = SoundManager.instance.getSoundEffectOpen();
        // 更新界面显示
        this.updateBgSound(bOpenMusic)
        this.updateEffectSound(bOpenEffect)
    }

    /**
     * @method updateBgSound
     * @description 更新背景音乐按钮的显示状态
     * @param {number} open - 背景音乐开关状态（0-关闭，1-开启）
     */
    updateBgSound(open:number):void{
        this.UI_BTN_BGMUSIC.ctrl_status.selectedIndex = open
    }

    /**
     * @method updateEffectSound
     * @description 更新音效按钮的显示状态
     * @param {number} open - 音效开关状态（0-关闭，1-开启）
     */
    updateEffectSound(open:number):void{ 
        this.UI_BTN_EFFECT.ctrl_status.selectedIndex = open
    }

    /**
     * @method updateUserInfo
     * @description 更新用户信息显示
     */
    updateUserInfo():void{
        // 显示用户昵称和ID
        this.UI_TXT_NICKNAME.text = DataCenter.instance.userData?.nickname ?? ''
        this.UI_TXT_USERID.text = `${DataCenter.instance.userid ?? 0}`;
        // 显示用户头像
        (this.UI_COMP_HEAD as FGUICompHead).UI_LOADER_HEAD.url = DataCenter.instance.headurl
        // 显示战力值
        const cp = DataCenter.instance.getRichByType(RICH_TYPE.COMBAT_POWER) ?? {richType:RICH_TYPE.COMBAT_POWER, richNums:0}
        this.UI_TXT_CP.text =`${cp.richNums}`
    }

    /**
     * @method onBtnClose
     * @description 关闭按钮点击事件处理
     */
    onBtnClose(): void {
        UserCenterView.hideView()
    }

    /**
     * @method createUserInfoBtn
     * @description 创建微信用户信息按钮，用于获取用户头像和昵称
     */
    createUserInfoBtn(){
        // 获取屏幕尺寸信息
        const screenWidth = MiniGameUtils.instance.getSystemInfoSync().screenWidth
        const screenHeight = MiniGameUtils.instance.getSystemInfoSync().screenHeight
        // 获取按钮在FGUI中的位置和尺寸
        const x = this.UI_BTN_WECHAT.x
        const y = this.UI_BTN_WECHAT.y
        const width = this.UI_BTN_WECHAT.width
        const height = this.UI_BTN_WECHAT.height
        // 计算按钮在实际屏幕中的位置和尺寸
        const left = x / fgui.GRoot.inst.width * screenWidth
        const top = y / fgui.GRoot.inst.height * screenHeight
        const width2 = width / fgui.GRoot.inst.width * screenWidth
        const height2 = height / fgui.GRoot.inst.height * screenHeight
        // 创建微信用户信息按钮
        MiniGameUtils.instance.createUserInfoButton({
            left: left,
            top: top,
            width: width2,
            height: height2,
            callBack: (userInfo:any)=>{
                if (userInfo) {
                    // 用户授权成功，更新用户信息
                    TipsView.showView({content:"已更新"})
                    if (DataCenter.instance.userData) {
                        // 构造头像URL并添加随机参数防止缓存
                        const rou = `?type=${DataCenter.instance.userid}.jpg`
                        const headUrl = userInfo.avatarUrl + rou
                        // 更新数据中心中的用户信息
                        DataCenter.instance.userData.nickname = userInfo.nickName
                        DataCenter.instance.headurl = headUrl
                        // 更新界面显示
                        this.updateUserInfo()
                        // 向服务器更新用户信息
                        const userData = new UserData()
                        userData.updateUserNameAndHeadurl(userInfo.nickName, headUrl)
                        // 派发用户数据更新事件
                        DispatchEvent('userData',DataCenter.instance.userData)
                    }
                }else{
                    // 用户拒绝授权或获取失败
                    TipsView.showView({content:"用户信息获取失败"})
                    console.log("用户信息获取失败/拒绝授权")
                }
            }

        })
    }

    /**
     * @method onBtnWechat
     * @description 微信按钮点击事件处理（暂未实现功能）
     */
    onBtnWechat(): void {
        
    }

    /**
     * @method onBtnDelAcc
     * @description 注销账号按钮点击事件处理
     */
    onBtnDelAcc(): void {
        // 确认注销操作的回调函数
        const func2 = ()=>{
            // 发送注销请求的回调函数
            const func3 = (data:any)=>{
                if (data.code === 1) {
                    // 注销申请成功
                    TipsView.showView({content:"申请注销成功"})
                }else if (data.code === 2) {
                    // 已在注销流程中，询问是否取消
                    const func4 = ()=>{ 
                        // 取消注销申请的回调函数
                        const func5 = (data:any)=>{
                            if (data.code === 1) {
                                // 取消成功
                                TipsView.showView({content:"申请取消成功"})
                            }else{
                                // 取消失败
                                TipsView.showView({content:"申请取消失败"})
                            }
                        }
                        // 发送取消注销请求
                        const revokeCancel = new RevokeAccount()
                        revokeCancel.reqCancelRevokeAccount(func5)
                    }
                    // 显示确认取消注销的弹窗
                    PopMessageView.showView({title:'温馨提示', content:'已经在注销流程中，是否申请取消', type:ENUM_POP_MESSAGE_TYPE.NUM2, sureBack: func4})
                }else if (data.code === 3) { 
                    // 注销成功，提示重新打开游戏
                    TipsView.showView({content:"注销成功, 请重新打开"})
                    LobbySocketManager.instance.close()
                }
                else{
                    // 注销申请失败
                    TipsView.showView({content:"申请注销失败"})
                }
                
            }
            // 发送注销请求
            const revoke = new RevokeAccount()
            revoke.reqRevokeAccount(func3)
        }
        // 显示确认注销的弹窗
        PopMessageView.showView({title:'温馨提示', content:'注销账号将会清除所有游戏数据，且有15天冷静期，15天后点击此按钮可立马注销，确实注销账号？', type:ENUM_POP_MESSAGE_TYPE.NUM2, sureBack: func2})
    }

    /**
     * @method onBtnBgmusic
     * @description 背景音乐开关按钮点击事件处理
     */
    onBtnBgmusic(): void {
        // 切换背景音乐开关状态
        const bOpen = SoundManager.instance.changeSoundMusic()
        // 更新界面显示
        this.updateBgSound(bOpen)
    }

    /**
     * @method onBtnEffect
     * @description 音效开关按钮点击事件处理
     */
    onBtnEffect(): void {
        // 切换音效开关状态
        const bOpen = SoundManager.instance.changeSoundEffect()
        // 更新界面显示
        this.updateEffectSound(bOpen)
    }

    /**
     * @method onDestroy
     * @description 界面销毁时的清理操作
     * @protected
     */
    protected onDestroy(): void {
        super.onDestroy()
        // 销毁微信用户信息按钮
        MiniGameUtils.instance.destroyUserInfoButton()
    }
}
fgui.UIObjectFactory.setExtension(UserCenterView.URL, UserCenterView);