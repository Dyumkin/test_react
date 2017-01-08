import React, { Component, PropTypes } from 'react';
import { Container, Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Link, IndexLink } from 'react-router';
import Breadcrumbs from 'react-breadcrumbs';

export default class Header extends Component {
    handleLogoutClick = e => {
        this.props.logoutUser();
        e.preventDefault();
    };

    getAuthLinks = () => {
        if (this.props.user.id) {
            return (
                <Nav className="float-xs-right" navbar>
                    <NavItem>
                        <NavLink activeClassName="active" tag={ Link } to="/sign-out" onClick={ this.handleLogoutClick }>Sign Out</NavLink>
                    </NavItem>
                </Nav>
            );
        } else {
            return (
                <Nav className="float-xs-right" navbar>
                    <NavItem>
                        <NavLink activeClassName="active" tag={ Link } to="/sign-in">Sign In</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink activeClassName="active" tag={ Link } to="/sign-up">Sign Up</NavLink>
                    </NavItem>
                </Nav>
            );
        }
    };

    getLeftLink = () => {

        return (
            <Nav className="float-xs-left" navbar>
                <NavItem>
                    <NavLink activeClassName="active" tag={ IndexLink } to={'/'}>Home</NavLink>
                </NavItem>
                {this.props.user.id &&
                    <NavItem>
                        <NavLink activeClassName="active" tag={ Link } to={'/dashboard'}>Dashboard</NavLink>
                    </NavItem>
                }
            </Nav>
        );

    };

    render() {
        return(
            <Container className="header">
                <Navbar color="primary" dark>
                    <NavbarBrand tag={ Link } to="/">TodoList</NavbarBrand>
                    { this.getLeftLink() }
                    { this.getAuthLinks() }
                </Navbar>

                <Breadcrumbs wrapperElement="ol"
                             itemElement="li"
                             itemClass="breadcrumb-item"
                             wrapperClass="breadcrumb"
                             separator=""
                             routes={ this.props.routes }
                             params={ this.props.params } />
            </Container>
        );
    }
}

Header.propTypes = {
    logoutUser: PropTypes.func.isRequired
};
