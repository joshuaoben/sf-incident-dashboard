import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const ResponseTimeChart = ({ data }) => {
  // Calculate average response time per each hour of the day
  const chartData = useMemo(() => {
    const hourlyData = {};

    data.forEach((incident) => {
      if (!incident.received_datetime || !incident.onscene_datetime) return;

      const receivedTime = new Date(incident.received_datetime);
      const onSceneTime = new Date(incident.onscene_datetime);

      // Validate date objects and skip if invalid
      if (isNaN(receivedTime.getTime()) || isNaN(onSceneTime.getTime())) return;

      const hour = receivedTime.getHours();
      const responseTime = (onSceneTime - receivedTime) / (1000 * 60);

      // Skip negative response times
      if (responseTime < 0) {
        return;
      }

      if (!hourlyData[hour]) {
        hourlyData[hour] = {
          count: 0,
          totalResponseTime: 0
        };
      }

      hourlyData[hour].count += 1;
      hourlyData[hour].totalResponseTime += responseTime;
    });

    // Create data array for all 24 hours
    const result = [];
    for (let hour = 0; hour < 24; hour++) {
      if (hourlyData[hour]) {
        const avgResponseTime =
          hourlyData[hour].totalResponseTime / hourlyData[hour].count;
        result.push({
          hour: `${hour}:00`,
          avgResponseTime: Math.round(avgResponseTime)
        });
      } else {
        result.push({
          hour: `${hour}:00`,
          avgResponseTime: 0
        });
      }
    }

    return result;
  }, [data]);

  return (
    <div className="card">
      <h2>Response Time Chart</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" interval={0} style={{ fontSize: "12px" }} />
          <YAxis
            label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="avgResponseTime"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResponseTimeChart;
