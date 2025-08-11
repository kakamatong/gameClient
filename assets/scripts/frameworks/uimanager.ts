import * as fgui from "fairygui-cc";
import { assetManager, AssetManager } from "cc";
export class UIManager {
    private readonly _viewStack: Map<string, any> = new Map();
    
    private _viewConfig: any;
    //单例
    private static _instance: UIManager;
    public static get instance(): UIManager {
        if (!this._instance) {
            this._instance = new UIManager();
        }
        return this._instance;
    }

    showView = (viewName: string, params?: any): void => {
        const view = this._viewStack.get(viewName);
        if (view) {
            fgui.GRoot.inst.addChild(view);
            return;
        }

        const module = this.getViewClass(viewName);
        if (!module) {
            console.log('viewClass not found');
            return;
        }
        
        if (!this._viewStack.has(viewName)) {
            const bundle = assetManager.getBundle('fgui') as AssetManager.Bundle;
            fgui.UIPackage.loadPackage(bundle, module.packageName, (error, pkg)=>{
                if(error){
                    console.log('loadPackage error', error);
                    return;
                }
    
                const view = fgui.UIPackage.createObject(module.packageName, viewName, module);
                this._viewStack.set(viewName, view);
                fgui.GRoot.inst.addChild(view);
                view.show && view.show(params);

            });
        }
    }

    hideView = (viewName: string): void => {
        if (this._viewStack.has(viewName)) {
            const view = this._viewStack.get(viewName);
            view.dispose();
            this._viewStack.delete(viewName);
        }
    }

    getViewClass(viewName: string) {
        return this._viewConfig[viewName];
    }

    initViewConfig(viewConfig: any) {
        this._viewConfig = viewConfig;
    }
}
