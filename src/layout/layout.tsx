import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Aside from './aside';
import Header from './header';
import Player from './player';

const Layout = () => {
  const { pathname } = useLocation();
  const main = React.useRef<HTMLMapElement>(null);

  React.useEffect(() => {
    main?.current && main.current.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <>
      <div className="h-[calc(100vh-1rem)] w-[calc(100vw-0.5rem)] p-1">
        <div className="flex h-[calc(100vh-4.5rem-0.75rem)] w-[calc(100vw-0.5rem)] mb-1">
          <Aside />
          <div className="max-w-[calc(100vw)] w-full min-w-[calc(60vw)]">
            <Header />
            <main
              ref={main}
              className="h-[calc(100vh-8.5rem)] overflow-y-auto bg-gradient-to-b from-[#191919] to-neutral-950 rounded-lg"
            >
              <Outlet />
            </main>
          </div>
        </div>
        <Player />
      </div>
    </>
  );
};

export default Layout;
