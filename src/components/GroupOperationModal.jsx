import React from "react";
import { Modal, Form, InputNumber, Button, Space } from "antd";

const GroupOperationModal = ({ visible, onCancel, onSubmit, loading, selectedCount }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
      })
      .catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      title={`عملیات گروهی روی ${selectedCount} سیم‌کارت`}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText="اعمال تغییرات"
      cancelText="انصراف"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="pricePerItem"
          label="قیمت جدید هر آیتم (تومان)"
          rules={[
            {
              type: "number",
              min: 0,
              message: "قیمت باید عدد مثبت باشد",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} placeholder="در صورت نیاز وارد کنید" />
        </Form.Item>

        <Form.Item
          name="discountPercentage"
          label="درصد تخفیف جدید"
          rules={[
            {
              type: "number",
              min: 0,
              max: 100,
              message: "درصد تخفیف باید بین ۰ تا ۱۰۰ باشد",
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="در صورت نیاز وارد کنید"
            min={0}
            max={100}
          />
        </Form.Item>

        <Form.Item
          name="changeByPercent"
          label="تغییر درصد تخفیف به مقدار عددی"
          tooltip="مثبت برای افزایش، منفی برای کاهش"
          rules={[
            {
              type: "number",
              min: -100,
              max: 100,
              message: "مقدار باید بین -100 تا 100 باشد",
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="برای افزایش یا کاهش درصد تخفیف"
            min={-100}
            max={100}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GroupOperationModal;
