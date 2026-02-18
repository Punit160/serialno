import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const CommonPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  size = "sm",
  gutter = true,
  variant = "",
  bg = true,
  circle = true,
}) => {

  let items = [];

  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => onPageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <Pagination
      size={size}
      className={`mt-3 justify-content-end pagination-gutter pagination-circle
        ${gutter ? "pagination-gutter" : ""} 
        ${variant && `pagination-${variant}`} 
        ${!bg && "no-bg"} 
        ${circle && "pagination-circle"}
      `}
    >

      {/* Prev */}
      <li className="page-item page-indicator">
        <Link
          className={`page-link ${currentPage === 1 ? "disabled" : ""}`}
          to="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage > 1) onPageChange(currentPage - 1);
          }}
        >
          <i className="la la-angle-left" />
        </Link>
      </li>

      {items}

      {/* Next */}
      <li className="page-item page-indicator">
        <Link
          className={`page-link ${currentPage === totalPages ? "disabled" : ""}`}
          to="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage < totalPages) onPageChange(currentPage + 1);
          }}
        >
          <i className="la la-angle-right" />
        </Link>
      </li>

    </Pagination>
  );
};

CommonPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  size: PropTypes.string,
  gutter: PropTypes.bool,
  variant: PropTypes.string,
  bg: PropTypes.bool,
  circle: PropTypes.bool,
};

export default CommonPagination;
