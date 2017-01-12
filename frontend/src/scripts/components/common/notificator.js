import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import moment from 'moment';
import { scrollToTop } from './../../utils/common-helper';
import EventEmitter, { NOTIFICATOR_ITEM_ADD } from './../../utils/event-emitter';

class Notificator extends Component {

  timeouts = [];

  componentWillMount() {
    this.state = {
      items: []
    };
  }

  componentDidMount() {
    EventEmitter.addListener(NOTIFICATOR_ITEM_ADD, this.addNotificatorItem);
  }

  componentWillUnmount() {
    EventEmitter.removeListener(NOTIFICATOR_ITEM_ADD, this.addNotificatorItem);
  }

  addNotificatorItem = resources => {
    let { items } = this.state;
    let { item } = resources;

    item.timeCode = Date.now() + Math.random();
    item.date = moment().format('MM/DD/YYYY hh:mm:ss');
    items.push(item);

    this.setState({ items }, () => {
      resources.scrollToTop && scrollToTop(300);
    });
  };

  dismissItem = timeCode => {
    let { items } = this.state;

    items = items.filter(item => item.timeCode !== timeCode);
    this.setState({ items }, () => {
      this.timeouts.splice(this.timeouts.indexOf(timeCode), 1);
    });
  };

  getNotifications = () => {
    const { items } = this.state;
    const readOneCharacter = 60 * 1000 / 1200;

    return items.length > 0 && items.map((item, key) => {
      if (this.timeouts.indexOf(item.timeCode) === -1) {
        const timeout = item.message ? item.message.length * readOneCharacter : 5000;
        setTimeout(this.dismissItem.bind(this, item.timeCode), timeout > 5000 ? timeout : 5000);
        this.timeouts.push(item.timeCode);
      }

      return (
        <Alert
          key= { key }
          color={ item.type || 'info' }
          toggle={ this.dismissItem.bind(this, item.timeCode) }>
          <h5>{ item.title }</h5>
          { item.message && <p>{ item.message }</p> }
          <p><small>{ item.date }</small></p>
        </Alert>
      );
    });
  };

  render() {
    return (
        <div className = "notificator-container">
          { this.getNotifications() }
        </div>
    );
  }

}

export default Notificator;