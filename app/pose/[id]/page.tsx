"use client";

import { fetchPoseById } from "@/lib/constants";
import { useState, useEffect } from "react";
import Timer from "@/components/Timer";
import TimerButton from "@/components/TimerButton";

export default function PoseDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [pose, setPose] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [poses, setPoses] = useState<any[]>([]);

  const [selectedTime, setSelectedTime] = useState<number | null>(null); // 타이머 초기값
  const [isTimerRunning, setIsTimerRunning] = useState(false); // 타이머 시작 상태
  const [isPaused, setIsPaused] = useState(false); // 타이머 일시정지 상태

  // 데이터 가져오기
  useEffect(() => {
    async function fetchData() {
      const { id } = await params;
      try {
        const data = await fetchPoseById(id);
        setPoses(data.results);
        setPose(data.results[currentIndex]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching poses:", error);
      }
    }
    fetchData();
  }, [params, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % poses.length);
    setIsTimerRunning(false); // 타이머 정지
    setSelectedTime(null); // 타이머 상태 초기화
    setIsPaused(false); // 일시정지 상태 해제
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? poses.length - 1 : prevIndex - 1
    );
    setIsTimerRunning(false); // 타이머 정지
    setSelectedTime(null); // 타이머 상태 초기화
    setIsPaused(false); // 일시정지 상태 해제
  };

  const handleTimeChange = (time: number | null) => {
    setSelectedTime(time);
    setIsTimerRunning(false); // 타이머는 설정만 하고 바로 시작하지 않음
    setIsPaused(false); // 타이머 일시정지 상태 해제
  };

  const startTimer = () => {
    setIsTimerRunning(true); // Start 버튼을 눌러야 타이머 시작
  };

  // 분:초 형식으로 변환하는 함수
  const formatTime = (time: number | null) => {
    if (time === null) return "Unlimited";
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  if (loading || !pose) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl mb-4">{pose.alt_description || "Pose Detail"}</h1>
      <img
        src={pose.urls.full}
        alt={pose.alt_description}
        className="w-1/2 h-auto mb-4"
      />

      {/* 타이머 설정 버튼 */}
      <div className="mb-4">
        <TimerButton time={60} label="1 Min" onClick={handleTimeChange} />
        <TimerButton time={180} label="3 Min" onClick={handleTimeChange} />
        <TimerButton time={300} label="5 Min" onClick={handleTimeChange} />
        <TimerButton time={600} label="10 Min" onClick={handleTimeChange} />
        <TimerButton time={null} label="Unlimited" onClick={handleTimeChange} />
      </div>

      {/* 선택된 타이머 시간 표시 및 Start 버튼 */}
      {selectedTime !== null && !isTimerRunning && (
        <div className="flex flex-col items-center mb-4">
          <p className="text-lg">Selected Time: {formatTime(selectedTime)}</p>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            onClick={startTimer}
          >
            Start
          </button>
        </div>
      )}

      {/* 타이머가 시작되면 실행 */}
      {isTimerRunning && (
        <Timer
          initialTime={selectedTime}
          onTimeout={handleNext}
          isRunning={isTimerRunning}
        />
      )}

      <div className="flex gap-4">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
