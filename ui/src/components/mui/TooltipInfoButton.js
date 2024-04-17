import {Component} from "react";
import {IconButton, Tooltip} from "@mui/material";
import {ReactComponent as InfoIcon} from '../../icons/info.svg'

export class TooltipInfoButton extends Component {
    state = {
        showTooltip: false
    }
    render() {
        const {showTooltip} = this.state;
        return (
            <>
                <Tooltip
                    leaveTouchDelay={5000}
                    placement="top" open={showTooltip}
                    onClose={() => this.setState({showTooltip: false})} arrow
                    title={this.props.title}
                    {...this.props}>
                    <IconButton aria-label="info" onClick={() => this.setState({showTooltip: true})}>
                        <InfoIcon />
                    </IconButton>
                </Tooltip>
            </>
        )
    }

}