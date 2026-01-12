export function saveSelectedBroadcaster(broadcaster) {
    window.store.saveBroadcaster(broadcaster);
}

let memoizedWidth = -1;
let memoizedHeight = -1;
export function saveCanvasSize(width, height) {
    console.log({ width, height });
    if (memoizedWidth === -1 && memoizedHeight === -1) {
        window.store.setWindowSize(width, height);
        return;
    }
    if (width === memoizedWidth && height === memoizedHeight) {
        return;
    }
    memoizedWidth = width;
    memoizedHeight = height;
    console.info("Saving canvas size:", width, height);
    showToast("Updated canvas size", "info");
    window.store.setWindowSize(width, height);
}
