import { Fragment, useState, useRef, useEffect } from "react";
import PageTitle from "../../layouts/PageTitle";
import jsQR from "jsqr";

const DamagePanel = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [image, setImage] = useState(null);

  const [damageData, setDamageData] = useState({
    PanelType: "DCR",
    dcrPanels: [],
    nonDcrPanels: [],
    remarks: "",
  });

  /* ===== CLEANUP ===== */
  useEffect(() => {
    return () => stopScan();
  }, []);

  /* ===== START SCAN ===== */
  const startScan = async () => {
    if (scanning) return;
    setScanning(true);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });

    streamRef.current = stream;
    videoRef.current.srcObject = stream;
    videoRef.current.setAttribute("playsinline", true);
    await videoRef.current.play();

    requestAnimationFrame(scanFrame);
  };

  /* ===== SCAN FRAME ===== */
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

  /* ===== STOP CAMERA ===== */
  const stopScan = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  };

  /* ===== SAVE PANEL ===== */
  const savePanel = (panelCode) => {
    const panelObj = {
      code: panelCode,
      time: new Date().toLocaleString(),
    };

    setDamageData((prev) => {
      if (prev.PanelType === "DCR") {
        return { ...prev, dcrPanels: [...prev.dcrPanels, panelObj] };
      }
      return { ...prev, nonDcrPanels: [...prev.nonDcrPanels, panelObj] };
    });
  };

  /* ===== TYPE CHANGE ===== */
  const handleTypeChange = (e) => {
    setDamageData((prev) => ({
      ...prev,
      PanelType: e.target.value,
    }));
  };

  /* ===== MANUAL ADD ===== */
  const addManualPanel = () => {
    if (!manualCode.trim()) return alert("Enter panel code");
    savePanel(manualCode.trim());
    setManualCode("");
  };

  /* ===== SUBMIT ===== */
const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  const allPanels = [
    ...damageData.dcrPanels.map((p) => ({
      panel_no: p.code,
      damage_location_type: 1,
      panel_type: 1,
    })),
    ...damageData.nonDcrPanels.map((p) => ({
      panel_no: p.code,
      damage_location_type: 1,
      panel_type: 2,
    })),
  ];

  if (allPanels.length === 0) {
    return alert("No panels added");
  }

  try {
    for (let panel of allPanels) {
      const formData = new FormData();
      formData.append("panel_no", panel.panel_no);
      formData.append("damage_location_type", panel.damage_location_type);
      formData.append("panel_type", panel.panel_type);
      formData.append("remarks", damageData.remarks);

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}damage/create-damage-panel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ SEND TOKEN
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Server Error");
      }
    }

    alert("Damage Report Submitted Successfully");

    setDamageData({
      PanelType: "DCR",
      dcrPanels: [],
      nonDcrPanels: [],
      remarks: "",
    });
    setImage(null);
  } catch (error) {
    console.error("Backend Error:", error.message);
    alert("Error: " + error.message);
  }
};




  return (
    <Fragment>
      <PageTitle
        activeMenu="Damage Panel"
        motherMenu="Panel Management"
        pageContent="Scan & Report Damaged Panel"
      />

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Damage Panel Scan</h4>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* PANEL TYPE */}
                <div className="text-center mb-4">
                  <label className="form-label">Panel Type *</label>

                  <div className="d-flex justify-content-center gap-3">
                    {["DCR", "NON_DCR"].map((type) => (
                      <label
                        key={type}
                        className={`btn ${
                          damageData.PanelType === type
                            ? "btn-outline-success"
                            : "btn-outline-danger"
                        }`}
                        style={{ width: 150 }}
                      >
                        <input
                          hidden
                          type="radio"
                          value={type}
                          checked={damageData.PanelType === type}
                          onChange={handleTypeChange}
                        />
                        {type}
                      </label>
                    ))}
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


                  <div className="col-md-12 ">
                    <div className="form-group mb-3">
                      <label className="form-label">
                        Image <span className="text-danger">*</span>
                      </label>
                    <input
                          type="file"
                          className="form-control"
                          name="image"
                          onChange={(e) => setImage(e.target.files[0])}
                          required
                        />

                    </div>
                  </div>

                {/* REMARKS */}
                <div className="mt-4">
                  <label className="form-label">Remarks *</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={damageData.remarks}
                    onChange={(e) =>
                      setDamageData({ ...damageData, remarks: e.target.value })
                    }
                    required
                  />
                </div>

                {/* PANEL DISPLAY */}
                <div className="row mt-4">
                  <div className="col-md-6">
                    <label className="form-label">
                      DCR Panels ({damageData.dcrPanels.length})
                    </label>
                    <div className="border rounded p-3" style={{ minHeight: 120 }}>
                      {damageData.dcrPanels.length === 0 ? (
                        <p className="text-muted">No DCR panels</p>
                      ) : (
                        damageData.dcrPanels.map((p, i) => (
                          <div key={i}>
                            <span className="badge bg-success">{p.code}</span>{" "}
                            <small className="text-muted">{p.time}</small>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      NON-DCR Panels ({damageData.nonDcrPanels.length})
                    </label>
                    <div className="border rounded p-3" style={{ minHeight: 120 }}>
                      {damageData.nonDcrPanels.length === 0 ? (
                        <p className="text-muted">No NON-DCR panels</p>
                      ) : (
                        damageData.nonDcrPanels.map((p, i) => (
                          <div key={i}>
                            <span className="badge bg-success">{p.code}</span>{" "}
                            <small className="text-muted">{p.time}</small>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <button type="submit" className="btn btn-danger px-4">
                    Submit Damage Report
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

export default DamagePanel;
