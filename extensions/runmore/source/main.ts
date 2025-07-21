// @ts-ignore
import packageJSON from '../package.json';
const Path = require('fire-path');
const Fs = require('fs-extra');
/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    /**
     * @en A method that can be triggered by message
     * @zh 通过 message 触发的方法
     */
    openPanel() {
        Editor.Panel.open(packageJSON.name);
    },
};

/**
 * @en Method Triggered on Extension Startup
 * @zh 扩展启动时触发的方法
 */
export function load() {
    const path1 = Path.join(Editor.Project.path, '/extensions/runmore/containerHtml/index.html')
    const path2 = Path.join(Editor.Project.path, '/library/index.html')
    console.log(path1, path2);
    Fs.copySync(path1, path2);
 }

/**
 * @en Method triggered when uninstalling the extension
 * @zh 卸载扩展时触发的方法
 */
export function unload() { }
