import PageSwiper from "@/app/components/PageSwiper";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function Home() {
  return <PageSwiper initialSlide={0} />;
}
