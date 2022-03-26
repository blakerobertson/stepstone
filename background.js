chrome.action.onClicked.addListener(tab => {
    console.log("tag.id",tab.id)
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: emboldenFirstLetters
    });
});

function emboldenFirstLetters() {
    console.log("hello")
    let ptags = document.body.getElementsByTagName("p");
    for (let ptag of ptags) {
        // capture the initial state of childNodes because we'll be changing it
        const children = Array.from(ptag.childNodes);
        for (let n of children) {
            // n could be an inline element or something, so check its type
            // note: TEXT_NODE type includes attribute values too (?!) so if we make this recursive later we'll need to account for that
            if (n.nodeType === Node.TEXT_NODE) {
                const words = Array.from(n.nodeValue.matchAll(/\b[a-zA-Z]+/g));

                for (let i=words.length-1; i>=0; i--) {
                    let word_node = n.splitText(words[i].index);
                    // n now contains everything before the matched word while
                    // word_node is a new text node containing the word itself
                    // and any word boundary char before it and any non-alpha chars after it

                    let actual_word = word_node.nodeValue.match(/[a-zA-Z]+/);
                    let leading_char_cnt = actual_word.index;
                    let word_length = actual_word[0].length;
                    let halflength = (word_length+1)/2;
                    let word_tail_node = word_node.splitText(leading_char_cnt+halflength);
                    // word_node is now the first half of the word and word_tail_node is everything from there to the start of the next word

                    let span = document.createElement("span");
                    span.appendChild(word_node);
                    span.style.fontWeight = 600;
                    ptag.insertBefore(span, word_tail_node);
                }
            }
        }
    }
}
