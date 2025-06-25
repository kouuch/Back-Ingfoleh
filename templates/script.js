// Toggle the visibility of the Edit Profile form
document.getElementById("editProfileBtn").addEventListener("click", function() {
    const editForm = document.getElementById("editProfileForm");
    const isVisible = editForm.style.display === "block";
    editForm.style.display = isVisible ? "none" : "block";
});

// Cancel editing
document.getElementById("cancelEditBtn").addEventListener("click", function() {
    const editForm = document.getElementById("editProfileForm");
    editForm.style.display = "none";
});
