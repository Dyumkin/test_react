import React, { Component } from 'react';
import { Media, ListGroup, ListGroupItem, Button, ButtonGroup } from 'reactstrap';
import {Icon} from 'react-fa';

export default class Notes extends Component {

    componentWillMount() {
        this.state = { notes: this.props.notes || [] };
    }

    componentWillReceiveProps(nextProps) {
        let { notes } = nextProps;

        if (notes) {
            this.setState({ notes });
        }
    }

    getNotes = () => {
        const { notes } = this.state;

        return notes.map((note, index) => {
            return (
                <ListGroupItem key={ index }>
                    {note.text}
                    <ButtonGroup className="pull-right">
                        <Button onClick={ this.removeNote.bind(null, index) }
                                size="sm"
                                color="primary">
                            <Icon name="pencil"/>
                        </Button>{' '}
                        <Button onClick={ this.updateNote.bind(null, index) }
                                size="sm"
                                color="danger">
                            <Icon name="times"/>
                        </Button>{' '}
                    </ButtonGroup>
                </ListGroupItem>
            );
        });
    };

    removeNote = (index) => {

    };

    updateNote = (index) => {

    };

    render() {
        return (
            <Media>
                <Media body>
                    <Media heading>
                        Notes:
                    </Media>
                    <ListGroup>
                        { this.getNotes() }
                    </ListGroup>
                </Media>
            </Media>
        );
    }
}

Notes.propTypes = {
    notes: React.PropTypes.array
};