import React, {Component, cloneElement} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Col, Button} from 'reactstrap';
import Menu from './dashboard/menu';
import TaskModal from './dashboard/modal';

@connect(
    state => ({
        user: state.user.toJS()
    })
)
class Dashboard extends Component {

    render() {
        return (
            <Container>
                <Row>
                    <Col xs="6" md={{ size: 2, offset: 2 }}>
                        <h1>Tasks</h1>
                    </Col>
                    <Col xs="6" md={{ size: 2, offset: 6 }}>
                        <TaskModal/>
                    </Col>
                    <div className="clearfix"></div>
                </Row>
                <Row>
                    <Col xs="12" md="2">
                        <Menu user={ this.props.user }/>
                    </Col>
                    <Col xs="12" md="10">
                        { cloneElement(this.props.children, {
                            user: this.props.user
                        }) }
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Dashboard;
