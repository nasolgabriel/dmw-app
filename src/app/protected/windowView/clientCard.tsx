import { OnProcessQueue } from "@/mocks";

interface ClientCardProps {
  clientData: OnProcessQueue;
}

const ClientCard: React.FC<ClientCardProps> = ({ clientData }) => {
  return (
    <div className="m-10">
      {/* Title */}
      <div>
      <h2 className="text-xl md:text-1xl xl:text-4xl mb-10">
        Client Number:{" "}
        <span className="font-bold">{clientData.queueNumbers[0]}</span>
      </h2>

      <p className="mb-2 text-base md:text-sm xl:text-2xl">
        <span className="font-bold">Name:</span> {clientData.name}
      </p>
      <p className="mb-2 text-base md:text-sm xl:text-2xl">
        <span className="font-bold">Age:</span> {clientData.age}
      </p>
      <p className="mb-2 text-base md:text-sm xl:text-2xl">
        <span className="font-bold">Sex:</span> {clientData.sex}
      </p>
      <p className="mb-2 text-base md:text-sm xl:text-2xl">
        <span className="font-bold">Contact Number:</span>{" "}
        {clientData.contact}
      </p>
      <p className="mb-2 text-base md:text-sm xl:text-2xl">
        <span className="font-bold">Address:</span> {clientData.address}
      </p>
      <p className="mb-2 text-base md:text-sm xl:text-2xl">
        <span className="font-bold">Email:</span> {clientData.email}
      </p>
      <p className="mb-2 text-base md:text-sm xl:text-2xl">
        <span className="font-bold">Passport Number:</span>{" "}
        {clientData.passportNumber}
      </p>

      <p className="mb-4 text-base md:text-sm xl:text-2xl">
        <span className="font-bold">Appointment:</span>{" "}
        {clientData.appointment ? "Yes" : "No"}
      </p>
      <p className="mb-2 text-sm xl:text-2xl">
        <span className="font-bold">Transaction:</span>{" "}
        {clientData.transaction}
      </p>
      </div>
    </div>
  );
};
export default ClientCard;
