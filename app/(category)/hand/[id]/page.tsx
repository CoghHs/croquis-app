"use client";

import { fetchPoseById, fetchPoses } from "@/lib/constants";
import { useState, useEffect } from "react";
import Timer from "@/components/Timer";
import TimerButton from "@/components/TimerButton";

export default function HandDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [poses, setPoses] = useState<any[]>([]); // 전체 포즈 목록 저장
  const [pose, setPose] = useState<any>(null); // 현재 선택된 포즈
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0); // 현재 포즈의 인덱스
  const [selectedTime, setSelectedTime] = useState<number | null>(null); // 타이머 초기값
  const [isTimerRunning, setIsTimerRunning] = useState(false); // 타이머 시작 상태
  const [isPaused, setIsPaused] = useState(false); // 타이머 일시정지 상태

  // 카테고리별 포즈 목록과 개별 포즈 데이터를 가져오는 함수
  useEffect(() => {
    async function fetchData() {
      const { id } = await params; // 비동기로 params에서 id 추출
      try {
        // 'hand' 카테고리의 포즈 목록 가져오기
        const posesData = await fetchPoses("hand"); // "hand" 카테고리 필터링
        setPoses(posesData.results || []); // 포즈 목록 저장

        // 현재 포즈 인덱스 설정
        const initialIndex = posesData.results.findIndex(
          (pose: any) => pose.id === id
        );
        setCurrentIndex(initialIndex);

        // 개별 포즈 데이터 설정
        const data = await fetchPoseById(id);
        setPose(data); // 현재 포즈 설정
      } catch (error) {
        console.error("Error fetching poses or pose details", error);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    }
    fetchData();
  }, [params]);

  // '다음' 포즈로 이동하는 함수
  const handleNext = () => {
    if (poses.length > 0) {
      const nextIndex = (currentIndex + 1) % poses.length; // 인덱스 순환
      setCurrentIndex(nextIndex); // 인덱스 업데이트
      setPose(poses[nextIndex]); // 포즈 업데이트
      setIsTimerRunning(false); // 타이머 정지
      setSelectedTime(null); // 타이머 초기화
      setIsPaused(false); // 일시정지 상태 해제
    }
  };

  // '이전' 포즈로 이동하는 함수
  const handlePrevious = () => {
    if (poses.length > 0) {
      const prevIndex =
        currentIndex === 0 ? poses.length - 1 : currentIndex - 1;
      setCurrentIndex(prevIndex); // 인덱스 업데이트
      setPose(poses[prevIndex]); // 포즈 업데이트
      setIsTimerRunning(false); // 타이머 정지
      setSelectedTime(null); // 타이머 초기화
      setIsPaused(false); // 일시정지 상태 해제
    }
  };

  // 타이머 시간을 설정하는 함수
  const handleTimeChange = (time: number | null) => {
    setSelectedTime(time);
    setIsTimerRunning(false); // 타이머는 설정만 하고 바로 시작하지 않음
    setIsPaused(false); // 타이머 일시정지 상태 해제
  };

  const startTimer = () => {
    setIsTimerRunning(true); // Start 버튼을 눌러야 타이머 시작
  };

  const formatTime = (time: number | null) => {
    if (time === null) return "Unlimited";
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  if (loading || !pose) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center">
      <img
        src={pose.urls.full}
        alt={pose.alt_description}
        className="w-1/3 h-auto mb-4"
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
          onTimeout={handleNext} // 타이머가 끝나면 다음 포즈로 이동
          isRunning={isTimerRunning}
        />
      )}

      <div className="flex gap-4 mt-4">
        {/* 이전 포즈로 이동하는 버튼 */}
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={handlePrevious}
        >
          Previous
        </button>

        {/* 다음 포즈로 이동하는 버튼 */}
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
