import {withRouter} from "react-router-dom";
import {Box, Paper, Slider, Typography} from "@mui/material";
import React,{Component} from "react";
import {TooltipInfoButton} from "./TooltipInfoButton";

class PageBundles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            options: [
                {
                    title: 'Rutinas que quiero crear',
                    description: 'Elige cuantas rutinas quieres agregar a tu paquete',
                    type: 'slider',
                    //quantity?
                    price: {
                        min: 10,
                        max: 1000,
                        interval: 100,
                        given: 10
                    }
                }
            ]
        }
    }

    handleSliderChange = (index, value) => {
        const newStep = this.calculateStep(value);
        this.setState(prevState => {
            let newOptions = prevState.options.slice();
            newOptions[index].price.interval = newStep;
            return {
                options: newOptions
            }
        });
    }

    calculateStep = (value) => {
        // Define your function to calculate step based on current value
        // For now, let's use a simple linear function
        return 100 - 0.1 * value;
    }

    render() {
        const { loading, options } = this.state;
        function valuetext(value) {
            return `${value}`;
        }
        return (
            <div>
                <h1>Configura tu paquete!</h1>
                {options.map((o, i) => {
                    return (
                        <Paper>
                            <Box p={2}>
                                <Typography gutterBottom>
                                    {o.title}
                                    <TooltipInfoButton title={o.description}/>
                                </Typography>
                                <Slider
                                    style={{textAlign:`center`, color: 'white'}}
                                    defaultValue={o.price.given}
                                    getAriaValueText={valuetext}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    step={o.price.interval}
                                    marks={true}
                                    min={o.price.min}
                                    max={o.price.max}
                                    onChange={(_, value) => this.handleSliderChange(i, value)}
                                />
                            </Box>
                        </Paper>
                    )
                })}
            </div>
        )
    }
}

export default withRouter(PageBundles);