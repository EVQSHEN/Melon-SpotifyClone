import { createContext, useContext, useState } from 'react';

export const PlayerContext = createContext<Spotify.PlayerContextProps | null>(null);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }: any) => {
  const [player, setPlayer] = useState<any>(undefined);
  return <PlayerContext.Provider value={{ player, setPlayer }}>{children}</PlayerContext.Provider>;
};
