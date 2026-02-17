import { Fragment, useState, useRef, useEffect } from "react";
import PageTitle from "../../layouts/PageTitle";
import jsQR from "jsqr";

const ReceivePanel = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [image, setImage] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [receiveData, setReceiveData] = useState({
    state: "",
    truckNo: "",
    driverName: "",
    PanelType: "DCR",
    dcrPanels: [],
    nonDcrPanels: [],
  });

  /* ================= CLEANUP CAMERA ================= */
  useEffect(() => {
    return () => stopScan();
  }, []);

  /* ================= START SCAN ================= */
  const startScan = async () => {
    if (scanning) return;
    setScanning(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.setAttribute("playsinline", true);
      await videoRef.current.play();

      requestAnimationFrame(scanFrame);
    } catch (err) {
      alert("Camera not accessible");
      setScanning(false);
    }
  };

  /* ================= SCAN FRAME ================= */
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

  /* ================= STOP CAMERA ================= */
  const stopScan = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  };

  /* ================= SAVE PANEL ================= */
  const savePanel = (panelCode) => {
    setReceiveData((prev) => {
      const existsInDCR = prev.dcrPanels.some((p) => p.code === panelCode);
      const existsInNonDCR = prev.nonDcrPanels.some((p) => p.code === panelCode);

      if (existsInDCR || existsInNonDCR) {
        alert("Panel already scanned");
        return prev;
      }

      const panelObj = {
        code: panelCode,
        time: new Date().toLocaleString(),
      };

      if (prev.PanelType === "DCR") {
        return {
          ...prev,
          dcrPanels: [...prev.dcrPanels, panelObj],
        };
      }

      return {
        ...prev,
        nonDcrPanels: [...prev.nonDcrPanels, panelObj],
      };
    });
  };

  /* ================= TYPE CHANGE ================= */
  const handleTypeChange = (e) => {
    setReceiveData((prev) => ({
      ...prev,
      PanelType: e.target.value,
    }));
  };

  /* ================= MANUAL ADD ================= */
  const addManualPanel = () => {
    if (!manualCode.trim()) {
      alert("Please enter panel code");
      return;
    }
    savePanel(manualCode.trim());
    setManualCode("");
  };

  /* ================= FINAL SUBMIT ================= */
const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Session expired. Please login again.");
    return;
  }

  if (!image) return alert("Image is required");
  if (!remarks.trim()) return alert("Remarks required");

  const allPanels = [
    ...receiveData.dcrPanels.map((p) => p.code),
    ...receiveData.nonDcrPanels.map((p) => p.code),
  ];

  if (allPanels.length === 0) {
    return alert("No panels added");
  }

  try {
    setSubmitting(true);

    for (let panelNo of allPanels) {
      const formData = new FormData();
      formData.append("panel_no", panelNo);
      formData.append("damage_location_type", 2);
      formData.append("remarks", remarks);
      formData.append("image", image);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}damage/create-damage-panel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed");
      }
    }

    alert("Receive Damage Submitted Successfully");

    setReceiveData({
      state: "",
      truckNo: "",
      driverName: "",
      PanelType: "DCR",
      dcrPanels: [],
      nonDcrPanels: [],
    });

    setImage(null);
    setRemarks("");
  } catch (error) {
    console.error(error);
    alert(error.message);
  } finally {
    setSubmitting(false);
  }
};


  return (
    <Fragment>
      <PageTitle
        activeMenu="Receive Damage Panel"
        motherMenu="Panel Management"
        pageContent="Security & Quality Audit"
      />

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Receive Damage Panel</h4>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* PANEL TYPE */}
                <div className="text-center my-3">
                  <label className="form-label">Panel Type *</label>

                  <div className="d-flex justify-content-center gap-3">
                    {["DCR", "NON_DCR"].map((type) => {
                      const isActive = receiveData.PanelType === type;

                      return (
                        <label
                          key={type}
                          className={`btn ${
                            isActive
                              ? "btn-outline-success"
                              : "btn-outline-danger"
                          }`}
                          style={{ width: 150 }}
                        >
                          <input
                            type="radio"
                            hidden
                            value={type}
                            checked={isActive}
                            onChange={handleTypeChange}
                          />
                          {type}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* SCAN + MANUAL */}
                <div className="row justify-content-center align-items-end mb-4">
                  <div className="col-md-4 text-center">
                    <label className="form-label d-block">Scan Panel QR</label>
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={startScan}
                    >
                      Verify Panel QR
                    </button>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Manual Panel Code</label>
                    <div className="input-group">
                      <input
                        className="form-control"
                        placeholder="Enter Panel Code"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={addManualPanel}
                      >
                        Add
                      </button>
                    </div>
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

                {/* IMAGE */}
                <div className="mb-3">
                  <label className="form-label">
                    Image <span className="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                  />
                </div>

                {/* REMARKS */}
                <div className="mt-4">
                  <label className="form-label">Remarks *</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    required
                  />
                </div>

                {/* PANELS LIST */}
                <div className="row mt-4">
                  <div className="col-md-6">
                    <label className="form-label">
                      DCR Panels ({receiveData.dcrPanels.length})
                    </label>
                    <div className="border rounded p-3">
                      {receiveData.dcrPanels.map((p, i) => (
                        <div key={i}>
                          <span className="badge bg-success">{p.code}</span>{" "}
                          <small className="text-muted">{p.time}</small>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      NON-DCR Panels ({receiveData.nonDcrPanels.length})
                    </label>
                    <div className="border rounded p-3">
                      {receiveData.nonDcrPanels.map((p, i) => (
                        <div key={i}>
                          <span className="badge bg-success">{p.code}</span>{" "}
                          <small className="text-muted">{p.time}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-danger px-4"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Damage Report"}
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

export default ReceivePanel;
