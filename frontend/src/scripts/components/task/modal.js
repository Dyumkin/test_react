import React, { Component } from 'react';
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
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './../../actions/tasks';
import FormValidator from './../../utils/form-validator';
import { getDiffs } from './../../utils/common-helper';
import Loader from '../common/loader';
import NoteForm from './note-form';
import {Icon} from 'react-fa';
import Datetime from 'react-datetime';
import moment from 'moment';

@connect(
    state => ({
        tasks: state.tasks.toJS()
    }),
    dispatch => ({
        actions: bindActionCreators(actions, dispatch)
    })
)
export default class TaskModal extends Component {

    initState = {
        title: '',
        subtitle: '',
        deadline: '',
        description: '',
        notes: [],
        canSubmit: false,
        modal: false
    };

    componentWillMount() {
        const { task } = this.props;

        if (task) {
            this.initState = {...task};
        }

        this.state = {
            ...this.initState
        };

        this.toggle = this.toggle.bind(this);

        this.formValidator = FormValidator.init({
            title: FormValidator.createRule().min(3).max(200).isRequired(),
            subtitle: FormValidator.createRule().min(3).max(200),
            description: FormValidator.createRule().min(3).max(2000).isRequired()
        });

    }

    componentWillReceiveProps(nextProps) {
        const nextTask = nextProps.tasks.task || {};
        const prevTask = this.props.tasks.task || {};

        if (prevTask && nextTask && Object.keys(getDiffs(prevTask, nextTask)).length > 0) {
            this.setState({ ...nextTask, canSubmit: false });
        }
    }

    componentWillUnmount() {
        const { task } = this.props;
        task && this.props.actions.resetCurrentTask();
    }

    handleChangeField = e => {
        const { name, value } = e.target;

        this.formValidator.removeError(name);
        this.setState({ [name]: value });
    };

    validateField = e => {
        const { name } = e.target;

        this.setState({ canSubmit: this.formValidator.validateAttribute(name, this.state) });
        e.preventDefault();
    };

    handleFormSubmit = e => {
        if (this.formValidator.validate(this.state)) {
            if (this.props.task) {
                this.props.actions.updateTask(this.state);
                this.toggle();
            } else {
                this.props.actions.addTask(this.state);
            }
        } else {
            this.setState({ canSubmit: false });
        }
        e.preventDefault();
    };

    toggle() {
        const { task } = this.props;

        if (task) {
            this.initState = {...task};
        }

        this.setState({
            ...this.initState,
            notes: [],
            modal: !this.state.modal
        });

        this.formValidator.clearErrors();
    }

    resetForm = () => {
        this.setState({...this.initState, notes: [], modal:true});
        this.formValidator.clearErrors();
    };

    getFormGroup = (type, name, label, required = false) => {
        return (
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
        );
    };

    getDateTimeGroup = (name, label) => {
        return (
            <FormGroup row color={ this.formValidator.getError(name).style }>
                <Label for={ name } sm={2}>{ label }</Label>
                <Col sm={10}>
                    <Datetime strictParsing utc value={moment(this.state.deadline)}
                              onChange={this.handleChangeDate.bind(this)}/>
                    <FormFeedback>{ this.formValidator.getError(name).message }</FormFeedback>
                </Col>
            </FormGroup>
        );
    };

    handleChangeDate (date) {
        this.setState({deadline: date});
    }

    handleAddNote(note) {
        const { notes } = this.state;
        notes.push(note);

        this.setState({notes: notes});
    }

    getNote = () => {
        return this.state.notes.map((note, index) => {
            return (
                <li className="list-group-item" key={ index }>
                    <span>{ index + 1 }: { note.text }</span>
                    {<Button type="button"
                            size="sm"
                            className="pull-right"
                            onClick={ this.removeNote.bind(this, index) }
                            color="danger"><Icon name="times"/>
                    </Button>}
                </li>
            );
        });
    };

    removeNote = (index) => {
        const notes = this.state.notes;
        notes.splice(index, 1);
        this.setState({notes: notes });
    };

    getNotes = () => {
        return (
            <FormGroup row>
                <Label sm={2}>Notes</Label>
                <Col sm={10}><ul className="list-group">{ this.getNote() }</ul></Col>
            </FormGroup>
        );
    };

    getForm() {
        return (
            <Form onSubmit={this.handleFormSubmit} noValidate={true}>
                { this.getFormGroup('text', 'title', 'Title', true)}
                { this.getFormGroup('text', 'subtitle', 'Subtitle')}
                { this.getDateTimeGroup('deadline', 'Deadline')}
                { this.getFormGroup('textarea', 'description', 'Description', true)}
                { (this.state.notes.length > 0 && !this.props.task ) && this.getNotes() }
            </Form>
        );
    }

    render() {
        const { isLoading } = this.props.tasks;

        return (
            <div style={this.props.style}>
                <Button
                    onClick={this.toggle}
                    className={this.props.className || ''}
                    color={this.props.task ? 'primary' : 'success'}>
                    {this.props.task ? 'Update' : 'Add Task'}
                </Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>{this.props.task ? 'Update Task' : 'Add Task'}</ModalHeader>
                    <ModalBody>
                        <Loader visible={isLoading}/>
                        { this.getForm() }
                    </ModalBody>
                    <ModalFooter>
                        {!this.props.task &&
                            <NoteForm className="pull-left" onAddNote={ this.handleAddNote.bind(this) }/>
                        }{' '}
                        <Button color="primary" onClick={this.handleFormSubmit}>{this.props.task ? 'Update' : 'Save'} <Icon name="check"/></Button>{' '}
                        <Button color="secondary" onClick={this.resetForm}>Reset</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

NoteForm.propTypes = {
    task: React.PropTypes.object,
    style: React.PropTypes.object,
    className: React.PropTypes.string
};