
import FGUIGameView from '../../fgui/game10001/FGUIGameView';
import { GameSocketManager } from '../../frameworks/gameSocketManager';
import { LogColors } from '../../frameworks/framework';
import { DataCenter } from '../../datacenter/datacenter'
import { GameData } from '../../datacenter/gamedata';
import { SELF_LOCAL ,ENUM_GAME_STEP, PLAYER_ATTITUDE,HAND_FLAG,PLAYER_STATUS,SEAT_2,SEAT_1,ROOM_END_FLAG} from '../../datacenter/interfaceGameConfig';
import { Match } from '../../modules/match';
import { UserStatus } from '../../modules/userStatus';
import * as fgui from "fairygui-cc";
export class GameView extends FGUIGameView {
    show(data:any){
        
    }

    onBtnBack(): void {
        
    }

    onBtnScissors(): void {
        
    }

    onBtnRock(): void {
        
    }

    onBtnPaper(): void {
    }
}
fgui.UIObjectFactory.setExtension(GameView.URL, GameView);