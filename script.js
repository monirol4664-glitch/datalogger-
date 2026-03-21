// Function to handle the "Edit Profile" logic
function updateProfile() {
    const profileData = {
        name: document.getElementById('studentName').value,
        course: document.getElementById('courseName').value,
        regNo: document.getElementById('regNo').value,
        rollNo: document.getElementById('rollNo').value
    };

    // This would fetch your Cloudflare Worker endpoint
    fetch('/api/update-profile', {
        method: 'POST',
        body: JSON.stringify(profileData)
    }).then(res => alert('Profile Updated Successfully!'));
}

// Logic for "Download PDF" (Simple Print Version)
document.getElementById('download-pdf')?.addEventListener('click', () => {
    window.print(); 
    // For a real PDF, you'd use a library like jsPDF
});
