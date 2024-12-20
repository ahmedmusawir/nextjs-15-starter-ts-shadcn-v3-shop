"use client";

import ReactPaginate from "react-paginate";
import { useNumberedPaginationStore } from "@/store/useNumberedPaginationStore";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

const NumberedPagination = () => {
  const { currentPage, totalPages, goToPage } = useNumberedPaginationStore();

  // Handle page change
  const handlePageClick = ({ selected }: { selected: number }) => {
    goToPage(selected + 1); // react-paginate uses zero-based index
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      {/* Mobile View */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          Next
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </p>
        <nav
          aria-label="Pagination"
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
        >
          <ReactPaginate
            previousLabel={
              <ChevronLeftIcon
                aria-hidden="true"
                className={`h-5 w-5 ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500"
                }`}
              />
            }
            nextLabel={
              <ChevronRightIcon
                aria-hidden="true"
                className={`h-5 w-5 ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500"
                }`}
              />
            }
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"flex space-x-2"}
            pageClassName={
              "relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none"
            }
            previousClassName={
              "inline-flex items-center px-4 py-2 text-sm font-medium ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none"
            }
            nextClassName={
              "inline-flex items-center px-4 py-2 text-sm font-medium ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none"
            }
            breakClassName={
              "inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500"
            }
            activeClassName={"z-10 bg-indigo-600 text-white"}
            forcePage={currentPage - 1} // Sync with Zustand
            disableInitialCallback
          />
        </nav>
      </div>
    </div>
  );
};

export default NumberedPagination;
