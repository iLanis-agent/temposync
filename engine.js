(function (root) {
  'use strict';
  // Note lengths: a quarter note lasts 60000 / BPM ms. Dotted notes are x1.5, triplets x2/3.
  // Tempo marking ranges: Wikipedia "Tempo" (en.wikipedia.org/wiki/Tempo).
  var NAMES = [['Larghissimo', 0, 24], ['Adagissimo / Grave', 24, 40], ['Largo', 40, 66], ['Larghetto', 44, 66], ['Adagio', 44, 66], ['Adagietto', 46, 80], ['Andante', 56, 108], ['Marcia moderato', 66, 80], ['Andantino', 80, 108], ['Andante moderato', 80, 108], ['Moderato', 108, 120], ['Allegretto', 112, 120], ['Allegro moderato', 116, 120], ['Allegro', 120, 156], ['Molto Allegro', 124, 156], ['Vivace', 156, 176], ['Vivacissimo / Allegrissimo', 172, 176], ['Presto', 168, 200], ['Prestissimo', 200, 1000]];
  var DENOMS = [1, 2, 4, 8, 16, 32];
  function validBpm(b) { return b >= 20 && b <= 300; }
  function noteMs(bpm, denom, kind) {
    if (!validBpm(bpm) || DENOMS.indexOf(denom) < 0) return null;
    var ms = (60000 / bpm) * 4 / denom;
    return kind === 'dotted' ? ms * 1.5 : kind === 'triplet' ? ms * 2 / 3 : ms;
  }
  function hz(ms) { return 1000 / ms; }
  function samples(ms, rate) { return ms * rate / 1000; }
  function barMs(bpm, num, den) { if (!validBpm(bpm) || !(num >= 1 && num <= 32) || DENOMS.indexOf(den) < 0) return null; return num * (4 / den) * 60000 / bpm; }
  function names(bpm) { if (!validBpm(bpm)) return []; return NAMES.filter(function (n) { return bpm >= n[1] && bpm <= n[2]; }).map(function (n) { return n[0]; }); }
  // tap tempo: timestamps in ms, uses up to the last 8 taps, restarts after a 2.5 s pause
  function tapBpm(taps) {
    var t = taps.slice(); for (var i = t.length - 1; i > 0; i--) if (t[i] - t[i - 1] > 2500) { t = t.slice(i); break; }
    t = t.slice(-8); if (t.length < 2) return null;
    var avg = (t[t.length - 1] - t[0]) / (t.length - 1); var b = 60000 / avg;
    return validBpm(b) ? b : null;
  }
  function table(bpm) {
    if (!validBpm(bpm)) return null;
    return DENOMS.map(function (d) { return { denom: d, straight: noteMs(bpm, d, 'straight'), dotted: noteMs(bpm, d, 'dotted'), triplet: noteMs(bpm, d, 'triplet') }; });
  }
  root.TempoSync = { NAMES: NAMES, DENOMS: DENOMS, noteMs: noteMs, hz: hz, samples: samples, barMs: barMs, names: names, tapBpm: tapBpm, table: table, validBpm: validBpm };
  if (typeof module !== 'undefined') module.exports = root.TempoSync;
})(typeof window !== 'undefined' ? window : globalThis);
