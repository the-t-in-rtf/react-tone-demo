// TODO: Add flow
import React from 'react';

import {Player} from "tone";

import './SampleSoundButton.css'

export default class SampleSoundButton extends React.Component {
    static defaultProps = {
        name: "Sound",
        playingClass: "playing",
        stoppedClass: "stopped",
        playingLeader: "Stop",
        stoppedLeader: "Play",
        watchedKeys: ["Enter", "Space"]
    }

    constructor(props) {
        super(props);

        this.player = new Player(props.path, this.onLoaded);
        this.player.onstop = this.onStop;
        this.player.loop = this.props.loop;
        this.player.toDestination();

        // TODO: Track whether we're loaded yet.

        this.state = {
            isLoaded: false,
            isPlaying: false
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // Make looping independently configurable.
        this.player.loop = this.props.loop;

        // Reload the sound when the path changes.
        if (prevProps.path !== this.props.path) {
            // Stop the sound if it's playing.
            if (this.player && this.player.state === "started") {
                this.player.stop(); // This will also eventually change isPlaying for us, but we need it sooner.
                this.setState({ isPlaying: false});
            }

            this.setState({isLoaded: false });
            const loadPromise = this.player.load(this.props.path);
            loadPromise.then(this.onLoaded)
        }
    }

    componentWillUnmount () {
        if (this.player && this.player.state === "started") {
            this.player.stop();
        }
    }

    onLoaded = () => {
        // TODO: This may be hit before the component is actually mounted.
        this.setState({ isLoaded: true });
    }

    onStop = () => {
        this.setState({ isPlaying: false});
    }

    handleClick = (event) => {
        event.preventDefault();
        this.toggleSound();
    }

    handleKeyDown = (event) => {
        if (this.props.watchedKeys.indexOf(event.key) !== -1) {
            event.preventDefault();
            this.toggleSound();
        }
    }

    toggleSound() {
        if (!this.props.toneStarted && this.props.toneStartHook) {
            // Start Tone.js asynchronously.
            const toneStartPromise = this.props.toneStartHook()
            toneStartPromise.then(() => {
                // Call ourselves again once the promise returns.
                this.toggleSound();
            });
        }
        else {
            if (this.player.state === "started") {
                this.player.stop();
            }
            else {
                this.setState({ isPlaying: true});
                this.player.start();
            }
        }
    }

    render () {
        const { isLoaded, isPlaying} = this.state;
        if (isLoaded) {
            return(
                <button
                    className={ this.state.isPlaying ? this.props.playingClass : this.props.stoppedClass }
                    onKeyDown={this.handleKeyDown}
                    onClick={this.handleClick}
                >
                    <div className="button-text">
                        { isPlaying ? this.props.playingLeader : this.props.stoppedLeader} {this.props.name}
                    </div>
                </button>
            )
        }
        else {
            return <div>Loading sound...</div>;
        }
    }
}