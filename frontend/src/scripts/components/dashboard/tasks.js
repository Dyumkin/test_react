import React, {Component} from 'react';
import {
    Card, Button, CardImg, CardTitle, CardText, CardDeck,
    CardSubtitle, CardBlock
} from 'reactstrap';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './../../actions/tasks';
import { Status } from '../../constants';
import TimeAgo from 'react-timeago';
import Loader from '../common/loader';
import { getColorByStatus } from '../../utils/common-helper';

@connect(
    state => ({
        user: state.user.toJS(),
        tasks: state.tasks.toJS()
    }),
    dispatch => ({
        actions: bindActionCreators(actions, dispatch)
    })
)
class Tasks extends Component {

    limit = 10;
    offset = 0;

    componentWillMount() {
        const status = Number(this.props.params.status) || Status.All;

        if (this.props.tasks.list.length === 0) {
            this.props.actions.getTasks(status, this.offset, this.limit)
        }
    }

    componentWillUnmount() {
        this.props.actions.resetTaskList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.params.status !== nextProps.params.status) {
            this.props.actions.getTasks(nextProps.params.status, this.offset, this.limit)
        }
    }

    getCards = () => {
        const { list, total } = this.props.tasks;

        if (list.length == 0) {
            return (
                <div>No tasks</div>
            );
        }

        return list.length > 0 && list.map((task, key) => {
                return (
                    <Card outline color={ getColorByStatus(task.status) } key= { key } >
                        <CardBlock>
                            <CardTitle>{ task.title }</CardTitle>
                            {task.subtitle &&
                                <CardSubtitle>{ task.subtitle }</CardSubtitle>
                            }
                            <CardText>{ task.description }</CardText>
                            <Button>View</Button>
                            <CardText>
                                <small className="text-muted">Created <TimeAgo date={ task.createdAt } /></small>
                                <small className="text-muted pull-right">Last Updated <TimeAgo date={ task.updatedAt } /></small>
                            </CardText>
                        </CardBlock>
                    </Card>
                );
            });

    };

    render() {
        const { isLoading } = this.props.tasks;

        return (
            <div>
                <Loader visible={isLoading}/>
                <CardDeck>
                    { this.getCards() }
                </CardDeck>
            </div>
        );
    }
}

export default Tasks;
