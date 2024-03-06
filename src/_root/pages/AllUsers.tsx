import UserCard from "@/components/shared/UserCard";
import { useGetAllUsers } from "@/lib/react-query/queries";

const AllUsers = () => {
  const { data: users } = useGetAllUsers();
  return (
    <div className="users-container">
      <div className="users-inner_container">
        <img
          src="/assets/icons/user.svg"
          width={36}
          height={36}
          alt="filter"
          className="mr-2"
        />
        <h2 className="h3-bold md:h2-bold w-full">All Users</h2>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl mt-5">
        <ul className="grid-container">
          {
            users?.documents.map((user) => (
              <UserCard user={user} />
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default AllUsers