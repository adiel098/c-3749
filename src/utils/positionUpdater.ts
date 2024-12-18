import { supabase } from "@/integrations/supabase/client";
import { Position } from "@/types/position";

export async function updatePositionProfitLoss(position: Position, currentPrice: number) {
  const priceChange = currentPrice - position.entry_price;
  const direction = position.type === 'long' ? 1 : -1;
  const positionSize = position.amount * position.leverage;
  const pnl = (priceChange / position.entry_price) * positionSize * direction;

  try {
    const { error } = await supabase
      .from('positions')
      .update({ profit_loss: pnl })
      .eq('id', position.id)
      .eq('status', 'open');

    if (error) throw error;
  } catch (error) {
    console.error('Error updating position P&L:', error);
  }
}