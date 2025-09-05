import { useState } from "react";
import Form from "../components/form";

const Home = () => {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  return (
    <>
      <section className="flex flex-col justify-start items-center px-4 bg-[#FBFBFB] h-[91vh]">
        <div className="w-full max-w-7xl">
          <div className="flex flex-col items-end">
            <button
              className="bg-blue-600 p-2 text-white rounded hover:bg-blue-700 my-6"
              onClick={toggleModal}
            >
              + Add Customer
            </button>
          </div>
          {modal && <Form toggleModal={toggleModal} />}
          <h1 className="font-semibold">Hey, Grand Welcome to Qstore!</h1>
          <section className="flex flex-col justify-center items-center h-[70vh]">
            <img
              src="https://res.cloudinary.com/dasvdkncm/image/upload/v1757051895/2085-removebg-preview_tafyeo.png"
              alt=""
              className="w-100"
            />
            <p className="w-full max-w-2xl text-center text-2xl">
              At Qstore, we believe shopping should be simple, exciting, and
              rewarding. Discover exclusive collections, unbeatable prices, and
              a customer-first experience all in one place.
            </p>
          </section>
        </div>
      </section>
    </>
  );
};

export default Home;
