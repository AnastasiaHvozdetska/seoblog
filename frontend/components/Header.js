import { useState } from 'react';
import { APP_NAME } from '../config';
import Link from 'next/link';
import { signOut, isAuth} from '../actions/auth'
import React from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import Router from 'next/router';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div>
          <Navbar color="light" light expand="md">
            <Link href="/">
              <NavLink className="font-weight-bold">{APP_NAME}</NavLink>
            </Link>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="mr-auto" navbar>
  
                {isAuth() ? (
                  <NavItem>
                    <NavLink style={{cursor: 'pointer'}} onClick={() => signOut(() => {
                      Router.replace('/signin')
                    })}>
                      Sign Out
                    </NavLink>
                  </NavItem>
                ) : (
                  <>
                    <NavItem>
                      <Link href="/signin">
                        <NavLink style={{cursor: 'pointer'}}>
                          Sign In
                        </NavLink>
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link href="/signup">
                        <NavLink style={{cursor: 'pointer'}}>
                          Sign Up
                        </NavLink>
                      </Link>
                    </NavItem>
                  </>
                )}
               
              </Nav>
            </Collapse>
          </Navbar>
        </div>
      );
}

export default Header;