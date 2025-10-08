import { Card, CardContent, CardHeader } from "@lms/components/ui/card"
import { Skeleton } from "@lms/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Skeleton className="h-48 w-full" />
      <div className="mx-auto max-w-4xl px-6 pb-12">
        <Skeleton className="relative -mt-20 mb-8 h-32 w-32 rounded-full" />
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="mt-2 h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
