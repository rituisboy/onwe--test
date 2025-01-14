"use client";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { UserProfile } from "@/types/type";
import RenderLinks from "./RenderLinks";
import { LoaderCircle, LucidePencilLine } from "lucide-react";
import { useUser } from "@/hooks/UserContext";
import { customAxios } from "@/lib/utils";

interface followProps {
  followers: number;
  following: number;
}

const Profile = ({
  userInfo,
  showEdit = true,
}: {
  userInfo: UserProfile;
  showEdit?: boolean;
}) => {
  const [uname, setUname] = useState<null | string>(null);
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      setUname(user?.username!);
    }
  }, [user]);

  const [followData, setFollowData] = useState<followProps | null>(null);
  const [status, setStatus] = useState<boolean>(false);
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const handleFollow = async () => {
    setFollowLoading(true);

    await delay(750);
    try {
      const res = await customAxios.post("/follow", {
        followUsername: userInfo?.user?.username,
      });
      if (res.status === 201) {
        setStatus(res.data.status);
        setFollowData((prev) => ({
          ...prev, // Spread previous state
          followers: (prev?.followers || 0) + 1, // Increment followers
          following: prev?.following || 0, // Update following from API
        }));
      }
      setFollowLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUnfollow = async () => {
    setFollowLoading(true);
    await delay(750);
    try {
      const res = await customAxios.post("/unfollow", {
        unfollowUsername: userInfo?.user?.username,
      });
      if (res.status === 200) {
        setStatus(res.data.status);
        setFollowData((prev) => ({
          ...prev, // Spread previous state
          followers: (prev?.followers || 0) - 1, // Increment followers
          following: prev?.following || 0, // Update following from API
        }));
      }
      setFollowLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCheck = async () => {
    try {
      const { data } = await customAxios.post("/checkfollow", {
        followUsername: userInfo?.user?.username,
      });

      setFollowData({
        followers: data.followers,
        following: data.following,
      });
      setStatus(data.status);
    } catch (error) {
      console.log("errorororororo", error);
    }
  };

  useEffect(() => {
    if (userInfo?.user?.username) {
      handleCheck(); // Call handleCheck only when both values are available
    }
  }, [userInfo?.user?.username]); // Add both as dependencies
  return (
    <div className="w-full items-center p-4 pl-0 flex flex-col ">
      <div className="flex justify-center items-center relative w-full">
        {/* <PostAvatar
          size={40}
          className="ring-8 ring-slate-300"
          imageUrl={userInfo?.user?.avatar}
        /> */}
        {showEdit && (
          <div
            className="my-3 p-2 group border rounded-full 
        absolute -bottom-10  right-10 transition-all duration-100 border"
          >
            <Link href="/profile/edit">
              <LucidePencilLine
                size={16}
                className="group-hover:scale-125 transition-all duration-100 ease-in-out"
              />
            </Link>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-center mt-8 whitespace-pre">
        {userInfo?.user?.fullname}
      </div>
      <div className="text-blue-500 text-center">
        @{userInfo?.user?.username}
      </div>
      <div className="flex flex-col  gap-x-4">
        {uname !== userInfo?.user?.username &&
          (followLoading ? (
            <div className="my-3 p-1 px-5 w-full flex items-center justify-center rounded-full border text-gray-600 bg-gray-300">
              <LoaderCircle />
            </div>
          ) : status === false ? (
            <button
              onClick={handleFollow}
              className="my-3 p-1 px-5 rounded-full border bg-blue-600 text-white"
            >
              Follow
            </button>
          ) : (
            <button
              onClick={handleUnfollow}
              className="my-3 p-1 px-5 rounded-full border bg-gray-300 text-gray-700"
            >
              unfollow
            </button>
          ))}
        {/* <div className="flex ">
          <div className="my-3 p-1 px-5 rounded-full border border-gray-300">
            {followData?.followers} Follower
          </div>
          <div className="my-3 p-1 px-5 rounded-full border border-gray-300">
            {followData?.following} Following
          </div>
        </div> */}
        <div className="flex flex-wrap gap-9 items-center w-full whitespace-nowrap mt-3">
          <div className="flex gap-2 justify-center items-center self-stretch my-auto">
            <div className="self-stretch my-auto text-2xl font-bold text-black">
              {followData?.followers}
            </div>
            <div className="self-stretch my-auto text-base font-medium text-neutral-400">
              Followers
            </div>
          </div>
          <div className="flex gap-2 justify-center items-center self-stretch my-auto">
            <div className="self-stretch my-auto text-2xl font-bold text-black">
              {followData?.following}
            </div>
            <div className="self-stretch my-auto text-base font-medium text-neutral-400">
              Following
            </div>
          </div>
          <div className="flex gap-2 justify-center items-center self-stretch my-auto">
            <div className="self-stretch my-auto text-2xl font-bold text-black">
              {userInfo?.posts?.length}
            </div>
            <div className="self-stretch my-auto text-base font-medium text-neutral-400">
              Posts
            </div>
          </div>
        </div>
      </div>
      {/* <div className="text-center w-52">
        <p className="whitespace-pre-wrap break-words">{userInfo?.user?.bio}</p>
      </div> */}
      <div className="mt-4 w-[85%] text-center leading-5 text-black whitespace-wrap">
        <span className="font-medium">{userInfo?.user?.bio}</span>
        {/* <span className="font-medium">... </span>
                 <span className="font-medium text-black">See more</span> */}
      </div>
      <div className="flex justify-center gap-8 space mt-4 w-full ">
        {userInfo?.user?.links.map((link, index) => (
          <RenderLinks key={index} link={link} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
