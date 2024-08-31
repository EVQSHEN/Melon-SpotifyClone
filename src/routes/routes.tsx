import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import { setToken } from '@/api/spotify';

const useRoutes = () => {
  const [tokenSubmit, setTokenSubmit] = React.useState<Promise<boolean>>();
  const { pathname } = useLocation();

  async function getToken() {
    const data = await setToken();
    return data;
  }

  React.useEffect(() => {
    if (!tokenSubmit && pathname !== 'login') {
      const token = getToken();
      setTokenSubmit(token);
    }
  }, [tokenSubmit]);

  return (
    <Routes>
      {tokenSubmit && (
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
      )}
      <Route path="/login" Component={Login} />
      <Route path="*" Component={NotFound} />
    </Routes>
  );
};

export default useRoutes;
