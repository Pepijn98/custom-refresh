const icons = Object.freeze({
    light_theme: {
        16: "icons/16.png",
        32: "icons/32.png",
        48: "icons/48.png",
        128: "icons/128.png",
    },
    dark_theme: {
        16: "icons/16_w.png",
        32: "icons/32_w.png",
        48: "icons/48_w.png",
        128: "icons/128_w.png",
    },
});

// Chrome dumb
if (typeof browser === "undefined") {
    var browser = chrome;
    if (typeof window !== "undefined" && typeof document !== "undefined") {
        document.browser = window.browser = chrome
    }
}

// Firefox dumb, doesn't support theme icons in manifest
// maybe not do this on install since someone could change their theme
browser.runtime.onInstalled.addListener(async () => {
    // Chrome doesn't even have a getBrowserInfo method
    const info = typeof browser.runtime.getBrowserInfo !== "undefined" ? await browser.runtime.getBrowserInfo() : { name: "Chrome" };
    if (info.name === "Firefox") {
        const is_dark_theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        browser.action.setIcon({ path: is_dark_theme ? icons.dark_theme : icons.light_theme });
    }
});

// Refresh tab on icon click
browser.action.onClicked.addListener(() => {
    browser.tabs.reload({ bypassCache: true });
});

// Refresh tab on keyboard shortcut
browser.commands.onCommand.addListener((command) => {
    if (command === "shortcut-refresh") {
        browser.tabs.reload({ bypassCache: true });
    }
});
