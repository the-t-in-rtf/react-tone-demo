import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

export default function HelpPopover (props) {
    const popoverId = "popover-" + (props.title || Date.now());
    const popover = (<Popover id={popoverId}>
        <Popover.Content>
            {props.content}
        </Popover.Content>
    </Popover>);

    return <OverlayTrigger trigger="focus" placement="auto" overlay={popover}>
        <Button variant={props.variant || "light" } className="control-label" style={props.buttonStyle}>
            {props.title}
        </Button>
    </OverlayTrigger>;
}