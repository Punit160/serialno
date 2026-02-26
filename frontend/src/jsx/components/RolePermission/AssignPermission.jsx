/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const modules = [
    "Solar Panel",
    "Tracking System",
    "Battery",
    "Dispatch",
    "Users",
    
];

const PermissionPopup = ({ show, onClose, role }) => {
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    const initial = {};
    modules.forEach((m) => {
      initial[m] = {
        view: false,
        add: false,
        edit: false,
        delete: false,
      };
    });
    setPermissions(initial);
  }, [role]);

  if (!show) return null;

  // Toggle single permission
  const toggle = (module, perm) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [perm]: !prev[module][perm],
      },
    }));
  };

  // Toggle all permissions
  const toggleAll = (module) => {
    const allChecked = Object.values(permissions[module]).every((v) => v);

    const updated = {};
    Object.keys(permissions[module]).forEach((k) => {
      updated[k] = !allChecked;
    });

    setPermissions((prev) => ({
      ...prev,
      [module]: updated,
    }));
  };

  return (
    <>
      <div className="modal-backdrop show"></div>

      <div className="modal d-block">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">

            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                Role Permission : <strong>{role?.name}</strong>
              </h5>

              <button className="btn-close" onClick={onClose}></button>
            </div>

            {/* Body */}
            <div className="modal-body">

              <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle">

                  <thead className="table-light">
                    <tr>
                      <th>Module</th>
                      <th className="text-center">All</th>
                      <th className="text-center">View</th>
                      <th className="text-center">Add</th>
                      <th className="text-center">Edit</th>
                      <th className="text-center">Delete</th>
                    </tr>
                  </thead>

                  <tbody>
                    {modules.map((module, index) => (
                      <tr key={module}>
                        <td>
                          <strong>{module}</strong>
                        </td>

                        {/* ALL */}
                        <td className="text-center">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={
                              permissions[module] &&
                              Object.values(permissions[module]).every(v => v)
                            }
                            onChange={() => toggleAll(module)}
                          />
                        </td>

                        {/* INDIVIDUAL */}
                        {["view", "add", "edit", "delete"].map((perm, i) => (
                          <td key={perm} className="text-center">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={permissions[module]?.[perm] || false}
                              onChange={() => toggle(module, perm)}
                            />
                          </td>
                        ))}

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>

              <button
                className="btn btn-success "
                onClick={() => {
                  console.log("Saved Permissions:", permissions);
                  onClose();
                }}
              >
                Save Permissions
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default PermissionPopup;