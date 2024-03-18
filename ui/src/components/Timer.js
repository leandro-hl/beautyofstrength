import {Component} from "react";
import {Icon, Loader} from "semantic-ui-react";

export class Timer extends Component {
    constructor(props) {
        super(props);
        const beep = new Audio(`${process.env.PUBLIC_URL}`+"/beep.mp3")
        beep.playbackRate = 3
        this.state = {tick: null, started: false, finished: false,beepStartsAt: 3, beep: beep, loading: true}
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

    setTick(intervals, beepStartsAt, beep) {
        const {tick, started, intervalId} = this.state
        if (tick-1 === -1) {
            const nextTick = intervals.pop()
            if (!nextTick) {
                clearInterval(intervalId)
                this.setState({tick: 0, finished: true})
                this.props.onFinished()
            } else {
                this.setState({tick: nextTick})

                if(started){
                    this.props.onNextInterval()
                } else {
                    this.setState({started: true})
                }
            }
        } else {
            if (tick <= beepStartsAt && tick > 0) {
                beep.play()
            }
            this.setState({tick: tick-1})
        }
    }

    start(intervals) {
        const {beepStartsAt, beep} = this.state

        this.setTick(intervals, beepStartsAt, beep)
        const intervalId = setInterval(() => {
            this.setTick(intervals, beepStartsAt, beep)
        }, 1000)
        this.setState({intervalId})
    }

    next() {
        this.setState({tick: 0})
    }

    render() {
        const {tick, finished, loading} = this.state

        return (
            <>
                <span>{tick}</span>
                {/*{!finished && <Icon*/}
                {/*    style={{*/}
                {/*        position: 'absolute',*/}
                {/*        right: '-10px',*/}
                {/*        top: 0,*/}
                {/*        fontSize: '1.2em',*/}
                {/*    }}*/}
                {/*    name={'chevron right'}*/}
                {/*    onClick={() => this.next()}*/}
                {/*/>}*/}
            </>
        )
    }
}