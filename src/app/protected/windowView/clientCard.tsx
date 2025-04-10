import { currentClientResponse } from "@/types/currentClient";

interface ClientCardProps {
  clientData?: currentClientResponse;
}

const ClientCard: React.FC<ClientCardProps> = ({ clientData }) => {
  const fullName = clientData
    ? [
        clientData.firstname,
        clientData.middlename,
        clientData.lastname,
        clientData.suffix,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <div className="m-10">
      <h2 className="text-xl md:text-1xl xl:text-4xl mb-10">
        Client ID:{" "}
        <span className="font-bold">{clientData ? clientData.id : ""}</span>
      </h2>

      <p className="mb-2 text-base md:text-sm xl:text-2xl">
        <span className="font-bold">Name:</span> {fullName}
      </p>
      <p className="mb-2 text-base md:text-sm xl:text-2xl">
        <span className="font-bold">Age:</span>{" "}
        {clientData ? clientData.age : ""}
      </p>
      <p className="mb-2 text-base md:text-sm xl:text-2xl">
        <span className="font-bold">Sex:</span> a
        {clientData ? clientData.sex : ""}
      </p>
      <p className="mb-2 text-base md:text-sm xl:text-2xl">
        <span className="font-bold">Contact:</span>{" "}
        {clientData ? clientData.contact : ""}
      </p>
      <p className="mb-2 text-base md:text-sm xl:text-2xl">
        <span className="font-bold">Address:</span>{" "}
        {clientData ? clientData.address : ""}
      </p>
      <p className="mb-2 text-base md:text-sm xl:text-2xl">
        <span className="font-bold">Email:</span>{" "}
        {clientData ? clientData.email : ""}
      </p>
      <p className="mb-2 text-base md:text-sm xl:text-2xl">
        <span className="font-bold">Passport:</span>{" "}
        {clientData ? clientData.passport_number : ""}
      </p>
      <p className="mb-2 text-base md:text-sm xl:text-2xl">
        <span className="font-bold">Purpose:</span>{" "}
        {clientData ? clientData.purpose : ""}
      </p>
      <p className="mb-2 text-base md:text-sm xl:text-2xl">
        <span className="font-bold">Priority:</span>{" "}
        {clientData ? (clientData.priority ? " Yes" : " No") : ""}
      </p>
      <p className="mb-2 text-base md:text-sm xl:text-2xl">
        <span className="font-bold">Status:</span>{" "}
        {clientData ? clientData.status : ""}
      </p>
    </div>
  );
};

export default ClientCard;
