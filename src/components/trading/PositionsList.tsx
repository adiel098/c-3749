import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PositionCard } from "./PositionCard";

interface Position {
  id: string;
  symbol: string;
  type: string;
  amount: number;
  entry_price: number;
  leverage: number;
  liquidation_price: number;
  profit_loss: number;
  status: string;
  stop_loss?: number;
  take_profit?: number;
  exit_price?: number;
  closed_at?: string;
}

interface PositionsListProps {
  positions: Position[];
  currentPrice?: number;
  onUpdate: () => void;
  type: 'open' | 'closed';
}

export function PositionsList({ positions, currentPrice, onUpdate, type }: PositionsListProps) {
  const filteredPositions = positions.filter(p => 
    type === 'open' ? p.status === 'open' : p.status === 'closed'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{type === 'open' ? 'פוזיציות פתוחות' : 'פוזיציות סגורות'}</CardTitle>
      </CardHeader>
      <CardContent>
        {!filteredPositions.length ? (
          <div className="text-center text-muted-foreground py-8">
            {type === 'open' ? 'אין פוזיציות פתוחות' : 'אין פוזיציות סגורות'}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPositions.map((position) => (
              type === 'open' ? (
                <PositionCard
                  key={position.id}
                  position={position}
                  currentPrice={currentPrice}
                  onUpdate={onUpdate}
                />
              ) : (
                <div key={position.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{position.symbol}</p>
                    <div className="flex items-center gap-2">
                      {position.type === 'long' ? (
                        <ArrowUpCircle className="text-success h-4 w-4" />
                      ) : (
                        <ArrowDownCircle className="text-warning h-4 w-4" />
                      )}
                      <span>{position.type.toUpperCase()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      כניסה: ${position.entry_price} | יציאה: ${position.exit_price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${position.amount}</p>
                    <p className={`text-sm ${position.profit_loss >= 0 ? 'text-success' : 'text-warning'}`}>
                      {position.profit_loss >= 0 ? '+' : ''}{position.profit_loss?.toFixed(2)} USDT
                    </p>
                    <p className="text-xs text-muted-foreground">
                      נסגר: {position.closed_at ? new Date(position.closed_at).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}