import { Button, Container } from "@mui/material";
import { data } from "@/mocks/customTableMock";
import ClientCard from "./clientCard";
import StartIcon from "@mui/icons-material/Start";
import { CustomTable } from "@/components/customTable/customTable";
import HeaderBar from "@/components/headerBar/headerBar";
import CustomModal from "@/components/modal/customModal";
import ClientTransferModal from "./clientTransferModal";

interface WindowViewProps {
  windowTitle: string;
  handleLogout: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  columns: any[];
  handleProceed: () => void;
  handleDone: () => void;
  clientData: any;
  clientTableData: any[];
}

const WindowView: React.FC<WindowViewProps> = ({
  windowTitle,
  handleLogout,
  isModalOpen,
  setIsModalOpen,
  columns,
  handleProceed,
  handleDone,
  clientData,
  clientTableData
}) => {
  return (
    <div className="w-screen h-screen">
      <HeaderBar />
      <div className="h-[90%] border-t-2 border-gray-500 flex">
        <div className="w-[50%] h-full pt-5">
          <div className="flex justify-end items-center w-[18rem] h-[5rem] font-bold bg-[#0038A8] rounded-r-[16px]">
            <h1 className="mr-8 text-[1rem] xl:text-[2.5rem] text-white">
              {windowTitle}
            </h1>
          </div>
          <Container className="mt-5">
            <h1 className="mr-8 text-[1.5rem] font-semibold ml-5 text-[#ACACAC]">
              In Queue
            </h1>
            <div className="flex justify-center items-center w-[93%] h-[2px] bg-[#E5E5E5] mt-4 ml-4" />
            <CustomTable
              columns={columns}
              data={clientTableData}
              sx={{
                maxWidth: 850,
                minHeight: 300,
                borderRadius: 4,
                height: 500,
                bgcolor: "white",
                mt: 2,
                ml: 2,
              }}
              renderButton={(row) => {
                return (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "transparent",
                      color: "black",
                      "&:hover": { backgroundColor: "transparent" },
                      boxShadow: "none",
                    }}
                    onClick={() => {
                      console.log("Button clicked for row", row.original);
                    }}
                  >
                    <StartIcon sx={{ color: "black" }} />
                  </Button>
                );
              }}
            />
            <div className="flex justify-end mt-4 mr-10">
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#FEAF00",
                  "&:hover": { bgcolor: "#E9A000" },
                  "&:active": { bgcolor: "forestgreen" },
                  width: "fit-Container",
                }}
                onClick={handleProceed}
                disabled={!!clientData}
              >
                PROCEED
              </Button>
            </div>
          </Container>
        </div>
        <div className="w-[50%] h-full flex justify-start items-end flex-col">
          <div className="w-[80%] h-[100%] bg-[#F4F4F4] mt-5 mr-10 rounded-3xl flex flex-col justify-between">
            <ClientCard clientData={clientData} />
            {/* Action Buttons */}
            <div className="flex justify-end gap-5 mr-10 mb-10">
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#FF8113",
                  "&:hover": { bgcolor: "#FF7700" },
                  "&:active": { bgcolor: "maroon" },
                }}
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                Transfer
              </Button>
              <CustomModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              >
                <ClientTransferModal onClose={() => setIsModalOpen(false)} />
              </CustomModal>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "green",
                  "&:hover": { bgcolor: "darkgreen" },
                  "&:active": { bgcolor: "forestgreen" },
                }}
                onClick={handleDone}
              >
                Done
              </Button>
            </div>
          </div>
          <div className="p-10">
            <Button variant="contained" color="error" onClick={handleLogout}>
              LOGOUT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindowView;
