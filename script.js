let currentOpenWindow = null;

function centerWindow(windowElement) {
    const windowWidth = windowElement.offsetWidth;
    const windowHeight = windowElement.offsetHeight;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const top = (screenHeight - windowHeight) / 3;
    const left = (screenWidth - windowWidth) / 2;

    windowElement.style.top = `${top}px`;
    windowElement.style.left = `${left}px`;
}

function openWindow(windowId) {
    if (currentOpenWindow && currentOpenWindow !== windowId) {
        closeWindow(currentOpenWindow);
    }

    const windowElement = document.getElementById(windowId);
    windowElement.style.display = "flex"; // Ensure the window is displayed as flex

    centerWindow(windowElement); // Center the window

    currentOpenWindow = windowId;

    makeDraggable(windowElement);

    // Show the corresponding start bar tab
    const tab = document.querySelector(`.start-bar-tab[for="${windowId}"]`);
    if (tab) {
        tab.style.display = "flex";
    }
}

function closeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    
    // Reset window state to normal size
    windowElement.classList.remove('maximized');
    const previousStyles = windowElement.dataset.previousStyles;
    if (previousStyles) {
        windowElement.setAttribute('style', previousStyles);
    } else {
        windowElement.removeAttribute('style');
    }
    delete windowElement.dataset.previousStyles;

    windowElement.style.display = "none";

    if (currentOpenWindow === windowId) {
        currentOpenWindow = null;
    }

    // Hide the corresponding start bar tab
    const tab = document.querySelector(`.start-bar-tab[for="${windowId}"]`);
    if (tab) {
        tab.style.display = "none";
    }
}


function makeDraggable(element) {
    const titleBar = element.querySelector('.title');
    let isDragging = false;
    let startX, startY, initialX, initialY;

    titleBar.addEventListener('mousedown', function (e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = element.offsetLeft;
        initialY = element.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            element.style.left = `${initialX + dx}px`;
            element.style.top = `${initialY + dy}px`;
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}

window.addEventListener('resize', () => {
    if (currentOpenWindow) {
        const windowElement = document.getElementById(currentOpenWindow);
        centerWindow(windowElement);
    }
});

document.querySelectorAll('.desktop-item').forEach(item => {
    item.addEventListener('click', () => {
        const windowId = item.getAttribute('for');
        openWindow(windowId);
    });
});

function maximizeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    const startBarHeight = document.getElementById('start-bar').offsetHeight;

    if (!windowElement.classList.contains('maximized')) {
        // Maximize the window
        windowElement.classList.add('maximized');
        // Save the window's current position and dimensions
        windowElement.dataset.previousStyles = windowElement.getAttribute('style');
        // Apply styles to fill the viewport, but not overlap the start bar
        windowElement.style.position = 'fixed';
        windowElement.style.top = '0.5vh';
        windowElement.style.left = '0.3vw';
        windowElement.style.width = '99.45vw';
        windowElement.style.height = `calc(98.75vh - ${startBarHeight}px)`;
    } else {
        // Restore the window to its previous size and position
        windowElement.classList.remove('maximized');
        // Restore previous styles
        const previousStyles = windowElement.dataset.previousStyles;
        if (previousStyles) {
            windowElement.setAttribute('style', previousStyles);
        } else {
            // If no previous styles, reset to defaults
            windowElement.removeAttribute('style');
        }
        // Clear the saved styles
        delete windowElement.dataset.previousStyles;
    }
}

// Event listener for the maximize button
document.querySelectorAll('.maximize').forEach(maximizeButton => {
    maximizeButton.addEventListener('click', () => {
        const windowId = maximizeButton.closest('.window-container').id;
        maximizeWindow(windowId);
    });
});

function minimizeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    windowElement.style.display = "none";
}

// Event listener for the minimize button
document.querySelectorAll('.minimize').forEach(minimizeButton => {
    minimizeButton.addEventListener('click', () => {
        const windowId = minimizeButton.closest('.window-container').id;
        minimizeWindow(windowId);
    });
});

// Event listener for the start bar tabs to restore minimized windows
document.querySelectorAll('.start-bar-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const windowId = tab.getAttribute('for');
        const windowElement = document.getElementById(windowId);
        if (windowElement.style.display === "none") {
            openWindow(windowId);
        }
    });
});

// Function to handle toggle of active/inactive styles for start bar tabs
function toggleTabStyle(windowId, minimize = false) {
    const tab = document.querySelector(`.start-bar-tab[for="${windowId}"]`);
    if (tab) {
        tab.classList.toggle("active-tab", !minimize);
        tab.classList.toggle("windows-box-shadow", minimize);
    }
}

// Toggle active tab for all details containers on page load
document.querySelectorAll('.window-container').forEach(window => {
    toggleTabStyle(window.id);
});

// Event listener for minimize buttons in details containers
document.querySelectorAll('.minimize').forEach(minimizeButton => {
    minimizeButton.addEventListener('click', () => {
        const windowId = minimizeButton.closest('.window-container').id;
        toggleTabStyle(windowId, true); // Pass true to indicate minimized state
    });
});

// Event listener for tabs
document.querySelectorAll('.start-bar-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const windowId = tab.getAttribute('for');
        toggleTabStyle(windowId); // Toggle active class
    });
});

// New start-button and start-menu functionality
const startButton = document.getElementById('start-button');
const startMenu = document.getElementById('start-menu');

startButton.addEventListener('click', toggleStartMenu);

function toggleStartMenu() {
    if (startMenu.style.display === 'none' || !startMenu.style.display) {
        openStartMenu();
    } else {
        closeStartMenu();
    }
}

function openStartMenu() {
    startMenu.style.display = 'block';
    // Additional logic for opening the start menu
}

function closeStartMenu() {
    startMenu.style.display = 'none';
    // Additional logic for closing the start menu
}

// Close start menu when anything outside of it is clicked
document.addEventListener('click', function(event) {
    const target = event.target;
    if (!target.closest('#start-menu') && !target.closest('#start-button')) {
        closeStartMenu();
    }
});

// Event listener for items within start menu
startMenu.querySelectorAll('.start-menu-item').forEach(item => {
    item.addEventListener('click', function(event) {
        // Close the start menu when an item is clicked
        closeStartMenu();

        // Additional logic for handling the click of start menu items
        const windowId = item.getAttribute('for');
        if (windowId) {
            openWindow(windowId); // Example function to open windows based on the item clicked
        }
        event.stopPropagation(); // Prevent the click from bubbling up and closing the menu immediately
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var loadingScreen = document.getElementById('loading-screen');
    
    // Ensure the loadingScreen element is present
    if (loadingScreen) {
        // Set a minimum display time for the loading screen (e.g., 3 seconds)
        var minimumDisplayTime = 3000; // 3 seconds in milliseconds
        var startTime = new Date().getTime();
      
        window.addEventListener('load', function() {
          var endTime = new Date().getTime();
          var loadTime = endTime - startTime;
          var remainingTime = minimumDisplayTime - loadTime;
      
          if (remainingTime > 0) {
            setTimeout(function() {
              loadingScreen.style.display = 'none';
            }, remainingTime);
          } else {
            loadingScreen.style.display = 'none';
          }
        });
    } else {
        console.error("Element with id 'loading-screen' not found.");
    }
});


document.addEventListener("DOMContentLoaded", function() {
    // Select the OK button and the login screen
    const loginButton = document.querySelector(".login > label");
    const loginScreen = document.getElementById("login-screen");

    // Ensure the initial display style is set
    loginScreen.style.display = "block";

    // Add a click event listener to the OK button
    loginButton.addEventListener("click", function() {
      // Toggle the visibility of the login screen
      if (loginScreen.style.display === "block") {
        loginScreen.style.display = "none";
      } else {
        loginScreen.style.display = "block";
      }
    });
});

function openContactMeWindow() {
    openWindow('contact-me-window');
}
