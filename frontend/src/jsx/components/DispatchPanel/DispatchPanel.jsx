import { Fragment, useState, useRef, useEffect } from "react";
import PageTitle from "../../layouts/PageTitle";
import axios from "axios";
import jsQR from "jsqr";

const DispatchPanel = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [dispatchStarted, setDispatchStarted] = useState(false);
  const [manualPanel, setManualPanel] = useState("");

  const STORAGE_KEY = "dispatchPanelData";

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

  /* LOAD FROM LOCAL STORAGE */
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setDispatchData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
  }, []);

  /* SAVE TO LOCAL STORAGE */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dispatchData));
  }, [dispatchData]);

  /* CLEAN CAMERA */
  useEffect(() => {
    return () => stopScan();
  }, []);

  /* START SCAN */
  const startScan = async () => {
    if (!scanning) {
      try {
        setScanning(true);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", true);
        await videoRef.current.play();

        requestAnimationFrame(scanFrame);
      } catch (err) {
        alert("Camera access denied");
        setScanning(false);
      }
    }
  };

  /* SCAN FRAME */
  const scanFrame = () => {
    if (!videoRef.current || videoRef.current.readyState !== 4) {
      requestAnimationFrame(scanFrame);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.drawImage(videoRef.current, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
      savePanel(code.data);
      stopScan();
    } else {
      requestAnimationFrame(scanFrame);
    }
  };

  /* STOP SCAN */
  const stopScan = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setScanning(false);
  };

  /* SAVE PANEL */
  const savePanel = async (panelCode) => {
    
  console.log("Sending to backend:", {
  panel_no: panelCode,
  dispatch_id: localStorage.getItem("dispatch_main_id"),
  panel_type: localStorage.getItem("dispatch_panel_type"),
});

    try {
      const token = localStorage.getItem("token");
      const dispatch_id = localStorage.getItem("dispatch_main_id");
      const panel_type = localStorage.getItem("dispatch_panel_type");

      console.log("TOKEN:", localStorage.getItem("token"));

      await axios.post(
        "http://localhost:3000/api/dispatch/scan-panel",
        {
          panel_no: panelCode,
          dispatch_id,
          panel_type: panel_type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDispatchData((prev) => {
        if (panel_type == 1) {
          return { ...prev, dcrPanels: [...prev.dcrPanels, panelCode] };
        }
        return { ...prev, nonDcrPanels: [...prev.nonDcrPanels, panelCode] };
      });
    } catch (err) {
      alert(err.response?.data?.message || "Panel not found");
    }
  };

  /* MANUAL ADD */
  const handleManualAdd = async () => {
    if (!manualPanel.trim()) return;
    await savePanel(manualPanel.trim());
    setManualPanel("");
  };

  /* INPUT CHANGE */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dispatchType") {
      const typeValue = value === "DCR" ? 1 : 2;
      localStorage.setItem("dispatch_panel_type", typeValue);
    }

    setDispatchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* START DISPATCH */
  const handleStartDispatch = async (e) => {
    e.preventDefault();

    try {
      const sessionUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      const company_id = sessionUser?.company_id;

      const payload = {
        dispatch_id: dispatchData.dispatch_id,
        state: dispatchData.state,
        truck_no: dispatchData.truck_no,
        driver_no: dispatchData.driver_no,
        driver_name: dispatchData.driver_name,
        challan_no: dispatchData.challan_no,
        dispatch_panel_count: dispatchData.dispatch_panel_count,
        company_id,
      };

     const res = await axios.post(
  "http://localhost:3000/api/dispatch/create-dispatch-panel",
  payload,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

     console.log("FULL RESPONSE:", res.data);

          localStorage.setItem(
      "dispatch_main_id",
      res.data.data.dispatch_id
    );
      
      alert("Dispatch Started Successfully");
      setDispatchStarted(true);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to start dispatch");
    }
  };

  /* END DISPATCH */
  const handleEndDispatch = (e) => {
    e.preventDefault();

    localStorage.removeItem("dispatch_main_id");
    localStorage.removeItem("dispatch_panel_type");
    localStorage.removeItem("dispatchPanelData");

    alert("Dispatch Completed");
    window.location.href = "/view-dispatch";
  };

  return (
    <Fragment>
      <PageTitle
        activeMenu="Dispatch Panel"
        motherMenu="Panel Dispatch"
        pageContent="Panel Dispatch"
      />

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Panel Dispatch</h4>
            </div>

            <div className="card-body">
              {/* FIRST FORM */}
              <form onSubmit={handleStartDispatch}>
                <div className="row">
                  {[
                    "dispatch_id",
                    "state",
                    "truck_no",
                    "driver_no",
                    "driver_name",
                    "challan_no",
                  ].map((field) => (
                    <div className="col-md-6 mb-3" key={field}>
                      <label className="form-label">
                        {field.replace(/_/g, " ").toUpperCase()}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name={field}
                        value={dispatchData[field]}
                        onChange={handleChange}
                        disabled={dispatchStarted}
                        required
                      />
                    </div>
                  ))}

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Dispatch Panel Count *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="dispatch_panel_count"
                      value={dispatchData.dispatch_panel_count}
                      onChange={handleChange}
                      disabled={dispatchStarted}
                      required
                    />
                  </div>
                </div>

                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-success px-5"
                    disabled={dispatchStarted}
                  >
                    Start Dispatch
                  </button>
                </div>
              </form>

              {/* SECOND FORM */}
              <form onSubmit={handleEndDispatch}>
                <div className="text-center my-3">
                  <label className="form-label">Panel Type *</label>
                  <div className="d-flex justify-content-center gap-3">
                    {["DCR", "NON_DCR"].map((type) => {
                      const isActive = dispatchData.dispatchType === type;

                      return (
                        <label
                          key={type}
                          className={`btn ${
                            isActive
                              ? "btn-outline-success"
                              : "btn-outline-danger"
                          }`}
                          style={{ width: "150px" }}
                        >
                          <input
                            type="radio"
                            name="dispatchType"
                            value={type}
                            hidden
                            checked={isActive}
                            onChange={handleChange}
                          />
                          {type}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="text-center mb-3">
                  <button
                    type="button"
                    className="btn btn-primary px-5 mb-2"
                    onClick={startScan}
                    disabled={!dispatchStarted}
                  >
                    Scan Panel QR
                  </button>

                  <div className="d-flex justify-content-center gap-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Panel No"
                      style={{ maxWidth: "250px" }}
                      value={manualPanel}
                      onChange={(e) => setManualPanel(e.target.value)}
                      disabled={!dispatchStarted}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleManualAdd}
                      disabled={!dispatchStarted}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {scanning && (
                  <div className="text-center mb-3">
                    <video
                      ref={videoRef}
                      style={{ width: "100%", maxWidth: 350 }}
                    />
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                  </div>
                )}

                <div className="row mt-4">
                  <div className="col-md-6">
                    <label>DCR Panels ({dispatchData.dcrPanels.length})</label>
                    <div className="border rounded p-3">
                      {dispatchData.dcrPanels.map((p, i) => (
                        <span key={i} className="badge bg-success me-2 mb-2">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label>
                      NON-DCR Panels ({dispatchData.nonDcrPanels.length})
                    </label>
                    <div className="border rounded p-3">
                      {dispatchData.nonDcrPanels.map((p, i) => (
                        <span key={i} className="badge bg-success me-2 mb-2">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-success px-5"
                    disabled={!dispatchStarted}
                  >
                    End Dispatch
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DispatchPanel;
