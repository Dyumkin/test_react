import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

class NoMatch extends Component {

  render() {
    return (
      <Container>
        <Row>
          <Col><h1 style={{"text-align": "center"}}>404 Not found</h1></Col>
        </Row>
      </Container>
    );
  }
}

export default NoMatch;
