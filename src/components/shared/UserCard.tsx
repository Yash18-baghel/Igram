import { Models } from "appwrite"
import { Button } from "../ui/button"

const UserCard = ({ user }: { user: Models.Document }) => {
    return (
        <div className="user-card px-0">
            <div className="flex flex-col justify-center flex-1">
                <div className="flex flex-1 justify-center items-center">
                    <img
                        src={user?.imageUrl}
                        width={90}
                        height={90}
                        alt="profile_pic"
                        className="rounded-full"
                    />
                </div>
                <p className="body-bold mt-5 text-center">{user.name}</p>
                <p className="small-regular  text-center mt-1 text-light-3">@{user.username}</p>
                <div className="flex flex-1 justify-center items-center">
                    <Button type="submit" className="shad-button_primary mt-5 w-[110px]">
                        Follow
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default UserCard;