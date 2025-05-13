import React, { useEffect, useState } from "react";
import FirstStepView from "./firstStepView";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ClientInfoFormData, clientInfoSchema } from "./validation";
import calculateAge from "@/hooks/useCalculateAge";
import { useNavigate } from "react-router-dom";
import { useApiCallback } from "@/hooks/useApi";
import { firstStepForm } from "@/types/firstStepForm";
import { clientInfo, getTicketNumber, logoutApi } from "@/api/authApi";
import { toast, ToastContainer } from "react-toastify";
import SubmissionModal from "./SubmissionModal/submissionModal";

const FirstStepViewBlock: React.FC = () => {
  const [windowTitle, setWindowTitle] = useState("FIRST STEP");
  const [age, setAge] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ClientInfoFormData | null>(null);
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

  const { execute: fetchTicketNumber } = useApiCallback(async (id: number) => {
    const ticketNumber = await getTicketNumber(id);
    return ticketNumber;
  });

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

  // This function is called when the form is submitted
  const onSubmit = async (data: ClientInfoFormData) => {
    // Store form data and open the confirmation modal
    setFormData(data);
    setIsModalOpen(true);
  };

  // This function is called when the user confirms the submission in the modal
  const handleConfirmSubmission = async () => {
    if (!formData) return;

    try {
      // Transform the data to match the API interface
      const apiPayload: firstStepForm = {
        firstName: formData.firstName,
        middleName: formData.middleName || null,
        lastName: formData.surname,
        contact: formData.phoneNumber,
        purpose: Array.isArray(formData.transactionType)
          ? formData.transactionType.join(", ")
          : "",
        priority: formData.priority,
        age: age || 0,
        birthday: formData.birthdate
          ? new Date(formData.birthdate).toISOString().split("T")[0]
          : null,
        sex: formData.sex.toLowerCase() as "male" | "female",
        passport_number: formData.passportNumber || null,
        email: formData.email || null,
        address: formData.address || null,
      };

      // Execute the API call
      const result = await submitClientInfo(apiPayload);

      // Ensure result exists
      if (!result) {
        throw new Error("No response from server");
      }

      // Parse the response
      const parsed = typeof result === "string" ? JSON.parse(result) : result;

      // Validate and convert ID to number
      if (!parsed?.id && !parsed?.data?.id) {
        throw new Error("Missing ID in API response");
      }

      const rawId = parsed.id || parsed.data?.id;
      const queueId = Number(rawId);

      // Fetch ticket number with validated numeric ID
      const ticketNumber = await fetchTicketNumber(queueId);

      toast.success(`ASSIGNED NUMBER: ${ticketNumber}`, {
        autoClose: 5000,
        position: "top-center",
        theme: "colored",
      });

      console.log("Ticket Number:", ticketNumber);

      // Close the modal
      setIsModalOpen(false);

      // Optionally reset the form
      // resetForm();
    } catch (error) {
      console.error("Submission failed:", error);
      // Add error state handling here
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const resetForm = () => {
    reset();
    setAge(null);
  };

  const handleLogout = async () => {
    try {
      await executeLogout("Successfully logged out.");
      ["access_token", "role", "window", "division", "counter_id"].forEach(
        (k) => localStorage.removeItem(k)
      );

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <ToastContainer />
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
      <SubmissionModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        handleConfirmSubmission={handleConfirmSubmission}
      />
    </>
  );
};

export default FirstStepViewBlock;
