import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WindowView from "./windowView";
import { clearLoginInfo, getLoginInfo } from "@/utils/loginInfo";

const WindowViewBlock: React.FC = () => {
  const [windowTitle, setWindowTitle] = useState(
    getLoginInfo().windowTitle.toUpperCase()
  );
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    clearLoginInfo();
    navigate("/");
  };

  const columns = [
    {
      header: "Number",
      accessorKey: "number",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Time",
      accessorKey: "time",
    },
  ];

  return (
    <WindowView
      windowTitle={windowTitle}
      handleLogout={handleLogout}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      columns={columns}
    />
  );
};

export default WindowViewBlock;
