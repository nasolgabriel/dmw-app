import { useEffect, useState } from "react";
import FirstStepView from "./firstStepView";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ClientInfoFormData, clientInfoSchema } from "./validation";
import calculateAge from "@/hooks/useCalculateAge";
import { useNavigate } from "react-router-dom";
import { useApiCallback } from "@/hooks/useApi";
import { firstStepForm } from "@/types/firstStepForm";
import { clientInfo, logoutApi } from "@/api/authApi";

const FirstStepViewBlock: React.FC = () => {
  const [windowTitle, setWindowTitle] = useState("FIRST STEP");
  const [age, setAge] = useState<number | null>(null);
  const navigate = useNavigate();

  const { execute: submitClientInfo, loading } = useApiCallback(
    async (formData: firstStepForm) => {
      const response = await clientInfo(formData);
      return response;
    }
  );

  const { execute: executeLogout } = useApiCallback<string, [string]>(
    logoutApi
  );

  // Initialize form using react-hook-form directly
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ClientInfoFormData>({
    resolver: yupResolver(clientInfoSchema),
    defaultValues: {
      transactionType: [],
      firstName: "",
      middleName: "",
      surname: "",
      suffix: "",
      sex: "",
      passportNumber: "",
      email: "",
      phoneNumber: "",
      address: "",
      priority: false,
      withAppointment: false,
    },
  });

  // Watch birthdate changes
  const birthdate = watch("birthdate");

  // Update age whenever birthdate changes
  useEffect(() => {
    if (birthdate) {
      try {
        const dateObj = new Date(birthdate);
        const utcDate = new Date(
          Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
        );
        const calculatedAge = calculateAge(utcDate);
        setAge(calculatedAge);
      } catch (error) {
        console.error("Error calculating age in useEffect:", error);
        setAge(null);
      }
    } else {
      setAge(null);
    }
  }, [birthdate]);

  const onSubmit = async (data: ClientInfoFormData) => {
    try {
      // Transform the data to match the API interface
      const apiPayload: firstStepForm = {
        firstName: data.firstName,
        middleName: data.middleName || null,
        lastName: data.surname,
        contact: data.phoneNumber,
        purpose: Array.isArray(data.transactionType)
          ? data.transactionType.join(", ")
          : "",
        priority: data.priority,
        age: age || 0,
        birthday: data.birthdate
          ? new Date(data.birthdate).toISOString().split("T")[0]
          : null,
        sex: data.sex.toLowerCase() as "male" | "female",
        passport_number: data.passportNumber || null,
        email: data.email || null,
        address: data.address || null,
      };

      // Execute the API call
      const result = await submitClientInfo(apiPayload);

      console.log("API response:", result);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const resetForm = () => {
    reset();
    setAge(null);
  };

  const handleLogout = async () => {
    try {
      await executeLogout("Successfully logged out.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <FirstStepView
      formProps={{
        control,
        handleSubmit,
        errors,
        onSubmit,
        age,
        setAge,
      }}
      windowTitle={windowTitle}
      handleLogout={handleLogout}
    />
  );
};

export default FirstStepViewBlock;
