var T = require('./engine.js'), pass = 0, fail = 0;
function eq(n, a, b, t) { if (a !== null && a !== undefined && Math.abs(a - b) <= (t || 0.001)) pass++; else { fail++; console.log('FAIL', n, a, b); } }
function ok(n, c) { if (c) pass++; else { fail++; console.log('FAIL', n); } }
// 120 BPM: quarter 500 ms
eq('whole', T.noteMs(120, 1, 's'), 2000); eq('half', T.noteMs(120, 2, 's'), 1000); eq('quarter', T.noteMs(120, 4, 's'), 500); eq('eighth', T.noteMs(120, 8, 's'), 250); eq('16th', T.noteMs(120, 16, 's'), 125); eq('32nd', T.noteMs(120, 32, 's'), 62.5);
eq('dotted eighth', T.noteMs(120, 8, 'dotted'), 375); eq('dotted quarter', T.noteMs(120, 4, 'dotted'), 750); eq('triplet eighth', T.noteMs(120, 8, 'triplet'), 166.667); eq('triplet quarter', T.noteMs(120, 4, 'triplet'), 333.333);
// 90 BPM
eq('90 quarter', T.noteMs(90, 4, 's'), 666.667); eq('90 dotted eighth', T.noteMs(90, 8, 'dotted'), 500); eq('60 quarter', T.noteMs(60, 4, 's'), 1000); eq('140 quarter', T.noteMs(140, 4, 's'), 428.571);
// three triplet notes fill one straight note; two dotted fill... dotted + eighth = quarter
eq('3 triplets = quarter', 3 * T.noteMs(100, 8, 'triplet'), T.noteMs(100, 4, 's')); eq('dotted eighth + sixteenth = quarter', T.noteMs(100, 8, 'dotted') + T.noteMs(100, 16, 's'), T.noteMs(100, 4, 's'));
// bars
eq('4/4 at 120', T.barMs(120, 4, 4), 2000); eq('3/4 at 120', T.barMs(120, 3, 4), 1500); eq('6/8 at 120', T.barMs(120, 6, 8), 1500); eq('2/2 at 120', T.barMs(120, 2, 2), 2000); eq('7/8 at 140', T.barMs(140, 7, 8), 7 * 0.5 * 60000 / 140);
ok('bad bar', T.barMs(120, 0, 4) === null && T.barMs(120, 4, 3) === null);
// frequency and samples
eq('hz of 500 ms', T.hz(500), 2); eq('hz of 375 ms', T.hz(375), 2.6667); eq('samples 44.1k', T.samples(500, 44100), 22050); eq('samples 48k 250 ms', T.samples(250, 48000), 12000);
// range checks
ok('low', T.noteMs(19, 4, 's') === null); ok('high', T.noteMs(301, 4, 's') === null); ok('NaN', T.noteMs(NaN, 4, 's') === null); ok('bad denom', T.noteMs(120, 3, 's') === null);
eq('edge 20', T.noteMs(20, 4, 's'), 3000); eq('edge 300', T.noteMs(300, 4, 's'), 200);
// tempo names from Wikipedia ranges
ok('120 names', ['Moderato', 'Allegretto', 'Allegro moderato', 'Allegro'].every(function (n) { return T.names(120).indexOf(n) >= 0; }));
ok('60 largo', T.names(60).indexOf('Largo') >= 0 && T.names(60).indexOf('Adagio') >= 0 && T.names(60).indexOf('Allegro') < 0);
ok('210 prestissimo', T.names(210).join() === 'Prestissimo'); ok('174 vivace', T.names(174).indexOf('Vivace') >= 0 && T.names(174).indexOf('Presto') >= 0); ok('30 grave', T.names(30).join() === 'Adagissimo / Grave'); ok('names out of range', T.names(10).length === 0);
// tap tempo
eq('tap 120', T.tapBpm([0, 500, 1000, 1500]), 120); eq('tap 100', T.tapBpm([1000, 1600, 2200]), 100); ok('one tap', T.tapBpm([0]) === null);
eq('tap restarts after a pause', T.tapBpm([0, 500, 1000, 9000, 9500, 10000]), 120); eq('tap uses last 8', T.tapBpm([0, 1000, 2000, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500]), 120);
ok('tap after long pause is one tap', T.tapBpm([0, 3000]) === null); eq('tap 25 bpm still valid', T.tapBpm([0, 2400]), 25);
// table
var tb = T.table(120); ok('table rows', tb.length === 6 && tb[2].denom === 4); eq('table quarter dotted', tb[2].dotted, 750); ok('table bad', T.table(5) === null);
console.log(pass + '/' + (pass + fail) + ' pass'); process.exit(fail ? 1 : 0);
