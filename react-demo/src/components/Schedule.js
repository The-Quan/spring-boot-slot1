import React, { useEffect, useState } from "react";
import { Table, Form, Input, Button, Modal, Select, message } from "antd";
import ScheduleService from "../services/scheduleService";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Option } = Select;

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editScheduleId, setEditScheduleId] = useState(null);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const response = await ScheduleService.getAllSchedules();
      setSchedules(response.data);
    } catch (error) {
      message.error("Error fetching schedules");
    }
    setLoading(false);
  };

  const handleRegister = async (values) => {
    try {
      await ScheduleService.registerClass(values.studentId, values.classScheduleId);
      message.success("Registered successfully!");
      loadSchedules();
      form.resetFields();
    } catch (error) {
      message.error("Error registering class");
    }
  };

  const handleEditClick = (schedule) => {
    setEditScheduleId(schedule.id);
    editForm.setFieldsValue({
      newClassScheduleId: schedule.classSchedule.id,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      await ScheduleService.updateSchedule(editScheduleId, values.newClassScheduleId);
      message.success("Updated successfully!");
      loadSchedules();
      setIsEditModalOpen(false);
    } catch (error) {
      message.error("Error updating schedule");
    }
  };

  const handleDelete = async (scheduleId) => {
    try {
      await ScheduleService.deleteSchedule(scheduleId);
      message.success("Deleted successfully!");
      loadSchedules();
    } catch (error) {
      message.error("Error deleting schedule");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Student", dataIndex: ["student", "name"], key: "student" },
    { title: "Class", dataIndex: ["classSchedule", "classEntity", "name"], key: "class" },
    { title: "Ngày đăng ký", dataIndex: ["classSchedule", "registration_start"], key: "registration_start" },
    { title: "Ngày kết thúc", dataIndex: ["classSchedule", "registration_end"], key: "registration_end" },
    { title: "Ngày học", dataIndex: ["classSchedule", "course_start"], key: "course_start" },
    { title: "Kết thúc", dataIndex: ["classSchedule", "course_end"], key: "course_end" },
    { title: "Can Edit", dataIndex: "canEdit", key: "canEdit", render: (canEdit) => (canEdit ? "Yes" : "No") },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => handleEditClick(record)} style={{ marginRight: 8 }} />
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Schedule Management</h2>

      {/* Đăng ký lớp */}
      <Form form={form} layout="inline" onFinish={handleRegister} style={{ marginBottom: 20 }}>
        <Form.Item name="studentId" rules={[{ required: true, message: "Please enter Student ID" }]}>
          <Input placeholder="Student ID" />
        </Form.Item>
        <Form.Item name="classScheduleId" rules={[{ required: true, message: "Please enter Class Schedule ID" }]}>
          <Input placeholder="Class Schedule ID" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Register</Button>
        </Form.Item>
      </Form>

      {/* Danh sách lịch học */}
      <Table
        columns={columns}
        dataSource={schedules}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/* Modal cập nhật lịch học */}
      <Modal
        title="Update Schedule"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleUpdate}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="newClassScheduleId"
            label="New Class Schedule ID"
            rules={[{ required: true, message: "Please enter new Class Schedule ID" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Schedule;
  