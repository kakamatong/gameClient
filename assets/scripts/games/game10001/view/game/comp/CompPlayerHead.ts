import FGUICompPlayerHead from "../../../../../fgui/game10001/FGUICompPlayerHead";
import * as fgui from "fairygui-cc";
import { HorizontalTextAlignment } from "cc";
import { GameData } from "../../../data/Gamedata";
import { PlayerInfoView } from "../../playerInfo/PlayerInfoView";
import { CompTalk } from "./CompTalk";
import { ViewClass } from "db://assets/scripts/frameworks/Framework";

@ViewClass()
export class CompPlayerHead extends FGUICompPlayerHead {
    public localSeat: number = 0;
    protected onConstruct() {
        super.onConstruct();
        this.initUI();
    }

    initUI() {
        this.onChangedPos();
        this.ctrl_pos.onChanged(this.onChangedPos, this);
        this.ctrl_localSeat.onChanged(this.onChangedLocalSeat, this);
        this.UI_COMP_HEAD.onClick(this.onHeadClick, this);
        this.localSeat = this.ctrl_localSeat.selectedIndex;
        this.updateTalkSeat(this.localSeat);
    }

    onChangedPos(): void {
        if (this.ctrl_pos.selectedIndex == 0) {
            this.UI_TXT_ID.pivotX = 0;
            this.UI_TXT_ID.pivotY = 0;
            this.UI_TXT_ID.align = HorizontalTextAlignment.LEFT;
            this.UI_TXT_NICKNAME.pivotX = 0;
            this.UI_TXT_NICKNAME.pivotY = 0;
            this.UI_TXT_NICKNAME.align = HorizontalTextAlignment.LEFT;
        } else {
            this.UI_TXT_ID.pivotX = 1;
            this.UI_TXT_ID.pivotY = 0;
            this.UI_TXT_ID.align = HorizontalTextAlignment.RIGHT;
            this.UI_TXT_NICKNAME.pivotX = 1;
            this.UI_TXT_NICKNAME.pivotY = 0;
            this.UI_TXT_NICKNAME.align = HorizontalTextAlignment.RIGHT;
        }
    }

    onChangedLocalSeat(): void {
        this.localSeat = this.ctrl_localSeat.selectedIndex;
        this.updateTalkSeat(this.localSeat);
    }

    onHeadClick(): void {
        console.log("onHeadClick:", this.ctrl_pos.selectedIndex);
        const player = GameData.instance.getPlayerByLocal(this.localSeat);
        if (player) {
            PlayerInfoView.showView({ userid: player.userid, cp: player.cp });
        }
    }

    showMsg(msg: string): void {
        (this.UI_COMP_TALK as CompTalk).talkMsg = msg;
    }

    updateTalkSeat(seat: number): void {
        (this.UI_COMP_TALK as CompTalk).localSeat = seat;
    }
}
fgui.UIObjectFactory.setExtension(CompPlayerHead.URL, CompPlayerHead);
