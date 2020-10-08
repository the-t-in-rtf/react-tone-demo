import Gridstrument from './GridStrument';

import {Panner} from "tone";

export default class PanningGridStrument extends Gridstrument {
    static defaultProps = Gridstrument.defaultProps;

    static noteByRow = {
        "-2": "G#",
        "-1": "G",
        "0":  "F#",
        "1":  "F",
        "2":  "E",
        "3":  "D#",
        "4":  "D",
        "5":  "C#",
        "6":  "C"
    }

    constructor (props) {
        super(props);

        // Initialize panner.
        this.initialisePanner(props);
    }

    initialisePanner = (props) => {
        this.sampler.disconnect();
        this.panner = new Panner(0);
        this.panner.toDestination();

        this.sampler.connect(this.panner);
    }

    playNote = () => {
        this.sampler.releaseAll();
        const noteName    = PanningGridStrument.noteByRow[this.state.cursorRow];
        const middleCol   = (this.props.maxCol + this.props.minCol) / 2;
        const distance    = (this.state.cursorCol - middleCol);
        const newPanValue = distance/4;
        this.panner.pan.rampTo(newPanValue, this.props.samplerNoteDuration);
        this.sampler.triggerAttack([noteName + this.props.samplerBaseOctave]);
    }
}