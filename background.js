// Author: Bhaskar Tallamraju
// Enforces HTTPS everywhere
// Date: 02/25/2018

// use browserObj to make the code browser agnostic
browserObj = (function () { return  window.browser || window.chrome; })();
browserObj.enable_override = false;
var urlCached = "";
/* ************************************** 
 * Request Header Listener
 * **************************************/
browserObj.webRequest.onBeforeSendHeaders.addListener(({tabId, type, frameId, url, requestHeaders}) => {

    if ((frameId == 0) && (type.indexOf('main_frame') >= 0) && !urlCached.match(url)) {
        if (browserObj.enable_override == false) {
            if (url.match("http:")) {
                var secUrl = url.replace("http:", "https:");
                console.log("Going to Secure site for url: " + url);
                browserObj.tabs.update(tabId, {
                    active: true,
                    url:secUrl
                });
                urlCached = url;
            }
        }
    }
    return {cancel: false};
}, {urls: ["<all_urls>"]}, ["requestHeaders", "blocking"]);

// Listen for and respond to messages from the popup
browserObj.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if( request.greeting === "set_enable_override" ) {
        if (request.message === "enable") {
            sendResponse( "OKAY" );
            console.log("Enabling insecure Browsing");
            browserObj.enable_override = true;
            browserObj.browserAction.setIcon({ path: "icons/insecure_48.png" });
            browserObj.browserAction.setBadgeText({text:"X"});
            browserObj.browserAction.setBadgeBackgroundColor({color:[194, 0, 0, 230]});
        } else {
            sendResponse( "OKAY" );
            console.log("Enabling insecure Browsing");
            browserObj.enable_override = false;
            browserObj.browserAction.setIcon({ path: "icons/secured_48.png" });
            browserObj.browserAction.setBadgeText({text:""});
            browserObj.browserAction.setBadgeBackgroundColor({color:[0,0,0,0]});
        }
    } else if ( request.greeting === 'get_enable_override') {
        console.log("responding to get_enable_override");
        if (browserObj.enable_override == true) {
            sendResponse( "enabled" );
        } else {
            sendResponse( "disabled" );
        }
    }
});
// End of File
