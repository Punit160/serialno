import { useState } from "react";
import { Card, Col, Table, Badge, Nav, Tab } from "react-bootstrap";
import TableExportActions from "../Common/TableExportActions";
import ScannedPanelsModal from "./ScannedPanelsModal";
import PropTypes from "prop-types";

const ViewDispatchPanel = () => {
    /* ================= STATE ================= */

    const [showModal, setShowModal] = useState(false);
    const [selectedDispatch, setSelectedDispatch] = useState(null);

    const openModal = (item) => {
        setSelectedDispatch(item);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedDispatch(null);
    };

    /* ================= MOCK DATA ================= */

    const dispatchList = [
        {
            id: 1,
            date: "22 Jan 2026",
            state: "Uttar Pradesh",
            truckNo: "UP16 AB 2345",
            driverName: "Ramesh",
            driverNo: "9876543210",
            dispatchType: "DCR",
            dcrScannedPanels: [
                "DCR-PNL-001",
                "DCR-PNL-002",
                "DCR-PNL-003",
            ],
            isCompleted: "Completed",
        },
        {
            id: 2,
            date: "23 Jan 2026",
            state: "Haryana",
            truckNo: "HR26 CD 8899",
            driverName: "Suresh",
            driverNo: "9123456780",
            dispatchType: "NON_DCR",
            nonDcrScannedPanels: [
                "NDCR-PNL-101",
                "NDCR-PNL-102",
                "NDCR-PLN-202",
            ],
            isCompleted: "Pending",
        },
    ];

    /* ================= FILTER ================= */

    const dcrList = dispatchList.filter((i) => i.dispatchType === "DCR");
    const nonDcrList = dispatchList.filter((i) => i.dispatchType === "NON_DCR");

    /* ================= EXPORT ================= */

    const exportData = dispatchList.map((item, index) => ({
        sno: index + 1,
        date: item.date,
        state: item.state,
        truckNo: item.truckNo,
        driver: `${item.driverName} (${item.driverNo})`,
        dispatchType: item.dispatchType,
        scannedPanels:
            item.dispatchType === "DCR"
                ? item.dcrScannedPanels.length
                : item.nonDcrScannedPanels.length,
        status: item.isCompleted,
    }));

    const exportColumns = [
        { label: "S No", key: "sno" },
        { label: "Date", key: "date" },
        { label: "State", key: "state" },
        { label: "Truck No", key: "truckNo" },
        { label: "Driver", key: "driver" },
        { label: "Dispatch Type", key: "dispatchType" },
        { label: "Scanned Panels", key: "scannedPanels" },
        { label: "Status", key: "status" },
    ];

    /* ================= TABLE COMPONENT ================= */

    const DispatchTable = ({ data, type }) => (
        <Table responsive className="table-hover align-middle">
            <thead>
                <tr>
                    <th>S No.</th>
                    <th>Date</th>
                    <th>State</th>
                    <th>Truck No</th>
                    <th>Driver</th>
                    <th>Type</th>
                    <th>Scanned</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                </tr>
            </thead>

            <tbody>
                {data.length > 0 ? (
                    data.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.date}</td>
                            <td>{item.state}</td>
                            <td>{item.truckNo}</td>

                            <td>
                                <strong>{item.driverName}</strong>
                                <br />
                                <small>{item.driverNo}</small>
                            </td>

                            <td>
                                <Badge bg="primary">{type}</Badge>
                            </td>

                            <td>
                                <strong>
                                    {type === "DCR"
                                        ? item.dcrScannedPanels.length
                                        : item.nonDcrScannedPanels.length}
                                </strong>
                            </td>

                            <td>
                                <Badge
                                    bg={item.isCompleted === "Completed" ? "success" : "warning"}
                                >
                                    {item.isCompleted}
                                </Badge>
                            </td>

                            <td className="text-center">
                                <button
                                    className="btn btn-primary btn-xs sharp me-2"
                                    onClick={() => openModal(item)}
                                >
                                    <i className="fa fa-eye" />
                                </button>

                                <button className="btn btn-danger btn-xs sharp">
                                    <i className="fa fa-trash" />
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="9" className="text-center text-muted">
                            No dispatch records found
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );

    /* ================= PROP TYPES FIX ================= */

    DispatchTable.propTypes = {
        data: PropTypes.array.isRequired,
        type: PropTypes.string.isRequired,
    };

    /* ================= UI ================= */

    return (
        <Col lg={12}>
            <Card>
                <Card.Header className="d-flex justify-content-between">
                    <Card.Title>Dispatch Panel List</Card.Title>

                    <TableExportActions
                        data={exportData}
                        columns={exportColumns}
                        fileName="Dispatch_Panel_Report"
                    />
                </Card.Header>

                <Card.Body>
                    <Tab.Container defaultActiveKey="dcr">
                        <Nav variant="pills" className="mb-4">
                            <Nav.Item>
                                <Nav.Link eventKey="dcr">
                                    DCR Dispatch ({dcrList.length})
                                </Nav.Link>
                            </Nav.Item>

                            <Nav.Item>
                                <Nav.Link eventKey="non_dcr">
                                    NON-DCR Dispatch ({nonDcrList.length})
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <Tab.Content>
                            <Tab.Pane eventKey="dcr">
                                <DispatchTable data={dcrList} type="DCR" />
                            </Tab.Pane>

                            <Tab.Pane eventKey="non_dcr">
                                <DispatchTable data={nonDcrList} type="NON_DCR" />
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Card.Body>
            </Card>

            {/* ===== MODAL ===== */}
            <ScannedPanelsModal
                show={showModal}
                onHide={closeModal}
                dispatch={selectedDispatch}
            />
        </Col>
    );
};

export default ViewDispatchPanel;
