// Get references to the buttons
var button1 = document.getElementById("but1");
var button2 = document.getElementById("but2");
var button3 = document.getElementById("but3");

// Default border color for buttons when not selected
var defaultBorderColor = "#00646E";

// Add click event listeners to each button
button1.addEventListener("click", function() {
    // Check if button is already selected
    if (button1.classList !== "selected") {
        // Reset border color for all buttons
        button1.style.border = "3px solid purple";
        button2.style.border = "3px solid " + defaultBorderColor;
        button3.style.border = "3px solid " + defaultBorderColor;
        button1.classList.add("selected");
        button2.classList.remove("selected");
        button3.classList.remove("selected");
    }
});

button1.addEventListener("mouseenter", function() {
    // Apply hover styling when mouse enters the button
    button1.style.border = "3px solid purple";
});
button1.addEventListener("mouseleave", function() {
    // Check if the button is not selected
    if (!button1.classList.contains("selected")) {
        // Remove hover styling when mouse leaves the button
        button1.style.border = "3px solid " + defaultBorderColor;
    }
});

button2.addEventListener("click", function() {
    // Check if button is already selected
    if (button2.classList !== "selected") {
        // Reset border color for all buttons
        button1.style.border = "3px solid " + defaultBorderColor;
        button2.style.border = "3px solid purple";
        button3.style.border = "3px solid " + defaultBorderColor;
        button1.classList.remove("selected");
        button3.classList.remove("selected");
        button2.classList.add("selected");
    }
    button2.classList.remove("selected");
});

button2.addEventListener("mouseenter", function() {
    // Apply hover styling when mouse enters the button
    button2.style.border = "3px solid purple";
});

button2.addEventListener("mouseleave", function() {
    // Check if the button is not selected
    if (!button2.classList.contains("selected")) {
        // Remove hover styling when mouse leaves the button
        button2.style.border = "3px solid " + defaultBorderColor;
    }
});

button3.addEventListener("click", function() {
    // Check if button is already selected
    if (button3.classList !== "selected") {
        // Reset border color for all buttons
        button1.style.border = "3px solid " + defaultBorderColor;
        button2.style.border = "3px solid " + defaultBorderColor;
        button3.style.border = "3px solid purple";
        button1.classList.remove("selected");
        button2.classList.remove("selected");
        button3.classList.add("selected");
    }
});

button3.addEventListener("mouseenter", function() {
    // Apply hover styling when mouse enters the button
    button3.style.border = "3px solid purple";
});
button3.addEventListener("mouseleave", function() {
    // Check if the button is not selected
    if (!button3.classList.contains("selected")) {
        // Remove hover styling when mouse leaves the button
        button3.style.border = "3px solid " + defaultBorderColor;
    }
});