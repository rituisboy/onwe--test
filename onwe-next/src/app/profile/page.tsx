'use client'

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'
import axios from 'axios'
import { setUser } from '@/lib/features/user/userSlice'
import { useSignIn } from '@/hooks/useSignIn'
import { UserProfile } from '@/types/type'
import PostAvatar from '@/components/post_component/PostAvatar'
import Profile from '@/components/profile/Profile'
import ProfileRightSection from '@/components/profile/ProfileRightSection'
import RenderLinks from '@/components/profile/RenderLinks'

const fetcher = async (url: string, token: string) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return data
}

export default function Page() {
  const [userInfo, setUserInfo] = useState<UserProfile>()
  const dispatch = useDispatch()
  const { getToken } = useSignIn()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(getToken())
  }, [getToken])

  const { data: swrData } = useSWR(
    token ? ['/user/info', token] : null,
    ([url, token]) => fetcher(url, token),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  useEffect(() => {
    if (swrData) {
      dispatch(setUser(swrData))
      setUserInfo(swrData)
    }
  }, [swrData, dispatch])

  return (
    <div className="overflow-y-auto h-screen scrollbar-custom p-2 pl-0">
      <div>
        <div className="relative w-full h-64 bg-white">
          <div className="absolute inset-0 bg-black rounded-xl">
            <video className="absolute h-full w-full object-cover" loop autoPlay muted>
              <source src="/path/to/your/video.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="absolute left-[9.5%] bottom-[-80px]">
            <PostAvatar
              size={40}
              className="ring-8 ring-slate-300"
              imageUrl={userInfo?.user?.avatar}
            />
          </div>
          <div className="absolute bottom-8 right-8 flex space-x-4 border p-2 bg-gray-500 rounded-lg">
            {userInfo?.user?.links.map((link, index) => (
              <RenderLinks key={index} link={link} />
            ))}
          </div>
        </div>
      </div>
      
      <div className="h-[100vh] w-full sm:flex items-center sm:p-0 bg-white">
        <div className="hidden sm:flex w-full h-full flex-col sm:flex-row animate-slide-up fade-in-5 rounded-xl bg-white gap-16 justify-between">
          <div className="w-[35%] h-full flex justify-center items-start mt-[50px]">
            <Profile userInfo={userInfo!} />
          </div>
          <div className="w-full sm:w-[65%] p-2 pt-3 bg-white rounded-lg h-full">
            <ProfileRightSection posts={userInfo?.posts!} />
          </div>
        </div>
        
        <div className="sm:hidden w-full h-full flex pl-4 pt-4 items-center content-center overflow-y-auto scrollbar-hidden bg-white mb-14 pb-6">
          <div className="w-full h-[96vh] flex flex-col animate-slide-up fade-in-5 rounded-xl bg-white mr-4 items-center">
            <div className="w-[45%] h-max flex justify-center items-start mt-4">
              <Profile userInfo={userInfo!} />
            </div>
            <div className="w-full p-2 bg-white rounded-lg h-full">
              <ProfileRightSection posts={userInfo?.posts!} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}