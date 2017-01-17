import React, { Component } from 'react';
import { Media, ListGroup, ListGroupItem, Button } from 'reactstrap';
import {Icon} from 'react-fa';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './../../actions/tasks';
import NoteForm from './note-form';

@connect(
    state => ({
        tasks: state.tasks.toJS()
    }),
    dispatch => ({
        actions: bindActionCreators(actions, dispatch)
    })
)
export default class Notes extends Component {

    componentWillMount() {
        const { task } = this.props;
        this.state = { notes: task.notes || [] };
    }

    componentWillReceiveProps(nextProps) {
        let { task } = nextProps;

        if (task) {
            this.setState({notes: task.notes});
        }
    }

    getNotes = () => {
        const { notes } = this.state;

        return notes.map((note, index) => {
            return (
                <ListGroupItem key={ index }>
                    {note.text}
                    <Button onClick={ this.removeNote.bind(null, index) }
                            size="sm"
                            className="pull-right"
                            color="danger">
                        <Icon name="times"/>
                    </Button>{' '}
                    <NoteForm
                        onUpdateNote={this.updateNote.bind(this, index)}
                        style={{display: 'inline'}}
                        className="pull-right"
                        note={note}
                        size="sm"
                        color="primary"><Icon name="pencil"/>
                    </NoteForm>
                </ListGroupItem>
            );
        });
    };

    removeNote = (index) => {
        const { task, actions } = this.props;

        if (confirm('Are you sure?')) {
            task.notes.splice(index, 1);
            actions.updateTask(task);
        }
    };

    updateNote = (index, note) => {
        const { notes } = this.state,
             { task } = this.props;

        if (notes[index].text != note.text) {
            notes[index].text = note.text;
            task.notes = notes;
            this.props.actions.updateTask(task);
        }
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
    tasks: React.PropTypes.object
};