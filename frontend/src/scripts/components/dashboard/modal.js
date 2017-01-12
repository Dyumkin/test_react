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

@connect(
    state => ({
        tasks: state.tasks.toJS()
    }),
    dispatch => ({
        actions: bindActionCreators(actions, dispatch)
    })
)
class TaskModal extends Component {

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
        const { id } = this.props;
        id && this.props.actions.getTask(id);

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
        const { id } = this.props;
        id && this.props.actions.resetCurrentTask();
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
            if (this.props.id) {
                this.props.actions.updateTask(this.state);
            } else {
                this.props.actions.addTask(this.state);
            }
        } else {
            this.setState({ canSubmit: false });
        }
        e.preventDefault();
    };

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

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
                        value={ this.state[name] }
                        onChange={ this.handleChangeField }
                        onBlur={ this.validateField }
                        required={required}
                    />
                    <FormFeedback>{ this.formValidator.getError(name).message }</FormFeedback>
                </Col>
            </FormGroup>
        );
    };

    getForm() {
        return (
            <Form onSubmit={this.handleFormSubmit} noValidate={true}>
                { this.getFormGroup('text', 'title', 'Title', true)}
                { this.getFormGroup('text', 'subtitle', 'Subtitle')}
                { this.getFormGroup('text', 'deadline', 'Deadline')}
                { this.getFormGroup('textarea', 'description', 'Description', true)}
            </Form>
        );
    }

    render() {
        const { isLoading } = this.props.tasks;

        return (
            <div>
                <Button
                    onClick={this.toggle}
                    className="pull-right"
                    color="success">
                    Add Task
                </Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Add Task</ModalHeader>
                    <ModalBody>
                        <Loader visible={isLoading}/>
                        { this.getForm() }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleFormSubmit}>Save</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default TaskModal;