// Simulate a delay (e.g., fetching data)
function simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 300)); // 5000 milliseconds = 5 seconds
}

// Start loading data when the page loads
window.addEventListener('load', async function () {
    // Show the loading screen
    const loadScreen = document.getElementById('loading');

    let getLvDataPromise = assignLvData();
    let gettotalgoldPromise = gettotalgold();
    let fetchHypixelApiPromise = fetchHypixelApi();

    // Start fetching the data
    Promise.all([getLvDataPromise, gettotalgoldPromise, fetchHypixelApiPromise])
        .then(async (values) => {
            // All data has been fetched at this point, perform calculations.
            let totalGold = values[1];
            let hypixelPrices = values[2];
            performCalculations(totalGold, hypixelPrices);

            // Simulate a delay
            await simulateDelay();

            // Call the function once at the start to initialize sizes.
            setRowHeight();

            // Hide the loading screen
            loadScreen.style.opacity = '0';
            loadScreen.style.transition = 'opacity 1s ease-out';

            setTimeout(function () {
                loadScreen.style.display = 'none';

                // Trigger the grid animation
                animateGrid();

            }, 1000); // match this to the length of the transition
        })
        .catch(err => {
            // Error occurred in one of the promises.
            console.error(err);
        });
});

// Animate the grid
function animateGrid() {
    const grid_timer = document.getElementById('grid_timer');
    const name = document.getElementById('name');
    const light_dark = document.getElementById('light_dark');
    const production = document.getElementById('production');
    const composter = document.getElementById('composter');
    const grid_submit = document.getElementById('grid_submit');
    const price = document.getElementById('price');

    grid_timer.style.animation = 'slideIn 1s forwards';
    name.style.animation = 'slideIn 1s 0.5s forwards';
    light_dark.style.animation = 'slideIn 1s 1s forwards';
    production.style.animation = 'slideIn 1s 1.5s forwards';
    composter.style.animation = 'slideIn 1s 2s forwards';
    grid_submit.style.animation = 'slideIn 2.5s 1s forwards';
    price.style.animation = 'slideIn 1s 3s forwards';
}


// Height and width for light/dark mode
function setRowHeight() {
    let base_width_light_dark = document.getElementById('light_dark');
    let width = base_width_light_dark.offsetWidth;
    let heigth = base_width_light_dark.offsetHeight;
    let unit_width = (width / 2) - 8;

    // Get the grid container
    let gridContainer = document.getElementById('grid-container');

    if (window.innerWidth > 800) {
        gridContainer.style.gridTemplateRows = `${unit_width}px ${unit_width}px auto auto auto auto auto auto auto auto auto`;
    } else {
        gridContainer.style.gridTemplateRows = `${width}px auto auto auto auto auto`;
    }
};

// Add the event listener to handle window resizing.
window.addEventListener('resize', setRowHeight);

// DARK MODE------------------------------------------------------

// selectors
const lightDark = document.querySelector('#switch');

// state
let theme = localStorage.getItem('theme');

// on mount
if (theme) {
    document.body.classList.add(theme);
    // if the saved theme is dark-mode, set the image to moon
    if (theme === 'dark-mode') {
        lightDark.style.backgroundImage = 'url("./img/moon.png")';
    }
    // else, set the image to sun
    else {
        lightDark.style.backgroundImage = 'url("./img/sun.png")';
    }
}

//moon sun animation
window.addEventListener('load', function () {
    lightDark.onclick = function () {
        // Slide out
        lightDark.style.animation = 'slideOut 2s forwards';

        setTimeout(function () {
            // When the animation is halfway done (the sun/moon is off-screen), toggle the theme
            if (document.body.classList.contains('dark-mode')) {
                document.body.classList.remove('dark-mode');
                localStorage.removeItem('theme');
            } else {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            }
        }, 1000); // Half of the animation duration

        setTimeout(function () {
            // When the animation ends, hide the element
            lightDark.style.display = 'none';

            // Check what the current background image is
            var currentBackground = getComputedStyle(lightDark).backgroundImage;

            // If it's currently the sun, change it to the moon
            if (currentBackground.includes('sun.png')) {
                lightDark.style.backgroundImage = 'url("./img/moon.png")';
            }
            // If it's currently the moon, change it to the sun
            else {
                lightDark.style.backgroundImage = 'url("./img/sun.png")';
            }

            // Position the element off the right side of the screen
            lightDark.style.left = '100vw';

            // Make the element visible again
            lightDark.style.display = '';

            // Slide in
            lightDark.style.animation = 'slideInFromRight 2s forwards';
        }, 2000);
    };
});









// CALCULATION AREA ---------------------------------------------

//Composter level -----------------------------------------------------------


let start_lv; // global scope

//get lv data from the server
async function getLvData() {
    try {
        const res = await fetch('https://api.skyblockdata.fr/lv');
        const start = await res.json(); //need a global variable to store the data
        const properties = ['speed', 'multiDrop', 'fuel', 'biomass', 'c_Reduction']; // list of properties to update

        properties.forEach(property => {
            document.getElementById(property).textContent = property.charAt(0).toUpperCase() + property.slice(1) + " level : " + start[property];
            const inputElement = document.getElementById(property + 'Input');
            inputElement.placeholder = start[property];  // set data as placeholder
            inputElement.addEventListener('focus', function () {
                this.value = start[property];  // set data as value when input is focused
            });
        });
        return start;
    } catch (err) {
        console.error(err);
        alert("Error getting data from server for lv.");
    }
};

// Call the async function and assign the result to start_lv
async function assignLvData() {
    start_lv = await getLvData();
    return start_lv;
}

//verify if the input is valid and assign it to variable
function Form_Data() {

    // Get form values
    let New_speed = document.getElementById('speedInput').value;
    let New_multiDrop = document.getElementById('multiDropInput').value;
    let New_fuel = document.getElementById('fuelInput').value;
    let New_biomass = document.getElementById('biomassInput').value;
    let New_c_Reduction = document.getElementById('c_ReductionInput').value;

    //if the input is empty, use the placeholder
    if (New_speed == "") {
        New_speed = start_lv.speed;
    }
    if (New_multiDrop == "") {
        New_multiDrop = start_lv.multiDrop;
    }
    if (New_fuel == "") {
        New_fuel = start_lv.fuel;
    }
    if (New_biomass == "") {
        New_biomass = start_lv.biomass;
    }
    if (New_c_Reduction == "") {
        New_c_Reduction = start_lv.c_Reduction;
    }


    // new_lv object
    let new_lv = {
        speed: New_speed,
        multi_drop: New_multiDrop,
        fuel: New_fuel,
        biomass: New_biomass,
        c_reduction: New_c_Reduction
    };
    console.log(new_lv);
    return new_lv;
};

// Function to send data to the server
async function handleClick() {
    // Get form data
    let answer = Form_Data();

    // Send a POST request to the server
    try {
        let response = await fetch('https://api.skyblockdata.fr/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answer),
        });


        let result = await response.json();
        if (response.ok) {  // Check if HTTP status code is 200-299
            console.log('Success:', result);
            alert("Success : " + result.message);
        } else {
            console.log('Error:', result);
            alert("Error : " + result.message);
        }

    } catch (error) {
        console.error('Error:', error);
        alert("Error :" + error);
    }
};


//Submit button event listener
document.getElementById('submitButton').addEventListener('click', async function (event) {
    try {
        await postGold(goldtoadd);

        // Call handleClick
        await handleClick(event);

        // Then reset the timer
        await resetTimer();

        // Finally, reload the page
        location.reload();
    } catch (err) {
        console.error(err);
        alert("An error occurred during the operation");
    }
});


//Manage Total Gold -----------------------------------------------------------

async function gettotalgold() {
    try {
        const response = await fetch('https://api.skyblockdata.fr/gettotalgold');
        if (!response.ok) {
            throw new Error('Failed to fetch data from the server');
        }
        let totalgold = await response.json();
        return totalgold;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

//fonction to post : goldtoadd

function postGold(goldtoadd) {
    // Send the data to the server
    fetch('https://api.skyblockdata.fr/posttotalgold', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            gold: goldtoadd
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


//Hypixelapi -----------------------------------------------------------

async function fetchHypixelApi() {
    try {
        const response = await fetch('https://api.skyblockdata.fr/hypixelapi');
        if (!response.ok) {
            throw new Error('Failed to fetch data from the server');
        }
        const hypixelPrices = await response.json();
        return hypixelPrices;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

//Timer -----------------------------------------------------------


//initialize the timer
let countdown;
let countdownInterval;

//get the timer from the server
async function getTimer() {

    // Clear first timer if it exists
    try {
        const res = await fetch('https://api.skyblockdata.fr/timer');
        const data = await res.json();
        return data.timer;
    } catch (err) {
        console.error(err);
        alert("Error getting data from server for timer");
    }
};

//display the timer
function displayTimeLeft(seconds) {
    seconds = Math.round(seconds); // Round seconds to nearest whole number
    if (seconds <= 0) {
        document.getElementById('timer-display').textContent = "00:00:00";
        return; // Ensure no further execution in this function
    }
    const hours = Math.floor(seconds / 3600);
    const remainderMinutes = Math.floor((seconds % 3600) / 60);
    const remainderSeconds = seconds % 60;
    const display = `${hours}:${remainderMinutes < 10 ? '0' : ''}${remainderMinutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    document.title = display;
    document.getElementById('timer-display').textContent = display;
};

let goldtoadd;

//define start the timer
async function timer() {
    countdown = await getTimer();

    countdownInterval = setInterval(async () => {
        countdown -= 1;

        // Synchronise User each minutes
        if (countdown % 60 === 0) {
            const serverCountdown = await getTimer();  // Fetch the server's countdown

            // 4 is for safety
            if (serverCountdown > (countdown + 4)) {
                location.reload();  // Refresh the page if the server's countdown is greater
            }
            else {
                countdown = serverCountdown;  // Otherwise, simply update the countdown
            }
        }

        if (countdown < 1 && countdown >= -2) {

            // Play a sound when the timer reaches zero
            new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3').play();

            setTimeout(function () {
                document.title = 'Timer Finished!';
            }, 1000); // Delay the title change by 1 second to ensure it takes effect
        }

        displayTimeLeft(countdown);
        updatePercentage(); // Update the percentage (fonction at the bottom)

        //gold per fill
        let corrected_percentage = percentageTimePassed;

        // Ensure percentageTimePassed is not negative
        if (corrected_percentage <= 0) {
            corrected_percentage = 0;
        }

        document.getElementById("production-num5").innerText = (Math.round(gold_per_refill * ((100 - corrected_percentage) / 100))).toLocaleString('fr-FR');
        goldtoadd = (gold_per_refill * ((100 - corrected_percentage) / 100));
    }, 1000);

};

//reset the timer
function resetTimer() {
    return fetch('https://api.skyblockdata.fr/reset', { method: 'POST' })
        .then((res) => res.json())
        .then((data) => {
            countdown = data.timer;
            displayTimeLeft(countdown);
        })
        .catch((err) => {
            console.error(err);
            alert("Error resetting timer");
        });
};


document.getElementById('reset-button').addEventListener('click', async function (event) {
    try {
        await postGold(goldtoadd);

        // Then reset the timer
        await resetTimer();
      
        // Finally, reload the page
        location.reload();
    } catch (err) {
        console.error(err);
        alert("An error occurred");
    }
});

//Calculate variables -----------------------------------------------------------

// Declare the variable globally
let time_between_refill;
let gold_per_refill;

function performCalculations(totalGold, hypixelPrices) {
    all_time_profit = totalGold.totalgold.totalgold;
    let p_compost = hypixelPrices.compost;
    let p_BOS = hypixelPrices.boxOfSeeds;
    let p_OL = hypixelPrices.oilBarrel;
    let speed = start_lv.speed;
    let multiDrop = start_lv.multiDrop;
    let fuel = start_lv.fuel;
    let biomass = start_lv.biomass;
    let c_Reduction = start_lv.c_Reduction;

    // MD = Multi Drop, BOS = Box Of Seeds, OB = Oil Barrel
    let BOS_capicity = 25000
    let OL_capacity = 10000
    let biomass_Capacity = 40000 + (20000 * biomass);
    let fuel_Capacity = 100000 + (30000 * fuel);
    let biomass_cost_per_compost = 4000 * (1 - (c_Reduction * 0.01));
    let biomass_cost_per_fuel = 2000 * (1 - (c_Reduction * 0.01));
    let time_per_compost = 600 / (1 + (0.2 * speed));
    let nb_of_compost_per_refill = Math.floor(biomass_Capacity / biomass_cost_per_compost);
    let nb_of_compost_MD_per_refill = nb_of_compost_per_refill * (1 + 0.03 * multiDrop);
    let nb_BOS_per_fill = biomass_Capacity / BOS_capicity;
    let nb_OL_per_fill = (nb_of_compost_per_refill * biomass_cost_per_fuel) / OL_capacity;
    let p_compost_per_refill = p_compost * nb_of_compost_per_refill;
    let p_compost_MD_per_refill = p_compost * nb_of_compost_MD_per_refill;
    let gold_diff_per_refill_compost_compostMD = p_compost_MD_per_refill - p_compost_per_refill;
    let p_BOS_per_refill = p_BOS * nb_BOS_per_fill;
    let p_OL_per_refill = p_OL * nb_OL_per_fill;
    gold_per_refill = Math.floor(p_compost_MD_per_refill - (p_BOS_per_refill + p_OL_per_refill));

    console.log("all_time_profit : " + all_time_profit);

    //time variables
    time_between_refill = time_per_compost * nb_of_compost_per_refill;
    let time_in_hours = time_between_refill / 3600.0


    //price variable to display
    document.getElementById("1compost").innerHTML = "x1 : <strong>" + Math.round(p_compost / 1000) + "k</strong>";
    document.getElementById("64compost").innerHTML = "x64 : <strong>" + (Math.round((p_compost * 64) / 100000) / 10) + "M</strong>";
    document.getElementById("PFcompost").innerHTML = "PF : <strong>" + (Math.round(p_compost_MD_per_refill / 100000) / 10) + "M</strong>";

    document.getElementById("1bos").innerHTML = "x1 : <strong>" + Math.round(p_BOS / 1000) + "k</strong>";
    document.getElementById("64bos").innerHTML = "x64 : <strong>" + (Math.round((p_BOS * 64) / 100000) / 10) + "M</strong>";
    document.getElementById("PFbos").innerHTML = "PF : <strong>" + (Math.round(p_BOS_per_refill / 100000) / 10) + "M</strong>";

    document.getElementById("1ob").innerHTML = "x1 : <strong>" + Math.round(p_OL / 1000) + "k</strong>";
    document.getElementById("64ob").innerHTML = "x64 : <strong>" + (Math.round((p_OL * 64) / 100000) / 10) + "M</strong>";
    document.getElementById("PFob").innerHTML = "PF : <strong>" + (Math.round(p_OL_per_refill / 100000) / 10) + "M</strong>";


    //production variable to display
    document.getElementById("production-num1").innerText = (nb_of_compost_MD_per_refill / time_in_hours);
    document.getElementById("production-num2").innerText = nb_of_compost_MD_per_refill.toFixed(2);
    document.getElementById("production-num3").innerText = Math.round((gold_per_refill / time_in_hours) / 1000) + " K";
    document.getElementById("production-num4").innerText = (gold_per_refill / 1000000).toFixed(2) + " M";
    //the fith is in timer
    document.getElementById("production-num6").innerText = Math.round(all_time_profit / 1000000) + " M";
};

let percentageTimePassed;

// Function to calculate the percentage of time that has passed
function updatePercentage() {
    percentageTimePassed = ((countdown / time_between_refill) * 100);

    document.getElementById('hover-text_composter').textContent = percentageTimePassed.toFixed(2) + "%";

    let orange = "img/yellow_stained_glass.png";
    let red = "img/red_stained_glass.png";

    if (percentageTimePassed < 99) {
        document.getElementById("cropmeter1").src = orange;
        document.getElementById("fuelmeter1").src = orange;
    }
    if (percentageTimePassed < 80) {
        document.getElementById("cropmeter1").src = red;
        document.getElementById("fuelmeter1").src = red;
        document.getElementById("cropmeter2").src = orange;
        document.getElementById("fuelmeter2").src = orange;
    }
    if (percentageTimePassed < 60) {
        document.getElementById("cropmeter2").src = red;
        document.getElementById("fuelmeter2").src = red;
        document.getElementById("cropmeter3").src = orange;
        document.getElementById("fuelmeter3").src = orange;
    }
    if (percentageTimePassed < 40) {
        document.getElementById("cropmeter3").src = red;
        document.getElementById("fuelmeter3").src = red;
        document.getElementById("cropmeter4").src = orange;
        document.getElementById("fuelmeter4").src = orange;
    }
    if (percentageTimePassed < 20) {
        document.getElementById("cropmeter4").src = red;
        document.getElementById("fuelmeter4").src = red;
        document.getElementById("cropmeter5").src = orange;
        document.getElementById("fuelmeter5").src = orange;
    }
    if (percentageTimePassed <= 0) {
        document.getElementById("cropmeter5").src = red;
        document.getElementById("fuelmeter5").src = red;
    }
};



//start the timer
timer();
