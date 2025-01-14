"use client";

import React, { useState, useCallback, useRef } from "react";
import axios from "axios";
import useSWR from "swr";
import ClubCard from "../clubs/ClubCard";
import { ClubCardProps } from "@/types/type";
import { ChevronLeft, ArrowRight, Loader2 } from "lucide-react";
import { debounce } from "lodash";
import { useSignIn } from "@/hooks/useSignIn";

interface SearchClubsProps extends ClubCardProps {
  isUserMember: boolean;
}

export default function Component({
  closeSidebar,
}: {
  closeSidebar: () => void;
}) {
  const [searchClubs, setSearchClubs] = useState<SearchClubsProps[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchAreaRef = useRef<HTMLDivElement>(null);
  const { getToken } = useSignIn();

  const { data: myClubs, isValidating } = useSWR<ClubCardProps[]>("/myclubs");

  const fetchSearchClubs = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchClubs([]);
        return;
      }
      setIsSearching(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/explore/clubs/${query}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        setSearchClubs(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    [getToken]
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchInput(query);
    fetchSearchClubs(query);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchAreaRef.current &&
      !searchAreaRef.current.contains(event.target as Node)
    ) {
      setShowSearchArea(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col border ">
      <div className="flex items-center border-b h-[8vh] relative ">
        <div className="bg-[#f1f1f1] w-80 rounded-3xl h-10 ml-2 flex items-center justify-between pr-4">
          <input
            type="text"
            placeholder="Search clubs"
            className="bg-transparent pl-4 outline-none w-full"
            onFocus={() => setShowSearchArea(true)}
            onChange={handleSearchInputChange}
          />
          {isSearching ? <Loader2 className="animate-spin" /> : <ArrowRight />}
        </div>
        {/* <button className="absolute right-4 sm:hidden" onClick={closeSidebar}>
          <ChevronLeft />
        </button> */}
        {showSearchArea && (
          <div
            ref={searchAreaRef}
            className="w-full h-[calc(100dvh-4rem)] p-3 absolute bg-gray-50 top-14 border rounded overflow-y-auto z-30"
          >
            {isSearching ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin" />
              </div>
            ) : searchClubs.length > 0 ? (
              searchClubs.map((club) => (
                <ClubCard
                  key={club.id}
                  club={club}
                  showJoin={true}
                  isJoined={club.isUserMember}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">No clubs found</p>
            )}
          </div>
        )}
      </div>
      <div className="overflow-y-auto">
        <div className="flex flex-col overflow-hidden space-y-2 mt-4">
          {isValidating ? (
            <div className="flex justify-center items-center h-20">
              <Loader2 className="animate-spin" />
            </div>
          ) : myClubs && myClubs.length > 0 ? (
            myClubs.map((club) => (
              <ClubCard key={club.id} club={club} showJoin={false} />
            ))
          ) : (
            <p className="text-center text-gray-500">No clubs joined yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
