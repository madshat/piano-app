// Load Audio: Bell Sound
let ding = new Audio("notes/611112__5ro4__bell-ding-2.wav");
ding.volume = 0.3;

// Variables: Progression Box
let boxValues = [['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4']];     // Stores the notes to be played by each chord
let boxStatus = [false, false, false, false];     // Stores the "modifying" status of each box
let boxElements = document.querySelectorAll(".box");

// Variables: Notes
let playingNotes = [];     // Stores notes that are currently playing
let fadingNotes = [];     // Stores notes that are currently fading out

// Variables: Mouse Interaction
let draggingKey = "";     // Specifies the key that is being dragged 

// Variables: Wave & Progression Status
let stopWave = true;     // true = Waves will stop animating
let progressionPlaying = false;     // true = Progression is playing

// ================================= 1) Function Declarations =================================

// ------------ Function 1: Change the status of the progression box ------------
function toggleBox(boxNo) {
    if (boxStatus[boxNo]) {
        boxStatus[boxNo] = false;     // false: Change box value if a chord button is pressed
        document.getElementById("grid" + boxNo).classList.remove("active");
    } else {
        boxStatus[boxNo] = true;     // true: Change box value if a chord button is pressed
        document.getElementById("grid" + boxNo).classList.add("active");
    }     
}     

// ------------ Function 2: Play a Note ------------
// Example: playNote(['C4', 'E4, 'G4'], true, 'C')
function playNote(notes, chord, chordname) {
    let notesToPlay = [];     // Stores all notes to be played
    
    // Set up the notes to be played
    notes.forEach(note => {
        // Debugging Chunk: If note is found in fadingNotes, it gets removed from the array as it will be restarted.
        if (fadingNotes.includes(note)) {
            fadingNotes.splice(fadingNotes.indexOf(note), 1); 
        };

        let noteAudio = document.getElementById(note);
        noteAudio.volume = 1;     // Resets volume to 1 
        noteAudio.currentTime = 0;     // Plays audio from beginning
        notesToPlay.push(noteAudio);
        playingNotes.push(note);     // Adds note into playingNotes array

        // Key is pressed, color changes
        document.getElementById(note + "key").classList.add("active");
    });

    // Plays all notes at once
    notesToPlay.forEach(noteAudio => {
        noteAudio.play();
    });

    // If the function is called by a chord button...
    if (chord) {
        setTimeout(stopNote, 1000, notes);     // Chords will only play for 1 second

        stopWave = false;
        animateWave();

        setTimeout(function() {stopWave = true}, 1000);

        // Add chord to progression boxes
        for (let i = 0; i < boxStatus.length; i++) {
        	if (boxStatus[i]) {
        		boxValues[i] = notes;     // Stores the notes that each box represents

                // Modifies the text in the box to the new chord
                if (chordname.slice(1,2) == 'b') {
                    boxElements[i].innerHTML = chordname.slice(0, 2) + "<span>" + chordname.slice(2) + "</span>";
                } else {
            		boxElements[i].innerHTML = chordname.slice(0, 1) + "<span'>" + chordname.slice(1) + "</span>";
        		}

                toggleBox(i)     // Reset the box status
        	}
        }
    };
}

// ------------ Function 3a: Stops a note from playing ------------
// Example: stopNote(['C4', 'D4', 'G4'])
function stopNote(notes) {
    notes.forEach(note => {
        let noteAudio = document.getElementById(note);

        fadingNotes.push(note);     // Adds note into fadingNotes array
        playingNotes.splice(playingNotes.indexOf(note), 1);     // Remove note from playingNotes array
        decreaseVolume(noteAudio, note);
    });
}

// ------------ Function 3b: Fades out a note ------------
function decreaseVolume(noteAudio, key) {
    if (fadingNotes.filter(x => x === key).length > 1) {
        fadingNotes.splice(fadingNotes.indexOf(key), 1);
    };

    if (!playingNotes.includes(key)) {
        document.getElementById(key + "key").classList.remove("active");
        noteAudio.volume = Math.max(0, noteAudio.volume - 0.05)

        if (noteAudio.volume < 0.1) {
            fadingNotes.splice(fadingNotes.indexOf(key), 1);
            noteAudio.pause();
        } else {
            setTimeout(decreaseVolume, 20, noteAudio, key);
        };   
    } else {
    }
}

// ------------ Function 4: Move the div of a key ------------
function moveNote(e) {
    // Get current margin of key
    let dragKey = document.getElementById(draggingKey + "key");
    let margin = dragKey.style.marginTop;

    if (margin !== "") {
        let newmargin = parseInt(margin.substring(0, margin.length - 2)) + e.movementY;

        if (newmargin < 1) return;     // So that keys are not dragged upwards
        if (newmargin > 90) {
            ding.currentTime = 0;
            ding.play();
            dragKey.style.marginTop = null;
            changeButtons(draggingKey);
            stopNote([draggingKey]);
            draggingKey = "";
            return;
        }

        dragKey.style.marginTop = newmargin + "px";
    } else {
        if (e.movementY < 1) return;     // So that keys are not dragged upwards
        dragKey.style.marginTop = e.movementY + "px";
    }
}

// ------------ Function 5: Change chord buttons ------------
const KEY_NAMES = [
    "F3", "Gb3", "G3", "Ab3", "A3", "Bb3", "B3", "C4", "Db4", "D4", "Eb4", "E4",
    "F4", "Gb4", "G4", "Ab4", "A4", "Bb4", "B4", "C5", "Db5", "D5", "Eb5", "E5",
];     // used to index keys, for changing chord button functions

// Get chord buttons
let chord_135 = document.getElementById("135");
let chord_1b35 = document.getElementById("1b35");
let chord_1235 = document.getElementById("1235");
let chord_125 = document.getElementById("125");
let chord_145 = document.getElementById("145");
let chord_15 = document.getElementById("15");
let chord_1b35b7 = document.getElementById("1b35b7");
let chord_135b7 = document.getElementById("135b7");
let chord_1357 = document.getElementById("1357");

// Example: changeButtons('D4')
function changeButtons(newKey) {
    let keyNoOctave = newKey.substring(0, newKey.length - 1);     // Remove the octave, keep just the letter
    let keyPos = KEY_NAMES.indexOf(newKey);

    // Change button text to new chords
    chord_135.innerHTML = keyNoOctave;
    chord_1b35.innerHTML = keyNoOctave + "m";
    chord_1235.innerHTML = keyNoOctave + "2";
    chord_125.innerHTML = keyNoOctave + "sus2";
    chord_145.innerHTML = keyNoOctave + "sus4";
    chord_15.innerHTML = keyNoOctave + "5";
    chord_1b35b7.innerHTML = keyNoOctave + "m7";
    chord_135b7.innerHTML = keyNoOctave + "7";
    chord_1357.innerHTML = keyNoOctave + "maj7";

    // Change button html functions
    if (keyPos >= 12) keyPos -= 12;     // Play lower octave when it gets too high (beyond F4)
    chord_135.setAttribute("onclick", `playNote(["${KEY_NAMES[keyPos]}", "${KEY_NAMES[keyPos + 4]}", "${KEY_NAMES[keyPos + 7]}"], true, "${chord_135.innerHTML}")`);
    chord_1b35.setAttribute("onclick", `playNote(["${KEY_NAMES[keyPos]}", "${KEY_NAMES[keyPos + 3]}", "${KEY_NAMES[keyPos + 7]}"], true, "${chord_1b35.innerHTML}")`);
    chord_1235.setAttribute("onclick", `playNote(["${KEY_NAMES[keyPos]}", "${KEY_NAMES[keyPos + 2]}", "${KEY_NAMES[keyPos + 4]}", "${KEY_NAMES[keyPos + 7]}"], true, "${chord_1235.innerHTML}")`);
    chord_125.setAttribute("onclick", `playNote(["${KEY_NAMES[keyPos]}", "${KEY_NAMES[keyPos + 2]}", "${KEY_NAMES[keyPos + 7]}"], true, "${chord_125.innerHTML}")`);
    chord_145.setAttribute("onclick", `playNote(["${KEY_NAMES[keyPos]}", "${KEY_NAMES[keyPos + 5]}", "${KEY_NAMES[keyPos + 7]}"], true, "${chord_145.innerHTML}")`);
    chord_15.setAttribute("onclick", `playNote(["${KEY_NAMES[keyPos]}", "${KEY_NAMES[keyPos + 7]}"], true, "${chord_15.innerHTML}")`);
    chord_1b35b7.setAttribute("onclick", `playNote(["${KEY_NAMES[keyPos]}", "${KEY_NAMES[keyPos + 3]}", "${KEY_NAMES[keyPos + 7]}", "${KEY_NAMES[keyPos + 10]}"], true, "${chord_1b35b7.innerHTML}")`);
    chord_135b7.setAttribute("onclick", `playNote(["${KEY_NAMES[keyPos]}", "${KEY_NAMES[keyPos + 4]}", "${KEY_NAMES[keyPos + 7]}", "${KEY_NAMES[keyPos + 10]}"], true, "${chord_135b7.innerHTML}")`);
    chord_1357.setAttribute("onclick", `playNote(["${KEY_NAMES[keyPos]}", "${KEY_NAMES[keyPos + 4]}", "${KEY_NAMES[keyPos + 7]}", "${KEY_NAMES[keyPos + 11]}"], true, "${chord_1357.innerHTML}")`);
}

// ------------ Function 6: Loop Chord Progression ------------
// Example: INCOMPLETE
function playProgression(loop, BPM) {
    if (progressionPlaying) return;     // if button is clicked while previous progression is still playing, it will return

    progressionPlaying = true;

    for (let i = 0; i < boxStatus.length; i++) {     // makes sure grid values don't change
        boxStatus[i] = false;
    };

    let beatTime = 60/BPM;

    stopWave = false;
    animateWave();

    playNote(boxValues[0], true);
    setTimeout(playNote, beatTime*1000, boxValues[0], true);
    setTimeout(playNote, beatTime*2*1000, boxValues[0], true);
    setTimeout(playNote, beatTime*3*1000, boxValues[0], true);
    setTimeout(playNote, beatTime*4*1000, boxValues[1], true);
    setTimeout(playNote, beatTime*5*1000, boxValues[1], true);
    setTimeout(playNote, beatTime*6*1000, boxValues[1], true);
    setTimeout(playNote, beatTime*7*1000, boxValues[1], true);
    setTimeout(playNote, beatTime*8*1000, boxValues[2], true);
    setTimeout(playNote, beatTime*9*1000, boxValues[2], true);
    setTimeout(playNote, beatTime*10*1000, boxValues[2], true);
    setTimeout(playNote, beatTime*11*1000, boxValues[2], true);
    setTimeout(playNote, beatTime*12*1000, boxValues[3], true);
    setTimeout(playNote, beatTime*13*1000, boxValues[3], true);
    setTimeout(playNote, beatTime*14*1000, boxValues[3], true);
    setTimeout(playNote, beatTime*15*1000, boxValues[3], true);

    setTimeout(function() {progressionPlaying = false}, beatTime*16*1000);

    if (loop) {
        setTimeout(playProgression, beatTime*16*1000, true, BPM);
    };
}

// ------------ Function 7: Get a New Random Wave ------------
// x_10 = 10% of width, y_50 = 50% of height
function getRandomWave(x_10, y_50) {
    let startY = Math.random()*y_50+50;
    return `M0,${startY}
    R${x_10}, ${Math.random()*y_50+50}, ${x_10*2}, ${Math.random()*y_50+50},
    ${x_10*3}, ${Math.random()*y_50+50}, ${x_10*4}, ${Math.random()*y_50+50},
    ${x_10*5}, ${Math.random()*y_50+50}, ${x_10*6}, ${Math.random()*y_50+50},
    ${x_10*7}, ${Math.random()*y_50+50}, ${x_10*8}, ${Math.random()*y_50+50},
    ${x_10*9}, ${Math.random()*y_50+50}, ${x_10*10.5}, ${Math.random()*y_50+50},
    L${x_10*10.5},1000
    L0,1000
    L0,${startY}`
}

// ------------ Function 8: Animate the Wave ------------
function animateWave() {
    if (stopWave) return;
    wave.animate({"path": getRandomWave(x_10, y_50)}, 1000, animateWave);
}


// ================================= 2) Play note when computer keyboard is pressed =================================
const COMP_WHITE_KEYS = ["z", "x", "c", "v", "b", "n", "m", "q", "w", "e", "r", "t", "y", "u"];
const COMP_BLACK_KEYS = ["s", "d", "f", "h", "j", "2", "3", "4", "6", "7"];
const white_keys = document.querySelectorAll(".key.white");
const black_keys = document.querySelectorAll(".key.black");

document.addEventListener("keydown", (e) => {
    if (e.repeat) return;     // If computer key is held down, it doesn't keep triggering the audio

    const whiteIndex = COMP_WHITE_KEYS.indexOf(e.key);
    const blackIndex = COMP_BLACK_KEYS.indexOf(e.key);

    if (whiteIndex > -1) playNote([white_keys[whiteIndex].dataset.note]);
    if (blackIndex > -1) playNote([black_keys[blackIndex].dataset.note]);
});

document.addEventListener("keyup", (e) => {
    const whiteIndex = COMP_WHITE_KEYS.indexOf(e.key);
    const blackIndex = COMP_BLACK_KEYS.indexOf(e.key);

    if (whiteIndex > -1) stopNote([white_keys[whiteIndex].dataset.note]);
    if (blackIndex > -1) stopNote([black_keys[blackIndex].dataset.note]);
});


// ================================= 3) Plays/Drags a note mouse interacts with key =================================
const keys = document.querySelectorAll(".key");
const body = document.getElementsByTagName("body")[0];

keys.forEach(key => {
    key.addEventListener("mousedown", () => {
        draggingKey = key.dataset.note;     // Stores the key that is currently being dragged
        playNote([draggingKey]);
    });
});

body.addEventListener("mousemove", (e) => {
	e.preventDefault();     // Debugging line
	if (draggingKey !== "") moveNote(e);
});

body.addEventListener("mouseup", () => {
    if (draggingKey !== "") {
        stopNote([draggingKey]);
        let draggedKey = document.getElementById(draggingKey + "key");
        draggedKey.style.marginTop = null;
        draggingKey = "";
    }
});

// ================================= 4) Create Raphael Animation =================================
let footer = document.getElementsByClassName('footer')[0];

let paper = new Raphael(footer);
console.log("paper.width is: " + paper.width);
console.log("paper.height is: " + paper.height);

let rect = paper.rect(0, 0, paper.width, paper.height);
rect.attr({'stroke-width': '0px'});
let x_100 = paper.width;
let y_100 = paper.height;
let y_50 = paper.height/100*50;     // 50% so that wave does not go beyond the canvas
let x_10 = paper.width/10;

let wave = paper.path(getRandomWave(x_10, y_50));
wave.attr({
    "stroke-width": "3px",
    "stroke": "#3401CE",
    "fill": "blue",
    "opacity": "0.3"
});

// Make canvas responsive
paper.setViewBox(0, 0, x_100, y_100, false);
paper.setSize('100%', '100%');