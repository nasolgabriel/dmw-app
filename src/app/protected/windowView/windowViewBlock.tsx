import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import WindowView from "./windowView";

const WindowViewBlock: React.FC = () => {
  const [windowTitle, setWindowTitle] = useState("WINDOW 1");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
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
