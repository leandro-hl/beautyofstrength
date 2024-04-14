import {Component} from "react";

export class Chip extends Component {
    render() {
        const {success, omit, progress, feel, feelGrey, content, style, className, onClick} = this.props
        let classes = 'chip'
        if (success) {
            classes += ' success'
        } else if (omit) {
            classes += ' omit'
        } else if (progress) {
            classes += ' progress'
        } else if (feel) {
            classes += ' feel'
        } else if (feelGrey) {
            classes += ' feel-grey'
        }

        if (className) {
            classes += ' '+className
        }

        return (
            <span style={style} className={classes} onClick={onClick}>
                {content ?? this.props.children}
            </span>
        )
    }
}