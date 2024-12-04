"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { fetchPoses } from "@/lib/constants";
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
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<PosePage>({
      queryKey: ["poses", category],
      queryFn: ({ pageParam = 1 }) =>
        fetchPoses(category as string, 10, pageParam as number),
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return nextPage <= lastPage.totalPages ? nextPage : undefined;
      },
      enabled: !!category,
      initialPageParam: 1,
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
    setSelectedTime(null);
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
    setSelectedTime(time);
    setIsTimerRunning(false);
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

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

      <NavigationButtons
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />

      {/* 다음 페이지 로딩 중일 때 메시지 표시 */}
      {isFetchingNextPage && <p>Loading more poses...</p>}
    </div>
  );
}
