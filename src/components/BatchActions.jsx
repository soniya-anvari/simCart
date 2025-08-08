import { useState } from "react";

export default function BatchActions({ selectedIds, onBatchUpdate }) {
  const [price, setPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [isPriceChange, setIsPriceChange] = useState(true);

  const handleSubmit = () => {
    if (selectedIds.length === 0) return alert("ابتدا سیم‌کارت‌ها را انتخاب کنید");
    if (!price && !discountPercent) return alert("مقداری وارد کنید");

    let payload = {};
    if (isPriceChange && price) {
      payload.priceChange = Number(price);
    } else if (!isPriceChange && discountPercent) {
      payload.discountPercent = Number(discountPercent);
    }

    onBatchUpdate(payload);

    setPrice("");
    setDiscountPercent("");
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          checked={isPriceChange}
          onChange={() => setIsPriceChange(true)}
        />
        تغییر قیمت
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          checked={!isPriceChange}
          onChange={() => setIsPriceChange(false)}
        />
        تغییر درصد تخفیف
      </label>

      {isPriceChange ? (
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="مقدار تغییر قیمت"
          className="border border-gray-300 rounded-md px-3 py-2 w-48"
        />
      ) : (
        <input
          type="number"
          value={discountPercent}
          onChange={(e) => setDiscountPercent(e.target.value)}
          placeholder="درصد تخفیف"
          className="border border-gray-300 rounded-md px-3 py-2 w-48"
        />
      )}

      <button
        onClick={handleSubmit}
        disabled={selectedIds.length === 0}
        className={`px-4 py-2 rounded-md text-white ${
          selectedIds.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        اعمال
      </button>
    </div>
  );
}
