chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    let url = tabs[0].url;
    console.log(url);
});

function onClickHref(e) {
    chrome.tabs.create({ url: e.target.href });
}

window.addEventListener('load', () => {
    const assetLinksLink = document.getElementById('assetLinks')
    const appleAppSiteAssociationLink = document.getElementById('appleAppSiteAssociation')
    // XXX: I don't know the best practice for getting URLs on onActivated. Welcome PRs!
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        var url = new URL(tabs[0].url);
        url = url.protocol + '//' + url.hostname;

        var assetlinksUrl = url + '/.well-known/assetlinks.json';
        var appleAppSiteAssociationUrl = url + '/.well-known/apple-app-site-association';

        assetLinksLink.href = assetlinksUrl
        assetLinksLink.addEventListener('click', onClickHref);
        appleAppSiteAssociationLink.href = appleAppSiteAssociationUrl
        appleAppSiteAssociationLink.addEventListener('click', onClickHref);
    });
})
