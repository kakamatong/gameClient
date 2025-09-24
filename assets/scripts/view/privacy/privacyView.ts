import { sys } from 'cc';
import { LOCAL_KEY } from '../../datacenter/interfaceConfig';
import FGUIPrivacyView from '../../fgui/privacy/FGUIPrivacyView';
import * as fgui from "fairygui-cc";

export class PrivacyView extends FGUIPrivacyView {
    show(data?: any):void{
        
    }
    onBtnAgree(): void {
        sys.localStorage.setItem(LOCAL_KEY.AGREE_PRIVACY, 1)
        PrivacyView.hideView()
    }

    onBtnRefuse(): void {
        PrivacyView.hideView()
    }

    onBtnPrivacy(): void {
        // 跳转隐私协议
    }

    onBtnUser(): void {
        // 跳转用户协议
    }
    
}
fgui.UIObjectFactory.setExtension(PrivacyView.URL, PrivacyView);