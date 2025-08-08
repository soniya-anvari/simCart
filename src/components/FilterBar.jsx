import { useState } from "react";

export default function FilterBar({ onApply }) {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");

  const resetFilters = () => {
    setSearch("");
    setBrand("");
    setType("");
    onApply({});
  };

  const applyFilters = () => {
    onApply({
      ...(search && { search }),
      ...(brand && { brand }),
      ...(type && { type: +type }),
    });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <input
        type="text"
        placeholder="جستجو شماره یا کد محصول"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 flex-grow min-w-[200px]"
      />
      <select
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2"
      >
        <option value="">انتخاب برند</option>
        <option value="Irancell">Irancell</option>
        <option value="HamrahAval">HamrahAval</option>
      </select>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2"
      >
        <option value="">نوع رندی</option>
        <option value="1">دائمی</option>
        <option value="2">اعتباری</option>
      </select>
      <button
        onClick={applyFilters}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        اعمال فیلتر
      </button>
      <button
        onClick={resetFilters}
        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
      >
        پاک کردن فیلترها
      </button>
    </div>
  );
}
