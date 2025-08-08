import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  Modal,
  Form,
  InputNumber,
  message,
  ConfigProvider,
  theme,
  Popconfirm,
} from "antd";
import axios from "axios";
import GroupOperationModal from "./GroupOperationModal";

const { Option } = Select;

const simCardTypes = [
  { label: "دائمی", value: 1 },
  { label: "اعتباری", value: 2 },
];

const brands = [
  { label: "همراه اول", value: 1 },
  { label: "ایرانسل", value: 2 },
];
const qualities = [
  { label: "معمولی", value: 1 },
  { label: "عالی", value: 2 },
];
const operators = [
  { label: "0919", value: 1 },
  { label: "0935", value: 2 },
];

// Modal ویرایش و مشاهده جزئیات سیم‌کارت
const EditSimCardModal = ({ visible, onCancel, onSave, loading, simCard }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (simCard) {
      form.setFieldsValue({
        id: simCard.id,
        extraTitle: simCard.extraTitle,
        simCardBrandId: brands.find((b) => b.label === simCard.simCardBrandName)?.value || null,
        pricePerItem: simCard.pricePerItem || 0,
        discountPercentage: simCard.discountPercentage || 0,
        simCardQualityId: qualities.find((q) => q.label === simCard.simCardQualityTitle)?.value || null,
        simCardOperatorId: operators.find((o) => o.value === simCard.simCardOperatorCode)?.value || null,
        simCardStatus: simCard.simCardStatus,
        simCardType: simCard.simCardType,
        basketType: simCard.basketType,
        packImageUrl: simCard.packImageUrl || "",
      });
    } else {
      form.resetFields();
    }
  }, [simCard, form]);

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        onSave(values);
      })
      .catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      title={`ویرایش سیم‌کارت: ${simCard?.extraTitle || ""}`}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText="ذخیره"
      cancelText="انصراف"
      width={600}
    >
      <Form form={form} layout="vertical">
         <Form.Item name="id" style={{ display: "none" }}>
    <Input type="hidden" />
  </Form.Item>
        <Form.Item name="extraTitle" label="عنوان اضافه" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="simCardBrandId"
          label="برند"
          rules={[{ required: true, message: "لطفا برند را انتخاب کنید" }]}
        >
          <Select options={brands} />
        </Form.Item>

        <Form.Item
          name="pricePerItem"
          label="قیمت هر آیتم (تومان)"
          rules={[{ required: true, type: "number", min: 0 }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="discountPercentage"
          label="درصد تخفیف"
          rules={[{ type: "number", min: 0, max: 100 }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="simCardQualityId"
          label="کیفیت"
          rules={[{ required: true, message: "لطفا کیفیت را انتخاب کنید" }]}
        >
          <Select options={qualities} />
        </Form.Item>

        <Form.Item
          name="simCardOperatorId"
          label="اپراتور (پیش‌شماره)"
          rules={[{ required: true, message: "لطفا اپراتور را انتخاب کنید" }]}
        >
          <Select options={operators} />
        </Form.Item>

        <Form.Item
          name="simCardStatus"
          label="وضعیت سیم‌کارت"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: "فعال", value: 1 },
              { label: "غیرفعال", value: 2 },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="simCardType"
          label="نوع رندی"
          rules={[{ required: true }]}
        >
          <Select options={simCardTypes} />
        </Form.Item>

        <Form.Item
          name="basketType"
          label="نوع سبد"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item name="packImageUrl" label="آدرس تصویر پک">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const SimCardTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sorter, setSorter] = useState({});
  const [filters, setFilters] = useState({
    QualityId: null,
    BrandId: null,
    OperatorId: null,
    SimCardType: null,
    ProductCode: "",
    SimCardNumber: "",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // مودال عملیات گروهی
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [groupLoading, setGroupLoading] = useState(false);

  // مودال ویرایش/جزئیات سیم کارت
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [currentSimCard, setCurrentSimCard] = useState(null);

  const fetchData = async (page, pageSize, sorter, filters) => {
  setLoading(true);
  try {
    const params = {
      PageNumber: page,
      PageSize: pageSize,
    };

  
if (filters.BrandId) params.BrandId = filters.BrandId;
if (filters.QualityId) params.QualityId = filters.QualityId;
if (filters.OperatorId) params.OperatorId = filters.OperatorId;
if (filters.ProductCode) params.ProductCode = filters.ProductCode;
    const response = await axios.get(
      `https://oksimapi.hassanvahedi.ir/api/SimBaskets/filtered`,
      { params }
    );

    const result = response.data;

    setData(result.items);
    setPagination((prev) => ({
      ...prev,
      total: result.totalCount,
      current: page,
      pageSize: pageSize,
    }));
  } catch (error) {
    message.error("خطا در دریافت داده‌ها");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize, sorter, filters);
  }, []);

  const handleTableChange = (pag, tableFilters, sorter) => {
    setPagination({
      current: pag.current,
      pageSize: pag.pageSize,
      total: pagination.total,
    });

    setSorter(sorter);
    fetchData(pag.current, pag.pageSize, sorter, filters);
  };

  // تغییر فیلترها
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyFilters = () => {
    fetchData(1, pagination.pageSize, sorter, filters);
  };

  // انتخاب ردیف‌ها
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // عملیات گروهی
  const handleGroupOperationSubmit = async (values) => {
    if (
      !values.pricePerItem &&
      !values.discountPercentage &&
      !values.changeByPercent
    ) {
      message.warning("حداقل یکی از فیلدهای عملیات گروهی باید وارد شود.");
      return;
    }

    setGroupLoading(true);

    let pricePerItem = values.pricePerItem || 0;
    let discountPercentage = values.discountPercentage || 0;

    if (values.changeByPercent) {
      discountPercentage += values.changeByPercent;
      if (discountPercentage < 0) discountPercentage = 0;
      if (discountPercentage > 100) discountPercentage = 100;
    }
 console.log({
        ids: selectedRowKeys,
        pricePerItem,
        discountPercentage,
      })
    try {
      await axios.put("https://oksimapi.hassanvahedi.ir/api/SimBaskets/batch", {
        ids: selectedRowKeys,
        pricePerItem,
        discountPercentage,
      });
     
      message.success("عملیات گروهی با موفقیت انجام شد.");
      setSelectedRowKeys([]);
      setGroupModalVisible(false);
      fetchData(pagination.current, pagination.pageSize, sorter, filters);
    } catch (error) {
        console.log(error)
      message.error("خطا در انجام عملیات گروهی");
    } finally {
      setGroupLoading(false);
    }
  };

  // حذف سیم کارت
  const handleDelete = async (id) => {
    console.log(id)
    try {
      await axios.delete(`https://oksimapi.hassanvahedi.ir/api/SimBaskets/${id}`);
      message.success("سیم‌کارت با موفقیت حذف شد.");
      fetchData(pagination.current, pagination.pageSize, sorter, filters);
    } catch (error) {
      message.error("خطا در حذف سیم‌کارت");
    }
  };

  const openEditModal = (record) => {
    setCurrentSimCard(record);
    setEditModalVisible(true);
  };

  // ذخیره ویرایش
  const handleSaveEdit = async (values) => {
    console.log(values)
    setEditLoading(true);
    try {
      const data=await axios.put(`https://oksimapi.hassanvahedi.ir/api/SimBaskets/${values.id}`, values);
      message.success("ویرایش با موفقیت انجام شد.");
      console.log(data)
      setEditModalVisible(false);
      fetchData(pagination.current, pagination.pageSize, sorter, filters);
    } catch (error) {
      message.error("خطا در ویرایش سیم‌کارت");
      console.log(error)
    } finally {
      setEditLoading(false);
    }
  };

  const columns = [
    {
      title: "شماره سیم‌کارت",
      dataIndex: "extraTitle",
      key: "extraTitle",
      sorter: true,
    },
    {
      title: "قیمت کل (تومان)",
      dataIndex: "price",
      key: "price",
      sorter: true,
      render: (price) => price?.toLocaleString() + " تومان",
    },
    {
      title: "نوع رندی",
      dataIndex: "simCardType",
      key: "simCardType",
      filters: simCardTypes.map((t) => ({ text: t.label, value: t.value })),
      render: (val) => (val === 1 ? "دائمی" : "اعتباری"),
    },
    {
      title: "برند",
      dataIndex: "simCardBrandName",
      key: "simCardBrandName",
      filters: brands.map((b) => ({ text: b.label, value: b.value })),
    },
    {
      title: "کد محصول",
      dataIndex: "productCode",
      key: "productCode",
    },
    {
      title: "عملیات",
      key: "actions",
      fixed: "right",
      width: 180,
      render: (_, record) => (
       
        <Space>
          <Button size="small" onClick={() => openEditModal(record)}>
            مشاهده / ویرایش
          </Button>
          <Popconfirm
            title="آیا از حذف این سیم‌کارت مطمئن هستید؟"
            onConfirm={() => handleDelete(record.id)}
            okText="بله"
            cancelText="خیر"
          >
            <Button size="small" danger>
              حذف
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <div
        style={{
          padding: 20,
          minHeight: "100vh",
          backgroundColor: "#0f1214",
          color: "#fff",
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          {/* فیلترها */}
          <Space wrap style={{ marginBottom: 10 }}>
            
            <Input
              placeholder="جستجو بر اساس کد محصول"
              allowClear
              value={filters.ProductCode}
              onChange={(e) => handleFilterChange("ProductCode", e.target.value)}
              style={{ width: 180 }}
            />
            <Select
              placeholder="انتخاب برند"
              allowClear
              style={{ width: 160 }}
              value={filters.BrandId}
              onChange={(val) => handleFilterChange("BrandId", val)}
              options={brands}
            />
            <Select
              placeholder="انتخاب نوع کیفیت"
              allowClear
              style={{ width: 160 }}
              value={filters.QualityId}
              onChange={(val) => handleFilterChange("QualityId", val)}
              options={qualities}
            />
            <Select
              placeholder="انتخاب پیش‌شماره (اپراتور)"
              allowClear
              style={{ width: 160 }}
              value={filters.OperatorId}
              onChange={(val) => handleFilterChange("OperatorId", val)}
              options={operators}
            />
            
            <Button type="primary" onClick={applyFilters}>
              اعمال فیلترها
            </Button>
          </Space>

          {/* دکمه عملیات گروهی */}
          {selectedRowKeys.length > 0 && (
            <Button
              type="primary"
              danger
              onClick={() => setGroupModalVisible(true)}
              style={{ marginBottom: 10 }}
            >
              عملیات گروهی ({selectedRowKeys.length})
            </Button>
          )}

          <Table
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.id}
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            rowSelection={rowSelection}
            locale={{ emptyText: "موردی یافت نشد" }}
            scroll={{ x: 1000 }}
          />

          <GroupOperationModal
            visible={groupModalVisible}
            onCancel={() => setGroupModalVisible(false)}
            onSubmit={handleGroupOperationSubmit}
            loading={groupLoading}
            selectedCount={selectedRowKeys.length}
          />

          <EditSimCardModal
            visible={editModalVisible}
            onCancel={() => setEditModalVisible(false)}
            onSave={handleSaveEdit}
            loading={editLoading}
            simCard={currentSimCard}
          />
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default SimCardTable;
