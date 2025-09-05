import { RxCross2 } from "react-icons/rx";
import { IoWarningOutline } from "react-icons/io5";

const DeleteConfirmation = ({ handleDelete, customerId, customer }) => {
  // Delete Customer Data From Database.
  const deleteCustomer = async () => {
    handleDelete();
    try {
      const res = await fetch(
        `http://localhost:5000/api/customers/${customerId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <section className="fixed inset-0 z-50 flex items-center justify-center text-black">
        <div
          onClick={handleDelete}
          className="absolute inset-0 bg-black/70"
        ></div>
        <section className="relative bg-white rounded shadow-lg max-w-3xl w-full mx-4 p-5 overflow-auto">
          <button
            type="button"
            onClick={handleDelete}
            className="absolute top-1 right-0 px-3 py-1"
          >
            <RxCross2 size={25} />
          </button>
          <h2 className="text-lg flex gap-2 items-center font-semibold text-red-600">
            <IoWarningOutline />
            Confirm Deletion
          </h2>
          <p className="mt-5 text-gray-600">
            Are you sure you want to delete{" "}
            <span className="text-black font-semibold">
              {customer[0].lastName}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="bg-red-300/20 p-4 rounded border border-red-200 mt-5">
            <p className="text-red-500">
              <span className="text-red-600 font-bold">Warning:</span> This will
              permanently remove the customer and all associated data from the
              system.
            </p>
          </div>
          <div className="flex justify-end gap-4 mt-5">
            <button
              onClick={handleDelete}
              className="py-2 px-4 border-1 border-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={deleteCustomer}
              className="bg-red-600 py-2 px-4 text-white rounded hover:bg-red-700"
            >
              Delete Customer
            </button>
          </div>
        </section>
      </section>
    </>
  );
};

export default DeleteConfirmation;
