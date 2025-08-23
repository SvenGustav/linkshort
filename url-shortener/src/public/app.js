document.addEventListener('DOMContentLoaded', () => {
    const originalUrlInput = document.getElementById('originalUrl');
    const shortenButton = document.getElementById('shortenButton');
    const resultContainer = document.getElementById('resultContainer');
    const shortUrlInput = document.getElementById('shortUrl');
    const copyButton = document.getElementById('copyButton');
    const clickCount = document.getElementById('clickCount');
    const statsLink = document.getElementById('statsLink');

    // Trigger shorten action on Enter key press
    originalUrlInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            shortenButton.click();
        }
    });

    shortenButton.addEventListener('click', async () => {
        let originalUrl = originalUrlInput.value.trim();
        if (!originalUrl) {
            alert('Please enter a URL');
            return;
        }

        // Clean up the URL
        if (!originalUrl.match(/^https?:\/\//i)) {
            // Remove any accidentally pasted protocol
            originalUrl = originalUrl.replace(/^[^:]+:\/\//, '');
        }

        try {
            const response = await fetch('/api/url/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ originalUrl }),
            });

            const data = await response.json();
            
            if (response.ok) {
                resultContainer.classList.remove('hidden');
                shortUrlInput.value = data.shortUrl;
                clickCount.textContent = `${data.clicks} clicks`;
                statsLink.href = `/stats/${data.id}`; // Use shortUrl for stats link
            } else {
                const errorMessage = data.error === 'Invalid URL provided' 
                    ? 'Please enter a valid URL (e.g., google.com or github.com)'
                    : (data.error || 'Error creating short URL');
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating short URL');
        }
    });

    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(shortUrlInput.value);
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    });
});
