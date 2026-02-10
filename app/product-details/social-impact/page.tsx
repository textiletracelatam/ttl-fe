"use client";

import DetailPageLayout from "@/app/components/DetailPageLayout";
import ImageCarousel from "@/app/components/ImageCarousel";
import { useSocialImpact } from "@/app/hooks/useSocialImpact";

export default function SocialImpactPage() {
  const data = useSocialImpact();

  return (
    <DetailPageLayout title="Social Impact">
      {data && (
        <>
          <ImageCarousel images={data.images} />

          <p className="mt-6 text-sm sm:text-base leading-7 text-neutral-700 dark:text-neutral-300">
            {data.text}
          </p>

          {/* Compliance table */}
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
                  <table className="relative min-w-full divide-y divide-gray-300 dark:divide-white/15">
                    <thead className="bg-gray-50 dark:bg-gray-800/75">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6 dark:text-gray-200"
                        >
                          Applicable Social Impact Regulations & Standards
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                        >
                          Compliance Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-white/10 dark:bg-gray-800/50">
                      {data.compliance.map((item) => (
                        <tr key={item.name}>
                          <td className="py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:pl-6 dark:text-white">
                            {item.name}
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400 capitalize">
                            {item.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <a
            href={data.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-8 text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            {data.linkLabel} &rarr;
          </a>
        </>
      )}
    </DetailPageLayout>
  );
}
