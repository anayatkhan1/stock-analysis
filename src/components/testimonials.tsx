import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Testimonials() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-4xl font-medium lg:text-5xl">
            Trusted by investors worldwide
          </h2>
          <p>
            Our stock analysis platform provides powerful insights that help
            investors make informed decisions and achieve their financial goals.
          </p>
        </div>

        <div className="grid gap-4 [--color-card:var(--color-muted)] *:border-none *:shadow-none sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2 dark:[--color-muted:var(--color-zinc-900)]">
          <Card className="grid grid-rows-[auto_1fr] gap-8 sm:col-span-2 sm:p-6 lg:row-span-2">
            <CardHeader>
              <div className="font-bold text-lg">Institutional Investor</div>
            </CardHeader>
            <CardContent>
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p className="text-xl font-medium">
                  This stock analysis platform has completely transformed my
                  investment strategy. The comprehensive data visualization,
                  real-time market insights, and predictive analytics have
                  significantly improved my decision-making process. The
                  customizable dashboards allow me to focus on the metrics that
                  matter most to my portfolio. It's a game-changer for serious
                  investors.
                </p>

                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage
                      src="https://tailus.io/images/reviews/shekinah.webp"
                      alt="Sarah Thompson"
                      height="400"
                      width="400"
                      loading="lazy"
                    />
                    <AvatarFallback>ST</AvatarFallback>
                  </Avatar>

                  <div>
                    <cite className="text-sm font-medium">Sarah Thompson</cite>
                    <span className="text-muted-foreground block text-sm">
                      Portfolio Manager
                    </span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardContent className="h-full pt-6">
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p className="text-xl font-medium">
                  This stock analysis tool is extraordinary and incredibly
                  intuitive. The technical indicators and pattern recognition
                  features have helped me identify profitable opportunities I
                  would have otherwise missed. A real gold mine for active
                  traders.
                </p>

                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage
                      src="https://tailus.io/images/reviews/jonathan.webp"
                      alt="Michael Chen"
                      height="400"
                      width="400"
                      loading="lazy"
                    />
                    <AvatarFallback>MC</AvatarFallback>
                  </Avatar>
                  <div>
                    <cite className="text-sm font-medium">Michael Chen</cite>
                    <span className="text-muted-foreground block text-sm">
                      Day Trader
                    </span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="h-full pt-6">
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p>
                  The fundamental analysis tools in this platform are
                  exceptional. I can quickly evaluate company financials,
                  compare metrics across sectors, and identify undervalued
                  stocks with ease.
                </p>

                <div className="grid items-center gap-3 [grid-template-columns:auto_1fr]">
                  <Avatar className="size-12">
                    <AvatarImage
                      src="https://tailus.io/images/reviews/yucel.webp"
                      alt="Jennifer Rodriguez"
                      height="400"
                      width="400"
                      loading="lazy"
                    />
                    <AvatarFallback>JR</AvatarFallback>
                  </Avatar>
                  <div>
                    <cite className="text-sm font-medium">
                      Jennifer Rodriguez
                    </cite>
                    <span className="text-muted-foreground block text-sm">
                      Financial Analyst
                    </span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>
          <Card className="card variant-mixed">
            <CardContent className="h-full pt-6">
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p>
                  As a long-term investor, I appreciate the portfolio tracking
                  and performance analysis features. The risk assessment tools
                  have helped me build a more balanced and resilient investment
                  strategy.
                </p>

                <div className="grid grid-cols-[auto_1fr] gap-3">
                  <Avatar className="size-12">
                    <AvatarImage
                      src="https://tailus.io/images/reviews/rodrigo.webp"
                      alt="David Wilson"
                      height="400"
                      width="400"
                      loading="lazy"
                    />
                    <AvatarFallback>DW</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">David Wilson</p>
                    <span className="text-muted-foreground block text-sm">
                      Retirement Planner
                    </span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
