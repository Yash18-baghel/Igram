import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useAddFollowing, useGetUserById, useGetUsersPosts, useUnFollow } from "@/lib/react-query/queries";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Profile = () => {
    const { id = '' } = useParams();
    const { toast } = useToast();
    const { user: currentUser } = useUserContext();
    const { data: user, isLoading: isUserLoading } = useGetUserById(id);
    const { mutateAsync: addFollow } = useAddFollowing();
    const { mutateAsync: unFollow } = useUnFollow(user?.$id || '');
    const { data: posts, isLoading } = useGetUsersPosts(id);

    const [following, setFollowing] = useState<Models.Document[]>([]);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);

    useEffect(() => {
        const following = user?.follower.filter((follower: Models.Document) => follower.$id !== currentUser.id) || [];
        setFollowing(following);
        const isfollowing = following.length > 0;
        setIsFollowing(isfollowing);
    }, [user]);

    if (isUserLoading || !user) return <Loader />;

    const handleFollow = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFollowing(!isFollowing);
        try {
            if (isFollowing) {
                const [follows] = following;
                unFollow(follows.$id)
                return;
            }
            const follow = await addFollow({
                followerId: user.$id,
                followingId: currentUser.id
            });

            if (!follow) {
                toast({ title: "Error" })
            }

            toast({ title: `Following  ${user.name}` })
        } catch (er) {
            console.log(er);
        }
    }

    return (
        <div className="profile-container">
            <div className="profile-inner_container">
                <div className="flex-1 flex w-full gap-5">
                    <div className="flex flex-col">
                        <img
                            src={user?.imageUrl}
                            width={90}
                            height={90}
                            alt="profile_pic"
                            className="h-24 w-24 rounded-full"
                        />
                    </div>
                    <div className="flex w-3/4 flex-col">
                        <div className="flex sm:w-1/2 justify-between">
                            {/* <div className="w-full"> */}
                            <p className="flex font-bold sm:text-2xl text-light-2 items-center justify-center text-center">{user.name}</p>
                            {/* </div> */}
                            {currentUser.id === user.$id ?
                                <Link to='/user/update'>
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
                                </Link> :
                                <Button
                                    onClick={handleFollow}
                                    className={`${isFollowing ? "shad-button_secondary" : "shad-button_primary"}`}

                                >
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </Button>
                            }
                        </div>
                        <div>
                            <p className="small-regular text-light-3">@{user.username}</p>
                        </div>
                        <div className="sm:flex hidden my-5 gap-9">
                            <div className="user-account-info">
                                <p className="h4-semibold text-primary-500">{user.posts?.length}</p>
                                <h2 className="body-bold">Posts</h2>
                            </div>
                            <div className="user-account-info">
                                <p className="h4-semibold text-primary-500">{user.follower?.length}</p>
                                <h2 className="body-bold">Followers</h2>
                            </div>
                            <div className="user-account-info">
                                <p className="h4-semibold text-primary-500">{user.following?.length}</p>
                                <h2 className="body-bold">Following</h2>
                            </div>
                        </div>
                        <div className="flex">
                            <p >{user.bio}</p>
                        </div>
                    </div>

                </div>
                <div className="flex  sm:hidden gap-5">
                    <div className="user-account-info">
                        <p className="h4-semibold text-primary-500">{user.posts?.length}</p>
                        <h2 className="body-bold">Posts</h2>
                    </div>
                    <div className="user-account-info">
                        <p className="h4-semibold text-primary-500">{user.follower?.length}</p>
                        <h2 className="body-bold">Followers</h2>
                    </div>
                    <div className="user-account-info">
                        <p className="h4-semibold text-primary-500">{user.following?.length}</p>
                        <h2 className="body-bold">Following</h2>
                    </div>
                </div>
                <hr className="border w-full border-dark-4/80" />

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