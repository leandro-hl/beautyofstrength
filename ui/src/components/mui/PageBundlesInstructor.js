import {withRouter} from "react-router-dom";
import {Slider} from "@mui/material";
import React,{Component} from "react";

class PageBundlesInstructor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            options: [
                {
                    title: 'Rutinas que puedo crear',
                    description: 'Rutinas que puedo crear',
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
                <h1>PageBundlesInstructor</h1>
                {options.map((o, i) => {
                    return <Slider
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
                })}
            </div>
        )
    }
}

export default withRouter(PageBundlesInstructor);