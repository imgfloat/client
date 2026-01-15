const path = require("node:path");

const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const { readStore, writeStore } = require("./store.js");

const STORE_PATH = path.join(app.getPath("userData"), "settings.json");
const INITIAL_WINDOW_WIDTH_PX = 960;
const INITIAL_WINDOW_HEIGHT_PX = 640;
const LOCAL_DOMAIN = "http://localhost:8080";
const DEFAULT_DOMAIN = "https://imgflo.at";
const RUNTIME_DOMAIN = resolveDefaultDomain();
let ELECTRON_WINDOW;

function normalizeDomain(domain) {
    return domain?.trim()?.replace(/\/+$/, "");
}

function resolveDefaultDomain() {
    if (process.env.LOCAL_DOMAIN) {
        return normalizeDomain(LOCAL_DOMAIN);
    }
    const buildTimeDomain = process.env.IMGFLOAT_DOMAIN || DEFAULT_DOMAIN;
    return normalizeDomain(buildTimeDomain);
}

function createWindowOptions() {
    return {
        width: INITIAL_WINDOW_WIDTH_PX,
        height: INITIAL_WINDOW_HEIGHT_PX,
        transparent: true,
        frame: false,
        backgroundColor: "#00000000",
        alwaysOnTop: false,
        icon: path.join(__dirname, "../res/icon/appicon.ico"),
        webPreferences: {
            backgroundThrottling: false,
            preload: path.join(__dirname, "preload.js"),
        },
    };
}

function createWindow(version) {
    const windowOptions = createWindowOptions();
    const win = new BrowserWindow(windowOptions);
    win.setMenu(null);
    win.setFullScreenable(false);
    win.setFullScreen(false);
    win.setResizable(false);
    win.setTitle(`Imgfloat Client v${version}`);

    return win;
}

ipcMain.handle("set-window-size", (_, width, height) => {
    if (ELECTRON_WINDOW && !ELECTRON_WINDOW.isDestroyed()) {
        ELECTRON_WINDOW.setContentSize(width, height, false);
    }
});

ipcMain.handle("minimize-window", () => {
    if (ELECTRON_WINDOW && !ELECTRON_WINDOW.isDestroyed()) {
        ELECTRON_WINDOW.minimize();
    }
});

ipcMain.handle("close-window", () => {
    if (ELECTRON_WINDOW && !ELECTRON_WINDOW.isDestroyed()) {
        ELECTRON_WINDOW.close();
    }
});

ipcMain.handle("save-broadcaster", (_, broadcaster) => {
    const store = readStore(STORE_PATH);
    store.lastBroadcaster = broadcaster;
    writeStore(STORE_PATH, store);
});

ipcMain.handle("load-broadcaster", () => {
    const store = readStore(STORE_PATH);
    return store.lastBroadcaster ?? "";
});

ipcMain.handle("save-domain", (_, domain) => {
    const store = readStore(STORE_PATH);
    store.lastDomain = normalizeDomain(domain);
    writeStore(STORE_PATH, store);
});

ipcMain.handle("load-domain", () => {
    const store = readStore(STORE_PATH);
    return normalizeDomain(store.lastDomain) || RUNTIME_DOMAIN;
});

ipcMain.handle("load-default-domain", () => RUNTIME_DOMAIN);

app.whenReady().then(() => {
    if (process.env.CI) {
        process.on("uncaughtException", (err) => {
            console.error("Uncaught exception:", err);
            app.exit(1);
        });
        setTimeout(() => app.quit(), 3000);
    }
    autoUpdater.checkForUpdatesAndNotify();

    const version = app.getVersion();
    ELECTRON_WINDOW = createWindow(version);
    ELECTRON_WINDOW.loadFile(path.join(__dirname, "index.html"));
    ELECTRON_WINDOW.on("page-title-updated", (e) => e.preventDefault());

    if (process.env.DEVTOOLS) {
        ELECTRON_WINDOW.webContents.openDevTools({ mode: "detach" });
    }
});
