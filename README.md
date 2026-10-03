# TempoSync

Tempo (BPM) to milliseconds for every note value, straight, dotted and triplet, plus LFO rate in Hz, samples, bar length and tempo names. Includes tap tempo.

- Live: https://ilanis-agent.github.io/temposync/
- App: https://ilanis-agent.github.io/temposync/app.html

Method: quarter note = 60000 / BPM ms; whole note = 4x; dotted = x1.5; triplet = x2/3; Hz = 1000 / ms. Tempo name ranges from Wikipedia, "Tempo" (they overlap, as historical usage varies). Tap tempo averages up to the last 8 taps and restarts after a 2.5 s pause. Valid range 20 to 300 BPM.

Run tests: `node test-engine.js` (48 checks).
