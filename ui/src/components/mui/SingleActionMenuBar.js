import React, {Component} from "react";
import {ButtonGroup, Button, Icon, Tooltip, Grid} from "@mui/material";
import {withRouter} from "react-router-dom";
import {AppContext} from "../../context";

class SingleActionMenuBar extends Component {
    static contextType = AppContext

    render() {
        const {state: {singleActionMenuBar:{onAction, disable, actionTitle}}} = this.context;

        return (
            <Grid container style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                maxWidth: 600,
                height: 80,
                borderTop: '1.482px solid rgba(255, 255, 255, 0.15)',
                backgroundColor: '#121212',
            }} alignItems={'center'} justifyContent={'center'}>
                <Grid item>
                    <Button
                        style={{transition: 'width .5s'}}
                        disabled={disable} variant={'contained'} onClick={() => onAction()}>{actionTitle}</Button>
                </Grid>
            </Grid>
        )
    }
}

export default withRouter(SingleActionMenuBar);