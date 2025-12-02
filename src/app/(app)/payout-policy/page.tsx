
import Header from "@/components/landing/header";


export default function PayoutPolicyPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1 container py-12">
        <h1 className="text-4xl font-bold">Payout Policy</h1>
        <p className="mt-4 text-muted-foreground">Details about the payout policy will go here.</p>
      </main>
     
    </div>
  );
}
