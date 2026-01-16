import { UserGameRecord } from '../../../../modules/UserGameRecord';
import FGUIPlayerInfoView from '../../../../fgui/game10001PlayerInfo/FGUIPlayerInfoView';
import * as fgui from "fairygui-cc";
import { GameData } from '../../data/Gamedata';
import FGUICompHead from '../../../../fgui/common/FGUICompHead';
import { ViewClass } from 'db://assets/scripts/frameworks/Framework';

@ViewClass()
export class PlayerInfoView extends FGUIPlayerInfoView {
    private _userid:number = 0;
    private _cp:number = 0;
    show(data?: any):void{
        this._userid = data.userid;
        this._cp = data.cp ?? 0;
        this.updateUserInfo()
        this.UI_BG_MASK.onClick(this.onBtnClose, this)
    }



    updateUserInfo():void{
        const player = GameData.instance.getPlayerByUserid(this._userid)
        if (!player) {
            return
        }
        this.UI_TXT_NICKNAME.text = player?.nickname ?? ''
        this.UI_TXT_USERID.text = `${this._userid}`;
        (this.UI_COMP_HEAD as FGUICompHead).UI_LOADER_HEAD.url = GameData.instance.getHeadurlByUserid(this._userid)
        this.UI_TXT_CP.text =`${this._cp}`

        if (player.win !== undefined && player.win !== null && player.lose !== undefined && player.lose !== null && player.draw !== undefined && player.draw !== null) {
            this.UI_TXT_WIN.text = `${player.win}`;
            this.UI_TXT_LOSE.text = `${player.lose}`;
            this.UI_TXT_DRAW.text = `${player.draw}`;
            const rate = player.win / (player.win + player.lose + player.draw) * 100;
            this.UI_TXT_RATE.text = `${rate.toFixed(1)}%`;
        }else{
            const gameRecords = new UserGameRecord()
            const func = (data:any)=>{
                player.win = data.win
                player.lose = data.lose
                player.draw = data.draw

                this.UI_TXT_WIN.text = data.win;
                this.UI_TXT_LOSE.text = data.lose;
                this.UI_TXT_DRAW.text = data.draw;
                const total = data.win + data.lose + data.draw;
                if (total) {
                    const rate = data.win / (total) * 100;
                    this.UI_TXT_RATE.text = `${rate.toFixed(1)}%`;
                }else{
                    this.UI_TXT_RATE.text = `--`;
                }
            }
            gameRecords.req(this._userid, func)
        }
    }

    onBtnClose(): void {
        PlayerInfoView.hideView()
    }
}
fgui.UIObjectFactory.setExtension(PlayerInfoView.URL, PlayerInfoView);