import React from 'react';
import { logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { NavItem, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { dAppName } from 'config';
import { routeNames } from 'routes';
// import { ReactComponent as ElrondLogo } from './../../../assets/img/elrond.svg';
import style from './navbar.module.scss';

const Navbar = () => {
  const { address } = useGetAccountInfo();

  const handleLogout = () => {
    logout(`${window.location.origin}/unlock`);
  };

  const isLoggedIn = Boolean(address);

  return (
    <Nav className={`${style.appNavigation} justify-content-between px-4 py-3`}>
      {/* <div className='container-fluid'> */}
      <Link
        className='d-flex align-items-center navbar-brand'
        to={isLoggedIn ? routeNames.dashboard : routeNames.home}
      >
        {/* <ElrondLogo className='elrond-logo' /> */}
        <span className='fw-bolder'>{dAppName}</span>
      </Link>

      <Nav className='ml-auto d-none d-lg-flex'>
        <NavItem className={'d-flex align-items-center mx-2'}>
          <Link
            className={`${style.appNavigationItem} btn btn-outline-primary px-2`}
            to={isLoggedIn ? routeNames.dashboard : routeNames.home}
          >
            {'Whitelist'}
          </Link>
        </NavItem>
        <NavItem className={'d-flex align-items-center mx-2'}>
          <Link
            className={`${style.appNavigationItem} btn btn-outline-primary px-2 `}
            to={isLoggedIn ? routeNames.mint : routeNames.home}
          >
            {'Mint'}
          </Link>
        </NavItem>
        <NavItem className={'d-flex align-items-center mx-2'}>
          <Link
            className={`${style.appNavigationItem} btn btn-outline-primary disabled px-2 `}
            to={isLoggedIn ? routeNames.mint : routeNames.home}
          >
            {'Marketplace'}
          </Link>
        </NavItem>
        <NavItem className={'d-flex align-items-center mx-2'}>
          <Link
            className={`${style.appNavigationItem} btn btn-outline-primary disabled px-2 `}
            to={isLoggedIn ? routeNames.mint : routeNames.home}
          >
            {'Provenance'}
          </Link>
        </NavItem>
        {isLoggedIn && (
          <NavItem>
            <button
              className='btn btn-outline-primary btn-rounded'
              onClick={handleLogout}
            >
              Log out
            </button>
          </NavItem>
        )}
      </Nav>
      {/* </div> */}
    </Nav>
  );
};

export default Navbar;
