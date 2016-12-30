import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import * as userActions from './../actions/user';
import { bindActionCreators } from 'redux';
import FormValidator from './../utils/form-validator';
import {Icon} from 'react-fa'
import Loader from './common/loader';

@connect(
  state => ({
    user: state.user.toJS()
  }),
  dispatch => ({
    userActions: bindActionCreators(userActions, dispatch)
  })
)
class SignUp extends Component {

  componentWillMount() {
    this.state = {
      user: {
        name: '',
        email: '',
        password: '',
        confirm_password: ''
      }
    };

    this.formValidator = FormValidator.init({
      name: FormValidator.createRule().string(),
      email: FormValidator.createRule().email().isRequired(),
      password: FormValidator.createRule().min(3).max(45).isRequired(),
      confirm_password: FormValidator.createRule().equal('password').isRequired()
    });
  }

  componentWillUnmount() {
    this.formValidator.clearErrors(this.props.userActions.setErrors);
  }

  componentWillReceiveProps(nextProps) {
    this.formValidator.setErrors(nextProps.user.errors);
  }

  handleSubmit = e => {
    const canSubmit = this.formValidator.validate(this.state.user);

    (canSubmit) ?
      this.props.userActions.registerUser(this.state.user) :
      this.setState({ canSubmit });

    e.preventDefault();
  };

  handleChangeField = e => {
    this.formValidator.removeError(e.target.name);

    let { user } = this.state;
    user[e.target.name] = (e.target.type === 'checkbox') ?
      e.target.checked : e.target.value;

    this.setState({ user });
  };

  onBlurValidate = (e) => {
    const { name } = e.target;
    const canSubmit = this.formValidator.validateAttribute(name, this.state.user);

    this.setState({ canSubmit });
    e.preventDefault();
  };

  getFormGroup = (type, name, label, required = true) => {
    return (
        <FormGroup row color={ this.formValidator.getError(name).style }>
          <Label for={ name } sm={3}>{ label }</Label>
          <Col sm={9}>
            <Input
                state={ this.formValidator.getError(name).style }
                type={ type }
                name={ name }
                id={ name }
                value={ this.state.user[name] }
                onChange={ this.handleChangeField }
                onBlur={ this.onBlurValidate }
                required={required}
            />
            <FormFeedback>{ this.formValidator.getError(name).message }</FormFeedback>
          </Col>
        </FormGroup>
    );
  };

  render() {
    return (
        <Container>
          <Row>
            <Col sm="12" md={{ size: 8, offset: 2 }}>
              <Loader visible={this.props.user.isAuthenticating} />
              <Form onSubmit={this.handleSubmit} noValidate={true}>
                { this.getFormGroup('text', 'name', 'Username') }
                { this.getFormGroup('email', 'email', 'Email') }
                { this.getFormGroup('password', 'password', 'Password') }
                { this.getFormGroup('password', 'confirm_password', 'Confirm Password') }

                <FormGroup check row>
                  <Col sm={{ size: 9, offset: 3 }}>
                    <Button color="primary" type="submit">Submit <Icon name="check"/></Button>
                  </Col>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Container>
    );
  }

}

export default SignUp;
