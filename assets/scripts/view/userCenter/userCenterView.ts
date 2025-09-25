import FGUIUserCenterView from '../../fgui/userCenter/FGUIUserCenterView';
import * as fgui from "fairygui-cc";
import { UserGameRecord } from '../../modules/userGameRecord';
import FGUICompHead from '../../fgui/common/FGUICompHead';
import { DataCenter } from '../../datacenter/datacenter';

export class UserCenterView extends FGUIUserCenterView {
    show(data?: any):void{
        const gameRecords = new UserGameRecord()
        const func = (data:any)=>{
            this.UI_TXT_WIN.text = data.win;
            this.UI_TXT_LOSE.text = data.lose;
            this.UI_TXT_DRAW.text = data.draw;
            const rate = data.win / (data.win + data.lose + data.draw) * 100;
            this.UI_TXT_RATE.text = `${rate.toFixed(2)}%`;
        }
        gameRecords.req(func)

        this.updateUserInfo()
    }

    updateUserInfo():void{
        this.UI_TXT_NICKNAME.text = DataCenter.instance.userData?.nickname ?? ''
        this.UI_TXT_USERID.text = `${DataCenter.instance.userid ?? 0}`;
        (this.UI_COMP_HEAD as FGUICompHead).UI_LOADER_HEAD.url = DataCenter.instance.headurl
    }

    onBtnClose(): void {
        UserCenterView.hideView()
    }
}
fgui.UIObjectFactory.setExtension(UserCenterView.URL, UserCenterView);