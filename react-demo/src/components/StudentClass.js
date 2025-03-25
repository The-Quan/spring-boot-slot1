import React, { useEffect, useState } from "react";
import { Table, Button, Input, Form, message, Space, Modal } from "antd";
import { FaTrash, FaUserPlus, FaExchangeAlt } from "react-icons/fa";
import StudentClassService from "../services/StudentClassService";

const StudentClass = () => {
  const [studentClasses, setStudentClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [transferForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    loadStudentClasses();
  }, []);

  const loadStudentClasses = async () => {
    setLoading(true);
    try {
      const response = await StudentClassService.getAll();
      setStudentClasses(response.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách lớp học!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      await StudentClassService.addStudentToClass(values.studentId, values.classId);
      form.resetFields();
      loadStudentClasses();
      message.success("Thêm sinh viên vào lớp thành công!");
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi thêm sinh viên!");
    }
  };

  const handleTransfer = async (values) => {
    try {
      await StudentClassService.transferStudent(values.studentId, values.oldClassId, values.newClassId);
      transferForm.resetFields();
      setIsModalVisible(false);
      loadStudentClasses();
      message.success("Chuyển lớp thành công!");
    } catch (error) {
      message.error(error.response?.data?.message || "Chuyển lớp thất bại!");
    }
  };

  const handleDelete = async (studentId, classId) => {
    const isConfirmed = window.confirm("Bạn có chắc muốn xóa sinh viên khỏi lớp này?");
    if (isConfirmed) {
      try {
        await StudentClassService.removeStudentFromClass(studentId, classId);
        loadStudentClasses();
        alert("Xóa sinh viên khỏi lớp thành công!");
      } catch (error) {
        alert("Không thể xóa sinh viên khỏi lớp!");
      }
    }
  };
  

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Mã SV", dataIndex: ["student", "id"], key: "studentId" },
    { title: "Tên Sinh Viên", dataIndex: ["student", "name"], key: "studentName" },
    { title: "Mã Lớp", dataIndex: ["classes", "id"], key: "classId" },
    { title: "Tên Lớp", dataIndex: ["classes", "name"], key: "className" },
    {
      title: "Hành động",
      key: "actions",
      render: (record) => (
        <Button type="primary" danger onClick={() => handleDelete(record.student.id, record.classes.id)}>
          <FaTrash /> Xóa
        </Button>
      ),
    },
  ];

  return (
    <div style={{padding: "30px"}}>
      <h2>Quản lý Sinh viên - Lớp</h2>

      {/* Form Thêm Sinh Viên */}
      <Form form={form} layout="inline" onFinish={handleSubmit}>
        <Form.Item name="studentId" rules={[{ required: true, message: "Nhập mã sinh viên!" }]}>
          <Input placeholder="Mã sinh viên" type="number" />
        </Form.Item>
        <Form.Item name="classId" rules={[{ required: true, message: "Nhập mã lớp!" }]}>
          <Input placeholder="Mã lớp" type="number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            <FaUserPlus /> Thêm
          </Button>
        </Form.Item>
      </Form>

      {/* Nút mở modal chuyển lớp */}
      <Button type="default" onClick={() => setIsModalVisible(true)} style={{ margin: "15px 0" }}>
        <FaExchangeAlt /> Chuyển Lớp
      </Button>

      {/* Modal Chuyển Lớp */}
      <Modal
        title="Chuyển Lớp"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={transferForm} layout="vertical" onFinish={handleTransfer}>
          <Form.Item name="studentId" rules={[{ required: true, message: "Nhập mã sinh viên!" }]}>
            <Input placeholder="Mã sinh viên" type="number" />
          </Form.Item>
          <Form.Item name="oldClassId" rules={[{ required: true, message: "Nhập mã lớp cũ!" }]}>
            <Input placeholder="Mã lớp cũ" type="number" />
          </Form.Item>
          <Form.Item name="newClassId" rules={[{ required: true, message: "Nhập mã lớp mới!" }]}>
            <Input placeholder="Mã lớp mới" type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              <FaExchangeAlt /> Xác nhận chuyển
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bảng danh sách sinh viên */}
      <Table
        columns={columns}
        dataSource={studentClasses}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default StudentClass;
