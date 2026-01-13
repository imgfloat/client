import { BroadcastRenderer } from "./broadcast/renderer.js";
import { saveSelectedBroadcaster } from "./ipc.js";
import { showToast } from "./toast.js";

const normalizeDomain = (value) => value?.trim()?.replace(/\/+$/, "");
const domainParam = new URL(window.location.href).searchParams.get("domain");
const defaultDomain = await window.store.loadDefaultDomain();
const savedDomain = await window.store.loadDomain();
const domain = normalizeDomain(domainParam || savedDomain || defaultDomain);

globalThis.onerror = (error, url, line) => {
    console.error(error);
    showToast(`Runtime error: ${error} (${url}:${line})`, "error");
};
globalThis.onunhandledrejection = (error) => {
    console.error(error);
    showToast(`Unhandled rejection: ${error.reason}`, "error");
};

const broadcaster = new URL(window.location.href).searchParams.get("broadcaster");
if (!broadcaster) {
    throw new Error("No broadcaster");
}
if (!domain) {
    throw new Error("No domain configured");
}
saveSelectedBroadcaster(broadcaster);

const renderer = new BroadcastRenderer({
    broadcaster,
    domain,
    canvas: document.getElementById("broadcast-canvas"),
    scriptCanvas: document.getElementById("broadcast-script-canvas"),
});

renderer.start().then(() => {
    showToast(`Welcome, ${broadcaster}`, "success");
});
