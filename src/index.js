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
import ConfigurableGridStrument from './ConfigurableGridStrument';

import './index.css';

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

        <p>
          This page presents a few sample sound components created using React and <a href="https://tonejs.github.io">Tone.js</a>.
          It is intended to help with the discussion around
          <a href="https://issues.fluidproject.org/browse/C2LC-234">sonifying the coding environment</a>.
        </p>

        <h2>Basic Playback</h2>

        <h3>Starting / Stopping Sounds</h3>

        <p>
          The most basic thing we need to do is play an incidental sound.  For this I used the
          <a href="https://tonejs.github.io/docs/14.7.39/Player">Player</a> class provided by Tone.js.  Here is a simple
          demonstration of sound playback.  Click (or hit enter) on the button to play the sound.  Click (or hit enter)
          on the button to stop the sound.
          </p>

        <SampleSoundButton
          name="Phone Dial"
          path="./sounds/fisher-price-dial.wav"
          toneStarted={this.state.toneStarted}
          toneStartHook={this.toneStartHook}
        />

        <p>
          Here is a sound that loops, it will not stop and the button UI will not update until you click (or hit enter)
          on the button again.
        </p>

        <SampleSoundButton
          name="Bass Drone"
          path="./sounds/analog-lab-bass-drone.wav"
          loop={true}
          toneStarted={this.state.toneStarted}
          toneStartHook={this.toneStartHook}
        />

        <h3>Sound Picker</h3>

        <p>
          Here is a "picker" that lets you try all of the sample sounds in this directory.  It also demonstrates making key
          parameters configurable in real time.  When you change the sound, the previous sound will stop playing, and
          a new sound will be loaded asynchronously.  This kind of reloading could be useful in allowing users to select
          a sound theme without requiring them to download the sounds for all themes.
        </p>

        <SoundPicker toneStarted={this.state.toneStarted} toneStartHook={this.toneStartHook}/>

        <h2>Using a Panned Loop to Suggest Direction of Movement</h2>

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


        <h2>Suggesting Position</h2>

        <p>
          One of the key challenges in sonifying the coding environment is representing the position of various objects
          using sound.  This next section explores a few strategies for doing so, using a series of grid environments
          with "in bound" squares (white), "out of bounds" areas (black), and a "cursor" (red).  Focus on a demo and
          use the arrow and enter keys to change the position.
        </p>

        <h3>Suggesting Position Using Pitch</h3>

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

        <p>
          With a short percussive sound, the range of octaves scales well enough, but is a bit soft on the ends of the
          range.
        </p>

        <GridStrument/>

        <p>
          A longer sound is more difficult to scale over the range, even if you loop or record long samples, the higher
          octaves quickly become unintelligible.
        </p>

        <GridStrument samplerURLs= {{ "E2": "analog-lab-bass-drone.wav" }} />
          
        <h3>Suggesting Position Using Pitch and Panning</h3>

        <p>
          The above approach gives each cell a distinct pitch, but ends up covering a huge range of notes.  It might
          be difficult to find an instrument that is audible and pleasant to listen to over the whole range.  If we
          reserve pitch for the rows and use panning to represent how far left or right the column is, then each
          character's voice can stay roughly within the same octave.  This lends itself to approaches like giving
          each character their own distinct range.  Here's an example with a short percussive sound.
        </p>

        <PanningGridStrument/>

        <p>
          For comparision, here's an example with a longer, non-percussive sound.
        </p>

        <PanningGridStrument samplerURLs= {{ "E2": "analog-lab-robotic-sequence.wav" }} />

       <h2>Representing Boundaries</h2>

       <p>
         The grid used in the last few examples has boundaries, i.e. cells that are "in bounds" (white) and cells that
         are "out of bounds" (black).  This section demonstrates strategies for changing the sound to reflect whether
         (and how far) out of bounds the cursor is.
        </p>

        <h3>Suggesting Boundaries Using Sound Volume</h3>

        <p>
          One strategy to represent distance is to lower the volume of distant sounds.  I used the
          <a href="https://tonejs.github.io/docs/14.7.39/Gain">Gain</a> class provided by Tone.js for this purpose.
          Here is a demonstration of that approach, note that the sound drops off as you move "out of bounds".
        </p>

        <BoundedPanningGridStrument gainCutoffOutOfBounds="0.4"/>

        <h3>Suggesting Boundaries Using Reverb</h3>

        <p>
          In the team discussion, one idea that came up for representing boundaries was to add reverb when the cursor
          is "out of bounds".  This approximates the sound of approaching a wall that might echo back the sound.  I used
          the <a href="https://tonejs.github.io/docs/14.7.39/Reverb">Reverb</a> class provided by Tone.js for this
          purpose.  Here is a demonstration of that approach.
        </p>

        <BoundedPanningGridStrument reverbWetnessOutOfBounds={0.35}/>

        <h3>Suggesting Boundaries Using a Low Pass Filter</h3>

        <p>
          In the team discussion, another suggestion was to use a low pass filter to approximate the way in which lower
          frequencies do not carry as far.  I used the <a href="https://tonejs.github.io/docs/14.7.39/LowpassCombFilter">LowPassCombFilter</a>
          class provided by Tone.js for this.  As you can hear in the following demonstration, as the cursor moves out
          of bounds, a kind of crunchy tone creeps into the sound.  I was less happy with this by itself, but as you'll
          hear in later demos, it works well when used in combination with lowering the volume.
        </p>

        <BoundedPanningGridStrument lowpassResonanceOutOfBounds={0.25}/>

        <h3>Suggesting Boundaries Using All Three</h3>

        <p>Here is a demonstration that uses all three strategies (lowering the volume, adding reverb, and applying a low pass filter).</p>

        <BoundedPanningGridStrument gainCutoffOutOfBounds="0.4" reverbWetnessOutOfBounds={0.35} lowpassResonanceOutOfBounds={0.35}/>

        <h2>Transitioning Effects More Gradually</h2>

        <p>
          Many of the adjustable parameters in various effects offer the ability to transition over time.  For an
          example, see <a href="https://tonejs.github.io/docs/14.7.39/Gain#gain">the documentation for the gain parameter</a> of
          the Gain class provided by Tone.js.  Although I found the effect less crisp, for the purposes of discussion
          I made the transitions configurable.  Here is a demonstration with the transition time set to three quarters
          of a second (slightly shorter than the sample used).
        </p>

        <BoundedPanningGridStrument gainCutoffOutOfBounds="0.4" reverbWetnessOutOfBounds={0.35} lowpassResonanceOutOfBounds={0.35} rampToDuration={0.75}/>

        <p>
          If you want to hear the difference, listen to the sound that plays when you use an arrow key to move out of
          bounds.  Then, hit enter to play the sound that corresponds to the current position.  As the effects have
          already transitioned to the values for a given square, repeating the note is the same as playing without
          any transition.
        </p>

        <h2>Adding the Ability to "Loop" Sounds</h2>

        <p>
          One of my ideas about our soundscape is that we would use non-repeating sounds for things like bouncing off
          an obstacle.  My idea was to use looped sounds for things coupled with animation, or that take place over
          time, such as turning, moving, moving while drawing.  This proved to be a small challenge with Tone.js.
        </p>

        <p>
          Unlike the similar <a href="https://tonejs.github.io/docs/14.7.39/Player">Player</a> class provided by Tone.js,
          The <a href="https://tonejs.github.io/docs/14.7.39/Sampler">Sampler</a> class does
          not include the option to loop playback.  To work around this, I wrote a wrapper around their <a href="https://tonejs.github.io/docs/14.7.39/Players">Players</a> class
          that adds the ability to loop the sound. Here is a demonstration that uses a repeated loop (hit enter to stop playback).
        </p>

        <BoundedPanningGridStrument
          loop={true}
          gainCutoffOutOfBounds="0.4"
          reverbWetnessOutOfBounds={0.35}
          lowpassResonanceOutOfBounds={0.35}
          samplerURLs= {{ "C2": "glissando/al-metalic-vs-robotic-up.wav"}}
        />

        <h2>Smoothing Transitions Between Pitched Sounds</h2>

        <p>
          If you transition quickly from one cell to the next in the previous demo, you may notice that the sound
          restarts on each transition.  This leads to a kind of stuttering effect.  I added an option to calculate
          the position in the previous sound and start the next sound at the same position.  Although it's not perfect,
          it does give the appearance of smoother transitions.
        </p>

        <BoundedPanningGridStrument
          loop={true}
          gainCutoffOutOfBounds="0.4"
          reverbWetnessOutOfBounds={0.35}
          lowpassResonanceOutOfBounds={0.35}
          samplerURLs= {{ "C2": "glissando/al-metalic-vs-robotic-up.wav"}}
          useOffsets={true}
        />


        <h2>Configurable Real Time Demo</h2>

        <p>
          The final demonstration adds the ability to configure various parameters in real time, so that you can try
          combinations of effects.  This also demonstrates using <a href="https://github.com/rakannimer/react-nexusui">React NexusUI</a>,
          which provides React components for the <a href="https://nexus-js.github.io/ui/">NexusUI</a> library of
          controls.
        </p>

        <ConfigurableGridStrument/>
      </Container>
    );
  }
}


// TODO: Confirm whether we can use this, previous failures may have been related to not setting the base URL properly.
// ReactDOM.render(
//   <React.StrictMode>
//     <TonePanel/>
//   </React.StrictMode>,
//   document.getElementById('root')
// );

ReactDOM.render(<TonePanel/>, document.getElementById('root'));
