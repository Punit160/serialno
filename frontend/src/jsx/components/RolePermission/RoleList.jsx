import { Card, Col, Table, Badge, Button } from "react-bootstrap";
import { useState } from "react";
import PermissionPopup from "./AssignPermission";
import CommonPagination from "../Common/Pagination";

const RoleList = () => {
  const [roles, setRoles] = useState([
    { name: "Admin", description: "Full Access", status: "Active" },
    { name: "Operator", description: "Solar Tracking", status: "Active" },
    { name: "Manager", description: "Reports Access", status: "Inactive" },
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Pagination
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(roles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = roles.slice(startIndex, startIndex + itemsPerPage);

  // Delete
  const handleDelete = (index) => {
    if (!window.confirm("Delete Role?")) return;
    setRoles(roles.filter((_, i) => i !== index));
  };

  // Permission Popup
  const openPermission = (role) => {
    setSelectedRole(role);
    setShowPopup(true);
  };

  return (
    <Col lg={12}>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title>Role List</Card.Title>

          <Button variant="success" size="sm">
            + Add Role
          </Button>
        </Card.Header>

        <Card.Body>

          <Table responsive hover className="align-middle">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Role Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Permission</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No Roles Found
                  </td>
                </tr>
              ) : (
                currentData.map((role, index) => (
                  <tr key={index}>
                    
                    <td>
                      <strong>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </strong>
                    </td>

                    <td>
                      <strong>{role.name}</strong>
                    </td>

                    <td>{role.description}</td>

                    <td>
                      <Badge bg={role.status === "Active" ? "success" : "danger"}>
                        {role.status}
                      </Badge>
                    </td>

                    <td>
                      <button
                        className="btn btn-info btn-xs sharp"
                        onClick={() => openPermission(role)}
                      >
                        <i className="fa fa-lock"></i>
                      </button>
                    </td>

                    <td className="text-center">
                      <div className="d-flex gap-2 justify-content-center">

                        <button className="btn btn-primary btn-xs sharp">
                          <i className="fa fa-eye"></i>
                        </button>

                        <button className="btn btn-warning btn-xs sharp">
                          <i className="fa fa-edit"></i>
                        </button>

                        <button
                          className="btn btn-danger btn-xs sharp"
                          onClick={() => handleDelete(index)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <CommonPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

        </Card.Body>
      </Card>

      <PermissionPopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
        role={selectedRole}
      />
    </Col>
  );
};

export default RoleList;