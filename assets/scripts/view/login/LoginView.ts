/**
 * @file LoginView.ts
 * @description 登录视图：处理用户登录和隐私协议
 * @category 登录视图
 */

import { sys } from 'cc';
import { LOCAL_KEY } from '../../datacenter/InterfaceConfig';
import FGUILoginView from '../../fgui/login/FGUILoginView';
import * as fgui from "fairygui-cc";
import { LobbyView } from '../lobby/LobbyView';
import { PrivacyView } from '../privacy/PrivacyView';
import { MiniGameUtils } from '../../frameworks/utils/sdk/MiniGameUtils';
import { PackageLoad, ViewClass } from '../../frameworks/Framework';

/**
 * @class LoginView
 * @description 登录视图，处理用户登录流程和隐私协议
 * @category 登录视图
 */
@ViewClass()
@PackageLoad(['common'])
export class LoginView extends FGUILoginView {
    /**
     * @description 显示登录视图
     * @param data 视图数据
     */
    show(data?: any):void{
        this.showPrivacy()
    }

    /**
     * @description 开始游戏按钮点击事件
     */
    onBtnStart(): void {
        const agree = sys.localStorage.getItem(LOCAL_KEY.AGREE_PRIVACY) ?? 0;
        if (agree) {
            this.showLobby()
        }else{
            this.showPrivacy()
        }
    }

    /**
     * @description 显示隐私协议
     */
    showPrivacy():void{
        if (!MiniGameUtils.instance.isThirdPlatform()) {
            sys.localStorage.setItem(LOCAL_KEY.AGREE_PRIVACY, 1)
            this.showLobby()
        }
        //显示隐私弹窗
        MiniGameUtils.instance.requirePrivacyAuthorize((b:boolean)=>{
            if (b) {
                sys.localStorage.setItem(LOCAL_KEY.AGREE_PRIVACY, 1)
                this.showLobby()
            }
        }, (resolve)=>{
            PrivacyView.showView({resolvefunc: resolve})
        })
    }

    /**
     * @description 显示大厅
     */
    showLobby():void{
        LobbyView.showView()
        LoginView.hideView()
    }
}
fgui.UIObjectFactory.setExtension(LoginView.URL, LoginView);