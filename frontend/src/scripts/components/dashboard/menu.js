import React, {Component} from 'react';
import {ListGroup, ListGroupItem} from 'reactstrap';
import {Link} from 'react-router';
import {Status} from '../../constants';

class Menu extends Component {

    render() {
        return (
            <ListGroup>
                <ListGroupItem activeClassName="active" tag={ Link } to={'/dashboard/all'} action>All</ListGroupItem>
                <ListGroupItem activeClassName="active" tag={ Link } to={`/dashboard/${Status.Active}`} action>Active</ListGroupItem>
                <ListGroupItem activeClassName="active" tag={ Link } to={`/dashboard/${Status.Overdue}`} action>Overdue</ListGroupItem>
                <ListGroupItem activeClassName="active" tag={ Link } to={`/dashboard/${Status.Done}`} action>Done</ListGroupItem>
                <ListGroupItem activeClassName="active" tag={ Link } to={`/dashboard/${Status.Cancel}`} action>Cancel</ListGroupItem>
            </ListGroup>
        );
    }
}

export default Menu;
