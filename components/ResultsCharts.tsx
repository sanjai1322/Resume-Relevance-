import React, { useMemo } from 'react';
import { ResumeAnalysis } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ResultsChartsProps {
  analyses: ResumeAnalysis[];
}

// FIX: Add explicit types for the recharts Pie component's label renderer props.
// The props were being inferred as `unknown`, causing errors in arithmetic operations.
interface PieLabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    value: number;
    index: number;
}

const COLORS = {
    High: '#22c55e', // green-500
    Medium: '#eab308', // yellow-500
    Low: '#ef4444', // red-500
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-slate-800 border border-slate-600 rounded-md shadow-lg">
        <p className="label font-bold text-amber-400">{`${label}`}</p>
        <p className="intro text-slate-300">{`Score: ${payload[0].value}`}</p>
        <p className="intro text-slate-300">{`Verdict: ${payload[0].payload.verdict}`}</p>
      </div>
    );
  }
  return null;
};


const ResultsCharts: React.FC<ResultsChartsProps> = ({ analyses }) => {
  const chartData = useMemo(() => {
    return analyses.map(a => ({
      name: a.fileName.length > 15 ? `${a.fileName.substring(0, 12)}...` : a.fileName,
      score: a.finalScore,
      verdict: a.verdict,
      fill: a.verdict === 'High' ? COLORS.High : a.verdict === 'Medium' ? COLORS.Medium : COLORS.Low
    }));
  }, [analyses]);

  const pieData = useMemo(() => {
    const counts = analyses.reduce((acc, curr) => {
        acc[curr.verdict] = (acc[curr.verdict] || 0) + 1;
        return acc;
    }, {} as Record<'High' | 'Medium' | 'Low', number>);
    
    return Object.entries(counts).map(([name, value]) => ({ name, value })) as {name: 'High' | 'Medium' | 'Low', value: number}[];
  }, [analyses]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
      <div className="md:col-span-3 h-80">
        <h3 className="text-lg font-semibold text-center mb-2 text-slate-300">Resume Scores Comparison</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(71, 85, 105, 0.5)'}} />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="md:col-span-2 h-80">
         <h3 className="text-lg font-semibold text-center mb-2 text-slate-300">Verdict Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              // FIX: The label prop function signature was incompatible with recharts' expected type.
              // Changed to accept `props: any` and use a type assertion internally to achieve type safety
              // without causing a component prop type mismatch.
              label={(props: any) => {
                  const { cx, cy, midAngle, innerRadius, outerRadius, value, index } = props as PieLabelProps;
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text x={x} y={y} fill="#cbd5e1" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                      {`${pieData[index].name} (${value})`}
                    </text>
                  );
                }}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip content={({ active, payload }: any) => {
                if (active && payload && payload.length) {
                    return (
                    <div className="p-2 bg-slate-800 border border-slate-600 rounded-md shadow-lg">
                        <p className="label font-bold" style={{ color: payload[0].payload.fill }}>{`${payload[0].name}: ${payload[0].value}`}</p>
                    </div>
                    );
                }
                return null;
            }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResultsCharts;