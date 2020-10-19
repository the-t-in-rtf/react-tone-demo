import Gridstrument from './GridStrument';

import {Destination, Panner} from "tone";

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
        this.initialisePanner();

        this.effects = [this.panner, Destination];
        this.connectEffects();
    }

    initialisePanner = () => {
        this.panner = new Panner(0);
    }

    playNote = () => {
        const noteName    = PanningGridStrument.noteByRow[this.state.cursorRow];

        const middleCol   = (this.props.maxCol + this.props.minCol) / 2;
        const distance    = (this.state.cursorCol - middleCol);

        // TODO: Refactor to make effects control consistent across derived grades without having to copy/paste.
        const newPanValue = distance * this.props.panPerColumn;

        if (this.props.rampToDuration > 0) {
            this.panner.pan.rampTo(newPanValue, this.props.rampToDuration);
        }
        else {
            this.panner.pan.value = newPanValue;
        }

        this.playSingleNote(noteName, this.props.samplerBaseOctave);
    }
}