import React, { Component } from 'react';
import { Jumbotron, Button, Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router';

export default class Home extends Component {

    render() {
        return(
            <Container>
                <Row>
                    <Col xs="12">
                        <Jumbotron>
                            <h1 className="display-3">Hello, world!</h1>
                            <p className="lead">This is a simple Todo application, you can create a simple task and don't forget to do something...</p>
                            <hr className="my-2" />
                            <p>To start using application you can to sign in or sign up</p>
                            <p className="lead">
                                <Button tag={ Link } to="/sign-in" color="primary">Sing In</Button>{' '}
                                <Button tag={ Link } to="/sign-up" color="primary">Sing Up</Button>{' '}
                            </p>
                        </Jumbotron>
                    </Col>
                </Row>
            </Container>
        );
    }
}
