// TimerController.tsx
interface TimerControlsPorps {
  handleTimeChange: (time: number | null) => void;
}

export default function TimerControls({
  handleTimeChange,
}: TimerControlsPorps) {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTime =
      event.target.value === "null" ? null : Number(event.target.value);
    handleTimeChange(selectedTime);
  };

  return (
    <div className="mb-4">
      <select
        onChange={handleSelectChange}
        className="py-2 bg-gray-500 text-white rounded"
      >
        <option value={60}>1 Min</option>
        <option value={180}>3 Min</option>
        <option value={300}>5 Min</option>
        <option value={600}>10 Min</option>
        <option value={900}>15 Min</option>
        <option value="null">Unlimited</option>
      </select>
    </div>
  );
}
