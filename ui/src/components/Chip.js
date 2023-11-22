import {Component} from "react";

export class Chip extends Component {
    render() {
        const {success, omit, progress, feel, content, style, className, onClick} = this.props
        let classes = 'chip'
        if (success) {
            classes += ' success'
        } else if (omit) {
            classes += ' omit'
        } else if (progress) {
            classes += ' progress'
        } else if (feel) {
            classes += ' feel'
        }

        return (
            <span style={style} className={classes+' '+className} onClick={onClick}>
                {content ?? this.props.children}
            </span>
        )
    }
}