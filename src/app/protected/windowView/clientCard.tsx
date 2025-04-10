import { currentClientResponse } from "@/types/currentClient";

interface ClientCardProps {
  clientData?: currentClientResponse;
}

const ClientCard: React.FC<ClientCardProps> = ({ clientData }) => {
  // Always create fullName structure, fallback to empty string
  const fullName = [
    clientData?.firstname,
    clientData?.middlename,
    clientData?.lastname,
    clientData?.suffix,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="m-10">
      <div>
        <h2 className="text-xl md:text-1xl xl:text-4xl mb-10">
          Client ID: <span className="font-bold">{clientData?.id || ""}</span>
        </h2>

        {/* Keep all fields visible regardless of data */}
        <p className="mb-2 text-base md:text-sm xl:text-2xl">
          <span className="font-bold">Name:</span> {fullName}
        </p>
        <p className="mb-2 text-base md:text-sm xl:text-2xl">
          <span className="font-bold">Age:</span> {clientData?.age || ""}
        </p>
        <p className="mb-2 text-base md:text-sm xl:text-2xl">
          <span className="font-bold">Sex:</span> {clientData?.sex || ""}
        </p>
        <p className="mb-2 text-base md:text-sm xl:text-2xl">
          <span className="font-bold">Contact Number:</span>{" "}
          {clientData?.contact || ""}
        </p>
        <p className="mb-2 text-base md:text-sm xl:text-2xl">
          <span className="font-bold">Address:</span>{" "}
          {clientData?.address || ""}
        </p>
        <p className="mb-2 text-base md:text-sm xl:text-2xl">
          <span className="font-bold">Email:</span> {clientData?.email || ""}
        </p>
        <p className="mb-2 text-base md:text-sm xl:text-2xl">
          <span className="font-bold">Passport Number:</span>{" "}
          {clientData?.passport_number || ""}
        </p>
        <p className="mb-4 text-base md:text-sm xl:text-2xl">
          <span className="font-bold">Transaction:</span>{" "}
          {clientData?.purpose || ""}
        </p>
        <p className="mb-2 text-sm xl:text-2xl">
          <span className="font-bold">Priority:</span>{" "}
          {clientData?.priority !== undefined
            ? clientData.priority
              ? "Yes"
              : "No"
            : ""}
        </p>
        {/* Uncomment if you want to show status */}
        {/* <p className="mb-2 text-sm xl:text-2xl">
          <span className="font-bold">Status:</span> {clientData?.status || ""}
        </p> */}
      </div>
    </div>
  );
};

export default ClientCard;
