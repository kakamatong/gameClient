
import FGUIMatchView from '../../fgui/match/FGUIMatchView';
import * as fgui from "fairygui-cc";
import { Match } from '../../modules/match';
import { ENUM_POP_MESSAGE_TYPE } from '../../datacenter/interfaceConfig';
import { PopMessageView } from '../common/popMessageView';
export class MatchView extends FGUIMatchView {
    show(data:any){
        this.ctrl_btn_join.selectedIndex = 0;
    }

    onBtnCancel(): void {
        const func = (b:boolean, data?:any)=>{
            if (b) {
                // 显示匹配view
                MatchView.hideView();
            }else{
                PopMessageView.showView({title:'温馨提示', content:'离开匹配失败！', type:ENUM_POP_MESSAGE_TYPE.NUM1SURE})
            }
        }
        Match.instance.reqLeave(func);
    }
}
fgui.UIObjectFactory.setExtension(MatchView.URL, MatchView);