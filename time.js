function updateTime() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'AM' : 'PM';
    const formattedHours = hours % 12 || 12; // Convert 24-hour time to 12-hour time
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    clockElement.textContent = `${formattedHours}:${formattedMinutes} ${ampm}`;
}

setInterval(updateTime, 1000); // Update the time every second
updateTime(); // Initial call to set the time immediately
