import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CompanyColors {
  primaryColor: string;
  secondaryColor: string;
}

const defaultColors: CompanyColors = {
  primaryColor: '#F97316', // Orange
  secondaryColor: '#FED7AA',
};

function hexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex values
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function applyColors(colors: CompanyColors) {
  const root = document.documentElement;
  
  if (colors.primaryColor) {
    const primaryHsl = hexToHsl(colors.primaryColor);
    root.style.setProperty('--primary', primaryHsl);
    root.style.setProperty('--ring', primaryHsl);
    root.style.setProperty('--sidebar-primary', primaryHsl);
    root.style.setProperty('--sidebar-ring', primaryHsl);
  }
  
  if (colors.secondaryColor) {
    const secondaryHsl = hexToHsl(colors.secondaryColor);
    root.style.setProperty('--secondary', secondaryHsl);
    root.style.setProperty('--accent', secondaryHsl);
  }
}

export function useCompanyColors(companyId: string | null) {
  const [colors, setColors] = useState<CompanyColors>(defaultColors);
  const [loading, setLoading] = useState(true);

  const loadColors = useCallback(async () => {
    if (!companyId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('companies')
        .select('primary_color, secondary_color')
        .eq('id', companyId)
        .maybeSingle();

      if (error) {
        console.error('Error loading company colors:', error);
        return;
      }

      if (data) {
        const companyColors: CompanyColors = {
          primaryColor: data.primary_color || defaultColors.primaryColor,
          secondaryColor: data.secondary_color || defaultColors.secondaryColor,
        };
        
        setColors(companyColors);
        applyColors(companyColors);
      }
    } catch (error) {
      console.error('Error loading company colors:', error);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadColors();
  }, [loadColors]);

  return { colors, loading };
}
