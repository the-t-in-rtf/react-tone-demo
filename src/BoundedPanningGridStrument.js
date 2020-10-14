import Gridstrument from './GridStrument';
import PanningGridStrument from './PanningGridStrument';

import {Reverb, Gain, LowpassCombFilter, Destination} from 'tone';

const boundedPanningGridStrumentDefaults = Object.assign({}, Gridstrument.defaultProps, {
    // TODO: Reintroduce a note length and make it possible to use a fraction of that to rampTo the next value.
    gainCutoffOutOfBounds: 0,
    reverbDecayOutOfBounds: 0.4,
    reverbWetnessOutOfBounds: 0,
    lowpassDampening : 440,
    lowpassDelayTime : 0.00003, // Must be non-zero, but we don't want it to 
    lowpassResonanceOutOfBounds: 0
});

export default class BoundedPanningGridStrument extends PanningGridStrument {
    static defaultProps = boundedPanningGridStrumentDefaults;

    constructor (props) {
        super(props);

        this.initialiseGain();
        this.initialiseReverb();
        this.initialiseLowpass();

        this.effects = [ this.panner, this.gain, this.reverb, this.lowpass, Destination];
        this.connectEffects();
    }


    initialiseGain = () => {
        // https://tonejs.github.io/docs/14.7.39/interface/GainOptions
        this.gain = new Gain({
            gain: 1
        });
    }

    initialiseReverb = () => {
        this.reverb = new Reverb({
            decay:  this.props.reverbDecayOutOfBounds, 
            wet: 0 // disabled by default.
        });
    }

    initialiseLowpass = () => {
        this.lowpass = new LowpassCombFilter({
            dampening: this.props.lowpassDampening,
            delayTime: this.props.lowpassDelayTime,
            resonance: 0
        });
    }

    distanceOutOfBounds = (position, numCells) => {
        if (position < 0) { return Math.abs(position);}
        else if (position > (numCells - 1)) {
            return position - (numCells - 1);
        }
        else {
            return 0;
        }
    }

    playNote = () => {
        const noteName    = PanningGridStrument.noteByRow[this.state.cursorRow];

        const middleCol   = (this.props.maxCol + this.props.minCol) / 2;
        const distance    = (this.state.cursorCol - middleCol);
        const newPanValue = distance/4;


        if (this.props.rampToDuration > 0) {
            this.panner.pan.rampTo(newPanValue, this.props.rampToDuration);
        }
        else {
            this.panner.pan.value = newPanValue;
        }

        // Calculate distance out of bounds on both axes and then combine using the square of the sum of the squares (ala pythagoras).
        const colsOutOfBounds = this.distanceOutOfBounds(this.state.cursorCol, this.props.numCols); 
        const rowsOutOfBounds = this.distanceOutOfBounds(this.state.cursorRow, this.props.numRows);
        const cellsOutOfBounds = Math.sqrt( (colsOutOfBounds * colsOutOfBounds) + (rowsOutOfBounds * rowsOutOfBounds));

        // Adjust the reverb based on the distance out of bounds.
        if (this.props.reverbDecayOutOfBounds > 0) {
            const newWetness = Math.min(1, this.props.reverbWetnessOutOfBounds * cellsOutOfBounds);
            if (this.props.rampToDuration > 0) {
                this.reverb.wet.rampTo(newWetness, this.props.rampToDuration);
            }
            else {
                this.reverb.wet.value = newWetness;
            }
        }

        // Adjust the volume based on the distance out of bounds.
        if (this.props.gainCutoffOutOfBounds > 0) {
            const newGain = 1 - (this.props.gainCutoffOutOfBounds * cellsOutOfBounds);

            if (this.props.rampToDuration > 0) {
                this.gain.gain.rampTo(newGain, this.props.rampToDuration);
            }
            else {
                this.gain.gain.value = newGain;
            }
        }

        // Adjust the lowpass resonance based on the distance out of bounds.
        if (this.props.lowpassResonanceOutOfBounds > 0) {
            const newResonance = Math.min(1, (this.props.lowpassResonanceOutOfBounds * cellsOutOfBounds));

            if (this.props.rampToDuration > 0) {
                this.lowpass.resonance.rampTo(newResonance, this.props.rampToDuration);
            }
            else {
                this.lowpass.resonance.value = newResonance;
            }
        }

        this.playSingleNote(noteName, this.props.samplerBaseOctave);
   }
}