import { useEffect, useState } from "react";
import Image from "next/image";
import dmw_logo from "../../assets/DMW_logo.png";
import bagongPh from "../../assets/BagongPilipinas_logo.png";

const HeaderBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  if (!hasMounted) return null;

  return (
    <div className="flex justify-between h-[10%]">
      <Image
        src={dmw_logo}
        alt={"dmwLogo"}
        className="w-auto h-auto ml-5 p-3"
      />
      <div className="flex justify-end items-center w-full">
        <div className="flex flex-col justfiy-end text-white p-2">
          <div
            id="time"
            className="flex flex-col justify-end items-end text-[#000000] font-bold mr-5"
          >
            <span className="text-[1.5rem] xl:text-[2.5rem]">
              {currentTime.toLocaleTimeString()}
            </span>
            <span className="text-[.5rem] xl:text-[1.5rem] mt-[-10] mb-2">
              {currentTime.toDateString()}
            </span>
          </div>
        </div>
      </div>
      <Image src={bagongPh} alt={"bpLogo"} className="w-auto h-auto mr-5 p-1" />
    </div>
  );
};

export default HeaderBar;
