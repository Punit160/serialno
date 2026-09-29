const Search = ({
  value = "",
  onChange,
  placeholder = "Search here...",
}) => {
  return (
    <div className="klk-search">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
          >
            <i className="fa fa-times" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
