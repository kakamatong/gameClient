import FGUIPlayerInfoView from '../../../../fgui/game10001PlayerInfo/FGUIPlayerInfoView';
import * as fgui from "fairygui-cc";


export class PlayerInfoView extends FGUIPlayerInfoView {
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
        this.createUserInfoBtn()
    }



    updateUserInfo():void{
        this.UI_TXT_NICKNAME.text = DataCenter.instance.userData?.nickname ?? ''
        this.UI_TXT_USERID.text = `${DataCenter.instance.userid ?? 0}`;
        (this.UI_COMP_HEAD as FGUICompHead).UI_LOADER_HEAD.url = DataCenter.instance.headurl
        const cp = DataCenter.instance.getRichByType(RICH_TYPE.COMBAT_POWER) ?? {richType:RICH_TYPE.COMBAT_POWER, richNums:0}
        this.UI_TXT_CP.text =`${cp.richNums}`
    }

    onBtnClose(): void {
        PlayerInfoView.hideView()
    }
}
fgui.UIObjectFactory.setExtension(PlayerInfoView.URL, PlayerInfoView);