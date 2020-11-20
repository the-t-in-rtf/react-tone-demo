import SampleSoundButton from './SampleSoundButton';

import {Panner, Oscillator} from 'tone';

// We cannot pick up the default properties via inheritance, so we extemd them manually.
const defaultProps = Object.assign({}, SampleSoundButton.defaultProps, {
    pannerStart: 0,   // the starting position of the panner, where -1 is hard left, 0 is dead centre, and 1 is hard right.

    oscFreq: 4,       // The frequency of the wave in seconds.
    oscType: "sine",  // Supports "sine", "sawtooth", and an incredible range other waves.  Also supports partials, like "sine2"
    oscPhase: 90      // Phase in "degrees", repeating every 360.    
});

export default class PanningSampleSoundButton extends SampleSoundButton {
    static defaultProps = defaultProps

    constructor (props) {
        super(props);

        // Rewire initial sound configuration.
        const panner = new Panner(props.pannerStart).toDestination();

        const osc = new Oscillator({
            frequency: props.oscFreq,
            type:      props.oscType,
            phase:     props.oscPhase
        });
        osc.connect(panner.pan);
        osc.start();
        this.player.disconnect();
        this.player.connect(panner);
    }
}
