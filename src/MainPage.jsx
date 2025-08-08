import { useState } from "react";
import { ConfigProvider, theme } from "antd";
import {
  fetchSimcardsFiltered,
  batchUpdateSimcards,
  updateSimcard,
  deleteSimcard,
} from "./api";
import FilterBar from "./components/FilterBar";
import SimCardTable from "./components/SimCardTable";
import BatchActions from "./components/BatchActions";
import EditModal from "./components/EditModal";
import LoadingSpinner from "./components/LoadingSpinner";

export default function SimCardPage() {
  const [filters, setFilters] = useState({});
  const [simcards, setSimcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingSimcard, setEditingSimcard] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleBatchUpdate = async (updatePayload) => {
    if (selectedIds.length === 0) {
      alert("ابتدا سیم‌کارت‌ها را انتخاب کنید");
      return;
    }
    setLoading(true);
    try {
      await batchUpdateSimcards({ simCardIds: selectedIds, ...updatePayload });
      alert("عملیات با موفقیت انجام شد");
    } catch {
      alert("خطا در عملیات گروهی");
    }
    setLoading(false);
  };

  const handleEditSave = async (data) => {
    setLoading(true);
    try {
      await updateSimcard(editingSimcard.id, data);
      alert("ویرایش با موفقیت انجام شد");
      setEditModalVisible(false);
      setEditingSimcard(null);
    } catch {
      alert("خطا در ویرایش");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteSimcard(id);
      alert("حذف با موفقیت انجام شد");
    } catch {
      alert("خطا در حذف");
    }
    setLoading(false);
  };

  const handleEdit = (simcard) => {
    setEditingSimcard(simcard);
    setEditModalVisible(true);
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div
        className=" mx-auto p-6 min-h-screen"
        style={{ backgroundColor: "#0f1214", color: "#fff" }}
      >
        <h1 className="text-3xl mb-6 font-bold">مدیریت سیم‌کارت‌ها</h1>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <SimCardTable
            filters={filters}
            setFilters={setFilters}
            simcards={simcards}
            setSimcards={setSimcards}
            loading={loading}
            setLoading={setLoading}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        <EditModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          simcard={editingSimcard}
          onSave={handleEditSave}
        />
     
      </div>
    </ConfigProvider>
  );
}
