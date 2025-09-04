import * as fgui from "fairygui-cc";
import { assetManager, AssetManager } from "cc";

/**
 * @class UIManager
 * @description UI管理器，负责管理所有UI视图的显示、隐藏和生命周期，使用单例模式
 * @category 框架组件
 * @singleton 单例模式
 */
export class UIManager {
    /**
     * @property {Map<string, any>} _viewStack - 视图栈，存储已创建的视图实例
     * @private
     * @readonly
     */
    private readonly _viewStack: Map<string, any> = new Map();
    
    /**
     * @property {any} _viewConfig - 视图配置对象，存储视图类的映射关系
     * @private
     */
    private _viewConfig: any;
    
    /**
     * @property {UIManager} _instance - 单例实例
     * @private
     * @static
     */
    private static _instance: UIManager;
    
    /**
     * @method instance
     * @description 获取UIManager的单例实例
     * @static
     * @returns {UIManager} UIManager单例实例
     */
    public static get instance(): UIManager {
        if (!this._instance) {
            this._instance = new UIManager();
        }
        return this._instance;
    }

    /**
     * @method showView
     * @description 显示指定的视图，如果视图不存在则创建并加载
     * @param {string} viewName - 视图名称
     * @param {any} [params] - 传递给视图的参数
     */
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
                if(error){console.log('loadPackage error', error);return;}
    
                const view = fgui.UIPackage.createObject(module.packageName, viewName, module);
                this._viewStack.set(viewName, view);
                view.makeFullScreen()
                fgui.GRoot.inst.addChild(view);
                view.show && view.show(params);

            });
        }
    }

    /**
     * @method hideView
     * @description 隐藏并销毁指定的视图
     * @param {string} viewName - 视图名称
     */
    hideView = (viewName: string): void => {
        if (this._viewStack.has(viewName)) {
            const view = this._viewStack.get(viewName);
            view.dispose();
            this._viewStack.delete(viewName);
        }
    }

    /**
     * @method getViewClass
     * @description 根据视图名称获取对应的视图类
     * @param {string} viewName - 视图名称
     * @returns {any} 视图类或undefined
     */
    getViewClass(viewName: string) {
        return this._viewConfig[viewName];
    }

    /**
     * @method initViewConfig
     * @description 初始化视图配置，设置视图名称与视图类的映射关系
     * @param {any} viewConfig - 视图配置对象
     */
    initViewConfig(viewConfig: any) {
        this._viewConfig = viewConfig;
    }
}
