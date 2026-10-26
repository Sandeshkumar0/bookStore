import Banner from "../components/Banner";
import Freebook from "../components/Freebook";

export default function Home() {
  return (
    <>
      <Banner />
      <div className="bg-white dark:bg-slate-900"><Freebook /></div>
      <section id="about" className="page-container py-20">
        <div className="grid gap-10 rounded-[2rem] bg-amber-100 p-8 text-slate-900 md:grid-cols-3 md:p-12 dark:bg-amber-400">
          <div className="md:col-span-2">
            <p className="text-sm font-bold uppercase tracking-[0.2em]">Why BookStore</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Less scrolling. More discovering.</h2>
          </div>
          <p className="leading-7 text-slate-700">We keep the experience simple: thoughtful selections, fast search, and a shelf that follows you across visits.</p>
        </div>
      </section>
    </>
  );
}
