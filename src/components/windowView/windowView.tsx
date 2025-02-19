import { Button, Container } from "@mui/material";
import HeaderBar from "../headerBar/headerBar";
import { useState } from "react";
import { CustomTable } from "../customTable/customTable";
import { data } from "@/mocks/customTableMock";

const WindowView: React.FC = () => {
  const [windowTitle, setWindowTitle] = useState("WINDOW 1");

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
    <div className="w-screen h-screen">
      <>
        <HeaderBar />
      </>
      <div className="h-[90%] border-t-2 border-gray-500 flex">
        <div className="w-[50%] h-full pt-5">
          <div className="flex justify-end items-center w-[18rem] h-[5rem] font-bold bg-[#0038A8] rounded-r-[16px]">
            <h1 className="mr-8 text-[2.5rem] text-white">{windowTitle}</h1>
          </div>
          <Container className=" mt-5">
            <h1 className="mr-8 text-[1.5rem] font-semibold ml-5 text-[#ACACAC]">
              In Queue
            </h1>
            <div className="flex justify-center items-center w-[93%] h-[2px] bg-[#E5E5E5] mt-4 ml-4" />
            <CustomTable
              columns={columns}
              data={data}
              sx={{
                maxWidth: 850,
                borderRadius: 4,
                bgcolor: "white",
                mt: 2,
                ml: 2,
              }}
              renderButton={(row) => {
                const {
                  buttonColor = "#FEAF00",
                  buttonHoverColor = "#E9A000",
                } = row.original as any;
                return (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: buttonColor,
                      color: "white",
                      "&:hover": {
                        backgroundColor: buttonHoverColor,
                      },
                    }}
                    onClick={() => {
                      console.log("Button clicked for row", row.original);
                    }}
                  >
                    Proceed
                  </Button>
                );
              }}
            />
          </Container>
        </div>
        <div className="w-[50%] h-full flex justify-end">
          <div className="w-[80%] h-1/2 bg-[#F4F4F4] mt-5 mr-10 rounded-3xl">
            <div className="m-5">
              {/* Title */}
              <h2 className="text-2xl font-bold mb-3">Client Number: 401</h2>

              {/* Client Info */}
              <p className="mb-1">Name: John Doe</p>
              <p className="mb-1">Age: 22</p>
              <p className="mb-1">Sex: Male</p>
              <p className="mb-1">Transaction: OEC</p>
              <p className="mb-4">Appointment: yes</p>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button className="bg-red-600 text-white px-4 py-2 rounded-md">
                  Back to e-reg
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md">
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindowView;
