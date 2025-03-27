import HeaderBar from "@/components/headerBar/headerBar";
import { Button } from "@mui/material";
import ClientInfoForm from "./ClientForm/clientInfoForm";
import { Control, FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { ClientInfoFormData } from "./validation";

interface FirstStepViewProps {
  formProps: {
    control: Control<ClientInfoFormData>;
    handleSubmit: UseFormHandleSubmit<ClientInfoFormData>;
    errors: FieldErrors<ClientInfoFormData>;
    onSubmit: (data: ClientInfoFormData) => void;
    age: number | null;
    setAge: React.Dispatch<React.SetStateAction<number | null>>;
  };
  windowTitle: string;
  handleLogout: () => void;
}

const FirstStepView: React.FC<FirstStepViewProps> = ({
  formProps,
  windowTitle,
  handleLogout,
}) => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <HeaderBar />
      <div className="flex-1 w-full border-t-2 border-gray-500 flex overflow-y-auto justify-between">
        {/* Left sidebar with title */}
        <div className="h-full pt-5">
          <div className="flex justify-end items-center xl:w-[16rem] h-[5rem] font-bold bg-[#0038A8] rounded-r-[16px]">
            <h1 className="mr-8 md:text-[1rem] lg:text-[1.4rem] xl:text-[2rem] text-white">
              {windowTitle}
            </h1>
          </div>
        </div>
        {/* Main content area with form */}
        <div className="h-full pt-5 flex flex-col justify-stretch items-center xxl:overflow-hidden">
          <ClientInfoForm {...formProps} />
        </div>

        <div className="h-full pt-5 pr-10">
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              padding: ".5rem 1rem",
            }}
          >
            LOGOUT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FirstStepView;
