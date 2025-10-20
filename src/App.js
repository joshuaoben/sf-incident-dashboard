import { useState, useEffect, useMemo } from "react";
import { fetchIncidents } from "./utils/api";
import IncidentTable from "./components/IncidentsTable";
import CallTypeChart from "./components/CallTypeChart";
import ResponseTimeChart from "./components/ResponseTimeChart";
import FilterBar from "./components/FilterBar";
import "./App.css";

function App() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState("callVolume");
  const [filters, setFilters] = useState({
    priority: "All",
    dateRange: "all",
    search: "",
    callType: "All",
    policeDistricts: "All"
  });

  //Fetch incident data from API on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchIncidents();
        setIncidents(data);
      } catch (error) {
        setError(`Failed to fetch incidents: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle chart click to filter by call type
  const handleChartClick = (value) => {
    if (currentView !== "callVolume") return;

    if (value) {
      // Toggle filter
      if (filters.callType === value) {
        setFilters((prev) => ({
          ...prev,
          callType: "All"
        }));
      } else {
        setFilters((prev) => ({
          ...prev,
          callType: value
        }));
      }
    } else {
      setFilters((prev) => ({ ...prev, callType: "All" }));
    }
  };

  // Apply filters to incidents data
  const filteredIncidents = useMemo(() => {
    let filteredIncidents = [...incidents];

    // Priority filter
    if (filters.priority !== "All") {
      filteredIncidents = filteredIncidents.filter(
        (i) => i.priority_final === filters.priority
      );
    }

    // Police district filter
    if (filters.policeDistricts !== "All") {
      filteredIncidents = filteredIncidents.filter(
        (i) => i.police_district === filters.policeDistricts
      );
    }

    // Search filter
    if (filters.search) {
      filteredIncidents = filteredIncidents.filter(
        (i) =>
          (i.call_type_final_desc &&
            i.call_type_final_desc
              .toLowerCase()
              .includes(filters.search.toLowerCase())) ||
          (i.call_type_original_desc &&
            i.call_type_original_desc
              .toLowerCase()
              .includes(filters.search.toLowerCase()))
      );
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      const cutoffDate = new Date();

      if (filters.dateRange === "24h") cutoffDate.setHours(now.getHours() - 24);
      if (filters.dateRange === "7d") cutoffDate.setDate(now.getDate() - 7);
      if (filters.dateRange === "30d") cutoffDate.setDate(now.getDate() - 30);

      filteredIncidents = filteredIncidents.filter((i) => {
        if (!i.received_datetime) return false;
        return new Date(i.received_datetime) >= cutoffDate;
      });
    }

    // Call type filter (only for call volume view)
    if (currentView === "callVolume" && filters.callType !== "All") {
      filteredIncidents = filteredIncidents.filter(
        (i) => i.call_type_final_desc === filters.callType
      );
    }

    return filteredIncidents;
  }, [incidents, filters, currentView]);

  // Calculate metrics
  const totalCalls = filteredIncidents.length;

  // Calculate average response time in minutes
  const avgResponseTime = useMemo(() => {
    const times = filteredIncidents
      .filter((i) => i.received_datetime && i.onscene_datetime)
      .map((i) => new Date(i.onscene_datetime) - new Date(i.received_datetime));

    if (times.length === 0) return 0;
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    return Math.round(avg / 60000); // convert to minutes
  }, [filteredIncidents]);

  // Calculate percentage of high priority calls
  const highPriorityPercent = useMemo(() => {
    const highPriority = filteredIncidents.filter(
      (i) => i.priority_final === "A"
    ).length;
    return totalCalls > 0 ? Math.round((highPriority / totalCalls) * 100) : 0;
  }, [filteredIncidents, totalCalls]);

  // Determine top police district by call volume
  const topDistrict = useMemo(() => {
    const counts = {};
    filteredIncidents.forEach((i) => {
      if (i.police_district) {
        counts[i.police_district] = (counts[i.police_district] || 0) + 1;
      }
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : "N/A";
  }, [filteredIncidents]);

  if (loading) return <div className="loading">Loading data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-left">
          <h1>SF Incident Dashboard</h1>
          <div>
            <select
              value={currentView}
              onChange={(e) => setCurrentView(e.target.value)}
              style={{ padding: "8px", fontSize: "14px" }}
            >
              <option value="callVolume">Call Volume Analysis</option>
              <option value="responseTime">Response Performance</option>
            </select>
          </div>
        </div>
        <div className="metrics">
          <div className="metric-card">
            <h3>{totalCalls}</h3>
            <p>Total Calls</p>
          </div>
          <div className="metric-card">
            <h3>{avgResponseTime} min</h3>
            <p>Average Res Time</p>
          </div>
          <div className="metric-card">
            <h3>{highPriorityPercent}%</h3>
            <p>High Priority</p>
          </div>
          <div className="metric-card">
            <h3>{topDistrict}</h3>
            <p>Top District</p>
          </div>
        </div>
      </div>

      {/* Show appropriate chart based on current view */}
      {currentView === "callVolume" ? (
        <CallTypeChart
          data={filteredIncidents}
          onChartClick={handleChartClick}
          selectedCallType={
            filters.callType !== "All" ? filters.callType : null
          }
        />
      ) : (
        <ResponseTimeChart data={filteredIncidents} />
      )}

      <div className="card table-wrapper">
        <div className="filter-container">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            currentView={currentView}
            callTypes={[
              ...new Set(incidents.map((i) => i.call_type_final_desc))
            ]}
            policeDistricts={[
              ...new Set(
                incidents.map((i) => i.police_district).filter(Boolean)
              )
            ]}
          />
        </div>
        <IncidentTable data={filteredIncidents} />
      </div>
    </div>
  );
}

export default App;
