import FGUIPrivacyView from '../../fgui/privacy/FGUIPrivacyView';
import * as fgui from "fairygui-cc";
import { MiniGameUtils } from '../../frameworks/utils/sdk/MiniGameUtils';

export class PrivacyView extends FGUIPrivacyView {
    private _resolve:Function | null = null;
    show(data?: any):void{
        this._resolve = data.resolvefunc
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
        MiniGameUtils.instance.openPrivacyContract()
    }
}
fgui.UIObjectFactory.setExtension(PrivacyView.URL, PrivacyView);