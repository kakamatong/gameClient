import * as fgui from "fairygui-cc";
import { ViewClass } from '../../frameworks/Framework';
import FGUISignInView from "../../fgui/signIn/FGUISignInView";

/**
 * 签到视图
 */
@ViewClass()
export class SignInView extends FGUISignInView { 
    show(args:any) {
        this.UI_MAIN_NODE.show(args)
    }
}
fgui.UIObjectFactory.setExtension(SignInView.URL, SignInView);