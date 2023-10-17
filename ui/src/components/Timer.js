import {Component} from "react";
import {Icon} from "semantic-ui-react";

export class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {tick: 0, finished: false}
    }

    componentWillUnmount() {
        const {intervalId} = this.state
        clearInterval(intervalId)
    }

    componentDidMount() {
        this.props.onMounted(this)
    }

    reset() {
        this.stop()
        this.start()
    }

    stop() {
        const {intervalId} = this.state
        clearInterval(intervalId)
        this.setState({tick: 0, finished: false})
    }

    start(intervals) {
        const intervalId = setInterval(() => {
            const {tick} = this.state
            if (tick-1 === -1) {
                const nextTick = intervals.pop()
                if (!nextTick) {
                    clearInterval(intervalId)
                    this.setState({tick: 0, finished: true})
                    this.props.onFinished()
                } else {
                    this.setState({tick: nextTick})
                    this.props.onNextInterval()
                }
            } else {
                this.setState({tick: tick-1})
            }
        }, 1000)
        this.setState({intervalId})
    }

    next() {
        this.setState({tick: 0})
    }

    render() {
        const {tick, finished} = this.state
        return (
            <>
                <span>{tick}</span>
                {!finished && <Icon
                    style={{
                        position: 'absolute',
                        right: '-10px',
                        top: 0,
                        fontSize: '1.2em',
                    }}
                    name={'chevron right'}
                    onClick={() => this.next()}
                />}
            </>
        )
    }
}