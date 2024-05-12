// import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Autorization } from './Components/AuthPage/Autorization';
import { MainPage } from 'main/Components/MainPage/MainPage';

// import classes from './mainStyle.module.scss';

export const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Autorization />} />
      <Route path="/" element={<MainPage />} />
    </Routes>
  );
};
