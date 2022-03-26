embolden.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: emboldenFirstLetters,
    });
});

function emboldenFirstLetters() {
    let ptags = document.body.getElementsByTagName("p");
    for (let ptag of ptags) {
        // capture the initial state of childNodes because we'll be changing it
        const children = Array.from(ptag.childNodes);
        for (let n of children) {
            // n could be an inline element or something, so check its type
            // note: TEXT_NODE type includes attribute values too (?!) so if we make this recursive later we'll need to account for that
            if (n.nodeType === Node.TEXT_NODE) {
                const words = Array.from(n.nodeValue.matchAll(/\b([a-zA-Z]+)/g));
                console.log('words', words[0]);

                for (let i=words.length-1; i>=0; i--) {
                    let word_node = n.splitText(words[i].index);
                    console.log("word_node", word_node.nodeValue);
                    // n now contains everything before the matched word while
                    // word_node is a new text node containing the word itself
                    // AND ANY \b CHAR BEFORE IT AND ANY NON-ALPHA CHARS AFTER IT

                    let halflength = (word_node.nodeValue.length+1)/2;
                    let word_tail_node = word_node.splitText(halflength);
                    // word_node is now the first half of the word and word_tail_node is the last half

                    let span = document.createElement("span");
                    span.appendChild(word_node);
                    span.style.fontWeight = 600;
                    ptag.insertBefore(span, word_tail_node);
                }
            }
        }
    }
}

