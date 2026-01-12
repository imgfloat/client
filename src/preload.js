const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("store", {
    saveBroadcaster: (value) => ipcRenderer.invoke("save-broadcaster", value),
    loadBroadcaster: () => ipcRenderer.invoke("load-broadcaster"),
    setWindowSize: (width, height) => ipcRenderer.invoke("set-window-size", width, height),
});
