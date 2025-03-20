import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, TimePicker, DatePicker, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import classScheduleService from "../services/classScheduleService";
import dayjs from "dayjs";

const { Option } = Select;

const ClassSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const res = await classScheduleService.getAllSchedules();
      setSchedules(res.data);
    } catch (error) {
      message.error("Lỗi tải lịch học!");
    }
  };

  const showModal = (schedule = null) => {
    if (schedule) {
      setEditingId(schedule.id);
      form.setFieldsValue({
        ...schedule,
        fixedStartTime: dayjs(schedule.fixedStartTime, "HH:mm"),
        registrationStart: dayjs(schedule.registrationStart),
        registrationEnd: dayjs(schedule.registrationEnd),
        courseStart: dayjs(schedule.courseStart),
        courseEnd: dayjs(schedule.courseEnd),
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await classScheduleService.deleteSchedule(id);
      message.success("Xóa thành công!");
      loadSchedules();
    } catch (error) {
      message.error("Không thể xóa lịch học!");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        fixedStartTime: values.fixedStartTime.format("HH:mm"),
        registrationStart: values.registrationStart.format("YYYY-MM-DD"),
        registrationEnd: values.registrationEnd.format("YYYY-MM-DD"),
        courseStart: values.courseStart.format("YYYY-MM-DD"),
        courseEnd: values.courseEnd.format("YYYY-MM-DD"),
      };

      if (editingId) {
        await classScheduleService.updateSchedule(editingId, payload);
        message.success("Cập nhật thành công!");
      } else {
        await classScheduleService.createSchedule(payload);
        message.success("Thêm lịch học thành công!");
      }

      setIsModalVisible(false);
      loadSchedules();
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu lịch học!");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Lớp", dataIndex: ["classEntity", "name"], key: "classEntity" },
    { title: "Giờ bắt đầu", dataIndex: "fixedStartTime", key: "fixedStartTime" },
    { title: "Số tiết/tuần", dataIndex: "lessonsPerWeek", key: "lessonsPerWeek" },
    { title: "Ngày đăng ký", dataIndex: "registrationStart", key: "registrationStart" },
    { title: "Ngày kết thúc đăng ký", dataIndex: "registrationEnd", key: "registrationEnd" },
    { title: "Ngày bắt đầu học", dataIndex: "courseStart", key: "courseStart" },
    { title: "Ngày kết thúc học", dataIndex: "courseEnd", key: "courseEnd" },
    { 
      title: "Trạng thái", 
      dataIndex: "status", 
      key: "status",
      render: (status) => {
        const color = status === "ACTIVE" ? "green" : status === "COMPLETED" ? "blue" : "red";
        return <span style={{ color }}>{status}</span>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => showModal(record)}>Sửa</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>Xóa</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý Lịch Học</h2>
      
      <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>Thêm Lịch</Button>
      
      <Table 
        columns={columns} 
        dataSource={schedules} 
        rowKey="id" 
        bordered 
        style={{ marginTop: 20 }} 
      />

      <Modal
        title={editingId ? "Cập nhật Lịch học" : "Thêm Lịch học"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="classEntity.id" label="ID Lớp học" rules={[{ required: true, message: "Vui lòng nhập ID lớp học!" }]}>
            <Input type="number" placeholder="Nhập ID lớp học" />
          </Form.Item>

          <Form.Item name="fixedStartTime" label="Giờ bắt đầu" rules={[{ required: true, message: "Vui lòng nhập giờ!" }]}>
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item name="lessonsPerWeek" label="Số tiết/tuần" rules={[{ required: true, message: "Vui lòng nhập số tiết!" }]}>
            <Input type="number" placeholder="Nhập số tiết/tuần" />
          </Form.Item>

          <Form.Item name="registrationStart" label="Ngày đăng ký" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="registrationEnd" label="Ngày kết thúc đăng ký" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="courseStart" label="Ngày bắt đầu khóa học" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="courseEnd" label="Ngày kết thúc khóa học" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Select>
              <Option value="ACTIVE">Hoạt động</Option>
              <Option value="COMPLETED">Hoàn thành</Option>
              <Option value="CANCELED">Hủy</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">{editingId ? "Cập nhật" : "Thêm"}</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassSchedule;
