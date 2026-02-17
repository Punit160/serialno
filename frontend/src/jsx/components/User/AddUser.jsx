import { Fragment, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const navigate = useNavigate();

  // 🔐 Get session user
  const sessionUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    whatsapp_no: "",
    gender: "",
    role: "",
    city: "",
    project: "",
    password: "",
    emp_image: null,
  });

  // 🔁 Input handler
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "emp_image") {
      setFormData({ ...formData, emp_image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🚀 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("company_id", sessionUser.company_id);
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("email", formData.email);
      data.append("whatsapp_no", formData.whatsapp_no);
      data.append("gender", formData.gender);
      data.append("role", formData.role);
      data.append("city", formData.city);
      data.append("project", formData.project);
      data.append("password", formData.password);

      // Required backend fields
      data.append("manager", sessionUser.first_name);
      data.append("state_access", "ALL");
      data.append("created_by", sessionUser.id);

      if (formData.emp_image) {
        data.append("emp_image", formData.emp_image);
      }

      await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}users/create-user`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("User added successfully");
      navigate("/user/list");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <PageTitle
        activeMenu="Add User"
        motherMenu="User Management"
        pageContent="Super Admin - Add New User"
      />

      <Card>
        <Card.Header>
          <Card.Title>Add New User</Card.Title>
        </Card.Header>

        <Card.Body>
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Row>

              <Col lg={6} className="mb-3">
                <Form.Label>First Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col lg={6} className="mb-3">
                <Form.Label>Last Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col lg={6} className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col lg={6} className="mb-3">
                <Form.Label>WhatsApp No *</Form.Label>
                <Form.Control
                  type="number"
                  name="whatsapp_no"
                  value={formData.whatsapp_no}
                  onChange={handleChange}
                  minLength={10}
                  required
                />
              </Col>

              <Col lg={6} className="mb-3">
                <Form.Label>Gender *</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </Form.Select>
              </Col>

              <Col lg={6} className="mb-3">
                <Form.Label>Role *</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </Form.Select>
              </Col>

              <Col lg={6} className="mb-3">
                <Form.Label>City *</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col lg={6} className="mb-3">
                <Form.Label>Project *</Form.Label>
                <Form.Control
                  type="text"
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col lg={6} className="mb-3">
                <Form.Label>Password *</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "12px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#6c757d",
                    }}
                  >
                    <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                  </span>
                </div>
              </Col>

              <Col lg={6} className="mb-3">
                <Form.Label>Profile Image *</Form.Label>
                <Form.Control
                  type="file"
                  name="emp_image"
                  accept="image/*"
                  onChange={handleChange}
                  required
                />
              </Col>

            </Row>

            <div className="text-center mt-3">
              <Button type="submit" variant="primary" className="px-5" disabled={loading}>
                {loading ? "Saving..." : "Add User"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default AddUser;
