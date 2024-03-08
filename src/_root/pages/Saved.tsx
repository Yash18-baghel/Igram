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
    <div className="saved-container">
      <div className="saved-inner_container">
        <img
          src="/assets/icons/save1.svg"
          width={36}
          height={36}
          alt="filter"
        />
        <h2 className="h3-bold md:h2-bold w-full">Saved Posts</h2>
      </div>

      {
        !posts || isLoading ?
          <div className="flex flex-1 items-center justify-center">
            <Loader />
          </div> :
          <div className="flex flex-wrap gap-9 w-full max-w-5xl mt-10">
            <GridPostList posts={posts} showStats={false} showUser={true} />
          </div>
      }

    </div>
  )
}

export default Saved