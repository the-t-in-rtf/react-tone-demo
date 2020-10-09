import Gridstrument from './GridStrument';
import PanningGridStrument from './PanningGridStrument';

import {Reverb, Gain, LowpassCombFilter} from 'tone';

const boundedPanningGridStrumentDefaults = Object.assign({}, Gridstrument.defaultProps, {
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

        this.initialiseBoundaryEffects(props);
    }

    initialiseBoundaryEffects = (props) => {
        this.panner.disconnect();
        
        // https://tonejs.github.io/docs/14.7.39/interface/GainOptions
        this.gain = new Gain({
            gain: 1
        });

        this.panner.connect(this.gain);
        
        // https://tonejs.github.io/docs/14.7.39/interface/ReverbOptions
        this.reverb = new Reverb({
            decay:  this.props.reverbDecayOutOfBounds, 
            wet: 0 // disabled by default.
        });

        this.gain.connect(this.reverb);

        // https://tonejs.github.io/docs/14.7.39/interface/LowpassCombFilterOptions
        this.lowpass = new LowpassCombFilter({
            dampening: this.props.lowpassDampening,
            delayTime: this.props.lowpassDelayTime,
            resonance: 0
        });
        
        this.reverb.connect(this.lowpass);
        this.lowpass.toDestination();

        // TODO: Add Low Pass Filter, and make sure we can enable/ disable combinations of options.
        // dampening : Frequency
        // delayTime : Time
        // resonance : NormalRange
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
        // This ensures that the last note stops before we play the next, but can result in a stutter.
        // TODO: When we convert to using Tone.Player, we should ensure that we have a way to play longer sounds (such as sequences) from a particular point in time.
        this.sampler.releaseAll();
        const noteName    = PanningGridStrument.noteByRow[this.state.cursorRow];
        const middleCol   = (this.props.maxCol + this.props.minCol) / 2;
        const distance    = (this.state.cursorCol - middleCol);
        const newPanValue = distance/4;

        // TODO: Try setting values immediately instead of ramping the values up and down.
        this.panner.pan.value = newPanValue;

        // Calculate distance out of bounds on both axes and then combine using the square of the sum of the squares (ala pythagoras).
        const colsOutOfBounds = this.distanceOutOfBounds(this.state.cursorCol, this.props.numCols); 
        const rowsOutOfBounds = this.distanceOutOfBounds(this.state.cursorRow, this.props.numRows);
        const cellsOutOfBounds = Math.sqrt( (colsOutOfBounds * colsOutOfBounds) + (rowsOutOfBounds * rowsOutOfBounds));

        // Adjust the reverb based on the distance out of bounds.
        if (this.props.reverbDecayOutOfBounds > 0) {
            const newWetness = Math.min(1, this.props.reverbWetnessOutOfBounds * cellsOutOfBounds);
            this.reverb.wet.value = newWetness;
        }

        // Adjust the volume based on the distance out of bounds.
        if (this.props.gainCutoffOutOfBounds > 0) {
            const newGain = 1 - (this.props.gainCutoffOutOfBounds * cellsOutOfBounds);
            this.gain.gain.value = newGain;
        }

        // Adjust the lowpass resonance based on the distance out of bounds.
        if (this.props.lowpassResonanceOutOfBounds > 0) {
            const newResonance = Math.min(1, (this.props.lowpassResonanceOutOfBounds * cellsOutOfBounds));
            this.lowpass.resonance.value = newResonance;
        }

        this.sampler.triggerAttack([noteName + this.props.samplerBaseOctave]);
    }

}