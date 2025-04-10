import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import WindowView from "./windowView";
import { useApiCallback } from "@/hooks/useApi";
import { getCurrentClient, logoutApi } from "@/api/authApi";
import { currentClientResponse } from "@/types/currentClient";

const WindowViewBlock: React.FC = () => {
  const [windowTitle, setWindowTitle] = useState("WINDOW 1");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { execute: executeLogout } = useApiCallback<string, [string]>(logoutApi);

  const [tempClient] = useState("43");

  // Keep clientData in local state so we can clear it when "Done" is clicked
  const [clientData, setClientData] = useState<currentClientResponse | null>(null);

  const { execute: fetchClient } = useApiCallback<currentClientResponse, [string | number]>(
    getCurrentClient
  );

  const handleProceed = async () => {
    try {
      const result = await fetchClient(tempClient);
      console.log("Fetched client data:", result);
      setClientData(result);
    } catch (error) {
      console.error("Failed to fetch client:", error);
    }
  };

  const handleDone = () => {
    setClientData(null);
  };

  const handleLogout = async () => {
    try {
      await executeLogout("Successfully logged out");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
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
      handleProceed={handleProceed}
      handleDone={handleDone}
      clientData={clientData}
    />
  );
};

export default WindowViewBlock;
