'use strict';

//モジュールを使えるようにする
const { app, BrowserWindow, ipcMain } = require("electron");
const { exec } = require('child_process')
const electron = require('electron');
const fs = require('fs')
const log = require('electron-log');

// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;

//アプリの画面を作成
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 250, height: 250, webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            preload: __dirname + '/preload.js'
        }
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');
}

// Electronの初期化完了後に実行
app.on('ready', function () {
    createWindow();
});

//アプリの画面が閉じられたら実行
app.on('window-all-closed', () => {
    // macOSでは、ユーザが Cmd + Q で明示的に終了するまで、
    // アプリケーションとそのメニューバーは有効なままにするのが一般的です。
    if (process.platform !== 'darwin') {
        mainWindow = null;
        app.quit()
    }
});

app.on('activate', () => {
    // macOSでは、ユーザがドックアイコンをクリックしたとき、
    // そのアプリのウインドウが無かったら再作成するのが一般的です。
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});

//レンダラープロセスから送られたdataの内容がargに格納されている
ipcMain.on("click", (event, arg) => {
    //処理
    //@TODO プロダクトとデベロップで分ける
    var pluginDir = __dirname.replace('app.asar', 'app.asar.unpacked') + "/script.js";
    //log.error(pluginDir)
    exec('/usr/bin/osascript -l JavaScript ' + pluginDir, (err, stdout, stderr) => {
        if (err) {
            log.error(`stderr: ${stderr}`)
            return
        }
        //console.log(`stdout: ${stdout}`)
    }
    )
});

//アプリケーションメニュー
const Menu = electron.Menu

//メニューバー内容
let template = [{
    label: 'StudySwitch',
    submenu: [{
        label: 'アプリを終了',
        accelerator: 'Cmd+Q',
        click: function () {
            app.quit();
        }
    }]
}, {
    label: 'Window',
    submenu: [{
        label: '最小化',
        accelerator: 'Cmd+M',
        click: function () {
            mainWindow.minimize();
        }
    }, {
        label: '最大化',
        accelerator: 'Cmd+Ctrl+F',
        click: function () {
            mainWindow.maximize();
        }
    }, {
        type: 'separator'
    }, {
        label: 'リロード',
        accelerator: 'Cmd+R',
        click: function () {
            BrowserWindow.getFocusedWindow().reload();
        }
    }]
}]

// Electronの初期化完了後に実行
app.on('ready', function () {
    //メニューバー設置
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

});