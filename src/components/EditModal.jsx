import { useState, useEffect } from "react";

export default function EditModal({ visible, onClose, simcard, onSave }) {
  const [formData, setFormData] = useState({
    number: "",
    price: "",
    type: "",
    brand: "",
    productCode: "",
  });

  useEffect(() => {
    if (simcard) {
      setFormData({
        number: simcard.number || "",
        price: simcard.price || "",
        type: simcard.type || "",
        brand: simcard.brand || "",
        productCode: simcard.productCode || "",
      });
    }
  }, [simcard]);

  if (!visible) return null;

  const onChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // اعتبارسنجی ساده
    if (!formData.number || !formData.price || !formData.type || !formData.brand || !formData.productCode) {
      alert("تمام فیلدها را پر کنید");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-semibold mb-4">ویرایش سیم‌کارت</h3>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="شماره"
            value={formData.number}
            onChange={(e) => onChange("number", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="number"
            placeholder="قیمت"
            value={formData.price}
            onChange={(e) => onChange("price", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <select
            value={formData.type}
            onChange={(e) => onChange("type", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">نوع رندی</option>
            <option value="1">دائمی</option>
            <option value="2">اعتباری</option>
          </select>
          <input
            type="text"
            placeholder="برند"
            value={formData.brand}
            onChange={(e) => onChange("brand", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="text"
            placeholder="کد محصول"
            value={formData.productCode}
            onChange={(e) => onChange("productCode", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-400 hover:bg-gray-100"
          >
            انصراف
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            ذخیره
          </button>
        </div>
      </div>
    </div>
  );
}
