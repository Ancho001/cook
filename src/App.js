import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Autorization } from 'Components/AuthPage/Autorization';
import { MainPage } from 'Components/MainPage/MainPage';
import './mainStyle.scss';



export const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Autorization />} />
      <Route path='/' element={<MainPage/>}/>
    </Routes>
  );
};
