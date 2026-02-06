import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from '@/pages/home';
import Login from '@/pages/login';
import Track from '@/pages/track';
import Album from '@/pages/album';
import Search from '@/pages/search';
import Artist from '@/pages/artist';
import Layout from '@/layout/layout';
import Playlist from '@/pages/playlist';
import NotFound from '@/pages/notFound';
import MusicHub from '@/pages/musicHub';
import SearchType from '@/pages/searchType';
import CallbackHandler from '@/pages/CallbackHandler';
import { setToken } from '@/api/spotify';

const useRoutes = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkToken = async () => {
      if (pathname === '/login' || pathname === '/callback') return;
      const isTokenValid = await setToken();
      if (!isTokenValid) {
        navigate('/login');
      }
    };
    checkToken();
  }, [pathname, navigate]);

  return (
    <Routes>
      <Route path="" Component={Layout}>
        <Route path="/" Component={Home} />
        <Route path="album/:id" Component={Album} />
        <Route path="track/:id" Component={Track} />
        <Route path="artist/:id" Component={Artist} />
        <Route path="playlist/:id" Component={Playlist} />
        <Route path="section/:musicHubType/:id" Component={MusicHub} />
        <Route path="search" Component={Search} />
        <Route path="search/:value" Component={Search} />
        <Route path="search/:value/:category" Component={SearchType} />
      </Route>
      <Route path="/callback" Component={CallbackHandler} />
      <Route path="/login" Component={Login} />
      <Route path="*" Component={NotFound} />
    </Routes>
  );
};

export default useRoutes;
