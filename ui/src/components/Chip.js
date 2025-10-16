/**
 * Copyright 2025 Leandro Herenu - BOS (Beauty Of Strength)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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