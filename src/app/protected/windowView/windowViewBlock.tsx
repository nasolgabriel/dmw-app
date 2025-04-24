import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WindowView from "./windowView";
import { useApiCallback } from "@/hooks/useApi";
import { assignWindowClient, getClientTable, getCurrentClient, logoutApi } from "@/api/authApi";
import { currentClientResponse } from "@/types/currentClient";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const WindowViewBlock: React.FC = () => {
  const [windowTitle] = useState(() =>
    (localStorage.getItem("window") ?? "window").toUpperCase()
  );
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { execute: executeLogout } = useApiCallback<string, [string]>(
    logoutApi
  );

  // currently selected client id
  const [tempClient, setTempClient] = useState<string>("");
  
  // client data
  const [clientData, setClientData] = useState<currentClientResponse | null>(
    null
  );

  const { execute: fetchClient } = useApiCallback<
    currentClientResponse,
    [string | number]
  >(getCurrentClient);

  const division = localStorage.getItem("division");

  const {
    data: clientTableData,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["clientTable", division],
    queryFn: () => (division ? getClientTable(division) : Promise.resolve([])),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    enabled: !!division,
  });

  // default to first row's id
  useEffect(() => {
    if (clientTableData?.length) {
      setTempClient(clientTableData[0].id?.toString() ?? "");
    }
  }, [clientTableData]);

  // auto refresh
  useEffect(() => {
    const iv = setInterval(refetch, 3000);
    return () => clearInterval(iv);
  }, [refetch]);

  useEffect(() => {
    if (isError) toast.error(`Error loading table: ${error}`);
  }, [isError, error]);

  // proceed with selected or default client
  const handleProceed = async () => {
    if (!tempClient) return;
    try {
      const data = await fetchClient(tempClient);
      const counter_id = Number(localStorage.getItem("counter_id"));
      
      if (isNaN(counter_id)) {
        toast.error("Invalid counter ID");
        return;
      }

      // Get access token from localStorage
      const access_token = localStorage.getItem("access_token");
      if (!access_token) {
        toast.error("Authentication required");
        return;
      }

      await assignWindowClient(counter_id, data.id);
      setClientData(data);
      toast.success("Client assigned to window successfully!");
    } catch (error) {
      toast.error("Failed to assign client to window");
    }
  };

  // row-specific proceed
  const handleRowProceed = async (clientId: string | number) => {
    try {
      const data = await fetchClient(clientId);
      const counter_id = Number(localStorage.getItem("counter_id"));

      if (isNaN(counter_id)) {
        toast.error("Invalid counter ID");
        return;
      }

      // Get access token from localStorage
      const access_token = localStorage.getItem("access_token");
      if (!access_token) {
        toast.error("Authentication required");
        return;
      }

      await assignWindowClient(counter_id, data.id);
      setClientData(data);
      toast.success("Client assigned to window successfully!");
    } catch (error) {
      toast.error("Failed to assign client to window");
    }
  };

  const handleClearCard = () => setClientData(null);
  const handleLogout = async () => {
    await executeLogout("Successfully logged out");
    ["access_token", "role", "window", "division", "counter_id"].forEach((k) =>
      localStorage.removeItem(k)
    );
    navigate("/");
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
      handleClearCard={handleClearCard}
      clientData={clientData}
      clientTableData={clientTableData ?? []}
      onRowClick={handleRowProceed}
      clientId={clientData?.id||0}
      refetchClientTable={refetch}
    />
  );
};

export default WindowViewBlock; 