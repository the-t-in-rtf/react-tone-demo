import React from 'react';
import ReactDOM from 'react-dom';

import Container from "react-bootstrap/Container";

import SampleSoundButton from './SampleSoundButton';
import SoundPicker from './SoundPicker';
import PanningSampleSoundButton from './PanningSampleSoundButton';

import {start} from 'tone';

import GridStrument from './GridStrument';
import PanningGridStrument from './PanningGridStrument';
import BoundedPanningGridStrument from './BoundedPanningGridStrument';

import "bootstrap/dist/css/bootstrap.min.css";

// An enclosing environment that ensures that Tone is started on the first 
// user input, and that it is only started once.

class TonePanel extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      toneStarted: false,
      tonePromise: false
    };
  }

  toneStartHook = () => {
    if (this.state.tonePromise) {
      return this.state.tonePromise;
    }
    else {
      const tonePromise = start();
      tonePromise.then(() => {
        this.setState({ toneStarted: true});
      });
      this.setState({ tonePromise: tonePromise});
      return tonePromise;
    }
  }

  render () {
    return(
      <Container>
        <h1>React + Tone.js Demos</h1>

        <p>This page presents a few sample sound components created using React and <a href="https://tonejs.github.io">Tone.js</a>.</p>

        <h2>Starting / Stopping Sounds</h2>

        <p>Here is a sound that plays once when you click it.  You can stop it manually while it's playing.  The button UI will also update when the sound finishes playing.</p>

        <SampleSoundButton
          name="Phone Dial"
          path="./sounds/fisher-price-dial.wav"
          toneStarted={this.state.toneStarted}
          toneStartHook={this.toneStartHook}
        />

        <p>Here is a sound that loops, it will not stop and the button UI will not update until you click the button again.</p>

        <SampleSoundButton
          name="Bass Drone"
          path="./sounds/analog-lab-bass-drone.wav"
          loop={true}
          toneStarted={this.state.toneStarted}
          toneStartHook={this.toneStartHook}
        />

        <h2>Sound Picker</h2>

        <p>
          Here is a "picker" that lets you try all of the sample sounds in this directory.  It also demonstrates making key
          parameters configurable in real time.  When you change the sound, the previous sound will stop playing.
        </p>

        <SoundPicker toneStarted={this.state.toneStarted} toneStartHook={this.toneStartHook}/>

        <h2>Using a Panned Loop to Suggest Direction</h2>

        <p>
          Here is a sound loop that is repeatedly "panned" from one ear to the other.  It is timed to match the tempo
          of the sequence so that each "beat" appears to be traveling from one ear to the other.  The oscillator that
          we use for this is a sine wave, we change the starting phase so that played notes occur on the right part of
          the "slope".
        </p>

        <PanningSampleSoundButton
            name="Panned Loop (L -> R)"
            path="./sounds/wavestation-intoamaze.wav"
            loop={true}
            toneStarted={this.state.toneStarted}
            toneStartHook={this.toneStartHook}
        />

        <p>Here's another sound loop with the phase shifted so that the direction appears to be reversed.</p>

        <PanningSampleSoundButton
            name="Panned Loop (L <- R)"
            path="./sounds/analog-lab-bass-drone.wav"
            oscPhase={270}
            loop={true}
            toneStarted={this.state.toneStarted}
            toneStartHook={this.toneStartHook}
        />

        <p>
          Although somewhat effective, this seems unlikely to be precisely readable enough to convey something like
          speed, and is a bit tiring to listen to for more than a few seconds.
        </p>

        <h2>Suggesting Position Using Pitch</h2>

        <p>
          Some MIDI grid controllers are tuned so that the lowest note is on the bottom left, and the highest note is
          on the upper right.  Each cell corresponds to a single note.  In some tunings, the cell to the right of
          a given cell corresponds to the next highest note, either a single step higher or the next note in a
          particular key.  In some tunings, the next highest row of cells can be thought of like the next set of keys
          on a piano keyboard.  For example, if there are eight columns in the grid, the next cell up is eight steps (or
          notes in a key) higher.  In other tunings, the next cell up is an octave higher.
        </p>

        <p>
          My initial thinking about easily representing a specific sound for each cell in our grid was to use two of
          these conventions. Each cell would be one note higher than the cell to the left, and one octave higher than
          the cell above it, as demonstrated in the following examples.
        </p>

        <h3>Percussive Sound</h3>

        <p>With a short percussive sound, the range of octaves scales well enough, but is a bit soft on the ends of the range.</p>

        <GridStrument/>

        <h3>Arpeggiated Sound</h3>

        <p>A longer sound is more difficult to scale over the range, even if you loop or record long samples, the higher octaves quickly become gibberish.</p>

        <GridStrument samplerURLs= {{ "E2": "analog-lab-bass-drone.wav" }} />
          
        <h2>Suggesting Position Using Pitch and Panning</h2>

        <p>
          The above approach gives each cell a distinct pitch, but ends up covering a huge range of notes.  It might
          be difficult to find an instrument that is audible and pleasant to listen to over the whole range.  If we
          reserve pitch for the rows and use panning to represent how far left or right the column is, then each
          character's voice can stay roughly within the same octave.  This lends itself to approaches like giving
          each character their own octave.
        </p>

        <h3>Percussive Sound</h3>

        <PanningGridStrument/>

        <h3>Arpeggiated Sound</h3>

        <PanningGridStrument samplerURLs= {{ "E2": "analog-lab-robotic-sequence.wav" }} />

       <h2>Auditising Boundaries</h2>

       <p>
         The grid used in the last few examples has boundaries, i.e. cells that are "in bounds" (white) and cells that
         are "out of bounds" (black).  This section demonstrates strategies for changing the sound to reflect whether
         (and how far) out of bounds the cursor is.
        </p>

        <h3>Suggesting Boundaries Using Sound Volume</h3>

        <BoundedPanningGridStrument gainCutoffOutOfBounds="0.4"/>

        <h3>Suggesting Boundaries Using Reverb</h3>

        <BoundedPanningGridStrument reverbWetnessOutOfBounds={0.35}/>


        <h3>Suggesting Boundaries Using a Low Pass Filter</h3>

        <BoundedPanningGridStrument lowpassResonanceOutOfBounds={0.35}/>
        

        <h3>Suggesting Boundaries Using All Three</h3>

        <BoundedPanningGridStrument gainCutoffOutOfBounds="0.4" reverbWetnessOutOfBounds={0.35} lowpassResonanceOutOfBounds={0.35}/>
      </Container>
    )
  }
}


// ReactDOM.render(
//   <React.StrictMode>
//     <TonePanel/>
//   </React.StrictMode>,
//   document.getElementById('root')
// );

ReactDOM.render(<TonePanel/>, document.getElementById('root'));
