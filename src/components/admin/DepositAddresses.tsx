import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bitcoin, Wallet2, Copy, CheckCircle2, Loader2 } from "lucide-react";
import { toastStyles, toastConfig } from "@/utils/toastStyles";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

export function DepositAddresses() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["deposit-addresses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deposit_addresses")
        .select("*")
        .order("currency");

      if (error) throw error;
      return data;
    },
  });

  const handleUpdate = async (id: string, newAddress: string) => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from("deposit_addresses")
        .update({ address: newAddress })
        .eq("id", id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["deposit-addresses"] });
      
      toast({
        title: "Address Updated! ✨",
        description: (
          <div className="flex items-center gap-2">
            {toastStyles.success.icon}
            <span>The deposit address has been successfully updated</span>
          </div>
        ),
        className: toastStyles.success.className,
        ...toastConfig,
      });
    } catch (error: any) {
      toast({
        title: "Update Failed ❌",
        description: (
          <div className="flex items-center gap-2">
            {toastStyles.error.icon}
            <span>{error.message}</span>
          </div>
        ),
        className: toastStyles.error.className,
        ...toastConfig,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopy = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading deposit addresses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#D946EF] bg-clip-text text-transparent">
          Deposit Addresses
        </h1>
        <p className="text-[#E5DEFF]/80">
          Manage cryptocurrency deposit addresses for your platform
        </p>
      </div>
      
      <div className="grid gap-6">
        {addresses?.map((address) => (
          <Card key={address.id} className="glass-effect overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-gradient-to-r from-[#1A1F2C] to-[#1A1F2C]/50">
              <CardTitle className="flex items-center gap-3 text-xl">
                {address.currency === "bitcoin" ? (
                  <Bitcoin className="h-6 w-6 text-[#9b87f5]" />
                ) : (
                  <Wallet2 className="h-6 w-6 text-[#9b87f5]" />
                )}
                <span className="bg-gradient-to-r from-[#E5DEFF] to-white bg-clip-text text-transparent">
                  {address.currency.toUpperCase()} Deposit Address
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    defaultValue={address.address}
                    className="font-mono bg-[#1A1F2C]/50 border-white/10 focus-visible:border-[#9b87f5]/50 focus-visible:ring-[#9b87f5]/20"
                    onBlur={(e) => {
                      if (e.target.value !== address.address) {
                        handleUpdate(address.id, e.target.value);
                      }
                    }}
                  />
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 bg-[#1A1F2C]/50 border-white/10 hover:bg-[#1A1F2C] hover:border-[#9b87f5]/50"
                        onClick={() => handleCopy(address.address)}
                      >
                        {copiedAddress === address.address ? (
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
                        `input[value="${address.address}"]`
                      ) as HTMLInputElement;
                      if (input && input.value !== address.address) {
                        handleUpdate(address.id, input.value);
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
                    {address.updated_at
                      ? new Date(address.updated_at).toLocaleString()
                      : "Never"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}