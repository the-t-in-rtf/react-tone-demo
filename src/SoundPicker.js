import React from 'react';

import SampleSoundButton from "./SampleSoundButton";

import './SoundPicker.css';

const soundDefs = [
    { name: "Along the Trail", path: "./sounds/wavestation-along-the-trail.wav", loop: true },
    { name: "Bass Drone", path: "./sounds/analog-lab-bass-drone.wav", loop: true },
    { name: "Bongo", path: "./sounds/bongo.wav" },
    { name: "Droid Bass", path: "./sounds/wavestation-droid-bass.wav", loop: true },
    { name: "Droid Bass 2", path: "./sounds/wavestation-droid-bass-2.wav", loop: true },
    { name: "Euro Percussion Organ", path: "./sounds/wavestation-euro-perc-organ.wav", loop: true },
    { name: "Fingernail on Cardboard Tube", path: "./sounds/cardboard-tube-fingernail.wav"},
    { name: "Into A Maze", path: "./sounds/wavestation-intoamaze.wav", loop: true },
    { name: "Kalimba", path: "./sounds/wavestation-kalimba.wav", loop: true },
    { name: "Marimba", path: "./sounds/wavestation-marimba.wav", loop: true },
    { name: "Nut Pan Beat", path: "./sounds/wavestation-nutpanbeat.wav", loop: true },
    { name: "Ocean Drum (Circles)", path: "./sounds/ocean-drum-circles.wav"},
    { name: "Ocean Drum (Pen Cap)", path: "./sounds/ocean-drum-pen-cap.wav"},
    { name: "Ocean Drum (Vertical Line)", path: "./sounds/ocean-drum-vertical-line.wav"},
    { name: "Pen on Cardboard", path: "./sounds/pen-cardboard-lines.wav", loop: true },
    { name: "Pen on Cardboard 2", path: "./sounds/pen-cardboard-lines-2.wav", loop: true},
    { name: "Pencil Drawing", path: "./sounds/pencil-cardboard-shading.wav"},
    { name: "Phone Dial", path: "./sounds/fisher-price-dial.wav"},
    { name: "Phone Dial (Forward)", path: "./sounds/fisher-price-phone-dial-forward.wav"},
    { name: "Phone Dial (Release)", path: "./sounds/fisher-price-phone-dial-release.wav"},
    { name: "Phone Rolling", path: "./sounds/fisher-price-phone-rolling.wav"},
    { name: "Phone Rolling (Backward)", path: "./sounds/fisher-price-phone-rolling-backward.wav"},
    { name: "Robotic Sequence", path: "./sounds/analog-lab-robotic-sequence.wav", loop: true },
    { name: "Techno Sequence", path: "./sounds/analog-lab-techno-sequence.wav", loop: true },
    { name: "Toy Box (Falling)", path: "./sounds/wavestation-toy-box-falling.wav", loop: true },
];

export default class SoundPicker extends React.Component {
    static defaultProps = {
        watchedKeys: ["Enter", "Space"]
    }

    constructor (props) {
        super(props);
        this.state = {
            selectedSound: 0
        };
    }

    // TODO: Make both of these support filtered key events.
    handlePrevious = (event) => {
        this.setState((prevState, prevProps) => {
            const nextSelectedSound = prevState.selectedSound === 0 ? (soundDefs.length - 1) : prevState.selectedSound - 1;
            return { selectedSound: nextSelectedSound};
        });
    }

    handleNext = (event) => {
        this.setState((prevState, prevProps) => {
            const nextSelectedSound = prevState.selectedSound === (soundDefs.length - 1) ? 0 : prevState.selectedSound + 1;
            return { selectedSound: nextSelectedSound};
        });
    }

    render () {
        const selectedSoundDef = soundDefs[this.state.selectedSound]
        return(<div className="picker-panel">
            <SampleSoundButton
                name={selectedSoundDef.name}
                path={selectedSoundDef.path}
                loop={selectedSoundDef.loop}
                toneStarted={this.props.toneStarted}
                toneStartHook={this.props.toneStartHook}
            />
            <div>
                <button className="previous" onClick={this.handlePrevious}>previous</button>
                <button className="next" onClick={this.handleNext}>next</button>
            </div>
        </div>);
    }
}

