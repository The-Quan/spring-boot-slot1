import React, { useEffect, useState } from "react";
import { Table, Button, Input, Form, message, Space, Modal } from "antd";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import StudentService from "../services/StudentService";

const Student = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await StudentService.getAll();
      setStudents(response.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách sinh viên!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editId) {
        await StudentService.update(editId, values);
        message.success("Cập nhật sinh viên thành công!");
      } else {
        await StudentService.add(values);
        message.success("Thêm sinh viên thành công!");
      }
      form.resetFields();
      setIsModalVisible(false);
      setEditId(null);
      loadStudents();
    } catch (error) {
      message.error("Lỗi khi lưu sinh viên!");
    }
  };

  const handleEdit = (student) => {
    setEditId(student.id);
    form.setFieldsValue(student);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Bạn có chắc muốn xóa sinh viên này?");
    if (isConfirmed) {
      try {
        await StudentService.remove(id);
        alert("Xóa sinh viên thành công!");
        loadStudents(); // Cập nhật danh sách sinh viên
      } catch (error) {
        alert("Lỗi khi xóa sinh viên!");
      }
    }
  };
  
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Hành động",
      key: "actions",
      render: (record) => (
        <Space>
          <Button onClick={() => handleEdit(record)} type="primary">
            <FaEdit /> Sửa
          </Button>
          <Button onClick={() => handleDelete(record.id)} danger>
            <FaTrash /> Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{padding: "30px"}}>
      <h2>Quản lý Sinh viên</h2>

      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 15 }}>
        <FaUserPlus /> Thêm Sinh Viên
      </Button>

      {/* Modal Thêm/Sửa Sinh Viên */}
      <Modal
        title={editId ? "Cập nhật Sinh viên" : "Thêm Sinh viên"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditId(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Tên" rules={[{ required: true, message: "Nhập tên!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Nhập email!" }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Nhập số điện thoại!" }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editId ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bảng danh sách sinh viên */}
      <Table columns={columns} dataSource={students} rowKey="id" loading={loading} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default Student;
