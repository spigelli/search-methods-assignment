import {
  MinimalCard,
  MinimalCardDescription,
  MinimalCardImage,
  MinimalCardTitle,
} from "@/components/ui/minimal-card"
import Link from "next/link";

  const cards = [
    {
      title: "Search Methods",
      description: "How to design with gestures and motion that feel intuitive and natural.",
      href: "/live-demos/search-methods/playground",
    },
    {
      title: "Genetic Algorithm (Python)",
      description: "How to design with gestures and motion that feel intuitive and natural.",
      href: "/live-demos/genetic-algorithm",
    },
  ]

export default function Demos() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Live Demos
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          A collection of live demos that showcase various algorithms and concepts.
        </p>
      </div>
      <div className="min-h-[500px] p-4  flex flex-col justify-center  rounded-lg space-y-4">
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              passHref
            >
              <MinimalCard>
                <MinimalCardTitle>{card.title}</MinimalCardTitle>
                <MinimalCardDescription>
                  {card.description}
                </MinimalCardDescription>
              </MinimalCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}