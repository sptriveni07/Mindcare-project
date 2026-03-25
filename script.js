let chart;
let lastTopic = "";

// 🔥 UNLOCK AUDIO (IMPORTANT FIX)
document.addEventListener("click", () => {
    let alertSound = document.getElementById("alertSound");
    let calmSound = document.getElementById("calmSound");

    if (alertSound) {
        alertSound.play().then(() => {
            alertSound.pause();
            alertSound.currentTime = 0;
        }).catch(() => {});
    }

    if (calmSound) {
        calmSound.play().then(() => {
            calmSound.pause();
            calmSound.currentTime = 0;
        }).catch(() => {});
    }

}, { once: true });


// ================= ANALYZE =================
function analyze() {

    let loader = document.getElementById("loader");
    let popup = document.getElementById("popup");
    let result = document.getElementById("result");
    let advice = document.getElementById("advice");
    let progress = document.getElementById("progress");

    let alertSound = document.getElementById("alertSound");
    let calmSound = document.getElementById("calmSound");

    loader.style.display = "block";

    setTimeout(() => {

        let score = 0;

        // Questions
        for (let i = 1; i <= 10; i++) {
            score += Number(document.getElementById("q" + i).value);
        }

        // Sleep
        let sleep = Number(document.getElementById("sleep").value) || 0;

        if (sleep <= 4) score += 4;
        else if (sleep <= 6) score += 2;
        else if (sleep <= 8) score += 0;
        else score += 1;

        let percent = (score / 24) * 100;
        progress.style.width = percent + "%";

        stopAllSounds();

        // ================= RESULT =================
        if (score <= 6) {
            result.innerText = "Low Risk ✅";
            advice.innerText = "You're doing well 🌿 Keep maintaining healthy habits.";

            if (sleep < 6) {
                advice.innerText += "\n😴 Try improving your sleep schedule (7–8 hrs recommended).";
            }

            progress.style.background = "green";

            // 🎧 Calm sound
            calmSound.currentTime = 0;
            calmSound.play().catch(() => {});

            setTimeout(() => {
                calmSound.pause();
                calmSound.currentTime = 0;
            }, 5000);
        }
        else if (score <= 14) {
            result.innerText = "Moderate Risk ⚠️";
            advice.innerText = "Try relaxing, journaling, or talking to someone.";
            progress.style.background = "orange";
        }
        else {
            result.innerText = "High Risk 🚨";
            advice.innerText = "Please seek help immediately.\n📞 Kiran Helpline: 1800-599-0019";
            progress.style.background = "red";

            // 🔊 ALERT SOUND (FIXED)
              // 🔊 HIGH RISK SOUND FIX
alertSound.pause();
alertSound.currentTime = 0;

let playPromise = alertSound.play();

if (playPromise !== undefined) {
    playPromise.then(() => {
        // playing successfully
    }).catch(() => {
        console.log("Click anywhere once to enable sound");
    });
}

// stop after 5 sec
setTimeout(() => {
    alertSound.pause();
    alertSound.currentTime = 0;
}, 5000);
        }

        drawChart(score, sleep);

        loader.style.display = "none";
        popup.style.display = "block";

        setTimeout(() => {
            popup.style.display = "none";
        }, 4000);

        document.getElementById("chartCanvas").scrollIntoView({
            behavior: "smooth"
        });

    }, 1200);
}


// ================= STOP SOUNDS =================
function stopAllSounds() {
    let alertSound = document.getElementById("alertSound");
    let calmSound = document.getElementById("calmSound");

    [alertSound, calmSound].forEach(sound => {
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    });
}


// ================= CHART =================
function drawChart(score, sleep) {

    let ctx = document.getElementById("chartCanvas");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Stress Score", "Sleep Hours"],
            datasets: [{
                label: "Health Data",
                data: [score, sleep]
            }]
        }
    });
}


// ================= TYPING =================
function typeText(text, element) {
    element.innerHTML = "";
    let i = 0;

    let interval = setInterval(() => {
        element.innerHTML += text[i];
        i++;
        if (i >= text.length) clearInterval(interval);
    }, 25);
}


// ================= CHATBOT =================
function chat() {

    let inputBox = document.getElementById("userInput");
    let input = inputBox.value.toLowerCase().trim();
    let reply = document.getElementById("botReply");

    if (input === "") {
        typeText("Hey 😊 I'm here for you. Tell me how you're feeling 💬", reply);
        return;
    }

    let response = "";

    if (input.includes("sad") || input.includes("depressed")) {
        response = "I'm really sorry you're feeling this way 💙\nI'm here to listen.\nDo you want to share more?";
        lastTopic = "sad";
    }
    else if (input.includes("stress")) {
        response = "That sounds stressful 😌\nWhat’s causing it?";
        lastTopic = "stress";
    }
    else if (input.includes("anxious")) {
        response = "Take a slow breath 💚\nYou're safe.\nWant to try a breathing exercise?";
        lastTopic = "anxiety";
    }
    else if (input.includes("happy")) {
        response = "That’s great 😄✨\nWhat made your day better?";
        lastTopic = "happy";
    }
    else {
        response = "I'm here for you 💬\nTell me more.";
    }

    typeText(response, reply);
    inputBox.value = "";
}


// ================= DARK MODE =================
function toggleDark() {
    document.body.classList.toggle("dark");
}