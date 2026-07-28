"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import useEmblaCarousel from "embla-carousel-react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import DetailPageLayout from "@/app/components/DetailPageLayout";
import ImageCarousel from "@/app/components/ImageCarousel";
import {
  useSupplyChain,
  type SupplyChainStage,
} from "@/app/hooks/useSupplyChain";

const SupplyChainMap = dynamic(
  () => import("@/app/components/SupplyChainMap"),
  { ssr: false },
);

export default function SupplyChainContent() {
  const supplyChain = useSupplyChain();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [modalStage, setModalStage] = useState<SupplyChainStage | null>(null);
  const timelineRefs = useRef<Map<number, HTMLLIElement>>(new Map());

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
  });

  // Sync embla scroll → selected stage (mobile)
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const idx = emblaApi.selectedScrollSnap();
      if (supplyChain) {
        setSelectedId(supplyChain.stages[idx]?.id ?? null);
      }
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, supplyChain]);

  const scrollEmblaTo = useCallback(
    (id: number) => {
      if (!emblaApi || !supplyChain) return;
      const idx = supplyChain.stages.findIndex((s) => s.id === id);
      if (idx >= 0) emblaApi.scrollTo(idx);
    },
    [emblaApi, supplyChain],
  );

  if (!supplyChain) return null;

  const { stages } = supplyChain;

  function handleStageSelect(id: number) {
    setSelectedId(id);
    const el = timelineRefs.current.get(id);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    scrollEmblaTo(id);
  }

  function handleStageOpen(id: number) {
    const stage = stages.find((s) => s.id === id);
    if (stage) {
      setSelectedId(id);
      setModalStage(stage);
      const el = timelineRefs.current.get(id);
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function handleMapMarkerClick(id: number) {
    handleStageSelect(id);
    handleStageOpen(id);
  }

  return (
    <DetailPageLayout title="Supply Chain" wide>
      {/* Desktop: map + timeline side by side */}
      <div className="flex flex-col lg:flex-row lg:gap-8">
        {/* Map */}
        <div className="flex-1 min-w-0">
          <div className="h-64 sm:h-80 lg:h-[32rem] rounded-2xl overflow-hidden">
            <SupplyChainMap
              stages={stages}
              selectedStageId={selectedId}
              onStageSelect={handleMapMarkerClick}
            />
          </div>
        </div>

        {/* Desktop timeline */}
        <div className="hidden lg:block w-72 shrink-0 h-[32rem] overflow-y-auto">
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {stages.map((stage, i) => {
                const isSelected = stage.id === selectedId;
                return (
                  <li
                    key={stage.id}
                    ref={(el) => {
                      if (el) timelineRefs.current.set(stage.id, el);
                    }}
                  >
                    <div className="relative pb-8">
                      {i !== stages.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-neutral-200 dark:bg-neutral-700"
                        />
                      )}
                      <div className="relative flex items-center space-x-3">
                        <button
                          onClick={() => handleStageSelect(stage.id)}
                          className="flex-1 flex space-x-3 text-left cursor-pointer group"
                        >
                          <div>
                            <span
                              className={`flex size-8 items-center justify-center rounded-full text-xs font-bold ring-4 ring-white dark:ring-neutral-900 transition-colors ${
                                isSelected
                                  ? "bg-primary-500 text-white"
                                  : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 group-hover:bg-neutral-300 dark:group-hover:bg-neutral-600"
                              }`}
                            >
                              {stage.id}
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col pt-0.5">
                            <p
                              className={`text-sm font-semibold transition-colors ${
                                isSelected
                                  ? "text-primary-600 dark:text-primary-400"
                                  : "text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400"
                              }`}
                            >
                              {stage.name}
                            </p>
                            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                              {stage.description}
                            </p>
                          </div>
                        </button>
                        <button
                          onClick={() => handleStageOpen(stage.id)}
                          aria-label={`Details for ${stage.name}`}
                          className="shrink-0 rounded-full p-1 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors cursor-pointer"
                        >
                          <InformationCircleIcon className="size-7" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile: compact card swiper below map */}
      <div className="mt-4 lg:hidden overflow-hidden -mx-1 px-1" ref={emblaRef}>
        <div className="flex gap-3 py-1">
          {stages.map((stage) => {
            const isSelected = stage.id === selectedId;
            return (
              <div
                key={stage.id}
                className="min-w-0 grow-0 shrink-0 basis-[70%] sm:basis-[50%]"
              >
                <button
                  onClick={() => handleStageOpen(stage.id)}
                  className={`w-full text-left rounded-2xl bg-neutral-100 dark:bg-neutral-800 px-4 py-3 cursor-pointer transition-shadow ${
                    isSelected ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
                  }`}
                >
                  <p className="text-[10px] font-semibold text-blue-500 dark:text-blue-400">
                    Stage {stage.id}
                  </p>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                    {stage.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                    {stage.description}
                  </p>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-neutral-400 dark:text-neutral-500 lg:hidden">
        Step {selectedId ?? 1} of {stages.length}
      </p>

      {/* Stage detail modal */}
      <Dialog
        open={modalStage !== null}
        onClose={() => setModalStage(null)}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-neutral-900/50 transition-opacity duration-200 data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-800 shadow-xl transition duration-200 data-closed:scale-95 data-closed:opacity-0"
          >
            {modalStage && (
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-blue-500 dark:text-blue-400 mb-1">
                      Stage {modalStage.id}
                    </p>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                      {modalStage.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setModalStage(null)}
                    className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    <XMarkIcon className="size-5" />
                  </button>
                </div>

                {modalStage.images.length > 0 && (
                  <ImageCarousel images={modalStage.images} />
                )}

                <p className="overflow-y-auto h-40 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {modalStage.description}
                </p>
              </div>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </DetailPageLayout>
  );
}
