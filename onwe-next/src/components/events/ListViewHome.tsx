import React from 'react'
import { ClubCardHome, EventCardHome } from '@/types/type';
import Image from 'next/image';
import Link from 'next/link';
interface props {
    event: EventCardHome
}
const formatDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "short" });
  
    // Pad day with leading zero if needed
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
  
    return { day: formattedDay, month };
  };
const ListViewHome:React.FC<props> = ({event}) => {
    const imageSrc = `data:image/png;base64,${event.photo}`;
    const { day, month } = formatDate(event.dateOfEvent);
    
  return (
    <div>
      <div
        className="sm:w-full w-[96vw] h-18 rounded-lg mb-3 flex sm:gap-0 gap-3 p-1 bg-white"
      >
        <div className="sm:w-20 w-max  h-full">
          <button className="border ml-2 mt-1 p-1 px-2.5 bg-gray-200 rounded-xl ">
            <h1 className="text-lg font-extrabold">{day}</h1>
            <h1 className="text-[10px] font-semibold mt-[-4px]">{month}</h1>
          </button>
        </div>
        <div className="h-full grow flex justify-between border-b-2">
          <div className="sm:w-52 h-full flex flex-col">
            <h1 className="text-lg font-medium">{event.title}</h1>
            <h1 className="text-sm mt-1 text-gray-500">{event.subtitle}</h1>
          </div>
          <div className="sm:w-20 h-full flex justify-center items-center">
            <button className="border text-[12px] bg-gray-200 rounded-full p-1 pl-2 pr-2">
              +remind
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListViewHome
