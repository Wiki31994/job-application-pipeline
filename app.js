const form = document.getElementById('jobApplicationForm');
const responseMessage = document.getElementById('responseMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            responseMessage.innerHTML = `<p style="color: green;">${result.message}</p>`;
            console.log('CV Uploaded:', result.publicUrl);
        } else {
            responseMessage.innerHTML = `<p style="color: red;">${result.message}</p>`;
        }
    } catch (error) {
        console.error('Error:', error);
        responseMessage.innerHTML = `<p style="color: red;">An error occurred while submitting the form.</p>`;
    }
});
