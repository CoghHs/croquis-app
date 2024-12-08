import { formatTime } from "@/lib/utils";
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

  // 알림 보내고 소리 재생하는 함수
  const sendNotificationAndSound = () => {
    if (Notification.permission === "granted") {
      // 알림 보내기
      new Notification("타이머 종료!", {
        body: "타이머가 종료되었습니다.",
      });
    } else {
      console.log("알림이 허용되지 않았습니다.");
    }
  };

  // 5초 남았을 때 소리 재생하는 함수
  const playSoundWhenFiveSecondsLeft = () => {
    if (Notification.permission === "granted" && timeLeft === 5) {
      const audio = new Audio("/sounds/alarm.mp3"); // 5초 전용 알림 소리 경로
      audio.play();
    }
  };

  // 타이머 동작 제어
  useEffect(() => {
    if (timeLeft === 0) {
      onTimeout(); // 시간이 0이 되면 onTimeout 호출
      sendNotificationAndSound(); // 타이머 종료 시 알림 보내기 및 소리 재생
    }

    // 5초 남았을 때 소리 재생
    playSoundWhenFiveSecondsLeft();

    let interval: NodeJS.Timeout | undefined;

    if (isRunning && !isPaused && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) =>
          prevTime && prevTime > 0 ? prevTime - 1 : 0
        );
      }, 1000);
    }

    return () => clearInterval(interval); // interval 해제
  }, [timeLeft, isRunning, isPaused, onTimeout]);

  const handlePause = () => {
    setIsPaused(!isPaused); // 일시정지 상태 토글
  };

  useEffect(() => {
    setTimeLeft(initialTime); // 초기 시간이 변경되면 타이머를 다시 설정
  }, [initialTime]);

  // 알림 권한 요청
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      {/* 타이머 시간 표시 */}
      <p className="text-lg mb-4">{formatTime(timeLeft)}</p>

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
