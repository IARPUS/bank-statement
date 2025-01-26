'use client';


import AnalysisSelectionMenu from '@/app/components/AnalysisSelectionMenu'


export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <AnalysisSelectionMenu></AnalysisSelectionMenu>

      <section>{children}</section>
    </>


  );
}
