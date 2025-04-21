import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import WindowView from "./windowView";
import { useApiCallback } from "@/hooks/useApi";
import { getClientTable, getCurrentClient, logoutApi } from "@/api/authApi";
import { currentClientResponse } from "@/types/currentClient";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const WindowViewBlock: React.FC = () => {
  const [windowTitle, setWindowTitle] = useState(() => (localStorage.getItem("window")?? "window").toUpperCase());
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { execute: executeLogout } = useApiCallback<string, [string]>(
    logoutApi
  );

  const [tempClient] = useState("43");

  // Keep clientData in local state so we can clear it when "Done" is clicked
  const [clientData, setClientData] = useState<currentClientResponse | null>(
    null
  );

  const { execute: fetchClient } = useApiCallback<
    currentClientResponse,
    [string | number]
  >(getCurrentClient);

  // Get division from localStorage
  const division = localStorage.getItem("division");

  // React Query implementation
  const {
    data: clientTableData,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["clientTable", division], // Unique query key
    queryFn: () => (division ? getClientTable(division) : Promise.resolve([])),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    enabled: !!division,
  });

  // Auto-refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 1000 * 3);

    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    if (isError) {
      toast.error(`Error fetching client table: ${error}`);
    }
  }, [isError]);

  // Log the data whenever it changes
  useEffect(() => {
    if (clientTableData) {
      console.log("Client Table Data:", clientTableData);
    }
  }, [clientTableData]);

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
      localStorage.removeItem("role");

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const columns = [
    { header: "Ticket Number", accessorKey: "ticket_number" },
    { header: "Name", accessorKey: "name" },
    { header: "Time", accessorKey: "time" },
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
      clientTableData={clientTableData ?? []}

    />
  );
};

export default WindowViewBlock;
