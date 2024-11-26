import { useState, useEffect } from "react";

interface TimerProps {
  initialTime: number | null;
  onTimeout: () => void;
  isRunning: boolean;
}

export default function Timer({
  initialTime,
  onTimeout,
  isRunning,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(initialTime);
  const [isPaused, setIsPaused] = useState(false);

  // 타이머 동작 제어
  useEffect(() => {
    if (timeLeft === 0) {
      onTimeout(); // 시간이 0이 되면 onTimeout 호출
    }

    let interval: NodeJS.Timeout | undefined;

    if (isRunning && !isPaused && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) =>
          prevTime && prevTime > 0 ? prevTime - 1 : 0
        );
      }, 1000);
    }

    return () => clearInterval(interval); // interval 해제
  }, [timeLeft, isRunning, isPaused]);

  const handlePause = () => {
    setIsPaused(!isPaused); // 일시정지 상태 토글
  };

  useEffect(() => {
    setTimeLeft(initialTime); // 초기 시간이 변경되면 타이머를 다시 설정
  }, [initialTime]);

  // 분:초 형식으로 변환하는 함수
  const formatTime = (time: number | null) => {
    if (time === null) return "Unlimited";
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${formattedSeconds}`;
  };

  return (
    <div>
      {/* 타이머 시간 표시 */}
      <p className="text-lg mb-4">Time Left: {formatTime(timeLeft)}</p>

      {/* 일시정지/재개 버튼 */}
      {timeLeft !== null && (
        <button
          onClick={handlePause}
          className="bg-yellow-500 text-white px-4 py-2 rounded mb-4"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
      )}
    </div>
  );
}
