import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './../actions/tasks';
import TimeAgo from 'react-timeago';
import { getColorByStatus } from '../utils/common-helper';
import TaskActions from './task/actions';
import Notes from './task/notes';
import {
    Container, Row, Col,
    Card, CardBlock, CardTitle, CardText, CardSubtitle
} from 'reactstrap';

@connect(
    state =>({
        user: state.user.toJS(),
        tasks: state.tasks.toJS()
    }),
    dispatch => ({
        actions: bindActionCreators(actions, dispatch)
    })
)

class TaskView extends Component {

    componentWillMount() {
        this.props.actions.getTask(this.props.params.id);
        this.state = { task: null };
    }

    componentWillReceiveProps(nextProps) {
        let { task } = nextProps.tasks;

        if (task) {
            this.setState({ task });
        }
    }

    componentWillUnmount() {
        this.props.actions.resetCurrentTask();
    }

    getTask = () => {
        const { task } = this.state;

        if (!task) {
            return null;
        }

        return (
            <Card outline color={getColorByStatus(task.status)}>
                <TaskActions task={task}/>
                <CardBlock>
                    <CardTitle>{ task.title }</CardTitle>
                    <CardSubtitle>{ task.subtitle }</CardSubtitle>
                    <CardText>{ task.description }</CardText>
                    <CardText>
                        <small className="text-muted">Created <TimeAgo date={ task.createdAt } /></small>
                        <small className="text-muted pull-right">Last Updated <TimeAgo date={ task.updatedAt } /></small>
                    </CardText>
                </CardBlock>
                {(task.notes.length > 0) &&
                <CardBlock>
                    <Notes notes={task.notes}/>
                </CardBlock>
                }
            </Card>
        );
    };

    render() {
        return (
            <Container>
                <Row>
                    <Col>{ this.getTask() }</Col>
                </Row>
            </Container>
        );
    }

}

export default TaskView;