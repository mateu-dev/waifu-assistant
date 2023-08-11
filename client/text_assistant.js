const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recog = new SpeechRecognition();
const synth = window.speechSynthesis;

const voiceSelect = document.querySelector("#vs")
let voices

document.getElementById("btt").addEventListener("click", async () => {
    let said = document.getElementById("said").value;

    let response = await fetch(`/handle?command=${encodeURIComponent(said)}`);
    response = await response.text()
    console.log(said, " => ", response);

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
});

window.addEventListener("load", () => {
    populateVoiceList();
})

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

