import { MatchView } from 'db://assets/scripts/view/match/matchView';
import FGUIResultView from '../../../../fgui/game10001Result/FGUIResultView';
import * as fgui from "fairygui-cc";
import { PopMessageView } from 'db://assets/scripts/view/common/popMessageView';
import { Match } from 'db://assets/scripts/modules/match';
import { ENUM_POP_MESSAGE_TYPE } from 'db://assets/scripts/datacenter/interfaceConfig';

export class ResultView extends FGUIResultView { 
    show(data?:any){
        this.ctrl_flag.selectedIndex = data?.flag ?? 0;
        this.act.play(()=>{
            this.UI_COMP_ACT.ctrl_show.selectedIndex = 1
        })
    }

    onBtnBack(): void {
        ResultView.hideView()
    }

    onBtnCon(): void {
        const func = (b:boolean, data?:any)=>{
            if (b) {
                // 显示匹配view
                MatchView.showView();
            }else{
                if (data && data.gameid && data.roomid) {
                    const func2 =()=>{
                        //返回房间
                    }
                    PopMessageView.showView({title:'温馨提示', content:'您已经在房间中，是否返回？', type:ENUM_POP_MESSAGE_TYPE.NUM2, sureBack: func2})
                }
            }
        }
        Match.instance.req(0,func);
    }
}
fgui.UIObjectFactory.setExtension(ResultView.URL, ResultView);