'use client'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../lib/store'
import { filterEvents } from '../../lib/features/events/eventsSlice'
import EventCard from '@/components/events/EventCard';
import { Event } from '../../lib/types/event';

const Page: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const events = useSelector((state: RootState) => state.events.events);

  const handleFilter = (filterType: string) => {
    dispatch(filterEvents({ filterType }));
  };

  return (
    <div>
      <div className='bg-white flex flex-col w-3/5'>
        <div className='top-0 sticky bg-white z-50 p-4 w-full relative'>
          <ul className='flex space-x-8'>
            <button onClick={() => handleFilter('upcoming')} className='border rounded-full text-sm p-2 active:bg-black'>Upcoming Events</button>
            <button onClick={() => handleFilter('past')} className='border rounded-full text-sm p-2 active:bg-black'>Past Events</button>
            <button onClick={() => handleFilter('remainder')} className='border rounded-full text-sm p-2 active:bg-black'>My Remainders</button>
            <button onClick={() => handleFilter('saved')} className='border rounded-full text-sm p-2 active:bg-black'>Saved</button>
          </ul>
        </div>
        <div className="p-4 mb-2 w-full relative">
          {events.map((event: Event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
