import React, { Component, PropTypes } from 'react';
import { Container, Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

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
                        <NavLink href="#" onClick={ this.handleLogoutClick }>Sign Out</NavLink>
                    </NavItem>
                </Nav>
            );
        } else {
            return (
                <Nav className="float-xs-right" navbar>
                    <NavItem>
                        <NavLink href="/sign-in">Sign In</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/sign-up">Sign Up</NavLink>
                    </NavItem>
                </Nav>
            );
        }
    };

    render() {
        return(
            <Container className="header">
                <Navbar color="faded" light>
                    <NavbarBrand href="/">TodoList</NavbarBrand>
                    <Nav className="float-xs-left" navbar>
                        <NavItem>
                            <NavLink href="/">Home</NavLink>
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
