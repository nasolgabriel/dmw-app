import { useEffect, useState } from "react";
import FirstStepView from "./firstStepView";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ClientInfoFormData, clientInfoSchema } from "./validation";
import calculateAge from "@/hooks/useCalculateAge";
import { useNavigate } from "react-router-dom";

const FirstStepViewBlock: React.FC = () => {
  const [windowTitle, setWindowTitle] = useState("FIRST STEP");
  const [age, setAge] = useState<number | null>(null);
  const navigate = useNavigate();

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

  // Form submission handler
  const onSubmit = (data: ClientInfoFormData) => {
    console.log("Form submitted:", data);

    // Transform the data to match the backend format
    const backendFormattedData = {
      firstname: data.firstName,
      middlename: data.middleName,
      lastname: data.surname,
      contact: data.phoneNumber,
      purpose:
        Array.isArray(data.transactionType) && data.transactionType.length > 0
          ? data.transactionType[0] // Just use the first item if we only allow one selection
          : "",
      age: age,
      sex: data.sex.toLowerCase(),
      status: "in queue",
      passport_number: data.passportNumber,
      address: data.address,
      email: data.email,
      priority: data.priority,
      birthday: data.birthdate
        ? new Date(data.birthdate).toISOString().split("T")[0]
        : null,
    };

    console.log("Backend formatted data:", backendFormattedData);

    // Add API call or data processing logic here
  };

  const resetForm = () => {
    reset();
    setAge(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    navigate("/");
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
