const WHITE_KEYS = ["z", "x", "c", "v", "b", "n", "m", "q", "w", "e", "r", "t", "y", "u"];
const BLACK_KEYS = ["s", "d", "f", "h", "j", "2", "3", "4", "6", "7"];
const KEY_NAMES = [
    "F3", "Gb3", "G3", "Ab3", "A3", "Bb3", "B3", "C4", "Db4", "D4", "Eb4", "E4",
    "F4", "Gb4", "G4", "Ab4", "A4", "Bb4", "B4", "C5", "Db5", "D5", "Eb5", "E5",
];     // used to index keys, for changing chord button functions

const keys = document.querySelectorAll(".key");
const whiteKeys = document.querySelectorAll(".key.white");
const blackKeys = document.querySelectorAll(".key.black");
const body = document.getElementsByTagName("body")[0];

let ding = new Audio("notes/611112__5ro4__bell-ding-2.wav");
ding.volume = 0.3;

// Variable to fade sound using setInterval
let fade = [];     // 
let fadingNote = [];     // to store a list of notes that are in process of fading out

// Variables for dragging keys
let mouseDown = false;
let draggingKey = "";     // only 1 key can be dragged at a time 

keys.forEach(key => {
    // Play note when mouse clicks on the key
    key.addEventListener("mousedown", (ev) => {
        playNote([key.dataset.note]);
        mouseDown = true;
        draggingKey = key.dataset.note;
    });
    // key.addEventListener("mouseup", () => {
    //     stopNote([key.dataset.note]);
    //     mouseDown = false;
    // });
});

body.addEventListener("mousemove", (ev) => moveNote(ev));
body.addEventListener("mouseup", () => {
    if (draggingKey !== "") {
        stopNote([draggingKey]);
        let draggedKey = document.getElementById(draggingKey + "key");
        draggedKey.style.marginTop = null;
        draggingKey = "";
    }
});

// Play note when the keyboard is pressed
document.addEventListener("keydown", ev => {
    if (ev.repeat) return;     // If note is held down, it doesn't keep triggering the audio

    const key = ev.key;
    const whiteKeyIndex = WHITE_KEYS.indexOf(key);
    const blackKeyIndex = BLACK_KEYS.indexOf(key);

    if (whiteKeyIndex > -1) playNote([whiteKeys[whiteKeyIndex].dataset.note]);
    if (blackKeyIndex > -1) playNote([blackKeys[blackKeyIndex].dataset.note]);
});

document.addEventListener("keyup", ev => {
    const key = ev.key;
    const whiteKeyIndex = WHITE_KEYS.indexOf(key);
    const blackKeyIndex = BLACK_KEYS.indexOf(key);

    if (whiteKeyIndex > -1) stopNote([whiteKeys[whiteKeyIndex].dataset.note]);
    if (blackKeyIndex > -1) stopNote([blackKeys[blackKeyIndex].dataset.note]);
});


// ========================= Function Declarations =========================
function playNote(keys, chord) {
    keys.forEach(key => {
        let noteAudio = document.getElementById(key);

        // If previous fading note is same as the note currently pressed, it resets
        if (fadingNote.includes(key)) {
            clearInterval(fade.splice(fadingNote.indexOf(key), 1));
            fadingNote.splice(fadingNote.indexOf(key), 1);
        };

        noteAudio.volume = 1;
        noteAudio.currentTime = 0;     // Plays audio from beginning
        noteAudio.play();

        // Key is pressed, color changes
        document.getElementById(key + "key").classList.add("active");
    });

    // If a chord is played, it last only 1s
    if (chord) {
        setTimeout(stopNote, 1000, keys);
    };
}

function stopNote(keys) {
    keys.forEach(key => {
        if (fadingNote.includes(key)) {
            clearInterval(fade.splice(fadingNote.indexOf(key), 1));
            fadingNote.splice(fadingNote.indexOf(key), 1);
        };

        let noteAudio = document.getElementById(key);

        // Fade out volume by repeatedly lowering volume
        fadingNote.push(key);

        // fade.push(setInterval(() => {
        //     noteAudio.volume = Math.max(0, noteAudio.volume - 0.05);
        //     // console.log(fade);
        //     let interval = fade[fade.length - 1];

        //     if (noteAudio.volume < 0.10) {
        //         console.log(fade);
        //         console.log(fade.indexOf(interval))
        //         clearInterval(fade[fade.indexOf(interval)]);
        //         fade.splice(fade.indexOf(interval), 1);
        //         fadingNote.splice(fadingNote.indexOf(key), 1);
        //         noteAudio.pause();
        //     }

        // }, 20));

        // if (noteAudio.volume < 0.1) {
        //     console.log(fadingNote);
        //     fadingNote.splice(fadingNote.indexOf(key), 1);
        //     noteAudio.pause();
        // } else {
        //     setTimeout(decreaseVolume, 20, noteAudio, key);
        // }

        decreaseVolume(noteAudio, key);

        // Key is unpressed, color changes back
        document.getElementById(key + "key").classList.remove("active");
    });
}

function decreaseVolume(noteAudio, key) {
    noteAudio.volume = Math.max(0, noteAudio.volume - 0.05)
    if (noteAudio.volume < 0.1) {
        console.log(fadingNote);
        fadingNote.splice(fadingNote.indexOf(key), 1);
        noteAudio.pause();
    } else {
        setTimeout(decreaseVolume, 20, noteAudio, key);
    };   
}

function moveNote(ev) {
    ev.preventDefault();     // Helps it be less buggy somehow
    if (draggingKey === "") return;

    if (mouseDown) {
        let dragKey = document.getElementById(draggingKey + "key");
        let margin = dragKey.style.marginTop;
        if (margin !== "") {
            let newmargin = parseInt(margin.substring(0, margin.length - 2)) + ev.movementY;
            if (newmargin < 2) return;     // So that keys are not dragged upwards
            dragKey.style.marginTop = newmargin + "px";
            if (newmargin > 100) {
                mouseDown = false
                ding.currentTime = 0;
                ding.play();
                dragKey.style.marginTop = null;
                changeButtons(draggingKey);
                return;
            }
        } else {
            if (ev.movementY < 2) return;
            dragKey.style.marginTop = ev.movementY + "px";
        }
    }    
}

function changeButtons(newKey) {
    let keyNoOctave = newKey.substring(0, newKey.length - 1);     // remove the octave
    let keyPos = KEY_NAMES.indexOf(newKey);
    console.log("Index of " + newKey + " is " + keyPos);

    // Get chord buttons
    let chord_135 = document.getElementById("135");
    let chord_1b35 = document.getElementById("1b35");
    let chord_1235 = document.getElementById("1235");
    let chord_125 = document.getElementById("125");
    let chord_145 = document.getElementById("145");
    let chord_15 = document.getElementById("15");
    let chord_1b35b7 = document.getElementById("1b35b7");
    let chord_135b7 = document.getElementById("135b7");

    // Change button text to new chords
    chord_135.innerHTML = keyNoOctave;
    chord_1b35.innerHTML = keyNoOctave + "m";
    chord_1235.innerHTML = keyNoOctave + "2";
    chord_125.innerHTML = keyNoOctave + "sus2";
    chord_145.innerHTML = keyNoOctave + "sus4";
    chord_15.innerHTML = keyNoOctave + "5";
    chord_1b35b7.innerHTML = keyNoOctave + "m7";
    chord_135b7.innerHTML = keyNoOctave + "7";

    // Change button functions
    if (keyPos >= 12) keyPos -= 12;     // Play lower octave when it gets too high (beyond F4)
    chord_135.setAttribute("onclick", `playNote(["${KEY_NAMES[keyPos]}", "${KEY_NAMES[keyPos + 4]}", "${KEY_NAMES[keyPos + 7]}"], true)`);
    chord_1b35.setAttribute("onclick", `playNote(["${KEY_NAMES[keyPos]}", "${KEY_NAMES[keyPos + 3]}", "${KEY_NAMES[keyPos + 7]}"], true)`);
    chord_1235.setAttribute("onclick", `playNote(["${KEY_NAMES[keyPos]}", "${KEY_NAMES[keyPos + 2]}", "${KEY_NAMES[keyPos + 4]}", "${KEY_NAMES[keyPos + 7]}"], true)`);
    chord_125.setAttribute("onclick", `playNote(["${KEY_NAMES[keyPos]}", "${KEY_NAMES[keyPos + 2]}", "${KEY_NAMES[keyPos + 7]}"], true)`);
    chord_145.setAttribute("onclick", `playNote(["${KEY_NAMES[keyPos]}", "${KEY_NAMES[keyPos + 5]}", "${KEY_NAMES[keyPos + 7]}"], true)`);
    chord_15.setAttribute("onclick", `playNote(["${KEY_NAMES[keyPos]}", "${KEY_NAMES[keyPos + 7]}"], true)`);
    chord_1b35b7.setAttribute("onclick", `playNote(["${KEY_NAMES[keyPos]}", "${KEY_NAMES[keyPos + 3]}", "${KEY_NAMES[keyPos + 7]}", "${KEY_NAMES[keyPos + 10]}"], true)`);
    chord_135b7.setAttribute("onclick", `playNote(["${KEY_NAMES[keyPos]}", "${KEY_NAMES[keyPos + 4]}", "${KEY_NAMES[keyPos + 7]}", "${KEY_NAMES[keyPos + 10]}"], true)`);
}