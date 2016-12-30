import React, { Component, PropTypes } from 'react';
import { Container, Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router';

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
                        <NavLink tag={ Link } to="/sign-out" onClick={ this.handleLogoutClick }>Sign Out</NavLink>
                    </NavItem>
                </Nav>
            );
        } else {
            return (
                <Nav className="float-xs-right" navbar>
                    <NavItem>
                        <NavLink tag={ Link } to="/sign-in">Sign In</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={ Link } to="/sign-up">Sign Up</NavLink>
                    </NavItem>
                </Nav>
            );
        }
    };

    render() {
        return(
            <Container className="header">
                <Navbar color="faded" light>
                    <NavbarBrand tag={ Link } to="/">TodoList</NavbarBrand>
                    <Nav className="float-xs-left" navbar>
                        <NavItem>
                            <NavLink tag={ Link } to="/">Home</NavLink>
                        </NavItem>
                    </Nav>

                    { this.getAuthLinks() }
                </Navbar>
            </Container>
        );
    }
}

Header.propTypes = {
    logoutUser: PropTypes.func.isRequired
};
