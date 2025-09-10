console.log("Email Writer Extension Loaded");

function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for (const sel of selectors) {
        const content = document.querySelector(sel);
        if (content) {
            return content.innerText.trim();
        }
    }
    return '';
}

function findComposeToolbar() {
    const toolbarSelectors = ['.btC', '.aDh', '[role="toolbar"]', '.gU.Up'];
    for (const sel of toolbarSelectors) {
        const toolbar = document.querySelector(sel);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
}

function createAIButton() {
    const button = document.createElement('div');
    button.className = 'T-I J_J5-Ji aoO v7 T-I-atl L3 ai-reply-button';
    button.style.marginRight = '8px';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}

function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) {
        existingButton.remove();
    }

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.error("Toolbar not found");
        return;
    }

    console.log("✅ Toolbar found, injecting button...");
    const button = createAIButton();
    toolbar.insertBefore(button, toolbar.firstChild);

    button.addEventListener('click', async () => {
        try {
            button.innerHTML = 'Generating...';
            button.style.pointerEvents = "none";

            const emailContent = getEmailContent();

            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "professional"
                })
            });

            if (!response.ok) {
                throw new Error("API Request Failed");
            }

            // assume API returns plain text
            const generatedReply = await response.text();

            const composeBox = document.querySelector(
                '[role="textbox"][g_editable="true"]'
            );
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            }

            button.innerHTML = 'AI Reply';
            button.style.pointerEvents = "auto";

        } catch (error) {
            console.error("❌ Error generating reply:", error);
            button.innerHTML = 'AI Reply';
            button.style.pointerEvents = "auto";
        }
    });
}

const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
        const addedNodes = mutation.addedNodes ? [...mutation.addedNodes] : [];

        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (
                node.matches('.aDh, .btC, [role="dialog"]') ||
                (node.querySelector && node.querySelector('.aDh, .btC, [role="dialog"]'))
            )
        );

        if (hasComposeElements) {
            console.log("✉️ Gmail Compose Window Detected!");
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
