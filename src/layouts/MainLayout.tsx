import React from 'react';
import Header from '../entries/header/header';
import { Outlet } from 'react-router';

export default function MainLayout() {
  return (
    <>
      <Header />
      <main className="main">
        <Outlet />
      </main>
    </>
  );
}

