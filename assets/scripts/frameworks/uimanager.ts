import * as fgui from "fairygui-cc";

export class UIManager {
    private readonly viewStack: Map<string, any> = new Map();
    private viewClassPaths: string[] = [];
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
        this.getViewClass(viewName).then(module => {
            if (!module) {
                console.log('viewClass not found');
                return;
            }
            if(!module[viewName]){
                console.log('viewClass not found');
                return;
            }
            if (!this.viewStack.has(viewName)) {
                const view = fgui.UIPackage.createObject(module.packageName, viewName, module);
                this.viewStack.set(viewName, view);
                fgui.GRoot.inst.addChild(view);
            }
        });
        
    }

    hideView = (viewName: string): void => {
        if (this.viewStack.has(viewName)) {
            const view = this.viewStack.get(viewName);
            view.dispose();
        }
    }

    async getViewClass(viewName: string): Promise<any> {
        for (const path of this.viewClassPaths) {
            const classPath = '../' + path + viewName + '.ts';
            return await this.importViewClass(classPath);
        }
    }

    async importViewClass(path: string): Promise<any> {
        try {
            path = '../view/TestView.ts'
            const {TestView} = await import(path);
            return TestView;
        } catch (error) {
            console.log(`加载视图类失败: ${path}`, error);
            return null;
        }
    }

    addViewClassPath(path: string): void {
        this.viewClassPaths.push(path);
    }

    clearViewClassPaths(): void {
        this.viewClassPaths = [];
    }
}

// 导出单例实例
UIManager.createInstance();
