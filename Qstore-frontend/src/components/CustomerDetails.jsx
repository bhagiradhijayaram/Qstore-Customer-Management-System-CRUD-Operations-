import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoLocationOutline } from "react-icons/io5";

const CustomerDetails = ({ handleRead, customerId }) => {
  console.log("Customer ID in CustomerDetails:", customerId);
  const [specificCustomer, setSpecificCustomer] = useState({});
  const getSpecificCustomer = async (customerId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/customers/${customerId}`
      );
      const data = await response.json();
      console.log("Specific customer data from server:", data);
      setSpecificCustomer(data);
    } catch (error) {
      console.error("Error fetching specific customer data:", error);
    }
  };

  useEffect(() => {
    getSpecificCustomer(customerId);
  }, []);

  let text;
  if (specificCustomer && specificCustomer.addresses) {
    text =
      specificCustomer.addresses.length > 1
        ? "Multi Address Customer"
        : "Single Address Customer";
  }

  useEffect(() => {
    console.log("Updated specificCustomer state:", specificCustomer);
  }, [specificCustomer]);
  return (
    <>
      <section className="fixed inset-0 z-50 flex items-center justify-center text-black">
        <div
          onClick={handleRead}
          className="absolute inset-0 bg-black/70"
        ></div>
        <section className="relative bg-white rounded shadow-lg max-w-3xl w-full mx-4 p-5 h-[500px] overflow-scroll">
          <button
            type="button"
            onClick={handleRead}
            className="absolute top-1 right-0 px-2 py-1"
          >
            <RxCross2 size={25} />
          </button>
          <h3 className="text-xl font-semibold">
            {specificCustomer.firstName} {specificCustomer.lastName}
          </h3>
          <section>
            <section className="border-b border-gray-300 pb-8">
              <h4 className="text-lg font-semibold mt-6 mb-3">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">First Name</span>
                  <span>{specificCustomer.firstName}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Last Name</span>
                  <span>{specificCustomer.lastName}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Email</span>
                  <span>{specificCustomer.email}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Phone</span>
                  <span>{specificCustomer.phone}</span>
                </div>
              </div>
            </section>
            <section className="border-b border-gray-300 pb-4">
              <h4 className="text-lg font-semibold mt-6 mb-3">Addresses</h4>
              {specificCustomer.addresses &&
              specificCustomer.addresses.length > 0 ? (
                specificCustomer.addresses.map((address, index) => (
                  <div>
                    <p className="mb-4 font-semibold flex items-center gap-1">
                      <IoLocationOutline size={18} />
                      Address {index + 1}
                    </p>
                    <div
                      key={address.id}
                      className=" mb-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">Street Address</span>
                        <span>{address.streetAddress}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">City</span>
                        <span>{address.city}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">State</span>
                        <span>{address.state}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">PINCode</span>
                        <span>{address.PINCode}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">Country</span>
                        <span>{address.country}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No addresses available.</p>
              )}
              {specificCustomer &&
              specificCustomer.addresses &&
              specificCustomer.addresses.length > 1 ? (
                <p className="text-blue-600">Multi Address Customer</p>
              ) : (
                <p className="text-green-600">Single Address Customer</p>
              )}
            </section>
            <section>
              <h4 className="text-lg font-semibold mt-6 mb-3">Order History</h4>
              <p>No order history available.</p>
            </section>
          </section>
        </section>
      </section>
    </>
  );
};
export default CustomerDetails;
