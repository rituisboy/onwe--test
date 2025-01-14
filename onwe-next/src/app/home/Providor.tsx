"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useContext,
  createContext,
} from "react";

import Posts from "@/components/post_component/Posts";
import PostsSkeleton from "@/components/post_component/PostSkeleton";
import { useDispatch } from "react-redux";
import { setPost } from "@/lib/features/posts/postSlice";
import { setTimeline } from "@/lib/features/timeline/postSlice";
import { PostsProps } from "@/types/type";
import useSWRInfinite from "swr/infinite";
import { useRouter } from "next/navigation";
import { useSignIn } from "@/hooks/useSignIn";
import { getData } from "@/lib/utils";

const PAGE_SIZE = 10;
export const PostContext = createContext<any | undefined>(undefined);

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { getToken } = useSignIn();

  const getKey = useCallback(
    (pageIndex: number, previousPageData: PostsProps[] | null) => {
      if (previousPageData && !previousPageData.length) return null; // Reached the end
      if (previousPageData)
        return `/posts?page=${pageIndex + 1}&limit=${PAGE_SIZE}&id=${
          previousPageData[previousPageData?.length - 1].id
        }`;
      // API endpoint with pagination
      else return `/posts?page=${pageIndex + 1}&limit=${PAGE_SIZE}`; // First page
    },
    []
  );

  const {
    data,
    error,
    size,
    setSize,
    isValidating,
    mutate: postMutate,
  } = useSWRInfinite<PostsProps[]>(getKey, {
    revalidateFirstPage: false,
    persistSize: true,
    revalidateOnFocus: false,
  });

  const posts = useMemo(
    () => (data ? ([] as PostsProps[]).concat(...data) : []),
    [data]
  );

  useEffect(() => {
    if (posts.length > 0) {
      dispatch(setTimeline(posts));
      dispatch(setPost(posts[0]));
    }
  }, [posts, dispatch]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isValidating) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isValidating) {
          setSize((prevSize) => prevSize + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isValidating, setSize]
  );

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <div className="text-red-500">
          <p>Error fetching data: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <PostContext.Provider value={postMutate}>
      <div className="flex h-screen w-full bg-white">
        <div className="h-full w-full flex flex-col overflow-y-auto scrollbar-hide bg-white">
          {posts.length === 0 && !isValidating ? (
            <div>No posts available.</div>
          ) : (
            posts.map((post, index) => (
              <div
                key={post.id || index}
                ref={index === posts.length - 4 ? lastElementRef : null}
              >
                <Posts post={post} />
              </div>
            ))
          )}
          {isValidating && <PostsSkeleton />}
          <div className="mt-20" />
        </div>
      </div>
    </PostContext.Provider>
  );
};

export default React.memo(Page);
