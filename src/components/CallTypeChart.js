import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const CallTypeChart = ({ data, onChartClick, selectedCallType }) => {
  // Prepare chart data, and get top 12 call types by volume
  const chartData = useMemo(() => {
    const counts = {};
    data.forEach((incident) => {
      const callType = incident.call_type_final_desc || "Unknown";
      if (callType) {
        counts[callType] = (counts[callType] || 0) + 1;
      }
    });

    const sortedCallTypes = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    return sortedCallTypes;
  }, [data]);

  const handleChartClick = (data) => {
    if (data && data.name) {
      const callType = data.name;
      onChartClick(callType);
    }
  };

  return (
    <div className="card">
      <h2>Call Volume Analysis</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            interval={0}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              // Truncate long call type names for better display
              return value.length > 12 ? value.substring(0, 12) + "..." : value;
            }}
          />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="#8884d8"
            cursor="pointer"
            onClick={handleChartClick}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CallTypeChart;
