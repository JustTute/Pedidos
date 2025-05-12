import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "@radix-ui/react-icons"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-orange-100">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Pedí y Pagá</h1>
          <p className="text-gray-500 md:text-xl/relaxed">
            Ordená y pagá el almuerzo de tu hijo/a en la escuela.
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Link href="/login" passHref>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                Empezar <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
