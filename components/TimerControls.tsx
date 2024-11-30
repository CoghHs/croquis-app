import TimerButton from "./TimerButton";

interface TimerControlsPorps {
  handleTimeChange: (time: number | null) => void;
}

export default function TimerControls({
  handleTimeChange,
}: TimerControlsPorps) {
  return (
    <div className="mb-4">
      <TimerButton time={60} label="1 Min" onClick={handleTimeChange} />
      <TimerButton time={180} label="3 Min" onClick={handleTimeChange} />
      <TimerButton time={300} label="5 Min" onClick={handleTimeChange} />
      <TimerButton time={600} label="10 Min" onClick={handleTimeChange} />
      <TimerButton time={null} label="Unlimited" onClick={handleTimeChange} />
    </div>
  );
}
