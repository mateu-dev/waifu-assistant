const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recog = new SpeechRecognition();
const synth = window.speechSynthesis;

const voiceSelect = document.querySelector("#vs")
let voices

recog.lang = "en";
recog.continuous = true;
recog.interimResults = false;

recog.onresult = async evt => {
    let said = evt.results[evt.results.length - 1][0].transcript.toLowerCase();

    let response = await fetch(`/handle?command=${said}`);
    console.log(said, " => ", response);
    response = await response.text()

    let utterance = new SpeechSynthesisUtterance(response);

    const selectedOption = voiceSelect.selectedOptions[0].getAttribute("data-name");
    for (let i = 0; i < voices.length; i++) {
        if (voices[i].name === selectedOption) {
            utterance.voice = voices[i];
            break;
        }
    }
    utterance.pitch = 1;
    utterance.rate = 1;

    synth.speak(utterance);
};

recog.onerror = restart;

recog.start();

window.addEventListener("load", () => {
    const interval = window.setInterval(restart, 1000 * 60)
    populateVoiceList();
})

function restart() {
    console.log("Restarting...");
    try { recog.stop(); } catch (e) { }
    window.setTimeout(() => { recog.start() }, 1000)
}

function populateVoiceList() {
    voices = synth.getVoices()
    const selectedIndex =
        voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
    voiceSelect.innerHTML = "";

    for (let i = 0; i < voices.length; i++) {
        const option = document.createElement("option");
        option.textContent = `${voices[i].name} (${voices[i].lang})`;

        if (voices[i].default) {
            option.textContent += " -- DEFAULT";
        }

        option.setAttribute("data-lang", voices[i].lang);
        option.setAttribute("data-name", voices[i].name);
        voiceSelect.appendChild(option);
    }
    voiceSelect.selectedIndex = selectedIndex;
}

