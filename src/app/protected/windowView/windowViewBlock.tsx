import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WindowView from "./windowView";
import { useApiCallback } from "@/hooks/useApi";
import {
  assignWindowClient,
  doneApi,
  getClientTable,
  getCurrentClient,
  getCurrentClientByCounter,
  logoutApi,
} from "@/api/authApi";
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

  useEffect(() => {
    const fetchCurrentClientForCounter = async () => {
      const storedCounterId = localStorage.getItem("counter_id");
      if (storedCounterId) {
        const counterId = Number(storedCounterId);
        if (!isNaN(counterId)) {
          try {
            const client = await getCurrentClientByCounter(counterId);
            setClientData(client);
          } catch (error) {
            console.error("No client assigned to this counter", error);
          }
        }
      }
    };

    fetchCurrentClientForCounter();
  }, []); // Empty dependency array to run once on mount

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

      await assignWindowClient(counter_id, data.client.id);
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

      await assignWindowClient(counter_id, data.client.id);
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

  // 1. markDone only needs the queue ID
  const { execute: markDone } = useApiCallback<{ status: string }, [number]>(
    doneApi
  );

  // 2. handleDone just passes the ID
  const handleDone = async () => {
    const queueId = clientData?.client?.id;
    if (!queueId) {
      console.warn("No client/ticket to mark done");
      return;
    }

    try {
      const result = await markDone(queueId);
      console.log("doneApi response:", result);
    } catch (error) {
      console.error("doneApi error:", error);
    }
  };

  const [isPriorityLane, setIsPriorityLane] = useState(false);

  // Filter the table data based on priority status
  const filteredTableData = isPriorityLane
    ? clientTableData?.filter((client) => client.priority === true) || []
    : clientTableData || [];

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
      clientTableData={filteredTableData}
      onRowClick={handleRowProceed}
      clientId={clientData?.client.id || 0}
      refetchClientTable={refetch}
      handleDone={handleDone}
      isPriorityLane={isPriorityLane}
      setIsPriorityLane={setIsPriorityLane}
    />
  );
};

export default WindowViewBlock;