import { Fragment, useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../Common/PageHeader";
import StateSelect from "../Common/StateSelect";
import ScannedPanelList from "../Common/ScannedPanelList";
import { PageLoader } from "../Common/LoadingState";
import { notifySuccess, notifyError, notifyWarning } from "../../utils/toast";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
import { INDIAN_STATES } from "../../constants/indianStates";

const DETAIL_FIELDS = [
  "dispatch_id",
  "state",
  "truck_no",
  "driver_no",
  "driver_name",
  "challan_no",
  "dispatch_panel_count",
];

const pickDetails = (data) => {
  const out = {};
  DETAIL_FIELDS.forEach((key) => {
    out[key] = data[key];
  });
  return out;
};

const formatStateLabel = (value) => {
  if (!value) return "—";
  const match = INDIAN_STATES.find((s) => s.value === value);
  return match?.label || String(value).replace(/_/g, " ");
};

const UpdateDispatchPanel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const scannerRef = useRef(null);
  const inputRef = useRef(null);
  const scanTimerRef = useRef(null);
  const lastScannedRef = useRef("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannerInput, setScannerInput] = useState("");
  const [manualPanel, setManualPanel] = useState("");
  const [collectStatus, setCollectStatus] = useState(0);
  const [editingDetails, setEditingDetails] = useState(false);
  const [detailsSnapshot, setDetailsSnapshot] = useState(null);

  const [dispatchData, setDispatchData] = useState({
    dispatch_id: "",
    state: "",
    truck_no: "",
    driver_no: "",
    driver_name: "",
    challan_no: "",
    dispatch_panel_count: "",
    dispatchType: "",
    dcrPanels: [],
    nonDcrPanels: [],
  });

  const stopScan = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {
        /* camera may already be stopped */
      }
      scannerRef.current = null;
    }
    setScanning(false);
  }, []);

  const fetchDispatchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const dispatchRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}dispatch/fetch-dispatch-panel/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const dispatchInfo = dispatchRes.data?.data || {};

      const panelRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}dispatch/fetch-dispatch-panel-lot/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const panels = panelRes.data?.data || [];

      const dcr = panels
        .filter((p) => Number(p.dispatch_panel_type) === 1)
        .map((p) => p.panel_unique_no);

      const nonDcr = panels
        .filter((p) => Number(p.dispatch_panel_type) === 2)
        .map((p) => p.panel_unique_no);

      const defaultType =
        dcr.length && !nonDcr.length
          ? "DCR"
          : nonDcr.length && !dcr.length
            ? "NON_DCR"
            : "";

      setCollectStatus(Number(dispatchInfo.collect_status) || 0);
      const loaded = {
        dispatch_id: dispatchInfo.dispatch_id || "",
        state: dispatchInfo.state || "",
        truck_no: dispatchInfo.truck_no || "",
        driver_no: dispatchInfo.driver_no || "",
        driver_name: dispatchInfo.driver_name || "",
        challan_no: dispatchInfo.challan_no || "",
        dispatch_panel_count: dispatchInfo.dispatch_panel_count ?? "",
        dispatchType: defaultType,
        dcrPanels: dcr,
        nonDcrPanels: nonDcr,
      };
      setDispatchData(loaded);
      setDetailsSnapshot(pickDetails(loaded));
      setEditingDetails(false);
    } catch (err) {
      console.log("Fetch error:", err.response?.data || err.message);
      notifyError("Failed to load dispatch details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDispatchDetails();
    return () => {
      stopScan();
    };
  }, [fetchDispatchDetails, stopScan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDispatchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const savePanel = async (panelCode) => {
    if (!panelCode) return;

    if (collectStatus === 1 || editingDetails) {
      notifyWarning(
        editingDetails
          ? "Save or cancel dispatch details before scanning"
          : "This dispatch is already received — cannot add panels"
      );
      return;
    }

    if (!dispatchData.dispatchType) {
      notifyWarning("Select DCR or NON-DCR first");
      return;
    }

    if (lastScannedRef.current === panelCode) return;
    lastScannedRef.current = panelCode;

    if (
      dispatchData.dcrPanels.includes(panelCode) ||
      dispatchData.nonDcrPanels.includes(panelCode)
    ) {
      notifyWarning("Panel already scanned");
      lastScannedRef.current = "";
      return;
    }

    const totalPanels =
      dispatchData.dcrPanels.length + dispatchData.nonDcrPanels.length;

    const targetCount = Number(dispatchData.dispatch_panel_count) || 0;
    if (targetCount > 0 && totalPanels >= targetCount) {
      notifyWarning("Dispatch panel count already reached");
      lastScannedRef.current = "";
      return;
    }

    const panel_type = dispatchData.dispatchType === "DCR" ? 1 : 2;

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}dispatch/scan-panel`,
        {
          panel_no: panelCode,
          dispatch_id: id,
          panel_type,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDispatchData((prev) =>
        panel_type === 1
          ? { ...prev, dcrPanels: [...prev.dcrPanels, panelCode] }
          : { ...prev, nonDcrPanels: [...prev.nonDcrPanels, panelCode] }
      );

      setTimeout(() => {
        lastScannedRef.current = "";
      }, 200);
    } catch (err) {
      notifyError(err.response?.data?.message || "Scan failed");
      lastScannedRef.current = "";
    }
  };

  const removePanel = async (panelCode, type) => {
    if (collectStatus === 1 || editingDetails) {
      notifyWarning(
        editingDetails
          ? "Save or cancel dispatch details before removing panels"
          : "This dispatch is already received — cannot remove panels"
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}dispatch/scan-panel-delete`,
        { panel_no: panelCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDispatchData((prev) =>
        type === "DCR"
          ? { ...prev, dcrPanels: prev.dcrPanels.filter((p) => p !== panelCode) }
          : { ...prev, nonDcrPanels: prev.nonDcrPanels.filter((p) => p !== panelCode) }
      );
      notifySuccess("Panel removed from dispatch");
    } catch (err) {
      notifyError(err.response?.data?.message || "Failed to remove panel");
    }
  };

  const handleStartEditDetails = async () => {
    await stopScan();
    setDetailsSnapshot(pickDetails(dispatchData));
    setEditingDetails(true);
  };

  const handleCancelEditDetails = () => {
    if (detailsSnapshot) {
      setDispatchData((prev) => ({
        ...prev,
        ...detailsSnapshot,
      }));
    }
    setEditingDetails(false);
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();

    const totalPanels =
      dispatchData.dcrPanels.length + dispatchData.nonDcrPanels.length;
    const targetCount = Number(dispatchData.dispatch_panel_count) || 0;

    if (targetCount > 0 && targetCount < totalPanels) {
      notifyError(
        `Panel count (${targetCount}) cannot be less than scanned panels (${totalPanels})`
      );
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const payload = {
        dispatch_id: dispatchData.dispatch_id,
        state: dispatchData.state,
        truck_no: dispatchData.truck_no,
        driver_no: dispatchData.driver_no,
        driver_name: dispatchData.driver_name,
        challan_no: dispatchData.challan_no,
        dispatch_panel_count: Number(dispatchData.dispatch_panel_count),
      };

      await axios.put(
        `${import.meta.env.VITE_BACKEND_API_URL}dispatch/update-dispatch-panel/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDetailsSnapshot(pickDetails(dispatchData));
      setEditingDetails(false);
      notifySuccess("Dispatch details saved — you can scan panels below");
    } catch (err) {
      notifyError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const startScan = async () => {
    if (collectStatus === 1) {
      notifyWarning("This dispatch is already received — scanning disabled");
      return;
    }

    if (!dispatchData.dispatchType) {
      notifyWarning("Please select panel type first.");
      return;
    }

    if (scannerRef.current) return;

    setScanning(true);

    try {
      const qr = new Html5Qrcode("reader");
      scannerRef.current = qr;

      await qr.start(
        { facingMode: "environment" },
        {
          fps: 25,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          disableFlip: true,
        },
        (decodedText) => {
          savePanel(decodedText);
        }
      );
    } catch (err) {
      console.log("Camera failed:", err);
      notifyError("Camera start failed");
      setScanning(false);
    }
  };

  const totalScanned =
    dispatchData.dcrPanels.length + dispatchData.nonDcrPanels.length;
  const targetCount = Number(dispatchData.dispatch_panel_count) || 0;
  const scanProgress =
    targetCount > 0 ? Math.min((totalScanned / targetCount) * 100, 100) : 0;
  const scanDisabled = collectStatus === 1 || editingDetails;
  const panelsLockedByEdit = editingDetails;

  if (loading) {
    return <PageLoader message="Loading dispatch..." />;
  }

  return (
    <Fragment>
      <PageHeader
        title="Update Dispatch"
        subtitle="Update truck/challan details or scan panels — one step at a time"
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Dispatch", to: "/dispatch/list" },
          { label: "Update Dispatch" },
        ]}
      />

      {collectStatus === 1 && (
        <div className="alert alert-warning mb-3">
          This dispatch has been received. You can update truck/challan details, but
          panel scanning is locked.
        </div>
      )}

      <div className="row">
        <div className="col-lg-12">
          <div className="card klk-form-card klk-dispatch-form">
            <div className="card-body">
              <form onSubmit={editingDetails ? handleSaveDetails : (e) => e.preventDefault()}>
                <div className="klk-dispatch-details">
                  <div className="klk-dispatch-details__head">
                    <h5>Dispatch details</h5>
                    {!editingDetails ? (
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={handleStartEditDetails}
                      >
                        <i className="fa fa-pen me-1" />
                        Edit dispatch details
                      </button>
                    ) : (
                      <span className="badge bg-warning text-dark">Editing details</span>
                    )}
                  </div>

                  {!editingDetails ? (
                    <div className="klk-dispatch-details-readonly">
                      <div className="klk-dispatch-details-readonly__item">
                        <span className="klk-dispatch-details-readonly__label">Dispatch ID</span>
                        <span className="klk-dispatch-details-readonly__value">
                          {dispatchData.dispatch_id || "—"}
                        </span>
                      </div>
                      <div className="klk-dispatch-details-readonly__item">
                        <span className="klk-dispatch-details-readonly__label">State</span>
                        <span className="klk-dispatch-details-readonly__value">
                          {formatStateLabel(dispatchData.state)}
                        </span>
                      </div>
                      <div className="klk-dispatch-details-readonly__item">
                        <span className="klk-dispatch-details-readonly__label">Truck No</span>
                        <span className="klk-dispatch-details-readonly__value">
                          {dispatchData.truck_no || "—"}
                        </span>
                      </div>
                      <div className="klk-dispatch-details-readonly__item">
                        <span className="klk-dispatch-details-readonly__label">Driver No</span>
                        <span className="klk-dispatch-details-readonly__value">
                          {dispatchData.driver_no || "—"}
                        </span>
                      </div>
                      <div className="klk-dispatch-details-readonly__item">
                        <span className="klk-dispatch-details-readonly__label">Driver Name</span>
                        <span className="klk-dispatch-details-readonly__value">
                          {dispatchData.driver_name || "—"}
                        </span>
                      </div>
                      <div className="klk-dispatch-details-readonly__item">
                        <span className="klk-dispatch-details-readonly__label">Challan No</span>
                        <span className="klk-dispatch-details-readonly__value">
                          {dispatchData.challan_no || "—"}
                        </span>
                      </div>
                      <div className="klk-dispatch-details-readonly__item">
                        <span className="klk-dispatch-details-readonly__label">Panel count</span>
                        <span className="klk-dispatch-details-readonly__value">
                          {dispatchData.dispatch_panel_count ?? "—"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="row">
                        <div className="col-xl-6 col-md-6">
                          <div className="form-group">
                            <label className="form-label">
                              Dispatch ID <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="dispatch_id"
                              value={dispatchData.dispatch_id}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-xl-6 col-md-6">
                          <div className="form-group">
                            <label className="form-label">
                              State <span className="text-danger">*</span>
                            </label>
                            <StateSelect
                              name="state"
                              value={dispatchData.state}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-xl-6 col-md-6">
                          <div className="form-group">
                            <label className="form-label">
                              Truck No <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="truck_no"
                              value={dispatchData.truck_no}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-xl-6 col-md-6">
                          <div className="form-group">
                            <label className="form-label">
                              Driver No <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="driver_no"
                              value={dispatchData.driver_no}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-xl-6 col-md-6">
                          <div className="form-group">
                            <label className="form-label">
                              Driver Name <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="driver_name"
                              value={dispatchData.driver_name}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-xl-6 col-md-6">
                          <div className="form-group">
                            <label className="form-label">
                              Challan No <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="challan_no"
                              value={dispatchData.challan_no}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-xl-6 col-md-6">
                          <div className="form-group">
                            <label className="form-label">
                              Dispatch Panel Count <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              name="dispatch_panel_count"
                              value={dispatchData.dispatch_panel_count}
                              onChange={handleChange}
                              min={totalScanned || 0}
                              required
                            />
                            {totalScanned > 0 && (
                              <small className="text-muted d-block mt-1">
                                Minimum {totalScanned} (already scanned)
                              </small>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="klk-dispatch-details__actions">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={handleCancelEditDetails}
                          disabled={saving}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={saving}
                        >
                          {saving ? "Saving..." : "Save dispatch details"}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {panelsLockedByEdit && (
                  <div className="klk-scan-locked__overlay">
                    Save or cancel dispatch details above to scan or remove panels.
                  </div>
                )}

                <div
                  className={`klk-form-section${
                    panelsLockedByEdit ? " klk-form-section--locked" : ""
                  }`}
                >
                  <div className="klk-form-section__head">
                    <h5 className="klk-form-section__title">Scan Panels</h5>
                    <span
                      className={`klk-dispatch-status${
                        scanDisabled ? "" : " klk-dispatch-status--active"
                      }`}
                    >
                      <i className={`fa fa-${scanDisabled ? "lock" : "check-circle"}`} />
                      {panelsLockedByEdit
                        ? "Save details first"
                        : scanDisabled
                          ? "Scanning locked"
                          : "Scanning enabled"}
                    </span>
                  </div>

                  <div className="klk-panel-type-block">
                    <label className="form-label d-block">
                      Panel Type <span className="text-danger">*</span>
                    </label>
                    <div className="klk-panel-type">
                      {["DCR", "NON_DCR"].map((type) => {
                        const isActive = dispatchData.dispatchType === type;
                        return (
                          <label
                            key={type}
                            className={`klk-panel-type__btn${isActive ? " is-active" : ""}`}
                          >
                            <input
                              type="radio"
                              name="dispatchType"
                              value={type}
                              checked={isActive}
                              onChange={handleChange}
                              disabled={scanDisabled}
                            />
                            {type.replace("_", "-")}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {!scanDisabled && (
                    <div className="klk-scan-tools">
                      <div className="klk-scan-tools__field">
                        <label>Scanner gun</label>
                        <input
                          ref={inputRef}
                          type="text"
                          className="form-control"
                          placeholder="Scan barcode here"
                          value={scannerInput}
                          onChange={(e) => {
                            const value = e.target.value;
                            setScannerInput(value);

                            if (scanTimerRef.current) {
                              clearTimeout(scanTimerRef.current);
                            }

                            scanTimerRef.current = setTimeout(() => {
                              const finalValue = value.trim();
                              if (!finalValue) return;

                              setScannerInput("");
                              savePanel(finalValue);
                            }, 70);
                          }}
                        />
                      </div>

                      <div className="klk-scan-tools__field">
                        <label>QR camera</label>
                        <div className="klk-scan-tools__actions">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={startScan}
                          >
                            <i className="fa fa-camera me-1" />
                            {scanning ? "Camera on" : "Start camera"}
                          </button>
                          {scanning && (
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={stopScan}
                            >
                              Stop
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="klk-scan-tools__field">
                        <label>Manual entry</label>
                        <div className="klk-scan-tools__manual">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Panel number"
                            value={manualPanel}
                            onChange={(e) => setManualPanel(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                savePanel(manualPanel.trim());
                                setManualPanel("");
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                              savePanel(manualPanel.trim());
                              setManualPanel("");
                            }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {scanning && (
                    <div className="klk-qr-reader">
                      <div id="reader" />
                    </div>
                  )}

                  <div className="klk-scan-stats">
                    <div className="klk-scan-counter">
                      <i className="fa fa-barcode" />
                      {totalScanned} scanned
                      {targetCount > 0 &&
                        ` · ${Math.max(targetCount - totalScanned, 0)} remaining`}
                    </div>
                    {targetCount > 0 && (
                      <div className="klk-dispatch-progress">
                        <div
                          className="klk-dispatch-progress__bar"
                          style={{ width: `${scanProgress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="row g-3 klk-scanned-panels-row">
                    <div className="col-md-6">
                      <div className="klk-scanned-panel-box">
                        <div className="klk-scanned-panel-box__title">
                          DCR Panels ({dispatchData.dcrPanels.length})
                        </div>
                        <div className="klk-scanned-panel-box__body">
                          <ScannedPanelList
                            panels={dispatchData.dcrPanels}
                            variant="success"
                            onRemove={
                              scanDisabled
                                ? undefined
                                : (panel) => removePanel(panel, "DCR")
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="klk-scanned-panel-box">
                        <div className="klk-scanned-panel-box__title">
                          NON-DCR Panels ({dispatchData.nonDcrPanels.length})
                        </div>
                        <div className="klk-scanned-panel-box__body">
                          <ScannedPanelList
                            panels={dispatchData.nonDcrPanels}
                            variant="info"
                            onRemove={
                              scanDisabled
                                ? undefined
                                : (panel) => removePanel(panel, "NON_DCR")
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {!editingDetails && (
                  <div className="klk-form-actions">
                    <button
                      type="button"
                      className="btn btn-outline-secondary klk-form-actions__btn"
                      onClick={() => navigate("/dispatch/list")}
                    >
                      Back to dispatch list
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateDispatchPanel;
