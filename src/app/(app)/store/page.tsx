
"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShoppingCart, IndianRupee, Minus, Plus, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const products = [
  {
    id: "tape-roll",
    name: "Branded Packaging Tape",
    description: "High-quality, durable tape with the Crevings logo. Perfect for sealing delivery packages securely.",
    image: "https://placehold.co/400x300.png",
    aiHint: "packaging tape",
    price: 0,
    unit: "per roll",
  },
  {
    id: "takeaway-bags",
    name: "Large Paper Bags (x100)",
    description: "Eco-friendly paper bags for takeaway orders. Sturdy handles and wide base.",
    image: "https://placehold.co/400x300.png",
    aiHint: "paper bag",
    price: 0,
    unit: "per pack of 100",
  },
];

export default function StorePage() {
  const [cart, setCart] = useState<Record<string, number>>({ "tape-roll": 1 });
  const { toast } = useToast();
  const router = useRouter();

  const handleQuantityChange = (productId: string, amount: number) => {
    setCart(prev => {
      const newQuantity = (prev[productId] || 0) + amount;
      return { ...prev, [productId]: Math.max(0, newQuantity) };
    });
  };
  
  const handlePlaceOrder = () => {
    toast({
        title: "Order Placed Successfully!",
        description: "Your items will be dispatched within 2 business days. You can track your order in the 'Track Order' section."
    });
    router.push('/order-tracking');
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl flex items-center gap-2">
            <ShoppingCart className="h-6 w-6"/> Partner Store
        </h1>
      </div>
      
      <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <Info className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-700 dark:text-green-300 font-semibold">Free for Partners!</AlertTitle>
        <AlertDescription className="text-green-600/80 dark:text-green-400/80">
          All items in the store, including delivery, are provided free of charge to our valued restaurant partners.
        </AlertDescription>
      </Alert>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="grid gap-6 md:grid-cols-2">
            {products.map((product) => (
                <Card key={product.id}>
                    <CardHeader className="p-0">
                         <div className="aspect-video w-full bg-muted flex items-center justify-center">
                            <Image
                                alt={product.name}
                                className="aspect-video w-full object-cover"
                                height={200}
                                src={product.image}
                                width={300}
                                data-ai-hint={product.aiHint}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                        <CardTitle>{product.name}</CardTitle>
                        <CardDescription>{product.description}</CardDescription>
                         <p className="font-bold text-lg text-primary">Free</p>
                    </CardContent>
                    <CardFooter className="p-4 border-t">
                        <div className="flex items-center justify-between w-full">
                           <span className="text-sm text-muted-foreground">{product.unit}</span>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(product.id, -1)} disabled={(cart[product.id] || 0) === 0}>
                                    <Minus className="h-4 w-4"/>
                                </Button>
                                <span className="font-bold text-base w-8 text-center">{cart[product.id] || 0}</span>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(product.id, 1)}>
                                    <Plus className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
        
        <div className="lg:sticky lg:top-6">
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {Object.entries(cart).filter(([,qty]) => qty > 0).length > 0 ? (
                        Object.entries(cart).map(([id, quantity]) => {
                           if (quantity === 0) return null;
                           const product = products.find(p => p.id === id);
                           if (!product) return null;

                           return (
                             <div key={id} className="flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-muted-foreground">Quantity: {quantity}</p>
                                </div>
                                <p className="font-semibold text-primary">Free</p>
                             </div>
                           )
                        })
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">Your cart is empty.</p>
                    )}
                </CardContent>
                <CardFooter>
                    <Button className="w-full" disabled={Object.values(cart).every(q => q === 0)} onClick={handlePlaceOrder}>
                        Place Order
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
