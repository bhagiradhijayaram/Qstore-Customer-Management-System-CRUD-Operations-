const CustomerTable = ({
  customersData,
  handleDelete,
  handleRead,
  handleUpdate,
}) => {
  return (
    <>
      {/* Customer Data */}
      <section className="w-full overflow-x-auto rounded shadow">
        <table className="w-full text-base min-w-[600px]">
          <thead>
            <tr>
              <th className="border-b border-gray-200 px-2 py-2 md:px-4 md:py-2 text-xs md:text-base text-left">
                First Name
              </th>
              <th className="border-b border-gray-200 px-2 py-2 md:px-4 md:py-2 text-xs md:text-base text-left">
                Last Name
              </th>
              <th className="border-b border-gray-200 px-2 py-2 md:px-4 md:py-2 text-xs md:text-base text-left">
                Email
              </th>
              <th className="border-b border-gray-200 px-2 py-2 md:px-4 md:py-2 text-xs md:text-base text-left">
                Phone
              </th>
              <th className="border-b border-gray-200 px-2 py-2 md:px-4 md:py-2 text-xs md:text-base text-left">
                Address
              </th>
              <th className="border-b border-gray-200 px-2 py-2 md:px-4 md:py-2 text-xs md:text-base text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {customersData.length > 0 ? (
              customersData.map((customer) => (
                <tr key={customer.id} className="relative">
                  <td className="border-b border-gray-200 px-2 py-2 md:px-4 md:py-2 text-xs md:text-base">
                    {customer.firstName}
                  </td>
                  <td className="border-b border-gray-200 px-2 py-2 md:px-4 md:py-2 text-xs md:text-base">
                    {customer.lastName}
                  </td>
                  <td className="border-b border-gray-200 px-2 py-2 md:px-4 md:py-2 text-xs md:text-base">
                    {customer.email}
                  </td>

                  <td className="border-b border-gray-200 px-2 py-2 md:px-4 md:py-2 text-xs md:text-base">
                    {customer.phone}
                  </td>
                  <td className="border-b border-gray-200 px-2 py-2 md:px-4 md:py-2 text-xs md:text-base">
                    {customer.addresses && customer.addresses.length > 0
                      ? `${customer.addresses[0].city}, ${customer.addresses[0].state}, ${customer.addresses[0].PINCode}, ${customer.addresses[0].country}`
                      : "N/A"}
                  </td>

                  <td className="border-b border-gray-200 px-2 py-2 md:px-4 md:py-2 text-xs md:text-base">
                    <div className="flex gap-2 justify-start items-start">
                      <button
                        className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        onClick={() => handleRead(customer.id)}
                      >
                        R
                      </button>
                      <button
                        className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        onClick={() => handleUpdate(customer.id)}
                      >
                        U
                      </button>
                      <button
                        className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        onClick={() => handleDelete(customer.id)}
                      >
                        D
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="border px-2 py-2 text-center">
                  <div>
                    The data you are looking for could not be found at the
                    moment
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default CustomerTable;
