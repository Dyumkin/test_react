import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

class Forbidden extends Component {

    render() {
        return (
            <Container>
                <Row>
                    <Col><h1 style={{"text-align": "center"}}>403 Forbidden</h1></Col>
                </Row>
            </Container>
        );
    }
}

export default Forbidden;