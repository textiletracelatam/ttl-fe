"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import DetailPageLayout from "@/app/components/DetailPageLayout";
import { useComposition, type CompositionMaterial } from "@/app/hooks/useComposition";

const RADIAN = Math.PI / 180;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderRadialLabel(props: any) {
  const { cx, cy, midAngle, outerRadius, name, percentage, fill } = props;
  const radius = outerRadius + 24;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={fill}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {name} {percentage}%
    </text>
  );
}

export default function CompositionPage() {
  const data = useComposition();
  const [showAll, setShowAll] = useState(false);

  if (!data) {
    return <DetailPageLayout title="Composition" />;
  }

  const mainMaterials = data.materials.filter((m) => m.main);
  const secondaryMaterials = data.materials.filter((m) => !m.main);

  return (
    <DetailPageLayout title="Composition">
      {/* Pie chart with radial labels */}
      <div className="w-full h-80 sm:h-96 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.materials}
              dataKey="percentage"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="50%"
              paddingAngle={2}
              strokeWidth={0}
              label={renderRadialLabel}
              labelLine={false}
            >
              {data.materials.map((mat) => (
                <Cell key={mat.name} fill={mat.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Main material cards */}
      <div className="space-y-4">
        {mainMaterials.map((mat) => (
          <MaterialCard key={mat.name} material={mat} />
        ))}
      </div>

      {/* Secondary materials toggle */}
      {secondaryMaterials.length > 0 && (
        <>
          {showAll && (
            <div className="space-y-4 mt-4">
              {secondaryMaterials.map((mat) => (
                <MaterialCard key={mat.name} material={mat} />
              ))}
            </div>
          )}
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1 mt-6 text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors cursor-pointer"
          >
            {showAll ? "Show less" : "Show all components"} &rarr;
          </button>
        </>
      )}
    </DetailPageLayout>
  );
}

function MaterialCard({ material }: { material: CompositionMaterial }) {
  return (
    <div className="rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span
          className="inline-block size-3 rounded-full shrink-0"
          style={{ backgroundColor: material.color }}
        />
        <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
          {material.name}
        </h3>
        <span className="ml-auto text-sm font-semibold text-neutral-500 dark:text-neutral-400">
          {material.percentage}%
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
        {material.description}
      </p>
    </div>
  );
}
