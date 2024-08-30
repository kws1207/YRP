import { isInstalled, getAddress } from "@gemwallet/api";
import Chart from "./components/Chart";
import mockData from "./assets/MockData.json";
import { DataPoint } from "./types";
import { useState } from "react";

export default function App() {
  const transformedData: DataPoint[] = mockData.map((item) => ({
    ...item,
    Type: item.Type as "Past" | "Future",
  }));

  const [address, setAddress] = useState<string | null>(null);

  const handleConnect = async () => {
    const response = await isInstalled();
    if (response.result.isInstalled) {
      const addressResponse = await getAddress();
      if (addressResponse.result?.address) {
        setAddress(addressResponse.result?.address);
      }
    } else {
      alert("Please install Gem Wallet.");
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
  };

  return (
    <div className="bg-black w-screen flex flex-col items-center justify-center">
      <div className="w-full p-6 flex flex-row items-center justify-end">
        {address ? (
          <button onClick={handleDisconnect}>Disconnect</button>
        ) : (
          <button onClick={handleConnect}>Connect Wallet</button>
        )}
      </div>
      <Chart data={transformedData} />
    </div>
  );
}
