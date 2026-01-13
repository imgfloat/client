const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("store", {
    saveBroadcaster: (value) => ipcRenderer.invoke("save-broadcaster", value),
    loadBroadcaster: () => ipcRenderer.invoke("load-broadcaster"),
    saveDomain: (value) => ipcRenderer.invoke("save-domain", value),
    loadDomain: () => ipcRenderer.invoke("load-domain"),
    loadDefaultDomain: () => ipcRenderer.invoke("load-default-domain"),
    setWindowSize: (width, height) => ipcRenderer.invoke("set-window-size", width, height),
    minimizeWindow: () => ipcRenderer.invoke("minimize-window"),
    closeWindow: () => ipcRenderer.invoke("close-window"),
});
