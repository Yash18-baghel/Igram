import Image from "@/components/shared/Image";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useAddComment, useDeleteComment, useDeletePost, useGetPostById, useLikeComment } from "@/lib/react-query/queries";
import { checkIsLiked, multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: post, isLoading } = useGetPostById(id || '');
  const { mutateAsync: deletePost } = useDeletePost();
  const { mutateAsync: addComment, isLoading: isCommentPosted } = useAddComment();

  const [comment, setComment] = useState<string>('');

  const { user } = useUserContext();

  const handleDeletePost = async () => {
    try {
      const isPostDeleted = await deletePost({ postId: post?.$id || '', imageId: post?.imageId });
      if (!isPostDeleted) {
        toast({ "title": "post Not Deleted" })
        throw Error;
        return;
      }

      navigate(-1);
    } catch (err) {
      console.log(err);
    }
  }

  const handleAddComment = async () => {
    setComment('')
    try {
      const addedComment = await addComment({
        text: comment,
        userId: user.id,
        postId: post?.$id || ''
      })

      if (!addedComment) throw Error;

    } catch (error) {
      console.log(error);
    }
  };

  const Comments = ({ comment }: { comment: Models.Document }) => {
    const { mutate: deleteComment, isLoading: isCommentdeleted } = useDeleteComment(post?.$id || '');
    const { mutate: likeComment } = useLikeComment(post?.$id || '');

    console.log(comment);


    const likesList = comment?.likes.map((user: Models.Document) => user.$id);
    const [likes, setLikes] = useState<string[]>(likesList);

    const handleCommentLike = async () => {
      let likesArray = [...likes];

      if (likesArray.includes(user.id)) {
        likesArray = likesArray.filter((Id) => Id !== user.id);
      } else {
        likesArray.push(user.id);
      }

      setLikes(likesArray);
      likeComment({ commentId: comment?.$id, likesArray });
    }

    const isLikedComment = useMemo(() => {
      return checkIsLiked(likes, user.id) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"
    }, [likes, user.id]);

    return <div className="comment-container my-2 flex flex-col">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <Link to={`/profile/${comment.user.$id}`}>
            <img
              src={comment.user.imageUrl}
              alt="user image"
              className="h-10  w-10 rounded-full"
            />
          </Link>

          <p className="text-light-3 base-regular lg:base-semibold">
            <Link to={`/profile/${comment.user.$id}`} className="">
              {comment.user.name}
            </Link>

            <span className="text-white base-regular ml-2">
              {comment.text}
            </span>
          </p>

        </div>
        <div className="flex gap-2">
          <div className={`cursor-pointer ${comment.user.$id !== user.id && "hidden"}`}>
            {!isCommentdeleted ? <img
              src="/assets/icons/delete.svg"
              alt="delete comment"
              width={24}
              height={24}
              onClick={() => deleteComment(comment.$id)}
            /> : <Loader />}
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <img
              src={isLikedComment}
              alt="like comment"
              width={16}
              height={16}
              onClick={handleCommentLike}
            />
            <p className="text-light-3 subtle-semibold lg:small-regular">{likes.length}</p>
          </div>

        </div>
      </div>
      <div className="flex mt-2">
        <p className="text-light-3 subtle-semibold lg:small-regular">
          {multiFormatDateString(comment?.$createdAt)}
        </p>
      </div>
    </div>
  }

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <Image
            src={post?.imageUrl}
            alt="creator"
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <div className="flex items-center gap-3">
                <Link to={`/profile/${post?.creator.$id}`}>
                  <Image
                    src={
                      post?.creator.imageUrl ||
                      "/assets/icons/profile-placeholder.svg"
                    }
                    alt="creator"
                    className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                  />
                </Link>

                <div className="flex gap-1 flex-col">
                  <Link to={`/profile/${post?.creator.$id}`}>
                    <p className="base-medium lg:body-bold text-light-1">
                      {post?.creator.name}
                    </p>
                  </Link>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}>
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`${user.id !== post?.creator.$id ? "hidden" : "post_details-delete_btn"} `}>
                  <img
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>


            <div className="flex flex-col w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.length > 0 && post?.tags.map((tag: string, index: string) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <hr className="border w-full border-dark-4/80" />

            <div className="flex w-full flex-col overflow-y-auto no-scrollbar h-56">
              {
                post.comment.map((comment: Models.Document, key: number) => (
                  <Comments comment={comment} key={key} />
                ))
              }
            </div>

            <div className="w-full mt-2">
              <PostStats post={post} userId={user.id} />
            </div>
            <div className="flex w-full gap-3">
              <div className="flex items-center ">
                <Image
                  src={user.imageUrl}
                  alt="user image"
                  width={24}
                  height={24}
                  className="h-11  w-11 rounded-full"
                />
              </div>
              <div className="flex flex-1 relative">
                <Input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className="shad-input" placeholder="Write your comment..." />
                <div className="absolute right-0 cursor-pointer px-2 py-3">

                  {!isCommentPosted ?
                    <img
                      src="/assets/icons/send.svg"
                      alt="user image"
                      width={22}
                      height={22}
                      onClick={handleAddComment}
                    /> : <Loader />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div> */}
    </div>
  )
}

export default PostDetails