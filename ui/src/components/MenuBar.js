import React, {Component} from "react";
import {Loader, Menu} from "semantic-ui-react";

export class MenuBar extends Component {
    state = {activeItem: 'Activas'}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const {activeItem} = this.state;

        return (
            <Menu borderless fluid>
                <Menu.Item
                    style={{width: '50%'}}
                    name='Activas'
                    active={activeItem === 'Activas'}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    style={{width: '50%'}}
                    name='Historicas'
                    active={activeItem === 'Historicas'}
                    onClick={this.handleItemClick}
                />
            </Menu>
        )
    }
}