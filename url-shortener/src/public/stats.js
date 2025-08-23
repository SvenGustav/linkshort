document.addEventListener('DOMContentLoaded', async () => {
    const shortUrl = window.location.pathname.split('/').pop(); // Extract shortUrl from the URL path

    if (!shortUrl) {
        alert('No URL ID provided');
        window.location.href = '/';
        return;
    }

    try {
        const response = await fetch(`/api/url/stats/${shortUrl}`); // Use shortUrl for stats fetch
        const data = await response.json();

        if (response.ok) {
            document.getElementById('originalUrl').textContent = data.originalUrl;
            document.getElementById('originalUrl').href = data.originalUrl;

            document.getElementById('shortUrl').textContent = data.shortUrl;
            document.getElementById('shortUrl').href = data.shortUrl;

            document.getElementById('clicks').textContent = data.clicks;
            document.getElementById('createdAt').textContent = new Date(data.createdAt).toLocaleString();
        } else {
            alert(data.error || 'Failed to load stats');
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
        alert('Failed to load stats');
        window.location.href = '/';
    }
});
