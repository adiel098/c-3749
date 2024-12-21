import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bitcoin, Wallet2, Copy, CheckCircle2, Loader2 } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface AddressCardProps {
  id: string;
  currency: string;
  address: string;
  updatedAt: string | null;
  onUpdate: (id: string, newAddress: string) => Promise<void>;
}

export function AddressCard({ id, currency, address, updatedAt, onUpdate }: AddressCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleCopy = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleUpdate = async (newAddress: string) => {
    if (newAddress !== address) {
      setIsUpdating(true);
      try {
        await onUpdate(id, newAddress);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <Card className="glass-effect overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-gradient-to-r from-[#1A1F2C] to-[#1A1F2C]/50">
        <CardTitle className="flex items-center gap-3 text-xl">
          {currency === "bitcoin" ? (
            <Bitcoin className="h-6 w-6 text-[#9b87f5]" />
          ) : (
            <Wallet2 className="h-6 w-6 text-[#9b87f5]" />
          )}
          <span className="bg-gradient-to-r from-[#E5DEFF] to-white bg-clip-text text-transparent">
            {currency.toUpperCase()} Deposit Address
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              defaultValue={address}
              className="font-mono bg-[#1A1F2C]/50 border-white/10 focus-visible:border-[#9b87f5]/50 focus-visible:ring-[#9b87f5]/20"
              onBlur={(e) => handleUpdate(e.target.value)}
            />
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 bg-[#1A1F2C]/50 border-white/10 hover:bg-[#1A1F2C] hover:border-[#9b87f5]/50"
                  onClick={() => handleCopy(address)}
                >
                  {copiedAddress === address ? (
                    <CheckCircle2 className="h-4 w-4 text-[#9b87f5]" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto">
                <p className="text-sm">Copy address to clipboard</p>
              </HoverCardContent>
            </HoverCard>
            <Button
              variant="outline"
              disabled={isUpdating}
              className="shrink-0 bg-[#1A1F2C]/50 border-white/10 hover:bg-[#1A1F2C] hover:border-[#9b87f5]/50 disabled:opacity-50"
              onClick={() => {
                const input = document.querySelector(
                  `input[value="${address}"]`
                ) as HTMLInputElement;
                if (input && input.value !== address) {
                  handleUpdate(input.value);
                }
              }}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Last updated:</span>
            <span>
              {updatedAt ? new Date(updatedAt).toLocaleString() : "Never"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}