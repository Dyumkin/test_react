import React, {Component} from 'react';
import {getColorByStatus} from '../../utils/common-helper';
import TaskModal from './modal';
import NoteForm from './note-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './../../actions/tasks';
import { Status } from '../../constants';
import {CardBlock, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

@connect(
    state =>({
        tasks: state.tasks.toJS()
    }),
    dispatch => ({
        actions: bindActionCreators(actions, dispatch)
    })
)
export default class TaskActions extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    removeTask = () => {
        const { task } = this.props;
        this.props.actions.removeTask(task.id);
    };

    changeStatus = (e) => {
        const { value } = e.target,
              { task } = this.props;

        if (value && task) {
            this.props.actions.updateTask({...task, status: value});
        }

        e.preventDefault();
    };

    getMenuItems = () => {
        const { task } = this.props,
            statuses = Object.values(Status),
            index = statuses.indexOf(task.status);

        if (index > -1) {
            statuses.splice(index, 1);
        }

        return statuses.map((status, key) => {
            return (
                <DropdownItem
                    style= {{'textTransform': 'capitalize'}}
                    key={ key }
                    onClick={this.changeStatus}
                    value={status}>{status}
                </DropdownItem>
            );
        });
    };

    render() {
        const { task } = this.props;

        return (
            <CardBlock>
                <TaskModal style={{display: 'inline-block'}} task={ task }/>{' '}
                <NoteForm style={{display: 'inline-block'}} task={ task }/>{' '}
                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret color={getColorByStatus(task.status)}>
                        Change Status
                    </DropdownToggle>
                    <DropdownMenu>
                        {this.getMenuItems()}
                    </DropdownMenu>
                </ButtonDropdown>
                <Button className="pull-right" color="danger" onClick={this.removeTask}>Delete</Button>
            </CardBlock>
        );
    }
}
