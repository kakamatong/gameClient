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
        this.UI_GROUP_PRIVACY.visible = true
        this.ctrl_privacy.selectedIndex = 0
    }

    onBtnClose(): void {
        this.UI_GROUP_PRIVACY.visible = false
    }

    onBtnUser(): void {
        // 跳转用户协议
        this.UI_GROUP_PRIVACY.visible = true
        this.ctrl_privacy.selectedIndex = 1
    }
    
}
fgui.UIObjectFactory.setExtension(PrivacyView.URL, PrivacyView);