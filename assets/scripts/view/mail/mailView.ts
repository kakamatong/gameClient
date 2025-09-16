import FGUIMatchView from '../../fgui/mail/FGUIMailView';
import * as fgui from "fairygui-cc";

export class MailView extends FGUIMatchView {


    onBtnClose(): void {
        MailView.hideView();
    }
}
fgui.UIObjectFactory.setExtension(MailView.URL, MailView);