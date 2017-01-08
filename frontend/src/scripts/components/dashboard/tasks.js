import React, {Component} from 'react';
import {
    Card, Button, CardImg, CardTitle, CardText, CardDeck,
    CardSubtitle, CardBlock
} from 'reactstrap';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './../../actions/tasks';
import { Status } from '../../constants';

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
    };

    componentWillUnmount() {
        this.props.actions.resetTaskList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.params.status !== nextProps.params.status) {
            this.props.actions.getTasks(nextProps.params.status, this.offset, this.limit)
        }
    }

    render() {
        return (
            <CardDeck>
                <Card>
                    <CardImg top width="100%"
                             src="https://placeholdit.imgix.net/~text?txtsize=33&txt=256%C3%97180&w=256&h=180"
                             alt="Card image cap"/>
                    <CardBlock>
                        <CardTitle>Card title</CardTitle>
                        <CardSubtitle>Card subtitle</CardSubtitle>
                        <CardText>This is a wider card with supporting text below as a natural lead-in to additional
                            content. This content is a little bit longer.</CardText>
                        <Button>Button</Button>
                    </CardBlock>
                </Card>
                <Card>
                    <CardImg top width="100%"
                             src="https://placeholdit.imgix.net/~text?txtsize=33&txt=256%C3%97180&w=256&h=180"
                             alt="Card image cap"/>
                    <CardBlock>
                        <CardTitle>Card title</CardTitle>
                        <CardSubtitle>Card subtitle</CardSubtitle>
                        <CardText>This card has supporting text below as a natural lead-in to additional
                            content.</CardText>
                        <Button>Button</Button>
                    </CardBlock>
                </Card>
                <Card>
                    <CardImg top width="100%"
                             src="https://placeholdit.imgix.net/~text?txtsize=33&txt=256%C3%97180&w=256&h=180"
                             alt="Card image cap"/>
                    <CardBlock>
                        <CardTitle>Card title</CardTitle>
                        <CardSubtitle>Card subtitle</CardSubtitle>
                        <CardText>This is a wider card with supporting text below as a natural lead-in to additional
                            content. This card has even longer content than the first to show that equal height
                            action.</CardText>
                        <Button>Button</Button>
                    </CardBlock>
                </Card>
            </CardDeck>
        );
    }
}

export default Tasks;
