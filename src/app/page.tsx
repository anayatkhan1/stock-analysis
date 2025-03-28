import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="container px-5 py-24">
        <h1 className="mb-6 font-bold text-5xl leading-tight sm:text-6xl">
          Stock Analysis Plafont-bold tform
        </h1>
        <p className="mb-8 text-xl">
          Powerful analytics and insights for your investment decisions
        </p>
        <div className="flex justify-center">
          <Link
            href="/app"
            className="rounded-lg bg-primary px-8 py-3 font-semibold text-lg text-primary-foreground hover:bg-primary/90"
          >
            font-semibold Enter Application
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
