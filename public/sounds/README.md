# About the Contents of This Directory

These sounds were recorded or created to demonstrate approaches to using sound to represent motion and position in React.

## BPM data of Sequences / Loops

Many of the sounds in this directory are loops taken from musical sequences.  As you may wish to synchronise other things with them or
adjust their tempo, here is a summary of the baseline tempo of each sequence:

| Filename                        | BPM     |
| ------------------------------- | ------- |
| analog-lab-bass-drone.wav       | 130.650 |
| analog-lab-robotic-sequence.wav | 103.855 |
| analog-lab-techno-sequence.wav  | 129.068 |
| wavestation-along-the-trail.wav | 142.207 |
| wavestation-droid-bass-2.wav    |  95.259 |
| wavestation-droid-bass.wav      |  95.573 |
| wavestation-euro-perc-organ.wav |  87.634 |
| wavestation-intoamaze.wav       | 119.900 |
| wavestation-kalimba.wav         | 120.614 |
| wavestation-marimba.wav         | 101.921 |
| wavestation-nutpanbeat.wav      | 117.945 |
| wavestation-toy-box-falling.wav | 131.243 |

BPM data was derived using `sox` and `bpm` using a command like:

```
for i in *.wav; do echo -n "$i: "; sox $i -t raw -r 44100 -e float -c 1 - | bpm; done
```

## Approximate Pitch for All Samples

When using these sounds with something like a Tone.Sampler, you will want to know an approximate pitch for the samples.   For samples, this is the rough pitch of the noise when compared to a played piano note.
| Filename                                | Pitch  |
| --------------------------------------- | ------ |
| bongo.wav                               | E2 |
| cardboard-tube-fingernail.wav           | | 
| fisher-price-dial.wav                   | |
| fisher-price-phone-dial-forward.wav     | |
| fisher-price-phone-dial-release.wav     | |
| fisher-price-phone-rolling-backward.wav | |
| fisher-price-phone-rolling.wav          | |
| ocean-drum-circles.wav                  | |
| ocean-drum-pen-cap.wav                  | |
| ocean-drum-vertical-line.wav            | |
| pen-cardboard-lines-2.wav               | |
| pen-cardboard-lines.wav                 | |
| pencil-cardboard-shading.wav            | |


For sequences, the pitch is also compared to a played piano note, but is the pitch of the lowest note in the sequence.

| Filename                        | Pitch   |
| ------------------------------- | ------- |
| analog-lab-bass-drone.wav       |  |
| analog-lab-robotic-sequence.wav |  |
| analog-lab-techno-sequence.wav  |  |
| wavestation-along-the-trail.wav |  |
| wavestation-droid-bass-2.wav    |  |
| wavestation-droid-bass.wav      |  |
| wavestation-euro-perc-organ.wav |  |
| wavestation-intoamaze.wav       |  |
| wavestation-kalimba.wav         |  |
| wavestation-marimba.wav         |  |
| wavestation-nutpanbeat.wav      |  |
| wavestation-toy-box-falling.wav |  |

