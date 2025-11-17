(() => {
    const darkModeToggle = document.querySelector(".mode_pixel");
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem(
            "modePreference",
            document.body.classList.contains("dark-mode") ? "dark-mode" : ""
        );
    });
})();