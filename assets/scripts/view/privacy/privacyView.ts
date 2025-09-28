import { sys } from 'cc';
import { LOCAL_KEY } from '../../datacenter/interfaceConfig';
import FGUIPrivacyView from '../../fgui/privacy/FGUIPrivacyView';
import * as fgui from "fairygui-cc";

export class PrivacyView extends FGUIPrivacyView {
    private _resolve:any | null = null;
    show(data?: any):void{
        this._resolve = data.resolve
        this._resolve && this._resolve({event:'exposureAuthorization'})
    }
    onBtnAgree(): void {
        this._resolve && this._resolve({event:'agree'})
        PrivacyView.hideView()
    }

    onBtnRefuse(): void {
        this._resolve && this._resolve({event:'disagree'})
        PrivacyView.hideView()
    }

    onBtnPrivacy(): void {
        // 跳转隐私协议
        
    }
}
fgui.UIObjectFactory.setExtension(PrivacyView.URL, PrivacyView);