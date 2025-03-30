import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">
            Pricing that Scales with Your Investment Needs
          </h1>
          <p>
            Our stock analysis platform provides powerful tools to help
            investors make data-driven decisions. Choose the plan that best fits
            your investment strategy and growth objectives.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="font-medium">Basic Investor</CardTitle>

              <span className="my-3 block text-2xl font-semibold">$0 / mo</span>

              <CardDescription className="text-sm">
                Per user, billed monthly
              </CardDescription>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="">Get Started</Link>
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Basic Stock Analytics Dashboard",
                  "Historical Data (1 Year)",
                  "Limited Stock Screening Tools",
                  "Daily Market Updates",
                  "Email Support",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="relative">
            <span className="bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">
              Popular
            </span>

            <CardHeader>
              <CardTitle className="font-medium">Active Trader</CardTitle>

              <span className="my-3 block text-2xl font-semibold">
                $19 / mo
              </span>

              <CardDescription className="text-sm">
                Per user, billed monthly
              </CardDescription>

              <Button asChild className="mt-4 w-full">
                <Link href="">Get Started</Link>
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Everything in Free Plan",
                  "Advanced Technical Analysis Tools",
                  "Historical Data (5 Years)",
                  "Real-time Market Data",
                  "Portfolio Tracking & Analysis",
                  "Customizable Stock Alerts",
                  "Fundamental Analysis Reports",
                  "Mobile App Access",
                  "Priority Email & Chat Support",
                  "Weekly Market Insights Newsletter",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-medium">Professional</CardTitle>

              <span className="my-3 block text-2xl font-semibold">
                $29 / mo
              </span>

              <CardDescription className="text-sm">
                Per user, billed monthly
              </CardDescription>

              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="">Get Started</Link>
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Everything in Pro Plan",
                  "API Access for Custom Integrations",
                  "Historical Data (10+ Years)",
                  "Advanced Algorithmic Trading Signals",
                  "Institutional-Grade Research Reports",
                  "Dedicated Account Manager",
                  "Custom Screener Development",
                  "Multi-user Team Access",
                  "Quarterly Strategy Consultation",
                  "White-label Reporting Options",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
