import * as fgui from "fairygui-cc";

export class UIManager {
    private readonly viewStack: Map<string, any> = new Map();
    
    private viewConfig: any;
    //单例
    public static instance: UIManager;

    private constructor() {
        if (UIManager.instance) {
            throw new Error("UIManager is a singleton!");
        }
    }

    static createInstance() {
        UIManager.instance = new UIManager();
    }

    showView = (viewName: string, params?: any): void => {
        const view = this.viewStack.get(viewName);
        if (view) {
            fgui.GRoot.inst.addChild(view);
            return;
        }

        const module = this.getViewClass(viewName);
        if (!module) {
            console.log('viewClass not found');
            return;
        }
        
        if (!this.viewStack.has(viewName)) {
            const view = fgui.UIPackage.createObject(module.packageName, viewName, module);
            this.viewStack.set(viewName, view);
            fgui.GRoot.inst.addChild(view);
        }
        
        
    }

    hideView = (viewName: string): void => {
        if (this.viewStack.has(viewName)) {
            const view = this.viewStack.get(viewName);
            view.dispose();
            this.viewStack.delete(viewName);
        }
    }

    getViewClass(viewName: string) {
        return this.viewConfig[viewName];
    }

    initViewConfig(viewConfig: any) {
        this.viewConfig = viewConfig;
    }
}

// 导出单例实例
UIManager.createInstance();
