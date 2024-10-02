import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { FormHTMLAttributes } from "react";

export function PopulateForm({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form className="grid w-full items-start gap-2" action={action}>
      <fieldset className="rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Sources
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <Button className="px-2" variant="secondary" size="default" asChild>
            <Link href="/coordinates.csv" target="_blank">
              Coordinates
              <Icons.download className="ml-1 size-4" />
            </Link>
          </Button>
          <Button className="px-2" variant="secondary" size="default" asChild>
            <Link href="/Adjacencies.txt" target="_blank" className={buttonVariants({
              size: "default",
              variant: "link"
            })}>
              Adjacencies
              <Icons.newPage className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </fieldset>
      <Button type="submit" className="w-full">
        Populate Tree
      </Button>
    </form>
  );
}
