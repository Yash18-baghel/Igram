import { Models } from "appwrite"
import { Button } from "../ui/button"
import { useAddFollowing, useUnFollow } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UserCard = ({ user }: { user: Models.Document }) => {
    const { user: currentUser } = useUserContext();
    const { toast } = useToast();

    const { mutateAsync: addFollow } = useAddFollowing();
    const { mutateAsync: unFollow } = useUnFollow(user?.$id || '');

    const [following, setFollowing] = useState<Models.Document[]>([]);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);

    useEffect(() => {
        const following = user?.follower.filter((follower: Models.Document) => follower.$id !== currentUser.id) || [];
        setFollowing(following);
        const isfollowing = following.length > 0;
        setIsFollowing(isfollowing);
    }, [user]);

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
        <div className="user-card px-0">
            <div className="flex flex-col justify-center flex-1">
                <Link to={`/profile/${user?.$id}`}>
                    <div className="flex flex-1 justify-center items-center">
                        <img
                            src={user?.imageUrl}
                            width={90}
                            height={90}
                            alt="profile_pic"
                            className="h-24 w-24 rounded-full"
                        />
                    </div>
                    <p className="body-bold mt-5 text-center">{user.name}</p>
                    <p className="small-regular  text-center mt-1 text-light-3">@{user.username}</p>
                </Link>
                <div className="flex flex-1 justify-center items-center">
                    <Button onClick={handleFollow} className={`${isFollowing ? "shad-button_secondary" : "shad-button_primary"} mt-5 w-[110px]`}>
                        {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default UserCard;