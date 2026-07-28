"use client";

import DetailPageLayout from "@/app/components/DetailPageLayout";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  useComposition,
  type CompositionMaterial,
} from "@/app/hooks/useComposition";
import { useTranslations } from "next-intl";

export default function CompositionContent() {
  const translation = useTranslations("composition");
  const data = useComposition();
  const [showAll, setShowAll] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!data) {
    return <DetailPageLayout title="Composition" />;
  }

  const mainMaterials = data.materials.filter((m) => m.main);
  const secondaryMaterials = data.materials.filter((m) => !m.main);

  return (
    <DetailPageLayout title="Composition">
      {/* Chart + legend side by side on sm+, stacked on mobile */}
      <div className="w-full mb-8 flex flex-col sm:flex-row sm:items-center sm:gap-6">
        {/* Pie chart — sin etiquetas radiales */}
        <div className="w-full sm:w-1/2 h-64 sm:h-80 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.materials}
                dataKey="percentage"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="35%"
                outerRadius="65%"
                paddingAngle={2}
                strokeWidth={0}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.materials.map((mat, index) => (
                  <Cell
                    key={index}
                    fill={mat.color}
                    opacity={
                      activeIndex === null || activeIndex === index ? 1 : 0.45
                    }
                    style={{
                      transition: "opacity 0.2s ease",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => {
                  if (typeof value === "number") {
                    return [`${value}%`, ""];
                  }
                  return value;
                }}
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  padding: "6px 12px",
                }}
                itemStyle={{ color: "inherit" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Leyenda externa — nunca se recorta */}
        <ul className="flex flex-col gap-2 sm:gap-3 mt-4 sm:mt-0 w-full sm:w-1/2">
          {data.materials.map((mat, index) => (
            <li
              key={index}
              className="flex items-center gap-2.5 cursor-default"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <span
                className="inline-block size-2.5 rounded-full shrink-0"
                style={{ backgroundColor: mat.color }}
              />
              <span
                className="text-sm font-semibold truncate"
                style={{
                  color:
                    activeIndex === null || activeIndex === index
                      ? mat.color
                      : undefined,
                }}
              >
                {mat.name}
              </span>
              <span className="ml-auto text-sm font-semibold text-neutral-500 dark:text-neutral-400 shrink-0">
                {mat.percentage}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Material cards */}
      <div className="space-y-4">
        {mainMaterials.map((mat, index) => (
          <MaterialCard key={index} material={mat} />
        ))}
      </div>

      {secondaryMaterials.length > 0 && (
        <>
          {showAll && (
            <div className="space-y-4 mt-4">
              {secondaryMaterials.map((mat, index) => (
                <MaterialCard key={index} material={mat} />
              ))}
            </div>
          )}
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1 mt-6 text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors cursor-pointer"
          >
            {showAll ? translation("showLess") : translation("showAll")} &rarr;
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
        <span className="ml-auto text-sm font-semibold text-neutral-500 dark:text-neutral-400 shrink-0">
          {material.percentage}%
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
        {material.description}
      </p>
    </div>
  );
}
