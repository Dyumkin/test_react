import React, { Component } from 'react';
import FormValidator from './../../utils/form-validator';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './../../actions/tasks';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    Input,
    FormGroup,
    Label,
    Col,
    FormFeedback
} from 'reactstrap';

@connect(
    state => ({
        tasks: state.tasks.toJS()
    }),
    dispatch => ({
        actions: bindActionCreators(actions, dispatch)
    })
)
export default class NoteForm extends Component {

    initState = {
        text: '',
        canAdd: false,
        modal: false
    };

    componentWillMount() {
        const { note } = this.props;

        if (note) {
            this.initState = {text: note.text};
        }

        this.state = {
            ...this.initState
        };

        this.toggle = this.toggle.bind(this);

        this.formValidator = FormValidator.init({
            text: FormValidator.createRule().min(3).max(2000).isRequired()
        });

    }

    toggle() {
        const { note } = this.props;

        if (note) {
            this.initState = {text: note.text};
        }

        this.setState({
            ...this.initState,
            modal: !this.state.modal
        });
    }

    handleChangeField = e => {
        const { name, value } = e.target;

        this.formValidator.removeError(name);
        this.setState({ [name]: value });
    };

    validateField = e => {
        const { name } = e.target;

        this.setState({ canAdd: this.formValidator.validateAttribute(name, this.state) });
        e.preventDefault();
    };

    handleFormSubmit = e => {
        if (this.formValidator.validate(this.state)) {

            if (this.props.note) {
                this.props.onUpdateNote(this.state);
            } else {
                this.props.onAddNote(this.state);
            }

            this.resetForm();
            this.toggle();
        } else {
            this.setState({ canAdd: false });
        }
        e.preventDefault();
    };

    resetForm = () => {
        this.setState({...this.initState, modal:true});
    };

    getForm = (type, name, label, required = false) => {
        return (
            <Form onSubmit={this.handleFormSubmit} noValidate={true}>
                <FormGroup row color={ this.formValidator.getError(name).style }>
                    <Label for={ name } sm={2}>{ label }</Label>
                    <Col sm={10}>
                        <Input
                            state={ this.formValidator.getError(name).style }
                            type={ type }
                            name={ name }
                            id={ name }
                            value={ this.state[name] || ''}
                            onChange={ this.handleChangeField }
                            onBlur={ this.validateField }
                            required={required}
                        />
                        <FormFeedback>{ this.formValidator.getError(name).message }</FormFeedback>
                    </Col>
                </FormGroup>
            </Form>
        );
    };

    render() {
        return (
            <div style={this.props.style}>
                <Button
                    onClick={this.toggle}
                    className={this.props.className || ''}
                    size={this.props.size || ''}
                    color={this.props.color || 'info'}>{this.props.children || 'Add note'}
                </Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>{this.props.note ? 'Update Note' : 'Add Note'}</ModalHeader>
                    <ModalBody>
                        { this.getForm('textarea', 'text', 'Note', true) }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleFormSubmit}>{this.props.note ? 'Update' : 'Add'}</Button>{' '}
                        <Button color="secondary" onClick={this.resetForm}>Reset</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

NoteForm.propTypes = {
    note: React.PropTypes.object,
    onAddNote: React.PropTypes.func,
    onUpdateNote: React.PropTypes.func,
    style: React.PropTypes.object,
    className: React.PropTypes.string,
    size: React.PropTypes.string,
    color: React.PropTypes.string
};
