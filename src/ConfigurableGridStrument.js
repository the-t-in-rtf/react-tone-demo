import React from 'react';

import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { Toggle, Dial, Select } from 'react-nexusui';

import './ConfigurableGridStrument.css';

import BoundedPanningGridStrument from './BoundedPanningGridStrument'

function roundedNumberAsString (number) {
    return (Math.round(number * 100) / 100).toString();
}

export default class ConfigurableGridStrument extends React.Component {
    samplerURLsByKey = {
        "Bongo": { "E2": "bongo.wav" },
        "Euro Perc": { "A1": "wavestation-euro-perc-organ.wav"},
        "Glissando (Down)": { "C3": "glissando/al-metalic-vs-robotic-down.wav"},
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
                <Col md="12">
                    <BoundedPanningGridStrument
                        gainCutoffOutOfBounds={this.state.gainCutoffOutOfBounds}
                        loop={this.state.loop}
                        lowpassResonanceOutOfBounds={this.state.lowpassResonanceOutOfBounds}
                        reverbWetnessOutOfBounds={this.state.reverbWetnessOutOfBounds}
                        samplerURLs={this.state.samplerURLs}
                        useOffsets={this.state.useOffsets}
                    />
                </Col>
            </Row>
            <Row>
                <Col md="6"></Col>
                <Col md="3">
                    <h4 className="control-label">Sound Pack</h4>
                </Col>
                <Col md="3">
                    <Select
                        options={Object.keys(this.samplerURLsByKey).sort()}
                        selectedIndex={0}
                        onChange={this.setSampleURLs}
                    />
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col md="4">
                    <h4 className="control-label">Loop Sample?</h4>

                    <Toggle
                        state={this.state.loop}
                        size={[100,40]}
                        onChange={this.setLoopParameter}
                    />

                    <p className="value-label">{this.state.loop ? "Yes" : "No"}</p>
                </Col>
                <Col md="4">
                    <h4 className="control-label">Effect Transition Time (s)</h4>
                    <Dial
                        value={this.state.rampToDuration}
                        onChange={this.setRampToDuration}
                        min={0}
                        max={2}
                        step={0.25}
                    />

                    <p className="value-label">{roundedNumberAsString(this.state.rampToDuration)}</p>
                </Col>
                <Col md="4">
                    <h4 className="control-label">"Out of Bounds" Gain Cutoff</h4>
 
                    <Dial
                        value={this.state.gainCutoffOutOfBounds}
                        onChange={this.setGainCutoffOutOfBounds}
                        min={0}
                        max={0.4}
                    />

                    <p className="value-label">{roundedNumberAsString(this.state.gainCutoffOutOfBounds)}</p>
                </Col>
            </Row>
            <Row>
                <Col md="4">
                    <h4 className="control-label">"Out of Bounds" Reverb</h4>
                    <Dial
                        value={this.state.reverbWetnessOutOfBounds}
                        onChange={this.setReverbWetnessOutOfBounds}
                        min={0}
                        max={0.35}
                    />

                    <p className="value-label">{roundedNumberAsString(this.state.reverbWetnessOutOfBounds)}</p>
                </Col>
                <Col md="4">
                    <h4 className="control-label">"Out of Bounds" Low Pass</h4>
                    <Dial
                        value={this.state.lowpassResonanceOutOfBounds}
                        onChange={this.setLowpassResonanceOutOfBounds}
                        min={0}
                        max={0.35}
                    />

                    <p className="value-label">{roundedNumberAsString(this.state.lowpassResonanceOutOfBounds)}</p>
                </Col>
                <Col md="4">
                    <h4 className="control-label">Use Offsets</h4>

                    <Toggle
                        state={this.state.useOffsets}
                        size={[100,40]}
                        onChange={this.setUseOffsets}
                    />

                    <p className="value-label">{this.state.useOffsets ? "Yes" : "No"}</p>

                </Col>
            </Row>
        </Container>);
    }
}