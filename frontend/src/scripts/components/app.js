import React, { Component } from 'react';
import Header from './common/header';
import Footer from './common/footer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as userActions from './../actions/user';
import Loader from './common/loader';
import EventEmitter, {
  PAGE_WRAPPER_ADD_CLASS,
  PAGE_WRAPPER_REMOVE_CLASS,
  PAGE_WRAPPER_TOGGLE_CLASS
} from './../utils/event-emitter';

import Notificator from './common/notificator';

@connect(
    state => ({
        user: state.user.toJS()
    }),
    dispatch => ({
        userActions: bindActionCreators(userActions, dispatch)
    })
)
export default class App extends Component {

  componentWillMount() {
    this.state = {
      classNames: [ 'segment', 'inner-page' ]
    };

    EventEmitter.addListener(PAGE_WRAPPER_ADD_CLASS, className => {
      let { classNames } = this.state;
      const classIndex = classNames.indexOf(className);
      classIndex === -1 && classNames.push(className);
      this.setState({ classNames });
    });

    EventEmitter.addListener(PAGE_WRAPPER_REMOVE_CLASS, className => {
      let { classNames } = this.state;
      const classIndex = classNames.indexOf(className);
      classIndex > -1 && classNames.splice(classIndex, 1);
      this.setState({ classNames });
    });

    EventEmitter.addListener(PAGE_WRAPPER_TOGGLE_CLASS, className => {
      let { classNames } = this.state;
      const classIndex = classNames.indexOf(className);
      classIndex > -1 ? classNames.splice(classIndex, 1) : classNames.push(className);
      this.setState({ classNames });
    });

    this.initApp();
  }

  initApp = () => {
    console.log('%c Hi there! What\'s up?!', 'background: #444; color: #fb7c05; font-size: 20px');
    this.props.userActions.initUser(this.props.user);
  };

  getGlogalComponents = () => {
    return (
      <div>
        <Notificator />
      </div>
    );
  };

  render() {
    return (
      <div id="wrapper" className={ this.state.classNames.join(' ') }>
        <Loader visible={ this.props.user.isLoading } />
        <Header
            user={ this.props.user }
            logoutUser={ this.props.userActions.logoutUser }
            routes={ this.props.routes }
            params={ this.props.params }
        />

        <div id="page-content-wrapper" className="main-content">
            { this.props.children }
        </div>

        <Footer/>

        { this.getGlogalComponents() }
      </div>
    );
  }

}
