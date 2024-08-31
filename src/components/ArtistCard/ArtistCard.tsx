import React from 'react';
import { useNavigate } from 'react-router-dom';
import SkeletonCard from '@/components/Skeleton/SkeletonCard';
import IconSVG from '@/components/IconSVG/IconSVG';

const ArtistCard: React.FC<SpotifyApi.ArtistObjectFull> = ({ name, images, followers, id }) => {
  const navigate = useNavigate();

  if (!name || !followers || !images || !id) {
    return <SkeletonCard />;
  }
  return (
    <div
      onClick={() => navigate(`/artist/${id}`)}
      className="cursor-pointer p-2 sm:p-3 pb-1 min-w-[100px]  flex-col text-sm sm:text-base bg-gradient-to-b from-[#242424] to-[#1d1d1d] hover:to-[#2d2d2d] rounded-lg relative group"
    >
      <div className="relative">
        <img
          src={images[0]?.url}
          className="mb-3 w-fit h-fit object-cover aspect-square rounded-full bg-white"
        />
        <div className="absolute top-0 flex items-center justify-center w-full h-full rounded-full opacity-0 group-hover:opacity-100 group-hover:bg-black group-hover:bg-opacity-60 group-hover:backdrop-blur-sm">
          <IconSVG name="playPulse" height="50" width="50" className="animate-pulse fill-sky-400" />
        </div>
      </div>

      <h2 className="mb-1 w-full truncate text-ellipsis">{name}</h2>
      <p className="mb-3 text-xs text-neutral-400 truncate text-ellipsis">
        {followers ? `Followers: ${followers.total}` : ''}
      </p>
    </div>
  );
};

export default ArtistCard;
