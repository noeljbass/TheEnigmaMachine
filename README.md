# The Enigma Machine

An interactive educational website about the Enigma machine, its historical role, and the basic cryptographic ideas behind a three-rotor Enigma I.

**Live site:** <https://noeljbass.github.io/TheEnigmaMachine/>

## Project scope

This project is a static web exhibit designed for learners who want an approachable introduction to Enigma without needing to install software or already understand cryptography. It combines narrative pages with a browser-based simulator so visitors can move from historical context to hands-on experimentation.

The site focuses on:

- **Historical background:** how Enigma moved from a commercial privacy device to a wartime communications system, plus the importance of daily keys, operator discipline, and Allied codebreaking.
- **Conceptual explanation:** a high-school-friendly walkthrough of rotors, reflectors, plugboard pairs, rotor stepping, and why matching settings allow both encryption and decryption.
- **Interactive exploration:** a JavaScript Enigma-style simulator that lets users configure machine settings and observe how those settings change the output.

This is an educational model rather than a complete reproduction of every historical Enigma variant. The simulator represents the core behavior of a three-rotor Enigma I using selectable rotors, reflector choices, rotor start positions, plugboard pairs, and rotor stepping.

## Interactive component

The Enigma Simulator page lets visitors configure and run a working browser-based cipher machine. Users can:

1. Choose three different rotors from rotors I through V.
2. Select reflector B or reflector C.
3. Set left, middle, and right rotor starting positions from A to Z.
4. Enter plugboard pairs such as `AB CD EF`.
5. Type plaintext or ciphertext and run **Encrypt / Decrypt**.
6. View the transformed output and the final rotor window positions.

The simulator preserves non-letter characters, groups letter output into blocks of five for readability, and validates common setup errors such as duplicate rotors, repeated plugboard letters, or self-paired plugboard letters.

Because Enigma encryption is reciprocal, the same interface handles both encryption and decryption: record the original rotor order, reflector, starting positions, and plugboard settings, then reset those same settings and run the ciphertext again.

## Site pages

- `index.html` — landing page for the exhibit.
- `history.html` — historical narrative and image-supported context.
- `how-it-worked.html` — conceptual explanation of the machine and a code walkthrough.
- `simulator.html` — interactive Enigma simulator UI.
- `script.js` — simulator logic for rotor wiring, stepping, plugboard parsing, validation, encryption, and output formatting.
- `styles.css` — shared layout, navigation, responsive design, and visual styling.
- `image-viewer.js` — image viewing behavior for exhibit images.
- `images/` — project image assets.

## How it works technically

The project is built with plain HTML, CSS, and JavaScript. There are no package dependencies or build steps required.

The simulator logic in `script.js` models the Enigma signal path:

```text
Keyboard → Plugboard → Right rotor → Middle rotor → Left rotor → Reflector → Left rotor → Middle rotor → Right rotor → Plugboard → Lamp
```

For each letter, the code advances the rotors, sends the signal through the plugboard, passes it through the rotors forward, reflects it, passes it back through the rotors in reverse, and applies the plugboard again.

## Running locally

Open `index.html` directly in a browser.

## Deployment

The project is currently hosted with GitHub Pages at:

<https://noeljbass.github.io/TheEnigmaMachine/>

Because this is a static site, deployment only requires the HTML, CSS, JavaScript, and image files to be available from the GitHub Pages branch or folder configured for the repository.

## Educational use

This site is intended for classroom demonstrations, independent study, and project-based exploration of historical cryptography. Suggested activities include:

- Encrypt a short message, record the settings, and have another person decrypt it.
- Compare outputs with and without plugboard pairs.
- Type repeated letters such as `AAAAA` to observe rotor movement.
- Change one starting position and compare how much the ciphertext changes.
- Read the history page before using the simulator to connect the interface to real operator procedures.
