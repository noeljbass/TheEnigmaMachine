const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const rotors = {
  I: { wiring: "EKMFLGDQVZNTOWYHXUSPAIBRCJ", notch: "Q" },
  II: { wiring: "AJDKSIRUXBLHWTMCQGZNPYFVOE", notch: "E" },
  III: { wiring: "BDFHJLCPRTXVZNYEIWGAKMUSQO", notch: "V" },
  IV: { wiring: "ESOVPZJAYQUIRHXLNFTGKDCMWB", notch: "J" },
  V: { wiring: "VZBRGITYUPSDNHLXAWMJQOFECK", notch: "Z" },
};

const reflectors = {
  B: "YRUHQSLDPXNGOKMIEBFZCWVJAT",
  C: "FVPJIAOYEDRZXWGCTKUQSBNMHL",
};

const defaults = {
  rotorLeft: "I",
  rotorMiddle: "II",
  rotorRight: "III",
  reflector: "B",
  posLeft: "A",
  posMiddle: "A",
  posRight: "A",
  plugboard: "",
  message: "MEET AT DAWN",
};

const rotorSelectIds = ["rotorLeft", "rotorMiddle", "rotorRight"];
const positionSelectIds = ["posLeft", "posMiddle", "posRight"];

function fillSelects() {
  rotorSelectIds.forEach((id) => {
    const select = document.getElementById(id);
    Object.keys(rotors).forEach((name) => select.add(new Option(`Rotor ${name}`, name)));
  });

  positionSelectIds.forEach((id) => {
    const select = document.getElementById(id);
    alphabet.split("").forEach((letter) => select.add(new Option(letter, letter)));
  });
}

function setDefaults() {
  Object.entries(defaults).forEach(([id, value]) => {
    document.getElementById(id).value = value;
  });
  document.getElementById("output").textContent = "Your encrypted or decrypted message will appear here.";
  document.getElementById("finalPositions").textContent = "A A A";
  document.getElementById("error").textContent = "";
  updateRotorWarning();
  updatePlugboardWarning();
}

function letterToIndex(letter) {
  return alphabet.indexOf(letter);
}

function indexToLetter(index) {
  return alphabet[(index + 26) % 26];
}

function parsePlugboard(input) {
  const clean = input.toUpperCase().replace(/[^A-Z]/g, "");
  if (clean.length % 2 !== 0) {
    throw new Error("Plugboard pairs must contain an even number of letters, such as AB CD EF.");
  }

  const map = new Map(alphabet.split("").map((letter) => [letter, letter]));
  const used = new Set();

  for (let i = 0; i < clean.length; i += 2) {
    const a = clean[i];
    const b = clean[i + 1];
    if (a === b) {
      throw new Error(`Plugboard pair ${a}${b} is invalid because a letter cannot be swapped with itself.`);
    }
    if (used.has(a) || used.has(b)) {
      throw new Error("Each plugboard letter can be used in only one pair. For example, AB AC is invalid because A appears twice.");
    }
    used.add(a);
    used.add(b);
    map.set(a, b);
    map.set(b, a);
  }

  return map;
}

function getDuplicateRotors(names) {
  return names.filter((name, index) => names.indexOf(name) !== index);
}

function validateRotors(names) {
  if (new Set(names).size !== names.length) {
    throw new Error("Original Enigma rules require three different rotors. Choose a unique left, middle, and right rotor.");
  }
}

function atNotch(rotorName, position) {
  return rotors[rotorName].notch === indexToLetter(position);
}

function stepRotors(state) {
  const middleAtNotch = atNotch(state.names[1], state.positions[1]);
  const rightAtNotch = atNotch(state.names[2], state.positions[2]);

  if (middleAtNotch) {
    state.positions[0] = (state.positions[0] + 1) % 26;
    state.positions[1] = (state.positions[1] + 1) % 26;
  } else if (rightAtNotch) {
    state.positions[1] = (state.positions[1] + 1) % 26;
  }

  state.positions[2] = (state.positions[2] + 1) % 26;
}

function passThroughRotorForward(letterIndex, rotorName, position) {
  const shifted = (letterIndex + position) % 26;
  const wiredLetter = rotors[rotorName].wiring[shifted];
  return (letterToIndex(wiredLetter) - position + 26) % 26;
}

function passThroughRotorBackward(letterIndex, rotorName, position) {
  const shifted = (letterIndex + position) % 26;
  const wiringIndex = rotors[rotorName].wiring.indexOf(indexToLetter(shifted));
  return (wiringIndex - position + 26) % 26;
}

function encipherLetter(letter, state, plugboard) {
  stepRotors(state);

  let signal = letterToIndex(plugboard.get(letter));
  signal = passThroughRotorForward(signal, state.names[2], state.positions[2]);
  signal = passThroughRotorForward(signal, state.names[1], state.positions[1]);
  signal = passThroughRotorForward(signal, state.names[0], state.positions[0]);
  signal = letterToIndex(reflectors[state.reflector][signal]);
  signal = passThroughRotorBackward(signal, state.names[0], state.positions[0]);
  signal = passThroughRotorBackward(signal, state.names[1], state.positions[1]);
  signal = passThroughRotorBackward(signal, state.names[2], state.positions[2]);

  return plugboard.get(indexToLetter(signal));
}

function groupLetters(text) {
  let count = 0;
  return text.split("").map((char) => {
    if (!/[A-Z]/.test(char)) return char;
    count += 1;
    return count > 1 && (count - 1) % 5 === 0 ? ` ${char}` : char;
  }).join("");
}

function updateRotorWarning() {
  const warning = document.getElementById("rotorWarning");
  const names = rotorSelectIds.map((id) => document.getElementById(id).value);
  const duplicates = [...new Set(getDuplicateRotors(names))];
  warning.textContent = duplicates.length
    ? `Rotor ${duplicates.join(", ")} is selected more than once. Pick three different rotors.`
    : "";
}

function updatePlugboardWarning() {
  const warning = document.getElementById("plugboardWarning");
  try {
    parsePlugboard(document.getElementById("plugboard").value);
    warning.textContent = "";
  } catch (err) {
    warning.textContent = err.message;
  }
}

function runEnigma(event) {
  event.preventDefault();
  const error = document.getElementById("error");
  error.textContent = "";

  try {
    const names = rotorSelectIds.map((id) => document.getElementById(id).value);
    validateRotors(names);

    const state = {
      names,
      reflector: document.getElementById("reflector").value,
      positions: positionSelectIds.map((id) => letterToIndex(document.getElementById(id).value)),
    };
    const plugboard = parsePlugboard(document.getElementById("plugboard").value);
    const message = document.getElementById("message").value.toUpperCase();

    const result = message.split("").map((char) => {
      if (!/[A-Z]/.test(char)) return char;
      return encipherLetter(char, state, plugboard);
    }).join("");

    document.getElementById("output").textContent = groupLetters(result);
    document.getElementById("finalPositions").textContent = state.positions.map(indexToLetter).join(" ");
  } catch (err) {
    error.textContent = err.message;
  }
}

fillSelects();
setDefaults();
rotorSelectIds.forEach((id) => document.getElementById(id).addEventListener("change", updateRotorWarning));
document.getElementById("plugboard").addEventListener("input", updatePlugboardWarning);
document.getElementById("enigmaForm").addEventListener("submit", runEnigma);
document.getElementById("resetButton").addEventListener("click", setDefaults);