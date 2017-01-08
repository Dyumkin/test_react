import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import config from './config';

export default (Page, role) => {

  class Shield extends Component {

    componentWillMount() {
      this.state = { accessIsGranted: false };
      this.checkAccess(this.props);
    }

    componentWillReceiveProps(nextProps) {
      this.checkAccess(nextProps);
    }

    checkAccess = (props) => {
      let accessIsGranted = true;

      if (!props.user.id && role === '@') {
        if (!props.user.isLoading) {
          sessionStorage.setItem('next', props.location.pathname);
          browserHistory.push('/sign-in');
        }
        accessIsGranted = false;
      }

      if (props.user.id && (
        role === 'guest' || (
          role !== '@' &&
          role !== props.user.role
        )
      )) {
        browserHistory.push(sessionStorage.getItem('next') || config.loginRedirectUrl);
        sessionStorage.removeItem('next');
        accessIsGranted = false;
      }

      this.setState({ accessIsGranted });
    };

    render() {
      const { user } = this.props;

      if (!user.id && user.isLoading) {
        return null;
      }

      if (this.state.accessIsGranted) {
        return <Page {...this.props}/>;
      }

      return null;
    }
  }

  return connect(state => ({
    user: state.user.toJS()
  }))(Shield);

}
