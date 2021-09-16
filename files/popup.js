chrome.storage.local.get("ep_title_disabled", function(data) {
    document
        .getElementById("disable-yt-episode-title")
        .checked = data.ep_title_disabled === 'true' ? true : false;
});

document.getElementById("disable-yt-episode-title").addEventListener("click", (e) => {
    let value = e.target.checked ? "true" : "false";

    chrome.storage.local.set({"ep_title_disabled": value}, function() {
      console.log('Value is set to ' + value);
    });
}, false);