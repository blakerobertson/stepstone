embolden.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: emboldenFirstLetters,
    });
});

function emboldenFirstLetters() {
    let tags = document.body.getElementsByTagName("p");
    for (let tag of tags) {
        // TODO: improve this so it doesn't break the p's child tags
        tag.innerHTML = tag.innerHTML.replace(/\b[a-zA-Z]+/g, s => {
            let half = (s.length+1)/2;
            return `<span style="font-weight:600">${s.slice(0, half)}</span>${s.slice(half)}`;
        });
    }
}

