import { sys } from 'cc';
import { LOCAL_KEY } from '../../datacenter/InterfaceConfig';
import FGUILoginView from '../../fgui/login/FGUILoginView';
import * as fgui from "fairygui-cc";
import { LobbyView } from '../lobby/LobbyView';
import { PrivacyView } from '../privacy/PrivacyView';
import { MiniGameUtils } from '../../frameworks/utils/sdk/MiniGameUtils';

export class LoginView extends FGUILoginView {
    show(data?: any):void{
        this.showPrivacy()
    }

    onBtnStart(): void {
        const agree = sys.localStorage.getItem(LOCAL_KEY.AGREE_PRIVACY) ?? 0;
        if (agree) {
            this.showLobby()
        }else{
            this.showPrivacy()
        }
    }

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

    showLobby():void{
        LobbyView.showView()
        LoginView.hideView()
    }
}
fgui.UIObjectFactory.setExtension(LoginView.URL, LoginView);