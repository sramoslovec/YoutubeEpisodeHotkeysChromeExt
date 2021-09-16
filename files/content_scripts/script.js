var episodesList = [];
var episodesListReversed = [];
var lastHref = document.location.href;

function parseTimeCodes() {
    document.querySelectorAll('#description a').forEach((elem) => {
        if (elem.innerText.match(/\d?\d?\:?\d?\d\:\d\d/)) {
            timecode = elem.innerText.match(/\d?\d?\:?\d?\d\:\d\d/)[0];

            if (!episodesList.includes(timecode)) {
                //console.log("YT_EP_TIME: " + timecode)
                episodesList.push(timecode);
                episodesListReversed.unshift(timecode);
            }
        }
    });
}

/*function parseTimeCodes() {
    $('#description a').each((i, elem) => {
        if (elem.innerText.match(/\d?\d?\:?\d?\d\:\d\d/)) {
            timecode = elem.innerText.match(/\d?\d?\:?\d?\d\:\d\d/)[0];

            if (!episodesList.includes(timecode)) {
                console.log("YT_EP_TIME: " + timecode)
                episodesList.push(timecode);
                episodesListReversed.unshift(timecode);
            }
        }
    });
}*/

function humanTimecodeToSeconds(time) {
    if (time.match(/^\d\:\d\d$/)) {
        time = "0"+time;
    }

    if (time.match(/^\d\:\d\d:\d\d$/)) {
        time = "0"+time;
    }

    if (!time.match(/\d\d\:\d\d\:\d\d/)) {
        time = "00:"+time;
    }

    date = new Date('1970-01-01T'+time+'Z')
    return date.getTime()/1000;
}

function searchForTimecodes() {
    parseTimeCodes();
    
    if (lastHref !== document.location.href) {
        lastHref = document.location.href;
        episodesList = [];
        episodesListReversed = [];
    }
    
    setTimeout(searchForTimecodes, 1000);
}

searchForTimecodes();

function disableOnvideoEpTitle() {
    chrome.storage.local.get("ep_title_disabled", function(data) {
        if (data.ep_title_disabled === 'true') {
            if (document.getElementsByClassName("ytp-doubletap-ui").length > 0) {
                let elem = document.getElementsByClassName("ytp-doubletap-ui")[0].remove();
            }
            if (document.getElementsByClassName("ytp-doubletap-ui-legacy").length > 0) {
                let elem = document.getElementsByClassName("ytp-doubletap-ui-legacy")[0].remove();
            }
        }
    });

    setTimeout(disableOnvideoEpTitle, 1000);
}

disableOnvideoEpTitle();


window.onkeydown = function(e) {
    if (
        e.isComposing || 
        e.keyCode === 229 || 
        e.target.tagName === 'INPUT' ||
        e.target.id === 'contenteditable-root'
    ) return;

    // previous episode
    if (e.which == 81 && episodesList.length > 0) {// key Q code
        video = document.getElementsByClassName('video-stream')[0];
        currentPlayerTime = Number((video.currentTime).toFixed(0));

        time = episodesListReversed.find((timecode, i, a) => {
            seconds = humanTimecodeToSeconds(timecode);
            if (seconds < currentPlayerTime-2) {
                return true;
            }
        });
        video.currentTime = humanTimecodeToSeconds(time);
    }

    // next episode
    if (e.which == 69 && episodesList.length > 0) {// key E code
        video = document.getElementsByClassName('video-stream')[0];
        currentPlayerTime = Number((video.currentTime).toFixed(0));
        
        time = episodesList.find((timecode, i, a) => {
            seconds = humanTimecodeToSeconds(timecode);
            if (seconds > currentPlayerTime) {
                return true;
            }
        });
        video.currentTime = humanTimecodeToSeconds(time);
    }
};