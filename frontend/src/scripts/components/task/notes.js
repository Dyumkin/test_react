import React, { Component } from 'react';
import { Media, Button } from 'reactstrap';
import {Icon} from 'react-fa';

export default class Notes extends Component {

    componentWillMount() {
        this.state = { notes: this.props.notes || [] };
    }

    componentWillReceiveProps(nextProps) {
        let { notes } = nextProps.notes;

        if (notes) {
            this.setState({ notes });
        }
    }

    getNotes = () => {
        const { notes } = this.state;

        return notes.map((note, key) => {
            return (
                <Media key={ key }>
                    <Media body>
                        <Button size="sm" color="primary"><Icon name="check"/></Button>{' '}
                        {note.text}
                    </Media>
                </Media>
            );
        });
    };

    render() {
        return (
            <Media>
                <Media body>
                    <Media heading>
                        Notes:
                    </Media>
                    { this.getNotes() }
                </Media>
            </Media>
        );
    }
}