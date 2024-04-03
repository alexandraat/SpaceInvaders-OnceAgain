// Get references to the buttons
var button1 = document.getElementById("but1");
var button2 = document.getElementById("but2");
var button3 = document.getElementById("but3");

// Default border color for buttons when not selected
var defaultBorderColor = "#00646E";

// Add click event listeners to each button
button1.addEventListener("click", function() {
    // Check if button is already selected
    if (button1.style.border !== "3px solid purple") {
        // Reset border color for all buttons
        button1.style.border = "3px solid purple";
        button2.style.border = "3px solid " + defaultBorderColor;
        button3.style.border = "3px solid " + defaultBorderColor;
    }
});

button2.addEventListener("click", function() {
    // Check if button is already selected
    if (button2.style.border !== "3px solid purple") {
        // Reset border color for all buttons
        button1.style.border = "3px solid " + defaultBorderColor;
        button2.style.border = "3px solid purple";
        button3.style.border = "3px solid " + defaultBorderColor;
    }
});

button3.addEventListener("click", function() {
    // Check if button is already selected
    if (button3.style.border !== "3px solid purple") {
        // Reset border color for all buttons
        button1.style.border = "3px solid " + defaultBorderColor;
        button2.style.border = "3px solid " + defaultBorderColor;
        button3.style.border = "3px solid purple";
    }
});
