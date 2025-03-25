import React, { useEffect, useState } from "react";
import { Table, Form, Input, Button, Modal, Space, message } from "antd";
import { FaEdit, FaTrash } from "react-icons/fa";
import classService from "../services/classService";

const Class = () => {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await classService.getAllClasses();
      setClasses(response.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách lớp học!");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      if (editingId) {
        await classService.updateClass(editingId, values);
        message.success("Cập nhật lớp học thành công!");
      } else {
        await classService.addClass(values);
        message.success("Thêm lớp học thành công!");
      }
      form.resetFields();
      setEditingId(null);
      fetchClasses();
    } catch (error) {
      message.error("Lỗi khi thêm/cập nhật lớp học!");
    }
  };

  const handleEdit = (classItem) => {
    setEditingId(classItem.id);
    form.setFieldsValue(classItem);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa lớp học này?");
    if (isConfirmed) {
      try {
        await classService.deleteClass(id);
        alert("Xóa lớp học thành công!");
        fetchClasses();
      } catch (error) {
        alert("Lỗi khi xóa lớp học!");
      }
    }
  };
  

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên Lớp",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số HS Tối Đa",
      dataIndex: "maxStudents",
      key: "maxStudents",
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            <FaEdit /> Sửa
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
            <FaTrash /> Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "30px" }}>
      <h2>Quản Lý Lớp Học</h2>

      {/* Thanh tìm kiếm */}
      <Input
        placeholder="Tìm kiếm lớp học..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "300px", marginBottom: "20px" }}
      />

      {/* Form Thêm/Sửa Lớp */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: "400px", marginBottom: "20px" }}
      >
        <Form.Item
          label="Tên lớp"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên lớp!" }]}
        >
          <Input placeholder="Tên lớp" />
        </Form.Item>
        <Form.Item
          label="Số học sinh tối đa"
          name="maxStudents"
          rules={[{ required: true, message: "Vui lòng nhập số lượng học sinh!" }]}
        >
          <Input type="number" placeholder="Số lượng học sinh tối đa" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {editingId ? "Cập Nhật" : "Thêm Mới"}
          </Button>
        </Form.Item>
      </Form>

      {/* Bảng danh sách lớp học */}
      <Table
        columns={columns}
        dataSource={classes.filter((classItem) =>
          classItem.name.toLowerCase().includes(search.toLowerCase())
        )}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Class;
