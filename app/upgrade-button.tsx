import { cookies } from "next/headers"
import { CheckIcon } from "@heroicons/react/20/solid"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default async function UpgradeButton() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const tiers = [
    {
      name: "Pro",
      id: "tier-pro",
      href: `https://nous.lemonsqueezy.com/checkout/buy/82a52c59-48db-430d-84de-122206ef2002?checkout[custom][user_id]=${user?.id}&checkout[email]=${user?.email}`,
      priceMonthly: "$5",
      description:
        "Use Nous as your personal information librarian. Support the tool and get access to the latest features!",
      features: [
        "Save upto 1000 bookmarks",
        "Search 𝕏 Bookmarks (coming soon)",
        "Search Android Screenshots (coming soon)",
        "Add custom labels (coming soon)",
        "...and much more.",
      ],
    },
  ]

  return (
    <Dialog>
      {/* Check if there's an error and display it */}
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="p-3 m-2 bg-green-3 hover:bg-green-5 focus:bg-green-5 border border-green-7 hover:border-green-8"
        >
          Upgrade
        </Button>
      </DialogTrigger>

      <DialogContent className="border-2 rounded-3xl bg-green-1 p-8 shadow-xl ring-1 ring-green-6">
        <DialogHeader>
          {/* <DialogTitle>Upgrade!</DialogTitle> */}
          {/* <DialogDescription>Want more? Get PRO!</DialogDescription> */}
        </DialogHeader>
        {tiers.map((tier) => (
          <div key={tier.id} className="flex flex-col justify-between">
            <div>
              <h3
                id={tier.id}
                className="text-base font-semibold leading-7 text-green-11"
              >
                {tier.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-green-12">
                  {tier.priceMonthly}
                </span>
                <span className="text-base font-semibold leading-7 text-green-12">
                  /month
                </span>
              </div>
              <p className="mt-6 text-base leading-7 text-sage-12">
                {tier.description}
              </p>
              <ul
                role="list"
                className="mt-10 space-y-4 text-lg font-bold leading-6 text-sage-12"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-sage-12"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <a
              target="_selfnpm run dev"
              href={tier.href}
              aria-describedby={tier.id}
              className="mt-8 block rounded-md bg-green-9 border-green-6 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-8"
            >
              Get started today
            </a>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  )
}
