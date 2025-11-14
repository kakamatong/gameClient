
import FGUICompPlayerHead from '../../../../../fgui/game10001/FGUICompPlayerHead';
import * as fgui from "fairygui-cc";
import { HorizontalTextAlignment } from 'cc';
import { GameData } from '../../../data/Gamedata';
import { PlayerInfoView } from '../../playerInfo/PlayerInfoView';
export class CompPlayerHead extends FGUICompPlayerHead {
    public localSeat:number = 0;
    protected onConstruct(){
        super.onConstruct();
        this.localSeat = this.ctrl_localSeat.selectedIndex;
        this.initUI()
    }

    initUI(){
        if (this.ctrl_pos.selectedIndex == 0) {
            this.UI_TXT_ID.pivotX = 0
            this.UI_TXT_ID.pivotY = 0
            this.UI_TXT_ID.align = HorizontalTextAlignment.LEFT
            this.UI_TXT_NICKNAME.pivotX = 0
            this.UI_TXT_NICKNAME.pivotY = 0
            this.UI_TXT_NICKNAME.align = HorizontalTextAlignment.LEFT
        }else{
            this.UI_TXT_ID.pivotX = 1
            this.UI_TXT_ID.pivotY = 0
            this.UI_TXT_ID.align = HorizontalTextAlignment.RIGHT
            this.UI_TXT_NICKNAME.pivotX = 1
            this.UI_TXT_NICKNAME.pivotY = 0
            this.UI_TXT_NICKNAME.align = HorizontalTextAlignment.RIGHT
        }
        this.UI_COMP_HEAD.onClick(this.onHeadClick, this)
    }

    onHeadClick(): void {
        const player = GameData.instance.getPlayerByLocal(this.localSeat)
        if (player) {
            PlayerInfoView.showView({userid:player.userid, cp: player.cp})
        }
    }

}
fgui.UIObjectFactory.setExtension(CompPlayerHead.URL, CompPlayerHead);