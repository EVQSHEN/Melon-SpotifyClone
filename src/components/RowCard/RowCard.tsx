import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RowCardProps } from '@/types/interface';

const RowCard: React.FC<RowCardProps> = ({ picture, name, type, id }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/${type}/${id}`)}
      className="bg-gradient-to-b from-[#242424] to-[#1d1d1d] flex w-full h-16 items-center p-2 text-sm sm:text-base rounded-lg cursor-pointer hover:to-[#2d2d2d]"
    >
      <img src={picture} className="h-12 w-12 mr-3 rounded-md" />
      <p className="truncate text-ellipsis">{name}</p>
    </div>
  );
};

export default RowCard;
