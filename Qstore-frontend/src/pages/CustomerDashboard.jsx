import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Form from "../components/form";
import CustomerDetails from "../components/CustomerDetails";
import Filter from "../components/Filter";
import Pagination from "../components/Pagination";
import DeleteConfirmation from "../components/DeleteConfirmation";
import CustomerTable from "../components/CustomerTable";

const CustomerDashboard = () => {
  const [modal, setModal] = useState(false);
  const [readModal, setReadModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [deleteCustomer, setDeleteCustomer] = useState();
  const [activeCustomerId, setActiveCustomerId] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const navigate = useNavigate();

  // Getting Customer Data From Database
  const getDataFromServer = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/customers");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Filter Customer Data Fron Database Based on User Actions like Search, and Sort.
  const handleFilter = useCallback(async (filters) => {
    const { search, city, state, sortOrder } = filters;
    console.log("Sending filter params:", filters);
    const res = await fetch(
      `http://localhost:5000/api/customers?search=${search}&city=${city}&state=${state}&sortOrder=${sortOrder}`
    );
    const data = await res.json();
    console.log("Filtered data from server:", data);
    setCustomers(data);
  }, []);

  useEffect(() => {
    getDataFromServer();
  }, []);

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  const handleRead = (id) => {
    setReadModal((prev) => !prev);
    setActiveCustomerId(id);
  };

  const handleUpdate = (id) => {
    const customer = customers.find((c) => c.id === id);
    setEditCustomer(customer);
    setModal(true);
  };

  // Pagination
  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = customers.slice(startIndex, startIndex + itemsPerPage);

  const filterForDelete = (id) => {
    const filterCustomer = currentItems.filter(
      (customer) => customer.id === id
    );
    console.log("Hell", filterCustomer);
    setDeleteCustomer(filterCustomer);
  };

  const handleDelete = async (id) => {
    console.log("Deleting customer with ID:", id);
    setDeleteModal((prev) => !prev);
    setActiveCustomerId(id);
    filterForDelete(id);
  };

  return (
    <>
      <section className="flex flex-col justify-center items-center my-6 px-4">
        <div className="w-full max-w-7xl flex flex-col gap-4 md:flex-row justify-between items">
          <div>
            <h2 className="text-2xl font-semibold">Customer Dashboard</h2>
            <p>Manage your customer database with ease</p>
          </div>
          <div>
            <button
              className="bg-blue-600 p-2 text-white rounded hover:bg-blue-700"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
          </div>
          {modal && (
            <Form
              toggleModal={toggleModal}
              customer={editCustomer}
              refreshCustomers={getDataFromServer}
            />
          )}
          {readModal && (
            <CustomerDetails
              handleRead={handleRead}
              customerId={activeCustomerId}
            />
          )}
          {deleteModal && (
            <DeleteConfirmation
              handleDelete={handleDelete}
              customerId={activeCustomerId}
              customer={deleteCustomer}
            />
          )}
        </div>
        <section className="w-full max-w-7xl mt-6">
          {/* Filter Component */}
          <Filter onFilter={handleFilter} />
          <h3 className="text-xl font-semibold my-4">Customer List</h3>
          <CustomerTable
            customersData={currentItems}
            handleRead={handleRead}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
          />
          {currentItems.length >= 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </section>
      </section>
    </>
  );
};

export default CustomerDashboard;
