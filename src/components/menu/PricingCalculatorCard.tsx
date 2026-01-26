import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useProductRecipeUnitCost } from "@/hooks/useProductRecipeUnitCost";

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function PricingCalculatorCard(props: {
  companyId: string;
  productId: string | null;
  onApplySuggestedPrice: (price: number) => void;
}) {
  const { toast } = useToast();
  const recipe = useProductRecipeUnitCost({
    companyId: props.companyId,
    productId: props.productId,
  });

  // Entradas do precificador (não persistidas; servem para cálculo/sugestão)
  const [manualCost, setManualCost] = useState<string>("");
  const [extraFees, setExtraFees] = useState<string>("");
  const [marginPct, setMarginPct] = useState<string>("30");
  const [paymentFeePct, setPaymentFeePct] = useState<string>("3.99");

  const manualCostValue = Number(manualCost || 0) || 0;
  const extraFeesValue = Number(extraFees || 0) || 0;
  const marginValue = clampNumber(Number(marginPct || 0) || 0, 0, 95);
  const paymentFeeValue = clampNumber(Number(paymentFeePct || 0) || 0, 0, 30);

  const baseCost = useMemo(() => {
    return (recipe.unitCost || 0) + manualCostValue + extraFeesValue;
  }, [recipe.unitCost, manualCostValue, extraFeesValue]);

  const suggested = useMemo(() => {
    // Margem + taxa (percentual sobre o preço de venda)
    // preço = custo / (1 - margem - taxa)
    const denom = 1 - marginValue / 100 - paymentFeeValue / 100;
    if (denom <= 0) return null;
    if (baseCost <= 0) return 0;
    return baseCost / denom;
  }, [baseCost, marginValue, paymentFeeValue]);

  const canApply = suggested !== null && suggested > 0;

  const handleApply = () => {
    if (!canApply || suggested === null) return;
    props.onApplySuggestedPrice(Number(suggested.toFixed(2)));
    toast({
      title: "Preço sugerido aplicado",
      description: `Preço definido para R$ ${suggested.toFixed(2)}`,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Precificador</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Custo por ingredientes (ficha técnica)</Label>
            <div className="relative">
              <CurrencyInput value={recipe.unitCost} onChange={() => {}} disabled />
              {recipe.loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            {!recipe.loading && !recipe.hasRecipe && (
              <p className="text-xs text-muted-foreground">
                Sem ficha técnica — configure em “Ficha Técnica” para calcular automaticamente.
              </p>
            )}
            {recipe.error && (
              <p className="text-xs text-destructive">{recipe.error}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Custo manual (opcional)</Label>
            <CurrencyInput
              value={Number(manualCost || 0)}
              onChange={(v) => setManualCost(String(v || ""))}
              placeholder="Ex: embalagem, perdas, etc"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Taxas adicionais (R$)</Label>
            <CurrencyInput
              value={Number(extraFees || 0)}
              onChange={(v) => setExtraFees(String(v || ""))}
              placeholder="Ex: taxa fixa"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Margem (%)</Label>
              <Input
                type="number"
                min={0}
                max={95}
                step={0.1}
                value={marginPct}
                onChange={(e) => setMarginPct(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Taxa pagamento (%)</Label>
              <Input
                type="number"
                min={0}
                max={30}
                step={0.01}
                value={paymentFeePct}
                onChange={(e) => setPaymentFeePct(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="rounded-md border p-3 space-y-2">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Custo base</p>
            <p className="text-sm font-medium">R$ {baseCost.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Preço sugerido</p>
            <p className="text-sm font-semibold">
              {suggested === null ? "—" : `R$ ${suggested.toFixed(2)}`}
            </p>
          </div>
          {suggested === null && (
            <p className="text-xs text-destructive">
              Margem + taxa estão acima de 100% — ajuste os percentuais.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end">
          <Button type="button" onClick={handleApply} disabled={!canApply}>
            Aplicar no preço
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
