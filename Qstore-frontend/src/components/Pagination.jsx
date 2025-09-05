// Pagination Logic.
const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  return (
    <>
      <div className="my-4 mx-2 flex flex-col justify-end items-end">
        <div className="flex gap-4">
          <button
            className={`px-3 py-1 rounded 
            ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className="px-2 text-black rounded"
              onClick={() => setCurrentPage(index + 1)}
              style={{
                backgroundColor: currentPage === index + 1 ? "#DDF4E7" : "",
              }}
            >
              {index + 1}
            </button>
          ))}

          <button
            className={`px-3 py-1 rounded 
            ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Pagination;
