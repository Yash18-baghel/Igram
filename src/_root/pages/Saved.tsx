import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext"
import { useGetSavedPosts } from "@/lib/react-query/queries";
import { useMemo } from "react";

const Saved = () => {
  const { user } = useUserContext();
  const { data: savedPosts, isLoading } = useGetSavedPosts(user?.id);

  const posts = useMemo(() =>
    savedPosts?.documents.map((doc) => (
      doc?.post
    )), [savedPosts]) || [];



  return (
    <div className="explore-container">
      <div className="flex w-full">
        <img
          src="/assets/icons/save1.svg"
          width={36}
          height={36}
          alt="filter"
          className="mr-2"
        />
        <h2 className="h3-bold md:h2-bold w-full">Saved Posts</h2>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl mt-10">
      </div>
      {isLoading && posts.length === 0 ? (
        <div className="mt-10">
          <Loader />
        </div>
      ) : (
        <GridPostList posts={posts} showStats={false} showUser={false} />
      )
      }
    </div>
  )
}

export default Saved