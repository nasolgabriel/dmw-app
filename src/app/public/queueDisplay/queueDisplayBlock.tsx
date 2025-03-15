import { mockQueueData } from "@/mocks";
import QueueDisplay from "./queueDisplay";


export const QueueDisplayBlock = () => {

    const cashierData = mockQueueData.find((item) => item.type === "cashier");
    const queueData = mockQueueData.find((item) => item.type === "queue");

    return (
        <QueueDisplay
            cashierData={cashierData}
            queueData={queueData}
        />
    );
};

export default QueueDisplayBlock;
