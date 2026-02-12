import PropTypes from "prop-types";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import {
  exportCSV,
  exportExcel,
  exportPDF,
  printTable
} from "./ExportUtils";

const TableExportActions = ({
  data,
  columns,
  fileName,
  actions
}) => {
  return (
    <div className="d-flex gap-2">
      {actions.includes("csv") && (
        <button
          className="btn btn-outline-primary btn-sm"
          title="CSV"
          onClick={() => exportCSV(data, fileName)}
        >
          <FaFileCsv />
        </button>
      )}

      {actions.includes("excel") && (
        <button
          className="btn btn-outline-success btn-sm"
          title="Excel"
          onClick={() => exportExcel(data, fileName)}
        >
          <FaFileExcel />
        </button>
      )}

      {actions.includes("pdf") && (
        <button
          className="btn btn-outline-danger btn-sm"
          title="PDF"
          onClick={() => exportPDF(data, columns, fileName)}
        >
          <FaFilePdf />
        </button>
      )}

      {actions.includes("print") && (
        <button
          className="btn btn-outline-dark btn-sm"
          title="Print"
          onClick={printTable}
        >
          <FaPrint />
        </button>
      )}
    </div>
  );
};

/* ================= PROPS VALIDATION ================= */

TableExportActions.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired
    })
  ),
  fileName: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.oneOf(["csv", "excel", "pdf", "print"])
  )
};

/* ================= DEFAULT PROPS ================= */

TableExportActions.defaultProps = {
  columns: [],
  actions: ["csv", "excel", "pdf", "print"]
};

export default TableExportActions;
