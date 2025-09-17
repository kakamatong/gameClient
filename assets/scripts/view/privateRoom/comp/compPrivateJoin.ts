import FGUICompPrivateJoin from "../../../fgui/privateRoom/FGUICompPrivateJoin";
import * as fgui from "fairygui-cc";

export class CompPrivateJoin extends FGUICompPrivateJoin { 
    show(data?:any){
        
    }

    onBtnClose(): void {
        CompPrivateJoin.hideView()
    }

    onBtnJoin(): void {
        
    }

    onBtnJoin0(): void {
        this.input(0);
    }

    onBtnJoin1(): void {
        this.input(1);
    }

    onBtnJoin2(): void {
        this.input(2);
    }

    onBtnJoin3(): void {
        this.input(3);
    }

    onBtnJoin4(): void {
        this.input(4);
    }

    onBtnJoin5(): void {
        this.input(5);
    }

    onBtnJoin6(): void {
        this.input(6);
    }

    onBtnJoin7(): void {
        this.input(7);
    }

    onBtnJoin8(): void {
        this.input(8);
    }

    onBtnJoin9(): void {
        this.input(9);
    }

    input(n:number):void{
        if (this.UI_TXT_ROOMID.text?.length && this.UI_TXT_ROOMID.text?.length >= 6) {
            return 
        }

        this.UI_TXT_ROOMID.text = (this.UI_TXT_ROOMID.text ?? '') + `${n}`;
    }

    onBtnJoinClear(): void {
        this.UI_TXT_ROOMID.text = ''
    }

}
fgui.UIObjectFactory.setExtension(CompPrivateJoin.URL, CompPrivateJoin);