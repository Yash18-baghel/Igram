import { useUserContext } from "@/context/AuthContext";
import UpdateUser from "@/components/forms/UpdateUser";
import Loader from "@/components/shared/Loader";

const EditUser = () => {
  const { user } = useUserContext();


  return (
    <div className="flex w-full">
      <div className="flex-1 saved-container">
        <div className="saved-inner_container">
          <img
            src="/assets/icons/edit-white.svg"
            width={36}
            height={36}
            alt="filter"
          />
          <h2 className="h3-bold md:h2-bold w-full">Edit Profile</h2>
        </div>
        {
          user.name ? <UpdateUser user={user} /> : <Loader />
        }
      </div>
      <div className="lg:w-1/4 lg:block hidden ">
        mics details...!!!
      </div>
    </div>
  )
}

export default EditUser