import { UserGameRecord } from '../../../../modules/UserGameRecord';
import FGUIPlayerInfoView from '../../../../fgui/game10001PlayerInfo/FGUIPlayerInfoView';
import * as fgui from "fairygui-cc";
import { GameData } from '../../data/Gamedata';
import FGUICompHead from '../../../../fgui/common/FGUICompHead';


export class PlayerInfoView extends FGUIPlayerInfoView {
    private _userid:number = 0;
    private _cp:number = 0;
    show(data?: any):void{
        this._userid = data.userid;
        this._cp = data.cp ?? 0;
        const gameRecords = new UserGameRecord()
        const func = (data:any)=>{
            this.UI_TXT_WIN.text = data.win;
            this.UI_TXT_LOSE.text = data.lose;
            this.UI_TXT_DRAW.text = data.draw;
            const rate = data.win / (data.win + data.lose + data.draw) * 100;
            this.UI_TXT_RATE.text = `${rate.toFixed(2)}%`;
        }
        gameRecords.req(data.userid, func)

        this.updateUserInfo()
    }



    updateUserInfo():void{
        const player = GameData.instance.getPlayerByUserid(this._userid)
        this.UI_TXT_NICKNAME.text = player?.nickname ?? ''
        this.UI_TXT_USERID.text = `${this._userid}`;
        (this.UI_COMP_HEAD as FGUICompHead).UI_LOADER_HEAD.url = GameData.instance.getHeadurlByUserid(this._userid)
        this.UI_TXT_CP.text =`${this._cp}`
    }

    onBtnClose(): void {
        PlayerInfoView.hideView()
    }
}
fgui.UIObjectFactory.setExtension(PlayerInfoView.URL, PlayerInfoView);