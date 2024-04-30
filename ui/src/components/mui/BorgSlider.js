import React, {Component} from "react";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import {Slider, styled} from "@mui/material";
import {ReactComponent as FaceDeathIcon} from "../../icons/face_death.svg";
import {ReactComponent as FaceSadIcon} from "../../icons/face_sad.svg";
// import {ReactComponent as FaceCalmIcon} from "../../icons/face_calm.svg";
import {ReactComponent as FaceCalmIcon} from "../../icons/face_calm.svg";
import {ReactComponent as OnFireIcon} from "../../icons/fire.svg";

const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }}/>
))((props) => ({
    backgroundColor: 'unset',
    [`& .${tooltipClasses.tooltip}`]: {
        lineHeight: 1.2,
        fontSize: 12,
        background: 'unset',
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: '0% 0% 50% 50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: props.color,
        transformOrigin: 'bottom left',
        transform: 'rotate(45deg)'
    }
}))

function ValueLabelComponent(props) {
    const { children, ownerState:{myColor,MyIcon} } = props;
    return (
        <>
            <StyledTooltip color={myColor} open={true} enterTouchDelay={0} placement="top" title={<MyIcon/>}>
                {children}
            </StyledTooltip>
        </>
    );
}

const PrettoSlider = styled(Slider)((props) => ({
    // this will change based on the range color
    color: props.myColor,
    height: 8,
    '&.Mui-disabled': {
        color: props.myColor,
        opacity: 0.38
    },
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-markLabel': {
      color: props.isWhite ? '#FFFFFF' : '#000000',
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        // this could be a little bit darker
        backgroundColor: props.myColor,
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&::before': {
            display: 'none',
        },
    }
}));

export class BorgSlider extends Component {
    constructor(props) {
        super(props);

        const value = 5

        const config = props.config ??{
            labels: [
                'Estoy Muerto',
                'Muy Cansado',
                'Cansado',
                'Algo Cansado',
                'Ok',
                'Bien',
                'Bastante Bien',
                'Ready!',
                'Go go go!',
                'Excelente!',
            ],
            colors: [
                '#00BCD4',
                '#00BCD4',
                '#4CAF50',
                '#4CAF50',
                '#FF9800',
                '#FF9800',
                '#FF9800',
                '#FF5722',
                '#FF5722',
                '#FF5722',
            ],
            icons: [
                FaceDeathIcon,
                FaceDeathIcon,
                FaceSadIcon,
                FaceSadIcon,
                FaceCalmIcon,
                FaceCalmIcon,
                FaceCalmIcon,
                OnFireIcon,
                OnFireIcon,
                OnFireIcon
            ]
        }

        this.state = {
            config,
            value: value,
            currentMarks:[{
                value: value,
                label: config.labels[value - 1]
            }],
        }
    }

    handleChange = (newValue) => {
        this.setState({
            value: newValue,
            currentMarks: [{
                value: newValue,
                label: this.state.config.labels[newValue - 1]
            }]
        });
        this.props.onChange(newValue)
    };

    render() {
        const {value, config, currentMarks} = this.state;

        return (
            <>
                <PrettoSlider
                    disabled={this.props.disabled}
                    disableSwap={this.props.disabled}
                    isWhite={this.props.isWhite}
                    myColor={config.colors[value - 1]}
                    MyIcon={config.icons[value - 1]}
                    onChange={(_, value) => this.handleChange(value)}
                    valueLabelDisplay={this.props.disabled ? "off" : "on"}
                    value={value}
                    shiftStep={1}
                    step={1}
                    marks={currentMarks}
                    min={1}
                    max={10}
                    slots={{
                        valueLabel: ValueLabelComponent
                    }}
                />
            </>
        )
    }
}