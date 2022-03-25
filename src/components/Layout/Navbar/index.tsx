import React from 'react';
import { logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Navbar as BsNavbar, NavItem, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { dAppName } from 'config';
import { routeNames } from 'routes';
import { ReactComponent as ElrondLogo } from './../../../assets/img/elrond.svg';

const Navbar = () => {
  const { address } = useGetAccountInfo();

  const handleLogout = () => {
    logout(`${window.location.origin}/unlock`);
  };

  const isLoggedIn = Boolean(address);

  return (
    <BsNavbar className='bg-white border-bottom border-dark px-4 py-3'>
      <div className='container-fluid'>
        <Link
          className='d-flex align-items-center navbar-brand mr-0'
          to={isLoggedIn ? routeNames.dashboard : routeNames.home}
        >
          <ElrondLogo className='elrond-logo' />
          <span className='dapp-name text-muted'>{dAppName}</span>
        </Link>

        <Nav className='ml-auto'>
          <NavItem className='mr-4'>
            <Link
              className='d-flex align-items-center navbar-brand mr-0'
              to={isLoggedIn ? routeNames.dashboard : routeNames.home}
            >
              <span className='text-muted'>{'Dashboard'}</span>
            </Link>
          </NavItem>
          <NavItem className='mr-4'>
            <Link
              className='d-flex align-items-center navbar-brand mr-0'
              to={isLoggedIn ? routeNames.mint : routeNames.home}
            >
              <span className='text-muted'>{'Mint'}</span>
            </Link>
          </NavItem>
          {isLoggedIn && (
            <NavItem>
              <button
                className='btn btn-outline-primary btn-rounded pl-4 pr-4'
                onClick={handleLogout}
              >
                Log out
              </button>
            </NavItem>
          )}
        </Nav>
      </div>
    </BsNavbar>
  );
};

export default Navbar;
