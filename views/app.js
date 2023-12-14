document.getElementById('shorten-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const full = document.getElementById('full-url').value;

    const response = await fetch('http://localhost:5001/shortUrls', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ full: full }) // Use 'full' instead of 'fullUrl'
    });

    const data = await response.json();
    // Handle the response as needed
});
