import BuilderPanel from '@/components/builder/BuilderPanel';
import OutputPanel from '@/components/output/OutputPanel';
import Header from '@/components/layout/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header />
      <main className="flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto bg-white border-x shadow-sm h-[calc(100vh-73px)] overflow-hidden">

        {/* Left Side: Builder Panel */}
        <section className="flex-1 md:w-2/3 h-full pb-10">
          <BuilderPanel />
        </section>

        {/* Right Side: Output Panel */}
        <aside className="w-full md:w-1/3 min-w-[320px] max-w-sm h-full">
          <OutputPanel />
        </aside>

      </main>
    </div>
  );
}
