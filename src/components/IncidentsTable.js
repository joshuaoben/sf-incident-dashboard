import { useState, useEffect, useMemo } from "react";

const IncidentsTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "received_datetime",
    direction: "desc"
  });
  const rowsPerPage = 10;

  // Sort data based on sort configuration
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Reset to first page when data or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Toggle sort direction or change sort key when column header is clicked
  const handleSort = (columnKey) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === columnKey) {
        return {
          key: columnKey,
          direction: prevConfig.direction === "asc" ? "desc" : "asc"
        };
      }
      return { key: columnKey, direction: "asc" };
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <div className="table-container">
        <div className="table-wrapper">
          {sortedData.length === 0 ? (
            <div className="no-data">
              <p>No incidents found</p>
              <span>Try adjusting your filters</span>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort("id")}>
                    {sortConfig.key === "id"
                      ? sortConfig.direction === "asc"
                        ? "↑ "
                        : "↓ "
                      : ""}
                    ID
                  </th>
                  <th onClick={() => handleSort("cad_number")}>
                    {sortConfig.key === "cad_number"
                      ? sortConfig.direction === "asc"
                        ? "↑ "
                        : "↓"
                      : ""}
                    CAD Number
                  </th>
                  <th onClick={() => handleSort("received_datetime")}>
                    {sortConfig.key === "received_datetime"
                      ? sortConfig.direction === "asc"
                        ? "↑ "
                        : "↓ "
                      : ""}
                    Received
                  </th>
                  <th onClick={() => handleSort("onscene_datetime")}>
                    {sortConfig.key === "onscene_datetime"
                      ? sortConfig.direction === "asc"
                        ? "↑ "
                        : "↓ "
                      : ""}
                    On Scene
                  </th>
                  <th onClick={() => handleSort("close_datetime")}>
                    {sortConfig.key === "close_datetime"
                      ? sortConfig.direction === "asc"
                        ? "↑ "
                        : "↓ "
                      : ""}
                    Close
                  </th>
                  <th onClick={() => handleSort("call_type_original")}>
                    {sortConfig.key === "call_type_original"
                      ? sortConfig.direction === "asc"
                        ? "↑ "
                        : "↓ "
                      : ""}
                    Call Type O
                  </th>
                  <th onClick={() => handleSort("call_type_original_desc")}>
                    {sortConfig.key === "call_type_original_desc"
                      ? sortConfig.direction === "asc"
                        ? "↑ "
                        : "↓ "
                      : ""}
                    Call Type O Desc
                  </th>
                  <th onClick={() => handleSort("call_type_final")}>
                    {sortConfig.key === "call_type_final"
                      ? sortConfig.direction === "asc"
                        ? "↑ "
                        : "↓ "
                      : ""}
                    Call Type F{" "}
                  </th>
                  <th onClick={() => handleSort("call_type_final_desc")}>
                    {sortConfig.key === "call_type_final_desc"
                      ? sortConfig.direction === "asc"
                        ? "↑ "
                        : "↓ "
                      : ""}
                    Call Type F Desc
                  </th>
                  <th onClick={() => handleSort("priority_final")}>
                    {sortConfig.key === "priority_final"
                      ? sortConfig.direction === "asc"
                        ? "↑ "
                        : "↓ "
                      : ""}
                    Priority
                  </th>
                  <th onClick={() => handleSort("agency")}>
                    {sortConfig.key === "agency"
                      ? sortConfig.direction === "asc"
                        ? "↑ "
                        : "↓ "
                      : ""}
                    Agency
                  </th>
                  <th onClick={() => handleSort("police_district")}>
                    {sortConfig.key === "police_district"
                      ? sortConfig.direction === "asc"
                        ? "↑ "
                        : "↓ "
                      : ""}
                    Police District
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((incident) => (
                  <tr key={incident.id}>
                    <td>{incident.id || "N/A"}</td>
                    <td>{incident.cad_number || "N/A"}</td>
                    <td>{formatDate(incident.received_datetime)}</td>
                    <td>{formatDate(incident.onscene_datetime)}</td>
                    <td>{formatDate(incident.close_datetime)}</td>
                    <td>{incident.call_type_original || "N/A"}</td>
                    <td>{incident.call_type_original_desc || "N/A"}</td>
                    <td>{incident.call_type_final || "N/A"}</td>
                    <td>{incident.call_type_final_desc || "N/A"}</td>
                    <td>
                      <span
                        className={`priority-badge priority-${(
                          incident.priority_final || "c"
                        ).toLowerCase()}`}
                      >
                        {incident.priority_final || "N/A"}
                      </span>
                    </td>
                    <td>{incident.agency || "N/A"}</td>
                    <td>{incident.police_district || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="pagination">
          <div>
            Showing {startIndex + 1} -{" "}
            {Math.min(startIndex + rowsPerPage, sortedData.length)} of{" "}
            {sortedData.length}
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span style={{ margin: "0 15px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default IncidentsTable;
