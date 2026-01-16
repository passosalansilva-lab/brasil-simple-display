import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Store,
  UtensilsCrossed,
  ShoppingBag,
  Truck,
  Settings,
  Ticket,
  Crown,
  Sliders,
  ScrollText,
  Package,
  FileText,
  BookOpen,
  Bell,
  Users,
  Megaphone,
  ClipboardList,
  Building2,
  Percent,
  StarHalf,
  CreditCard,
  Wallet,
  Volume2,
  UserCog,
  ChefHat,
  Gift,
  Activity,
  Rocket,
  RotateCcw,
  Mail,
  Receipt,
  Brain,
  HelpCircle,
} from "lucide-react";

interface SearchItem {
  label: string;
  href: string;
  icon: any;
  keywords: string[];
  category: string;
  roles?: string[];
}

const searchItems: SearchItem[] = [
  // Principal
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, keywords: ["inicio", "home", "painel", "dashboard"], category: "Principal" },
  { label: "Pedidos", href: "/dashboard/orders", icon: ClipboardList, keywords: ["pedidos", "orders", "vendas"], category: "Principal" },
  { label: "Cozinha (KDS)", href: "/dashboard/kds", icon: ChefHat, keywords: ["cozinha", "kds", "kitchen", "preparo"], category: "Principal" },
  { label: "Mesas", href: "/dashboard/tables", icon: UtensilsCrossed, keywords: ["mesas", "tables", "restaurante"], category: "Principal" },
  { label: "Comandas", href: "/dashboard/comandas", icon: Receipt, keywords: ["comandas", "fichas", "bar"], category: "Principal" },
  
  // Minha Loja
  { label: "Dados da Loja", href: "/dashboard/store", icon: Store, keywords: ["loja", "store", "configurações", "dados"], category: "Minha Loja" },
  { label: "Cardápio", href: "/dashboard/menu", icon: UtensilsCrossed, keywords: ["cardapio", "menu", "produtos", "itens"], category: "Minha Loja" },
  { label: "Estoque", href: "/dashboard/inventory", icon: Package, keywords: ["estoque", "inventory", "inventario", "ingredientes"], category: "Minha Loja" },
  { label: "Notas Fiscais", href: "/dashboard/nfe", icon: FileText, keywords: ["nfe", "nota fiscal", "fiscal"], category: "Minha Loja" },
  
  // Marketing
  { label: "Promoções", href: "/dashboard/promotions", icon: Megaphone, keywords: ["promoções", "promotions", "ofertas"], category: "Marketing" },
  { label: "Cupons", href: "/dashboard/coupons", icon: Percent, keywords: ["cupons", "coupons", "desconto"], category: "Marketing" },
  { label: "Indique e Ganhe", href: "/dashboard/referrals", icon: Gift, keywords: ["indicações", "referrals", "indique"], category: "Marketing" },
  { label: "Sorteios", href: "/dashboard/lottery", icon: Ticket, keywords: ["sorteios", "lottery", "prêmios"], category: "Marketing" },
  
  // Operações
  { label: "Entregadores", href: "/dashboard/drivers", icon: Truck, keywords: ["entregadores", "drivers", "motoboy", "delivery"], category: "Operações" },
  { label: "Equipe", href: "/dashboard/staff", icon: Users, keywords: ["equipe", "staff", "funcionários"], category: "Operações" },
  { label: "Avaliações", href: "/dashboard/reviews", icon: StarHalf, keywords: ["avaliações", "reviews", "feedback"], category: "Operações" },
  { label: "PDV / Caixa", href: "/dashboard/pos", icon: ShoppingBag, keywords: ["pdv", "caixa", "pos", "venda"], category: "Operações" },
  { label: "Vendas Online", href: "/dashboard/customer-transactions", icon: Wallet, keywords: ["vendas", "transactions", "online"], category: "Operações" },
  
  // Minha Conta
  { label: "Meu Perfil", href: "/dashboard/settings", icon: UserCog, keywords: ["perfil", "profile", "minha conta"], category: "Minha Conta" },
  { label: "Som de Notificações", href: "/dashboard/notification-sound", icon: Volume2, keywords: ["som", "notificação", "audio"], category: "Minha Conta" },
  { label: "Push Notifications", href: "/dashboard/notifications", icon: Bell, keywords: ["push", "notifications", "alertas"], category: "Minha Conta" },
  { label: "Histórico de Atividades", href: "/dashboard/activity", icon: ScrollText, keywords: ["atividades", "activity", "histórico", "logs"], category: "Minha Conta" },
  
  // Sistema
  { label: "Pagamentos PIX", href: "/dashboard/pix", icon: CreditCard, keywords: ["pix", "pagamentos", "transferência"], category: "Sistema" },
  { label: "Transações Cartão", href: "/dashboard/card", icon: CreditCard, keywords: ["cartão", "card", "transações"], category: "Sistema" },
  { label: "Planos e Assinatura", href: "/dashboard/plans", icon: Crown, keywords: ["planos", "plans", "assinatura"], category: "Sistema" },
  
  // Suporte
  { label: "Central de Ajuda", href: "/dashboard/help", icon: HelpCircle, keywords: ["ajuda", "help", "suporte", "wiki"], category: "Suporte" },
  
  // Super Admin
  { label: "Empresas", href: "/dashboard/companies", icon: Building2, keywords: ["empresas", "companies", "lojas"], category: "Super Admin", roles: ["super_admin"] },
  { label: "Gerenciar Planos", href: "/dashboard/admin/plans", icon: Sliders, keywords: ["planos admin", "gerenciar planos"], category: "Super Admin", roles: ["super_admin"] },
  { label: "Funcionalidades", href: "/dashboard/admin/features", icon: Package, keywords: ["funcionalidades", "features", "recursos"], category: "Super Admin", roles: ["super_admin"] },
  { label: "Transações Cartão (Admin)", href: "/dashboard/admin/card-transactions", icon: CreditCard, keywords: ["transações admin", "cartão admin"], category: "Super Admin", roles: ["super_admin"] },
  { label: "Nota Fiscal (NFe) Admin", href: "/dashboard/admin/nfe", icon: FileText, keywords: ["nfe admin", "fiscal admin"], category: "Super Admin", roles: ["super_admin"] },
  { label: "Logs do Sistema", href: "/dashboard/admin/logs", icon: ScrollText, keywords: ["logs", "sistema", "debug"], category: "Super Admin", roles: ["super_admin"] },
  { label: "Logs de IA", href: "/dashboard/admin/ai-logs", icon: Brain, keywords: ["ia", "ai", "inteligência artificial", "logs ia"], category: "Super Admin", roles: ["super_admin"] },
  { label: "Saúde das Integrações", href: "/dashboard/admin/integrations", icon: Activity, keywords: ["integrações", "saúde", "health"], category: "Super Admin", roles: ["super_admin"] },
  { label: "Config. Onboarding", href: "/dashboard/admin/onboarding", icon: BookOpen, keywords: ["onboarding", "configurar"], category: "Super Admin", roles: ["super_admin"] },
  { label: "Indicações (Admin)", href: "/dashboard/admin/referrals", icon: Crown, keywords: ["indicações admin", "referrals admin"], category: "Super Admin", roles: ["super_admin"] },
  { label: "Solicitações de Estorno", href: "/dashboard/admin/refunds", icon: RotateCcw, keywords: ["estorno", "refunds", "devolução"], category: "Super Admin", roles: ["super_admin"] },
  { label: "Templates de Email", href: "/dashboard/admin/email-templates", icon: Mail, keywords: ["email", "templates", "modelos"], category: "Super Admin", roles: ["super_admin"] },
  { label: "Notas de Versão", href: "/dashboard/admin/release-notes", icon: Rocket, keywords: ["versão", "release", "notas"], category: "Super Admin", roles: ["super_admin"] },
  { label: "Config. Sistema", href: "/dashboard/admin/system", icon: Settings, keywords: ["sistema", "configurações", "settings"], category: "Super Admin", roles: ["super_admin"] },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { roles } = useAuth();

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback((href: string) => {
    setOpen(false);
    navigate(href);
  }, [navigate]);

  // Filter items based on user roles
  const filteredItems = searchItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.some(role => roles.includes(role as any));
  });

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SearchItem[]>);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-md bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Pesquisar...</span>
        <span className="inline-flex lg:hidden">Pesquisar</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Pesquisar páginas, configurações..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          {Object.entries(groupedItems).map(([category, items]) => (
            <CommandGroup key={category} heading={category}>
              {items.map((item) => (
                <CommandItem
                  key={item.href}
                  value={`${item.label} ${item.keywords.join(" ")}`}
                  onSelect={() => handleSelect(item.href)}
                  className="cursor-pointer"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
