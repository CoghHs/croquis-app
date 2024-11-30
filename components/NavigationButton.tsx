interface NavigationButtonsProps {
  handlePrevious: () => void;
  handleNext: () => void;
}

export default function NavigationButtons({
  handlePrevious,
  handleNext,
}: NavigationButtonsProps) {
  return (
    <div className="flex gap-4 mt-4">
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded"
        onClick={handlePrevious}
      >
        Prev
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
}
