import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const data = [
  { name: "1/Aug/2025", sales: 0},
  { name: "7/Aug/2025", sales: 500 },
  { name: "13/Aug/2025", sales: 1000 },
  { name: "19/Aug/2025", sales: 1500 },
  { name: "25/Aug/2025", sales: 2000 },
  { name: "31/Aug/2025", sales: 2500 },

];

const Overview = () => {
  return (
    <div className="w-full col-span-1 lg:col-span-2 bg-white p-4 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#14da09ff"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Overview;
