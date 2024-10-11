import React from 'react';
import Image from 'next/image';

interface FollowNotiProps {
  details: {
    id: string;
    username: string;
    profilePicture: string;
  };
}

const FollowNoti: React.FC<FollowNotiProps> = ({ details }) => {
  return (
    <div className="flex items-center p-3 border-b hover:bg-gray-50 cursor-pointer">
      <Image
        src={details.profilePicture}
        alt={`${details.username}'s profile picture`}
        width={40}
        height={40}
        className="rounded-full mr-3"
      />
      <div>
        <p className="font-semibold">{details.username}</p>
        <p className="text-sm text-gray-600">started following you</p>
      </div>
    </div>
  );
};

export default FollowNoti;
