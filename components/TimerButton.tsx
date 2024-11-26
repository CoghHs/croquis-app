interface TimerButtonProps {
  time: number | null;
  label: string;
  onClick: (time: number | null) => void;
}

export default function TimerButton({
  time,
  label,
  onClick,
}: TimerButtonProps) {
  return (
    <button
      onClick={() => onClick(time)}
      className="mx-2 p-2 bg-gray-500 text-white rounded"
    >
      {label}
    </button>
  );
}
