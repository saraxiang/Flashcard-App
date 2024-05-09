import React from 'react';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <footer>
        <p>@Copyright 2024 Flash Card App</p>
      </footer>
    </>
  );
};

export default Layout;
