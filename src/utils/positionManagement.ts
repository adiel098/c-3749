import { supabase } from "@/integrations/supabase/client";
import { Position } from "@/types/position";
import { toast } from "@/components/ui/use-toast";

export async function checkPositionRequirements(
  userId: string,
  symbol: string,
  type: 'long' | 'short',
  amount: number,
  leverage: number
): Promise<boolean> {
  try {
    // Check available balance
    const { data: profile } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', userId)
      .single();

    if (!profile || profile.balance < amount) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance to open this position",
        variant: "destructive"
      });
      return false;
    }

    // Check for opposite positions
    const { data: oppositePositions } = await supabase
      .from('positions')
      .select('*')
      .eq('user_id', userId)
      .eq('symbol', symbol)
      .eq('status', 'open')
      .neq('type', type);

    if (oppositePositions && oppositePositions.length > 0) {
      toast({
        title: "Cannot open position",
        description: "You have an open position in the opposite direction",
        variant: "destructive"
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking position requirements:', error);
    return false;
  }
}

export async function handlePositionMerge(
  userId: string,
  symbol: string,
  type: 'long' | 'short',
  amount: number,
  leverage: number,
  entryPrice: number
): Promise<boolean> {
  try {
    // Find existing position in same direction
    const { data: existingPositions } = await supabase
      .from('positions')
      .select('*')
      .eq('user_id', userId)
      .eq('symbol', symbol)
      .eq('type', type)
      .eq('status', 'open');

    if (existingPositions && existingPositions.length > 0) {
      const existingPosition = existingPositions[0];
      
      // Call the merge_positions function
      const { data, error } = await supabase
        .rpc('merge_positions', {
          p1_id: existingPosition.id,
          p2_id: existingPosition.id
        });

      if (error) throw error;
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error merging positions:', error);
    return false;
  }
}

export async function checkAndClosePosition(position: Position, currentPrice: number) {
  if (!position.stop_loss && !position.take_profit) return;

  const shouldClose = (
    (position.stop_loss && (
      (position.type === 'long' && currentPrice <= position.stop_loss) ||
      (position.type === 'short' && currentPrice >= position.stop_loss)
    )) ||
    (position.take_profit && (
      (position.type === 'long' && currentPrice >= position.take_profit) ||
      (position.type === 'short' && currentPrice <= position.take_profit)
    ))
  );

  if (shouldClose) {
    try {
      const { error } = await supabase
        .from('positions')
        .update({
          status: 'closed',
          exit_price: currentPrice,
          closed_at: new Date().toISOString(),
          profit_loss: calculatePnL(position, currentPrice)
        })
        .eq('id', position.id);

      if (error) throw error;

      toast({
        title: `Position ${position.type === 'long' ? 'Long' : 'Short'} closed`,
        description: `Position closed at $${currentPrice} due to ${
          currentPrice === position.stop_loss ? 'Stop Loss' : 'Take Profit'
        }`,
      });
    } catch (error) {
      console.error('Error closing position:', error);
    }
  }
}

function calculatePnL(position: Position, exitPrice: number): number {
  const priceChange = exitPrice - position.entry_price;
  const direction = position.type === 'long' ? 1 : -1;
  const positionSize = position.amount * position.leverage;
  return (priceChange / position.entry_price) * positionSize * direction;
}