"use client"; // 클라이언트 컴포넌트로 설정

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // usePathname 임포트
import { fetchPoses, fetchPoseById } from "@/lib/constants";
import Timer from "@/components/Timer";
import TimerButton from "@/components/TimerButton";

export default function PoseDetail() {
  const pathname = usePathname(); // 현재 경로를 가져옴
  const pathParts = pathname?.split("/"); // 경로를 "/"로 분리

  // category와 id를 URL에서 추출
  const category = pathParts ? pathParts[1] : undefined;
  const id = pathParts ? pathParts[2] : undefined;

  const [poses, setPoses] = useState<any[]>([]);
  const [pose, setPose] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (!category || !id) return; // category나 id가 없는 경우 처리

    async function fetchData() {
      try {
        // category를 기반으로 전체 포즈 목록을 가져옴
        const posesData = await fetchPoses(category as string); // category가 string 타입이므로 캐스팅
        setPoses(posesData.results || []);

        // 해당 ID의 포즈 데이터를 가져옴
        const initialPose = await fetchPoseById(id as string);
        setPose(initialPose);

        // 해당 포즈의 인덱스 설정
        const initialIndex = posesData.results.findIndex(
          (pose: any) => pose.id === id
        );
        setCurrentIndex(initialIndex);
      } catch (error) {
        console.error("Error fetching poses or pose details", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [category, id]); // category와 id가 바뀔 때마다 새로 데이터를 fetch

  const handleNext = () => {
    if (poses.length > 0) {
      const nextIndex = (currentIndex + 1) % poses.length;
      setCurrentIndex(nextIndex);
      setPose(poses[nextIndex]);
      setIsTimerRunning(false);
      setSelectedTime(null);
    }
  };

  const handlePrevious = () => {
    if (poses.length > 0) {
      const prevIndex =
        currentIndex === 0 ? poses.length - 1 : currentIndex - 1;
      setCurrentIndex(prevIndex);
      setPose(poses[prevIndex]);
      setIsTimerRunning(false);
      setSelectedTime(null);
    }
  };

  const handleTimeChange = (time: number | null) => {
    setSelectedTime(time);
    setIsTimerRunning(false);
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  if (loading || !pose) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center">
      <img
        src={pose.urls.full}
        alt={pose.alt_description}
        className="w-1/3 h-auto mb-4"
      />

      <div className="mb-4">
        <TimerButton time={60} label="1 Min" onClick={handleTimeChange} />
        <TimerButton time={180} label="3 Min" onClick={handleTimeChange} />
        <TimerButton time={300} label="5 Min" onClick={handleTimeChange} />
        <TimerButton time={600} label="10 Min" onClick={handleTimeChange} />
        <TimerButton time={null} label="Unlimited" onClick={handleTimeChange} />
      </div>

      {selectedTime !== null && !isTimerRunning && (
        <div className="flex flex-col items-center mb-4">
          <p className="text-lg">Selected Time: {selectedTime}</p>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            onClick={startTimer}
          >
            Start
          </button>
        </div>
      )}

      {isTimerRunning && (
        <Timer
          initialTime={selectedTime}
          onTimeout={handleNext}
          isRunning={isTimerRunning}
        />
      )}

      <div className="flex gap-4 mt-4">
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
