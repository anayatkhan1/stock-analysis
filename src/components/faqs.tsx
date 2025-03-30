export default function FAQs() {
  return (
    <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]">
          <div className="text-center lg:text-left">
            <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
              Frequently <br className="hidden lg:block" /> Asked{" "}
              <br className="hidden lg:block" />
              Questions
            </h2>
            <p>Common questions about our stock analysis platform</p>
          </div>

          <div className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
            <div className="pb-6">
              <h3 className="font-medium">
                How accurate is your stock analysis?
              </h3>
              <p className="text-muted-foreground mt-4">
                Our AI-driven stock analysis platform maintains a 98.7% accuracy
                rate for market predictions based on historical data patterns
                and real-time market indicators.
              </p>

              <ol className="list-outside list-decimal space-y-2 pl-4">
                <li className="text-muted-foreground mt-4">
                  We use advanced algorithms that analyze thousands of data
                  points across global markets.
                </li>
                <li className="text-muted-foreground mt-4">
                  Our platform is continuously learning and improving through
                  machine learning techniques.
                </li>
                <li className="text-muted-foreground mt-4">
                  While we strive for maximum accuracy, all investments carry
                  inherent risks, and past performance doesn't guarantee future
                  results.
                </li>
              </ol>
            </div>
            <div className="py-6">
              <h3 className="font-medium">
                How do I access real-time market data?
              </h3>
              <p className="text-muted-foreground mt-4">
                Real-time market data is available on all subscription plans.
                Simply log into your dashboard and navigate to the "Market Data"
                section to view live updates from global exchanges.
              </p>
            </div>
            <div className="py-6">
              <h3 className="font-medium">
                Can I upgrade my subscription plan?
              </h3>
              <p className="text-muted-foreground my-4">
                Yes, you can upgrade your plan at any time through your account
                settings to access additional features like advanced technical
                analysis tools and personalized investment recommendations.
              </p>
              <ul className="list-outside list-disc space-y-2 pl-4">
                <li className="text-muted-foreground">
                  You'll be charged the difference between your current plan and
                  the upgraded plan.
                </li>
                <li className="text-muted-foreground">
                  Premium features become available immediately after upgrading,
                  with no need to wait for the next billing cycle.
                </li>
              </ul>
            </div>
            <div className="py-6">
              <h3 className="font-medium">
                How do I connect with financial analysts?
              </h3>
              <p className="text-muted-foreground mt-4">
                Premium and Enterprise subscribers can connect with our team of
                financial analysts through the in-app messaging system. Our
                experts are available during market hours to provide
                personalized investment guidance and answer your questions about
                market trends.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
