import { useState, useEffect } from "react";

const FilterEdge = ({ onFilter }) => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (onFilter) {
      onFilter({ search, city, state, sortOrder });
    }
  }, [search, city, state, sortOrder, onFilter]);

  const handleClear = () => {
    setSearch("");
    setCity("");
    setState("");
    setSortOrder("asc");
    if (onFilter) {
      onFilter({ search: "", city: "", state: "", sortOrder: "asc" });
    }
  };

  return (
    <>
      <section>
        <section className="py-4">
          <h2 className="text-xl font-semibold mb-4">Search & Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="mb-2 font-semibold" htmlFor="search">
                Search by Name, Email, or Phone
              </label>
              <input
                type="text"
                id="search"
                className="p-2 border border-gray-300 rounded"
                placeholder="Enter name, email, or phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold" htmlFor="city">
                City
              </label>
              <input
                type="text"
                id="city"
                className="p-2 border border-gray-300 rounded"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold" htmlFor="state">
                State
              </label>
              <input
                type="text"
                id="state"
                className="p-2 border border-gray-300 rounded"
                placeholder="Enter state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold" htmlFor="sortOrder">
                Sort Order
              </label>
              <select
                id="sortOrder"
                className="p-2 border border-gray-300 rounded w-full"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascending (A-Z)</option>
                <option value="desc">Descending (Z-A)</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              onClick={handleClear}
              type="button"
            >
              Clear Filters
            </button>
          </div>
        </section>
      </section>
    </>
  );
};

export default FilterEdge;
