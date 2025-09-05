import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const Form = ({ toggleModal, customer, refreshCustomers }) => {
  const [errors, setErrors] = useState({});
  const [addresses, setAddresses] = useState([
    { streetAddress: "", city: "", state: "", PINCode: "", country: "" },
  ]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e, index) => {
    const { name, value } = e.target;
    setAddresses((prev) => {
      const updated = [...prev];
      updated[index][name] = value;
      return updated;
    });
  };

  const addAddress = () => {
    if (addresses.length < 3) {
      setAddresses([
        ...addresses,
        { streetAddress: "", city: "", state: "", PINCode: "", country: "" },
      ]);
    } else {
      alert("You can only add up to 3 address details.");
    }
  };

  const removeAddress = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
  };

  // Form Validation
  const formValidation = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const pinCodeRegex = /^\d{6}$/;

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "A valid email address is required";
    }

    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = "A valid 10-digit phone number is required";
    }

    addresses.forEach((adr, i) => {
      if (!adr.streetAddress) {
        newErrors[
          `streetAddress-${i}`
        ] = `Street Address is required for address ${i + 1}`;
      }
      if (!adr.city) {
        newErrors[`city-${i}`] = `City is required for address ${i + 1}`;
      }
      if (!adr.state) {
        newErrors[`state-${i}`] = `State is required for address ${i + 1}`;
      }
      if (!adr.PINCode || !pinCodeRegex.test(adr.PINCode)) {
        newErrors[
          `PINCode-${i}`
        ] = `Valid 6-digit PIN Code required for address ${i + 1}`;
      }
      if (!adr.country) {
        newErrors[`country-${i}`] = `Country is required for address ${i + 1}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
      });
      setAddresses(
        customer.addresses || [
          { streetAddress: "", city: "", state: "", PINCode: "", country: "" },
        ]
      );
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });
      setAddresses([
        { streetAddress: "", city: "", state: "", PINCode: "", country: "" },
      ]);
    }
  }, [customer]);

  // Sending Data to The Database and Updating Existing Data
  const addCustomerHandler = async (e) => {
    e.preventDefault();
    const isValid = formValidation();
    if (!isValid) return;

    const finalData = { ...formData, addresses };
    const method = customer ? "PUT" : "POST";
    const url = customer
      ? `http://localhost:5000/api/customers/${customer.id}`
      : "http://localhost:5000/api/customers";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      await response.json();
      refreshCustomers();
      toggleModal();
    } catch (error) {
      console.error("Error:", error);
    }
    navigate("/customer-dashboard");
  };
  return (
    <>
      <section className="fixed inset-0 z-50 flex items-center justify-center text-black">
        <div
          onClick={toggleModal}
          className="absolute inset-0 bg-black/70"
        ></div>

        <form
          className="relative bg-white rounded shadow-lg max-w-3xl w-full mx-4 p-5 h-[600px] overflow-scroll"
          onSubmit={addCustomerHandler}
        >
          <button
            type="button"
            onClick={toggleModal}
            className="absolute top-1 right-3 px-3 py-1"
          >
            <RxCross2 size={25} />
          </button>
          <h3 className="text-xl font-semibold">
            {customer ? "Update Customer" : "Add New Customer"}
          </h3>
          <section className="bg-white border-1 border-gray-300 my-5 p-4">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 my-5 gap-5">
              <div className="flex flex-col">
                <label className="mb-2">First Name *</label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputs}
                  className="outline-none bg-gray-300/10 p-3 rounded-md border-1 border-gray-300"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputs}
                  placeholder="Enter last name"
                  className="outline-none bg-gray-300/10 p-3 rounded-md border-1 border-gray-300"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col my-5">
              <label className="mb-2">Email Address *</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputs}
                placeholder="Enter email address"
                className="outline-none bg-gray-300/10 p-3 rounded-md border-1 border-gray-300"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="flex flex-col my-5">
              <label className="mb-2">Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputs}
                placeholder="Enter phone number"
                className="outline-none bg-gray-300/10 p-3 rounded-md border-1 border-gray-300"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </section>
          <section className="bg-white border-1 border-gray-300 p-4">
            <h2 className="text-lg font-semibold">Address Information</h2>

            {addresses.map((adr, index) => (
              <div key={index}>
                <div className="flex flex-col my-5">
                  <label className="mb-2">Street Address *</label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={adr.streetAddress}
                    onChange={(e) => handleAddressChange(e, index)}
                    placeholder="Enter street address"
                    className="outline-none bg-gray-300/10 p-3 rounded-md border-1 border-gray-300"
                  />
                  {errors[`streetAddress-${index}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[`streetAddress-${index}`]}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 my-5 gap-5">
                  <div className="flex flex-col">
                    <label className="mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={adr.city}
                      onChange={(e) => handleAddressChange(e, index)}
                      placeholder="Enter city"
                      className="outline-none bg-gray-300/10 p-3 rounded-md border-1 border-gray-300"
                    />
                    {errors[`city-${index}`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`city-${index}`]}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={adr.state}
                      onChange={(e) => handleAddressChange(e, index)}
                      placeholder="Enter state"
                      className="outline-none bg-gray-300/10 p-3 rounded-md border-1 border-gray-300"
                    />
                    {errors[`state-${index}`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`state-${index}`]}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2">PIN Code *</label>
                    <input
                      type="text"
                      name="PINCode"
                      value={adr.PINCode}
                      onChange={(e) => handleAddressChange(e, index)}
                      placeholder="Enter PIN code"
                      className="outline-none bg-gray-300/10 p-3 rounded-md border-1 border-gray-300"
                    />
                    {errors[`PINCode-${index}`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`PINCode-${index}`]}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2">Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={adr.country}
                      onChange={(e) => handleAddressChange(e, index)}
                      placeholder="Enter country"
                      className="outline-none bg-gray-300/10 p-3 rounded-md border-1 border-gray-300"
                    />
                    {errors[`country-${index}`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`country-${index}`]}
                      </p>
                    )}
                  </div>
                </div>
                {addresses.length > 1 && index > 0 && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeAddress(index)}
                      className="text-red-600 font-semibold mb-5 text-center"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addAddress}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              + Add Another Address
            </button>
          </section>
          <div className="mt-5 flex flex-col justify-end items-end">
            <div className="flex gap-5">
              <button
                onClick={toggleModal}
                className="py-2 px-4 border-1 border-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 py-2 px-4 text-white rounded hover:bg-blue-700"
                type="submit"
              >
                {customer ? "Update Customer" : "Add Customer"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default Form;
