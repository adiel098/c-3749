import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

interface AddressFieldProps {
  address: string;
  currency: string;
}

export function AddressField({ address, currency }: AddressFieldProps) {
  const { toast } = useToast();

  const handleCopy = async (address: string) => {
    await navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied! 📋",
      description: (
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span>The deposit address is now in your clipboard ✨</span>
        </div>
      ),
      variant: "default"
    });
  };

  return (
    <div className="space-y-2">
      <Label>Deposit Address</Label>
      <div className="flex gap-2">
        <Input
          value={address}
          readOnly
          className="font-mono text-sm bg-secondary/20 border-secondary flex-1"
        />
        <Button 
          onClick={() => handleCopy(address)}
          className="bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/20 transition-all duration-300 hover:scale-[1.02] px-4"
        >
          Copy
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Send only {currency.toUpperCase()} to this address. Sending any other cryptocurrency may result in permanent loss.
      </p>
    </div>
  );
}