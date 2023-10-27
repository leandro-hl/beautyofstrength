import {Component} from "react";
import {Icon} from "semantic-ui-react";

export class Timer extends Component {
    constructor(props) {
        super(props);
        const beep = new Audio(`${process.env.PUBLIC_URL}`+"/beep.mp3")
        beep.playbackRate = 1.5
        this.state = {tick: 0, finished: false,beepStartsAt: 4, beep: beep}
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
        const {beepStartsAt, beep} = this.state
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
                if (tick <= beepStartsAt && tick > 0) {
                    beep.play()
                }
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