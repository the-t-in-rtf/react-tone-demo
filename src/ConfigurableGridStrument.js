import React from 'react';

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { Toggle, Dial, Select } from 'react-nexusui';

import './ConfigurableGridStrument.css';

import HelpPopover from './HelpPopover';
import BoundedPanningGridStrument from './BoundedPanningGridStrument'

function roundedNumberAsString (number) {
    return (Math.round(number * 100) / 100).toString();
}


// We need this wrapper because the React NexusUI component strips the className parameter and also lacks any useful class of its own.
function GridStrumentDial (props) {
    return (<div className="gridstrument-dial">
        <Dial
            size={props.size}
            interaction={props.interaction}
            mode={props.mode}
            min={props.min}
            max={props.max}
            step={props.step}
            value={props.value}
            onChange={props.onChange}
            onReady={props.onReady}
        />
    </div>);
}

export default class ConfigurableGridStrument extends React.Component {
    samplerURLsByKey = {
        "Bongo": { "E2": "bongo.wav" },
        "Euro Perc": { "A1": "wavestation-euro-perc-organ.wav"},
        "Glissando (Down)": { "C2": "glissando/al-metalic-vs-robotic-down.wav"},
        "Glissando (Up)": { "C2": "glissando/al-metalic-vs-robotic-up.wav"},
        "Pencil": {"A1": "pencil-cardboard-shading.wav"},
        "Train": { "C1": "train/C1.wav", "C2": "train/C2.wav", "C3": "train/C3.wav", "C4": "train/C4.wav" }
    }

    static defaultProps = {
        loop: false,
        rampToDuration: 0,
        gainCutoffOutOfBounds: 0.4,
        reverbWetnessOutOfBounds: 0.35,
        lowpassResonanceOutOfBounds: 0.35,
        samplerURLs: { "E2": "bongo.wav" },
        useOffsets: false
    }
 
    constructor (props) {
        super(props);
        this.state = {
            gainCutoffOutOfBounds: this.props.gainCutoffOutOfBounds,
            loop: this.props.loop,
            lowpassResonanceOutOfBounds: this.props.lowpassResonanceOutOfBounds,
            rampToDuration: this.props.rampToDuration,
            reverbWetnessOutOfBounds: this.props.reverbWetnessOutOfBounds,
            samplerURLs: this.props.samplerURLs,
            useOffsets: this.props.useOffsets
        };
    }

    // IMO it's pretty despicable not to make the components properly relay state without these kinds of handlers.
    setLoopParameter = (newLoopValue) => {
        this.setState({ loop: newLoopValue });
    }

    setRampToDuration = (newRampToDuration) => {
        this.setState({ rampToDuration: newRampToDuration});
    }

    setGainCutoffOutOfBounds = (newGainCutoffOutOfBounds) => {
        this.setState({ gainCutoffOutOfBounds: newGainCutoffOutOfBounds});
    }

    setReverbWetnessOutOfBounds = (newReverbWetnessOutOfBounds) => {
        this.setState({ reverbWetnessOutOfBounds: newReverbWetnessOutOfBounds});
    }

    setLowpassResonanceOutOfBounds = (newLowpassResonanceOutOfBounds) => {
        this.setState({ lowpassResonanceOutOfBounds: newLowpassResonanceOutOfBounds});
    }

    setSampleURLs = (selectedItemDef) => {
        const newSamplerURLs = this.samplerURLsByKey[selectedItemDef.value];
        this.setState({ samplerURLs: newSamplerURLs})
    }

    setUseOffsets = (newUseOffsets) => {
        this.setState({ useOffsets: newUseOffsets});
    }

    render () {
        return (<Container>
            <Row>
                <Col md="4">
                    <BoundedPanningGridStrument
                        gainCutoffOutOfBounds={this.state.gainCutoffOutOfBounds}
                        loop={this.state.loop}
                        lowpassResonanceOutOfBounds={this.state.lowpassResonanceOutOfBounds}
                        reverbWetnessOutOfBounds={this.state.reverbWetnessOutOfBounds}
                        samplerURLs={this.state.samplerURLs}
                        useOffsets={this.state.useOffsets}
                    />
                </Col>
                <Col md="1"></Col>
                <Col md="3">
                    <HelpPopover
                        title = "Sound Pack"
                        content = "Select which sounds to use."
                        block
                    />
                    <Select
                        options={Object.keys(this.samplerURLsByKey).sort()}
                        selectedIndex={0}
                        onChange={this.setSampleURLs}
                    />
                </Col>
                <Col md="1"></Col>
                <Col md="3">
                    <Row>
                        <Col md="6">
                            <HelpPopover
                                title = "Loop"
                                content = "Whether to loop the sample when it finishes playing."
                            />
                        </Col>
                        <Col md="4">
                            <Toggle
                                state={this.state.loop}
                                size={[100,40]}
                                onChange={this.setLoopParameter}
                            />
                        </Col>
                        <Col md="2">
                            <div className="value-label">{this.state.loop ? "Yes" : "No"}</div>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="6">
                            <HelpPopover
                                title = "Offsets"
                                content = "When changing notes (such as when moving up or down), start from the position reached in the previous sound rather than starting from the beginning of the sample."
                            />
                        </Col>

                        <Col md="4">
                            <Toggle
                                state={this.state.useOffsets}
                                size={[100,40]}
                                onChange={this.setUseOffsets}
                            />

                        </Col>
                        <Col md="2">
                            <p className="value-label">{this.state.useOffsets ? "Yes" : "No"}</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col md="3">
                    <HelpPopover
                        title = "Transition Time"
                        content = "How long (in seconds) to transition effects such as panning when they change.  Set to zero to disable."
                    />

                    <GridStrumentDial
                        className="gridstrument-dial"
                        value={this.state.rampToDuration}
                        onChange={this.setRampToDuration}
                        min={0}
                        max={2}
                        step={0.25}
                    />

                    <p className="value-label">{roundedNumberAsString(this.state.rampToDuration)}</p>
                </Col>
                <Col md="3">
                    <HelpPopover
                        title = "Gain Cutoff"
                        content = "How much to lower the volume when out of bounds."
                    />

                    <GridStrumentDial
                        className="gridstrument-dial"
                        value={this.state.gainCutoffOutOfBounds}
                        onChange={this.setGainCutoffOutOfBounds}
                        min={0}
                        max={0.4}
                        />

                    <p className="value-label">{roundedNumberAsString(this.state.gainCutoffOutOfBounds)}</p>
                </Col>
                <Col md="3">
                    <HelpPopover
                        title = "Reverb"
                        content = "How much reverb to apply when out of bounds."
                    />

                    <GridStrumentDial
                        className="gridstrument-dial"
                        value={this.state.reverbWetnessOutOfBounds}
                        onChange={this.setReverbWetnessOutOfBounds}
                        min={0}
                        max={0.35}
                    />

                    <p className="value-label">{roundedNumberAsString(this.state.reverbWetnessOutOfBounds)}</p>
                </Col>
                <Col md="3">
                    <HelpPopover
                        title = "Low Pass"
                        content = "How much of a low pass filter to apply when out of bounds."
                    />

                    <GridStrumentDial
                        value={this.state.lowpassResonanceOutOfBounds}
                        onChange={this.setLowpassResonanceOutOfBounds}
                        min={0}
                        max={0.35}
                    />

                    <p className="value-label">{roundedNumberAsString(this.state.lowpassResonanceOutOfBounds)}</p>
                </Col>
            </Row>
        </Container>);
    }
}