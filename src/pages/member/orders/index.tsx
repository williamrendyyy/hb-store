import MemberOrdersView from "@/components/views/Member/Orders";
import userServices from "@/services/user";
import { useEffect, useState } from "react";

const MemberOrdersPage = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getAllUsers = async () => {
      const { data } = await userServices.getAllUsers();
      setUsers(data.data);
    };
    getAllUsers();
  }, []);
  return (
    <>
      <MemberOrdersView users={users} />
    </>
  );
};

export default MemberOrdersPage;
