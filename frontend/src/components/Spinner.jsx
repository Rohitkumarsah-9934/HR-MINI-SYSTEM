const Spinner = ({ size = "md" }) => {
  const s = size === "sm" ? "w-5 h-5 border-2" : "w-10 h-10 border-4";
  return (
    <div className="flex justify-center py-10">
      <div className={`${s} border-blue-600 border-t-transparent rounded-full animate-spin`} />
    </div>
  );
};

export default Spinner;
