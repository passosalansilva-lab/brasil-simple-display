import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle2, XCircle, CreditCard, ChevronDown, ExternalLink, Eye, EyeOff, Info } from 'lucide-react';

interface PaymentSettings {
  picpay_enabled: boolean;
  picpay_verified: boolean;
  picpay_client_id: string | null;
  picpay_client_secret: string | null;
  picpay_account_email: string | null;
}

interface PicPayConfigProps {
  companyId: string;
}

const PicPayRequirementsInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-between text-muted-foreground hover:text-foreground">
          <span className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Como obter as credenciais do PicPay?
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Alert className="mt-2">
          <AlertDescription className="text-sm space-y-2">
            <p><strong>Para integrar o PicPay:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Acesse sua conta no <a href="https://lojista.picpay.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">PicPay Empresas <ExternalLink className="h-3 w-3" /></a></li>
              <li>Vá em <strong>Integrações</strong></li>
              <li>Clique em <strong>Gateway de Pagamento</strong></li>
              <li>Copie o <strong>Client ID</strong> e o <strong>Client Secret</strong></li>
              <li>Cole os valores nos campos abaixo</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-2">
              As credenciais são únicas da sua conta e permitem receber pagamentos via PicPay.
            </p>
          </AlertDescription>
        </Alert>
      </CollapsibleContent>
    </Collapsible>
  );
};

export function PicPayConfig({ companyId }: PicPayConfigProps) {
  // PicPay está temporariamente indisponível
  return (
    <Card className="opacity-75">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#21C25E]/10 rounded-lg grayscale">
              <CreditCard className="h-5 w-5 text-[#21C25E]" />
            </div>
            <div>
              <CardTitle className="text-lg">PicPay</CardTitle>
              <CardDescription>Receba pagamentos via PicPay</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-300">
            Em breve
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Alert className="bg-amber-50 border-amber-200">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            <strong>Integração em manutenção</strong>
            <p className="text-sm mt-1">
              A integração com PicPay está temporariamente indisponível devido a instabilidades na API do parceiro. 
              Estamos trabalhando para restabelecer o serviço em breve.
            </p>
            <p className="text-xs mt-2 text-amber-600">
              Use o Mercado Pago como alternativa para receber pagamentos online.
            </p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
