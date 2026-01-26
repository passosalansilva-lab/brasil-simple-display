import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Result = {
  unitCost: number;
  loading: boolean;
  hasRecipe: boolean;
  error: string | null;
};

/**
 * Retorna o custo por unidade do produto baseado na ficha técnica (ingredientes).
 * Soma: quantity_per_unit * average_unit_cost.
 *
 * Observação: não persiste nada; apenas leitura para precificação.
 */
export function useProductRecipeUnitCost(params: {
  companyId: string;
  productId: string | null;
}): Result {
  const { companyId, productId } = params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<
    Array<{ quantity_per_unit: number; average_unit_cost: number }>
  >([]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!companyId || !productId) {
        setRows([]);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: qError } = await supabase
          .from("inventory_product_ingredients")
          .select(
            `
            quantity_per_unit,
            inventory_ingredients ( average_unit_cost )
          `
          )
          .eq("company_id", companyId)
          .eq("product_id", productId);

        if (qError) throw qError;

        const parsed = (data || []).map((r: any) => ({
          quantity_per_unit: Number(r.quantity_per_unit) || 0,
          average_unit_cost: Number(r.inventory_ingredients?.average_unit_cost) || 0,
        }));

        if (!cancelled) setRows(parsed);
      } catch (e: any) {
        if (!cancelled) {
          setRows([]);
          setError(e?.message || "Erro ao carregar custo da ficha técnica");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [companyId, productId]);

  const unitCost = useMemo(() => {
    return rows.reduce(
      (sum, r) => sum + (Number(r.quantity_per_unit) || 0) * (Number(r.average_unit_cost) || 0),
      0
    );
  }, [rows]);

  const hasRecipe = rows.length > 0;

  return { unitCost, loading, hasRecipe, error };
}
