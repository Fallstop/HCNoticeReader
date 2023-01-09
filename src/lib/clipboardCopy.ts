async function fallbackCopyTextToClipboard(text: string) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

export async function copyTextToClipboard(text: string) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    try {
        await navigator.clipboard.writeText(text);
        console.log('Async: Copying to clipboard was successful!');

    } catch (err) {
        console.error('Async: Could not copy text: ', err);
    };

}

export function fallbackCopyElementToClipboard(element: HTMLElement) {
    window.getSelection()?.removeAllRanges();
    let range = document.createRange();
    range.selectNode(element);
    window.getSelection()?.addRange(range);
    document.execCommand('copy');
    window.getSelection()?.removeAllRanges();
}

function getPlaintextFromElement(element: HTMLElement) {
    // Couldn't be bothered to actually right an algorithm for this,
    // so, all credit to https://stephenhaney.com/2020/get-contenteditable-plaintext-with-correct-linebreaks/

    let newValue = '';
    let isOnFreshLine = true;

    // Recursive function to navigate childNodes and build linebreaks with text
    function parseChildNodesForValueAndLines(childNodes: NodeListOf<ChildNode>) {
        for (let i = 0; i < childNodes.length; i++) {
            const childNode = childNodes[i];

            if (childNode.nodeName === 'BR' || childNode.nodeName === 'HR') {
                // BRs are always line breaks which means the next loop is on a fresh line
                newValue += '\r\n';
                isOnFreshLine = true;
                continue;
            }

            // We may or may not need to create a new line
            if (childNode.nodeName === 'DIV' && isOnFreshLine === false) {
                // Divs create new lines for themselves if they aren't already on one
                newValue += '\r\n';
            }

            // Whether we created a new line or not, we'll use it for this content so the next loop will not be on a fresh line:
            isOnFreshLine = false;

            // Add the text content if this is a text node:
            if (childNode.nodeType === Node.TEXT_NODE && childNode.textContent) {
                newValue += childNode.textContent;
            }

            // If this node has children, get into them as well:
            parseChildNodesForValueAndLines(childNode.childNodes);
        }
    }

    // Parse the child nodes for HTML and newlines:
    parseChildNodesForValueAndLines(element.childNodes);
    return newValue
}

export async function copyElementToClipboard(element: HTMLElement) {
    try {
        let backupText = getPlaintextFromElement(element);
        let data = new ClipboardItem({
            ["text/html"]: new Blob([element.innerHTML], { type: "text/html" }),
            ["text/plain"]: new Blob([backupText], { type: "text/plain" })
        });
        await navigator.clipboard.write([data]);
    } catch (err) {
        console.log("Copy error, failing back now", err)
        fallbackCopyElementToClipboard(element);
    };
}