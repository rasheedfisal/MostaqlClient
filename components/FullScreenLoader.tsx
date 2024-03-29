import { BounceLoader } from "react-spinners";
const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-2xl font-semibold text-white bg-white">
      <BounceLoader size={50} color="#8b8d8d" speedMultiplier={3} />
    </div>
  );
};

export default FullScreenLoader;
