chrome.storage.local.get("ep_title_disabled", function(data) {
    $("#disable-yt-episode-title").attr("checked", data.ep_title_disabled);
});


$("#disable-yt-episode-title").on("click", (e) => {
    let value = $(e.target).is(":checked");
    chrome.storage.local.set({"ep_title_disabled": value});
});