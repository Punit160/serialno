import { useEffect, useState } from "react";
import { Card, Col, Table, Badge, Nav, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
import TableExportActions from "../Common/TableExportActions";
import PropTypes from "prop-types";


const ViewDamagePanel = () => {
  
  const [senderDamageList, setSenderDamageList] = useState([]);
  const [receiverDamageList, setReceiverDamageList] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchDamageData = async () => {
      try {
        const token = localStorage.getItem("token");

        const senderRes = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}damage/get-damage-panel`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const receiverRes = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}damage/get-damage-panel-onsite`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const senderData = await senderRes.json();
        const receiverData = await receiverRes.json();

        console.log("Sender Data:", senderData.data);
        console.log("Receiver Data:", receiverData.data);

        if (senderRes.ok) {
          setSenderDamageList(senderData.data || []);
        }

        if (receiverRes.ok) {
          setReceiverDamageList(receiverData.data || []);
        }
      } catch (error) {
        console.error("Error fetching damage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDamageData();
  }, []);

  /* ========== PANEL TYPE LOGIC (FIXED) ========= */
const getPanelType = (item) => {
  let category = item.panel_category;

  // If null or undefined, treat as 1 (DCR) by default
  if (category === null || category === undefined) {
    category = "1";
  }

  // Trim if it's a string, then convert to number
  const catNum = Number(String(category).trim());

  // Determine panel type
  if (catNum === 1) return "DCR";
  if (catNum === 2) return "NON DCR";

  return "NON DCR"; // fallback for any other value
};


  const getBadgeClass = (item) => {
    return getPanelType(item) === "DCR"
      ? "bg-info"
      : "bg-secondary";
  };

  /* ========== EXPORT PREP (FIXED) ========= */

  const prepareExport = (list) =>
    list.map((item, index) => ({
      sno: index + 1,
      panelId: item.panel_no,
      panelType: getPanelType(item),
      remarks: item.remarks,
      date: new Date(item.createdAt).toLocaleDateString(),
      status: "Reported",
    }));

  const exportColumns = [
    { label: "S No", key: "sno" },
    { label: "Panel ID", key: "panelId" },
    { label: "Panel Type", key: "panelType" },
    { label: "Remarks", key: "remarks" },
    { label: "Reported Date", key: "date" },
    { label: "Status", key: "status" },
  ];

  /* ========== COMMON TABLE ========= */

  const DamageTable = ({ data }) => (
    <Table responsive className="table-hover align-middle">
      <thead>
        <tr>
          <th>S no.</th>
          <th>Panel ID</th>
          <th>Panel Type</th>
          <th>Damage Image</th>
          <th>Remarks</th>
          <th>Reported Date</th>
          <th>Status</th>
          <th className="text-center">Action</th>
        </tr>
      </thead>

      <tbody>
        {data.length > 0 ? (
          data.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>

              <td>{item.panel_no}</td>

              {/* ✅ FIXED PANEL TYPE */}
              <td>
                <span className={`badge ${getBadgeClass(item)}`}>
                  {getPanelType(item)}
                </span>
              </td>

              <td>
                <img
                  src={`${IMAGE_BASE}${item.image}`}
                  alt="damage"
                  width="50"
                  height="50"
                  className="rounded border"
                />
              </td>

              <td>{item.remarks}</td>

              <td>
                {new Date(item.createdAt).toLocaleDateString()}
              </td>

              <td>
                <Badge bg="danger">Reported</Badge>
              </td>

              <td className="text-center">
                <Link
                  to={`/damage/view/${item._id}`}
                  className="btn btn-primary btn-xs sharp me-2"
                >
                  <i className="fa fa-eye" />
                </Link>

                <button
                  className="btn btn-danger btn-xs sharp"
                  onClick={() => console.log("Delete", item._id)}
                >
                  <i className="fa fa-trash" />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center text-muted">
              No damage records found
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );

  DamageTable.propTypes = {
    data: PropTypes.array.isRequired,
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <h5>Loading damage records...</h5>
      </div>
    );
  }

  /* ========== MAIN UI ========= */

  return (
    <Col lg={12}>
      <Card>
        <Card.Body>
          <Tab.Container defaultActiveKey="sender">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="sender">
                    Sender Damage ({senderDamageList.length})
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link eventKey="receiver">
                    Receiver Damage ({receiverDamageList.length})
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="sender">
                  <TableExportActions
                    data={prepareExport(senderDamageList)}
                    columns={exportColumns}
                    fileName="Sender_Damage_Report"
                  />
                </Tab.Pane>

                <Tab.Pane eventKey="receiver">
                  <TableExportActions
                    data={prepareExport(receiverDamageList)}
                    columns={exportColumns}
                    fileName="Receiver_Damage_Report"
                  />
                </Tab.Pane>
              </Tab.Content>
            </div>

            <Tab.Content>
              <Tab.Pane eventKey="sender">
                <DamageTable data={senderDamageList} />
              </Tab.Pane>

              <Tab.Pane eventKey="receiver">
                <DamageTable data={receiverDamageList} />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ViewDamagePanel;
