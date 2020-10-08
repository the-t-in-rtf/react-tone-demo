import React from "react";

import {Sampler} from "tone";

import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

export const gridstrumentDefaultProps = {
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
    watchedKeys: ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter"],
    samplerBaseOctave: 2,
    samplerBaseURL: "./sounds/",
    samplerRelease: 1,
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

    static defaultProps = gridstrumentDefaultProps;
    
    constructor (props) {
        super(props);

        // Initialize sound and filters.
        this.initialiseSampler(props);

        this.state = {
            cursorCol: props.startCol,
            cursorRow: props.startRow
        };
    }

    initialiseSampler = (props) => {
        // TODO: The Sampler doesn't allow you to loop sounds, so we'll probably want to write our own wrapper around Tone.Player with scaling for pitch.
        this.sampler = new Sampler({
            urls: props.samplerURLs,
            release: props.samplerRelease,
            baseUrl: props.samplerBaseURL
        });
        this.sampler.toDestination();
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
                    this.playNote();
                    break;
                default:
                    break;
            }
        }
    }

    playNote = () => {
        const octave = this.props.samplerBaseOctave + (this.props.numRows - this.state.cursorRow);
        const noteName = GridStrument.noteByColumn[this.state.cursorCol];

        this.sampler.releaseAll();
        this.sampler.triggerAttack([noteName + octave]);
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.cursorCol !== this.state.cursorCol || prevState.cursorRow !== this.state.cursorRow) {
            this.playNote();
        }
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
        
        return(<Container>
                <Row>
                    <Col md="6">
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
                    <Col md="6">
                        <div className="alert alert-dark">
                            Focus on the element, then use arrow keys to change position and space/enter to play the note corresponding to the current position.
                        </div>
                    </Col>
                </Row>
            </Container>);
    }
}

// TODO: Write a component that plays the note with effects depending on whether we're out of bounds.
