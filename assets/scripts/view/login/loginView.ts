import { sys } from 'cc';
import { LOCAL_KEY } from '../../datacenter/interfaceConfig';
import FGUILoginView from '../../fgui/login/FGUILoginView';
import * as fgui from "fairygui-cc";
import { LobbyView } from '../lobby/lobbyView';

export class LoginView extends FGUILoginView {
    show(data?: any):void{
        
    }

    onBtnStart(): void {
        const agree = sys.localStorage.getItem(LOCAL_KEY.AGREE_PRIVACY) ?? 0;
        if (agree) {
            LobbyView.showView()
            LoginView.hideView()
        }else{
            //显示隐私弹窗
        }
    }
}
fgui.UIObjectFactory.setExtension(LoginView.URL, LoginView);