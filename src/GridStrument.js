import React from "react";

import {Players, Frequency, Midi, Destination, start as StartTone} from "tone";

import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import HelpPopover from './HelpPopover';

import './GridStrument.css';

export const gridstrumentDefaultProps = {
    // Grid Params
    startRow: 2,
    startCol: 2,
    minCol:  -2,
    maxCol:   6,
    minRow:  -2,
    maxRow:   6,
    numCols:  5,
    numRows:  5,
    cellHeight: 30,
    cellWidth: 30,

    // Control Params
    watchedKeys: ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter"],

    // Sound Params
    useOffsets: false,
    loop: false,
    rampToDuration: 0,
    samplerBaseOctave: 2,
    samplerBaseURL: "./sounds/",
    samplerURLs: {
        "E2": "bongo.wav"
    }
}

export default class GridStrument extends React.Component {
    static noteByColumn = {
        "-2": "C",
        "-1": "C#",
        "0":  "D",
        "1":  "D#",
        "2":  "E",
        "3":  "F",
        "4":  "F#",
        "5":  "G",
        "6":  "A"
    }

    static indexByNote = {
        "C":  0,
        "C#": 1,
        "D":  2,
        "D#": 3,
        "E":  4,
        "F":  5,
        "F#": 6,
        "G":  7,
        "G#": 8,
        "A":  9,
        "A#": 10,
        "B":  11
    }

    static defaultProps = gridstrumentDefaultProps;
    
    constructor (props) {
        super(props);

        this.state = {
            cursorCol: props.startCol,
            cursorRow: props.startRow,
        };

        // Initialize sound and filters.
        this.initialisePlayers();

        this.effects = [Destination];
        this.connectEffects();
    }
    
    initialisePlayers = (props) => {
        this.players = new Players();

        this.playerKeysByPitch = {};
        Object.keys(this.props.samplerURLs).forEach((key) => {
            const sampleURL = this.props.samplerBaseURL + this.props.samplerURLs[key];
            this.players.add(key, sampleURL);
            const notePitch = Frequency(key).toMidi();
            this.playerKeysByPitch[notePitch] = key;
        });
    }
    

    // All of the classes that extend this one update this.effects to represent their desired chain of effects between
    // this.players and Tone.Destination.
    connectEffects = () => {
        this.players.disconnect();
        this.players.chain.apply(this.players, this.effects);
    }

    handleKeyDown = (event) => {
        if (event.key && this.props.watchedKeys.indexOf(event.key) !== -1) {
            event.preventDefault();
            switch (event.key) {
                case "ArrowLeft":
                    this.setState((prevState) => {
                        const nextCol = prevState.cursorCol - 1;
                        if (nextCol >= this.props.minCol) {
                            return { cursorCol: nextCol};
                        }
                        else {
                            return null;
                        }
                    });
                    break;
                case "ArrowRight":
                    this.setState((prevState) => {
                        const nextCol = prevState.cursorCol + 1;
                        if (nextCol <= this.props.maxCol) {
                            return { cursorCol: nextCol};
                        }
                        else {
                            return null;
                        }
                    });
                break;
                case "ArrowUp":
                this.setState((prevState) => {
                    const nextRow = prevState.cursorRow - 1;
                    if (nextRow >= this.props.minRow) {
                        return { cursorRow: nextRow};
                    }
                    else {
                        return null;
                    }
                });
                break;
                case "ArrowDown":
                    this.setState((prevState) => {
                        const nextRow = prevState.cursorRow + 1;
                        if (nextRow <= this.props.maxRow) {
                            return { cursorRow: nextRow};
                        }
                        else {
                            return null;
                        }
                    });
                    break;
                case "Enter":
                    if (this.activePlayer && this.activePlayer.state === "started") {
                        this.stopPlaying();
                    }
                    else {
                        this.playNote();
                    }                  
                    break;
                default:
                    break;
            }
        }
    }

    playNote = () => {
        const octave = this.props.samplerBaseOctave + (this.props.numRows - this.state.cursorRow);
        const noteName = GridStrument.noteByColumn[this.state.cursorCol];
        this.playSingleNote(noteName, octave);
    }

    stopPlaying = () => {
        if (this.activePlayer && this.activePlayer.state === "started") {
            this.activePlayer.stop();
        }
    }

    playSingleNote = (noteName, octave) => {
        let previousNoteOffset = 0;

        if (this.props.useOffsets && this.activePlayer && this.activePlayer.state === "started") {           
            // We have to calculate the relative position in the sample ourselves because Tone.js no longer exposes that information:
            // https://github.com/Tonejs/Tone.js/issues/621
            this.activePlayer.stop();
            let noteStopped = this.activePlayer.context.now();
            const sampleLength = this.activePlayer.buffer.duration;
            const timeElapsed = noteStopped - this.noteStarted;
            // The offset for the next note will be: (duration % sample length)  ( newPlaybackRate/ oldPlaybackRate ).
            previousNoteOffset = (timeElapsed % sampleLength) / this.activePlayer.playbackRate;
        }
       
        // The Sampler doesn't allow you to loop sounds, so we use a Players class and handle the pitch shifting ourselves.
        const desiredNote = noteName + octave;

        // Find our nearest neighbor note.
        const desiredPitch = Frequency(desiredNote).toMidi();

        let leastDistance = 127;
        Object.keys(this.playerKeysByPitch).forEach((pitch) => {
            const distance = pitch - desiredPitch;
            if (Math.abs(distance) < Math.abs(leastDistance)) {
                leastDistance = distance;
            }
        });

        if (leastDistance !== 127) {
            const closestPitch = desiredPitch + leastDistance;
            const key = Midi(closestPitch).toNote();

            // Get the individual Player instance.
            const notePlayer = this.players.player(key);

            if (notePlayer && notePlayer.start) {
                this.activePlayer = notePlayer;
                
                // Set its loop variable.
                notePlayer.loop = this.props.loop;
                
                // Adjust the speed
                const adjustmentFactor = Math.pow(2, Math.abs(leastDistance/12));
                const adjustedSpeed = leastDistance < 0 ? adjustmentFactor : (1 / adjustmentFactor);
                
                // TODO: The note player lacks a "rampTo" for its playbackrate, so we can't transition pitches that way.
                // See if they expose their timing mechanism for arbitrary values.
                // May not want to do this, as it would mess up our offset algorithm.
                debugger;
                notePlayer.playbackRate = adjustedSpeed;
                
                const scaledOffset = previousNoteOffset * adjustedSpeed

                this.noteStarted = notePlayer.context.now() - scaledOffset;
                
                // Play the note.
                notePlayer.start(0, scaledOffset);
            }
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.cursorCol !== this.state.cursorCol || prevState.cursorRow !== this.state.cursorRow) {
            this.playNote();
        }

        if (JSON.stringify(prevProps.samplerURLs) !== JSON.stringify(this.props.samplerURLs)) {
            this.stopPlaying();
            this.initialisePlayers(this.props);
            this.connectEffects();
        }

        if (prevProps.loop && !this.props.loop) {
            this.stopPlaying();
        }
    }

    getEffectsChain = () => {
        return [Destination];
    }

    drawGrid = (leftGutterX, topGutterY) => {
        const gridCells = [];
        for (let row = 0; row < this.props.numRows; row++) {
            for (let col = 0; col < this.props.numCols; col++) {
                const x = leftGutterX + ((col - 1) * this.props.cellWidth);
                const y = topGutterY + ((row - 1) * this.props.cellHeight);
                const key = row + "-" + col;
                gridCells.push(<rect key={key} x={x} y={y} width={this.props.cellWidth} height={this.props.cellHeight} fill="white" stroke="black" strokeWidth="2"/>);
            }
        }
        return gridCells;
    }

    render() {
        const totalCols = (this.props.maxCol - this.props.minCol) + 1;
        const height = totalCols * this.props.cellHeight;
        const totalRows = (this.props.maxRow - this.props.minRow) + 1;
        const width = totalRows * this.props.cellWidth;

        const leftGutterX = (1 - this.props.minCol) * this.props.cellWidth; 
        const topGutterY  = (1 - this.props.minRow) * this.props.cellHeight;

        const cursorCx = leftGutterX + (this.props.cellWidth * (this.state.cursorCol - 0.5));
        const cursorCy = topGutterY + (this.props.cellWidth *  (this.state.cursorRow - 0.5));
        
        const helpPopoverStyle = {
            width: width
        }

        return(<Container
                className="gridstrument"
                onKeyDown={StartTone}
                onClick={StartTone}
               >
                <Row>
                    <Col md="12">

                        <svg width={width} height={height} tabIndex="1" onKeyDown={this.handleKeyDown}>
                            <defs>
                                <radialGradient id="boundaries">
                                <stop offset="35%" stopColor="grey" />
                                <stop offset="75%" stopColor="black" />
                                </radialGradient>
                            </defs>

                            <rect
                                x="0"
                                y="0"
                                width={width}
                                height={height}
                                fill="url('#boundaries')"
                            />

                            {this.drawGrid(leftGutterX, topGutterY)}

                            <circle
                                cx={cursorCx}
                                cy={cursorCy}
                                r={this.props.cellWidth * 0.3 }
                                fill="#ffcccc"
                                stroke="#ff0000"
                                strokeWidth="1%"
                            />
                        </svg>         
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <HelpPopover
                            buttonStyle={helpPopoverStyle}
                            variant="info"
                            title="Help"
                            content = "
                                Focus on the grid by clicking or tab navigating to it, then use arrow keys to change
                                position. The note corresponding to your position will play as you move. Hit the enter
                                key to stop playing the current note or repeat the note that corresponds to the current
                                position.
                            "
                        />
                    </Col>
                </Row>
            </Container>);
    }
}
