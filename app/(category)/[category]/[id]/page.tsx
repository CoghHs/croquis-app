"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { fetchPoses, fetchRandomPoses } from "@/lib/constants";
import Timer from "@/components/Timer";
import Image from "next/image";
import TimerControls from "@/components/TimerControls";
import NavigationButtons from "@/components/NavigationButton";
import { useInfiniteQuery } from "@tanstack/react-query";

interface PosePage {
  results: PoseProps[];
  totalPages: number; // 전체 페이지 수
}

interface PoseProps {
  id: string;
  urls: {
    full: string;
  };
  alt_description: string;
}

export default function PoseDetail() {
  const pathname = usePathname();
  const pathParts = pathname?.split("/");

  const category = pathParts ? pathParts[1] : undefined;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<number>(60); // 기본 시간 1분(60초)으로 설정
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<PosePage>({
      queryKey: ["poses", category],
      queryFn: ({ pageParam = 1 }) => fetchRandomPoses(category as string, 10), // pageParam을 받지 않고 랜덤 페이지 요청
      getNextPageParam: (lastPage, allPages) => {
        // 랜덤 페이지 처리: 각 페이지마다 새로운 랜덤 페이지를 요청
        const nextPage = Math.floor(Math.random() * lastPage.totalPages) + 1;
        return nextPage <= lastPage.totalPages ? nextPage : undefined;
      },

      enabled: !!category,
      initialPageParam: 1, // 첫 페이지 시작
    });
  const poses = data?.pages.flatMap((page) => page.results) || [];
  const pose = poses[currentIndex];

  // 8번째나 9번째에 도달했을 때 미리 다음 페이지 로드
  useEffect(() => {
    if (currentIndex >= poses.length - 2 && hasNextPage) {
      fetchNextPage();
    }
  }, [currentIndex, poses.length, hasNextPage, fetchNextPage]);

  // 타이머 초기화 함수
  const resetTimer = () => {
    setIsTimerRunning(false);
    setSelectedTime(60); // 리셋 시에도 기본 시간을 1분으로 설정
  };

  const handleNext = () => {
    if (currentIndex === poses.length - 1 && hasNextPage) {
      fetchNextPage();
    } else {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % poses.length);
    }
    resetTimer();
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? poses.length - 1 : prevIndex - 1
    );
    resetTimer();
  };

  const handleTimeChange = (time: number | null) => {
    setSelectedTime(time ?? 60); // 타이머 변경 시에도 기본 시간을 1분으로 설정
    setIsTimerRunning(false);
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  if (isLoading || !pose) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center">
      <Image
        src={pose.urls.full}
        alt={pose.alt_description}
        width={500}
        height={500}
        className="w-1/4 h-1/4 mb-4"
      />

      <TimerControls handleTimeChange={handleTimeChange} />

      {selectedTime !== null && !isTimerRunning && (
        <div className="flex flex-col items-center mb-4">
          <p className="text-lg">Selected Time: {selectedTime / 60} Min</p>
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

      <NavigationButtons
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />

      {/* 다음 페이지 로딩 중일 때 메시지 표시 */}
      {isFetchingNextPage && <p>Loading more poses...</p>}
    </div>
  );
}
