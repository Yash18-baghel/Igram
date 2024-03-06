import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useGetUserById, useGetUsersPosts } from "@/lib/react-query/queries";
import { useParams } from "react-router-dom";

const Profile = () => {
    const { id = '' } = useParams();
    const { data: user, isLoading: isUserLoading } = useGetUserById(id);
    const { data: posts, isLoading } = useGetUsersPosts(id);


    if (isUserLoading || !user) return <Loader />


    return (
        <div className="profile-container">
            <div className="profile-inner_container">
                <div className="flex-1 flex gap-5">
                    <div>
                        <img
                            src={user?.imageUrl}
                            width={90}
                            height={90}
                            alt="profile_pic"
                            className="rounded-full"
                        />
                    </div>
                    <div className="flex flex-1 flex-col">
                        <div className=" flex w-1/2 justify-between">
                            <p className="font-bold text-2xl text-center">{user.name}</p>
                            <Button className="Edit-button_primary">
                                <img
                                    src={'/assets/icons/edit-yellow.svg'}
                                    width={16}
                                    height={16}
                                    alt="profile_pic"
                                    className="rounded-full"
                                />
                                Edit Profile
                            </Button>
                        </div>
                        <div>
                            <p className="small-regular text-light-3">@{user.username}</p>
                        </div>
                        <div className="flex my-5 gap-9">
                            <div className="posts">
                                <p className="text-2xl text-primary-500">273</p>
                                <h2 className="body-bold">Posts</h2>
                            </div>
                            <div className="posts">
                                <p className="text-2xl text-primary-500">273</p>
                                <h2 className="body-bold">Followers</h2>
                            </div>
                            <div className="posts">
                                <p className="text-2xl text-primary-500">273</p>
                                <h2 className="body-bold">Following</h2>
                            </div>
                        </div>
                        <div className="flex">
                            <p>🌿 Capturing the essence of nature through my lens <br />
                                ✨ "In every walk with nature, one receives far more than he seeks." - John Muir
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-9 w-full max-w-5xl mt-10">
                {isLoading && !posts || posts?.documents?.length === 0 ? (
                    <div className="mt-10">
                        <Loader />
                    </div>
                ) : (
                    <GridPostList posts={posts?.documents || []} showStats={false} showUser={false} />
                )
                }
            </div>
        </div>
    )
}

export default Profile