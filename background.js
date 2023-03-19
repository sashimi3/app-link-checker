// chrome.tabs.onActivated.addListener(function (activeInfo) {
//     // XXX: I don't know the best practice for getting URLs on onActivated. Welcome PRs!
//     chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true, 'currentWindow': true }, function (tabs) {
//         var url = tabs[0].url;
//         checkUrl(tabs[0].id, url)
//     });
// });

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url !== undefined && changeInfo.status === "complete") {
        checkUrl(tab.id, tab.url)
    }
});

function checkUrl(tabId, raw_url) {
    var url = new URL(raw_url);
    url = url.protocol + '//' + url.hostname;

    if (url && !url.startsWith('chrome://')) {
        var assetlinksUrl = url + '/.well-known/assetlinks.json';
        var appleAppSiteAssociationUrl = url + '/.well-known/apple-app-site-association';

        console.log(assetlinksUrl, appleAppSiteAssociationUrl)

        // TODO: Write nicely with Promise. Welcome PRs!
        var supportAndroid = false
        var supportIos = false

        applyStatus(tabId, supportAndroid, supportIos)

        // Check for assetlinks.json file
        fetch(assetlinksUrl).then(function (response) {
            if (response.status === 200) {
                supportAndroid = true;
            }

            // Check for apple-app-site-association file
            fetch(appleAppSiteAssociationUrl).then(function (response) {
                if (response.status === 200) {
                    supportIos = true;
                }
                applyStatus(tabId, supportAndroid, supportIos)
            });
        });
    }
}

function applyStatus(tabId, supportAndroid, supportIos) {
    var badgeText = ''
    var badgeColor = ''

    if (supportAndroid === true && supportIos === true) {
        badgeText = 'A/i';
        badgeColor = '#ff6600'
    }
    else if (supportAndroid === true) {
        badgeText = 'A'
        badgeColor = '#42D680'
    } else if (supportIos === true) {
        badgeText = 'i'
        badgeColor = '#2166E4'
    }

    // TODO?: Change the icon? Welcome PRs!
    // chrome.action.setIcon({ path: 'icon_apple_app_site_association_exists.png' });
    // chrome.action.setIcon({ path: 'icon_assetlinks_exists.png' });
    // chrome.action.setIcon({ path: 'icon_no_url_present.png' });

    if (badgeText) {
        chrome.action.setBadgeText({
            tabId: tabId,
            text: badgeText
        });
        chrome.action.setBadgeBackgroundColor({
            tabId: tabId,
            color: badgeColor
        });
    }
}
