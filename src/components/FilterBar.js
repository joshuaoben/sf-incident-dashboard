import React from "react";

const FilterBar = ({
  filters,
  setFilters,
  currentView,
  callTypes,
  policeDistricts
}) => {
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  const handleResetFilters = () => {
    setFilters({
      priority: "All",
      dateRange: "all",
      search: "",
      callType: "All",
      policeDistricts: "All"
    });
  };

  return (
    <div className="filter-bar">
      <div className="filter-input">
        <input
          className="search-bar"
          type="text"
          placeholder="Search call type"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>

      <div className="filter-input">
        <label>Date Range:</label>
        <select
          value={filters.dateRange}
          onChange={(e) => handleFilterChange("dateRange", e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      <div className="filter-input">
        <label>Priority:</label>
        <select
          value={filters.priority}
          onChange={(e) => handleFilterChange("priority", e.target.value)}
        >
          <option value="All">All</option>
          <option value="A">A - High</option>
          <option value="B">B - Medium</option>
          <option value="C">C - Low</option>
        </select>
      </div>

      <div className="filter-input">
        <label>District:</label>
        <select
          value={filters.policeDistricts}
          onChange={(e) =>
            handleFilterChange("policeDistricts", e.target.value)
          }
        >
          <option value="All">All District</option>
          {policeDistricts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      {/* Show Call Type filter only in Call Volume view */}
      {currentView === "callVolume" && (
        <div className="filter-input">
          <label>Call Type:</label>
          <select
            value={filters.callType}
            onChange={(e) => handleFilterChange("callType", e.target.value)}
          >
            <option value="All">All Types</option>
            {callTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      <button onClick={handleResetFilters}>Reset Filters</button>
    </div>
  );
};

export default FilterBar;
