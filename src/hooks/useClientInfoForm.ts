import {
  ClientInfoFormData,
  clientInfoSchema,
} from "@/app/protected/firstStepView/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import calculateAge from "./useCalculateAge";

const useClientInfoForm = () => {
  const [age, setAge] = useState<number | null>(null);

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

  const birthdate = watch("birthdate");

  useEffect(() => {
    if (birthdate) {
      try {
        const dateObj = new Date(birthdate);

        const utcDate = new Date(
          Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
        );

        const calculatedAge = calculateAge(utcDate);
        console.log("useEffect calculated age:", calculatedAge);

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
      purpose: data.transactionType.join(", "), // Join multiple transaction types
      age: age,
      sex: data.sex.toLowerCase(),
      status: "in queue",
      passport_number: data.passportNumber,
      address: data.address,
      email: data.email,
      priority: data.priority,
      birthday: data.birthdate ? new Date(data.birthdate).toISOString().split('T')[0] : null
    };
    
    // Log the backend-formatted data
    console.log("Backend formatted data:", backendFormattedData);
    
    // Add your API call or data processing logic here
  };

  // Reset form to initial state
  const resetForm = () => {
    reset();
    setAge(null);
  };

  return {
    formState: {
      control,
      errors,
      age,
    },
    handlers: {
      handleSubmit,
      onSubmit,
      setAge,
      resetForm,
    },
  };
};

export default useClientInfoForm;
