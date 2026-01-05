"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookOpen,
  Loader2,
  Plus,
  Search,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/utils/trpc";

const accountTypes = [
  { value: "asset", label: "Activo", color: "bg-blue-500" },
  { value: "liability", label: "Pasivo", color: "bg-red-500" },
  { value: "equity", label: "Patrimonio", color: "bg-purple-500" },
  { value: "income", label: "Ingresos", color: "bg-green-500" },
  { value: "expense", label: "Gastos", color: "bg-orange-500" },
];

// Plan contable español simplificado
const defaultChartOfAccounts = [
  // Grupo 1 - Financiación básica
  { code: "10", name: "Capital", level: 1, type: "equity" as const },
  {
    code: "100",
    name: "Capital social",
    level: 2,
    type: "equity" as const,
    parentCode: "10",
  },
  { code: "11", name: "Reservas", level: 1, type: "equity" as const },
  {
    code: "113",
    name: "Reservas voluntarias",
    level: 2,
    type: "equity" as const,
    parentCode: "11",
  },
  {
    code: "12",
    name: "Resultados pendientes de aplicación",
    level: 1,
    type: "equity" as const,
  },
  {
    code: "129",
    name: "Resultado del ejercicio",
    level: 2,
    type: "equity" as const,
    parentCode: "12",
  },
  {
    code: "17",
    name: "Deudas a largo plazo",
    level: 1,
    type: "liability" as const,
  },
  {
    code: "170",
    name: "Deudas a largo plazo con entidades de crédito",
    level: 2,
    type: "liability" as const,
    parentCode: "17",
  },

  // Grupo 2 - Activo no corriente
  {
    code: "20",
    name: "Inmovilizaciones intangibles",
    level: 1,
    type: "asset" as const,
  },
  {
    code: "206",
    name: "Aplicaciones informáticas",
    level: 2,
    type: "asset" as const,
    parentCode: "20",
  },
  {
    code: "21",
    name: "Inmovilizaciones materiales",
    level: 1,
    type: "asset" as const,
  },
  {
    code: "210",
    name: "Terrenos y bienes naturales",
    level: 2,
    type: "asset" as const,
    parentCode: "21",
  },
  {
    code: "211",
    name: "Construcciones",
    level: 2,
    type: "asset" as const,
    parentCode: "21",
  },
  {
    code: "213",
    name: "Maquinaria",
    level: 2,
    type: "asset" as const,
    parentCode: "21",
  },
  {
    code: "216",
    name: "Mobiliario",
    level: 2,
    type: "asset" as const,
    parentCode: "21",
  },
  {
    code: "217",
    name: "Equipos para procesos de información",
    level: 2,
    type: "asset" as const,
    parentCode: "21",
  },
  {
    code: "218",
    name: "Elementos de transporte",
    level: 2,
    type: "asset" as const,
    parentCode: "21",
  },
  {
    code: "28",
    name: "Amortización acumulada del inmovilizado",
    level: 1,
    type: "asset" as const,
  },
  {
    code: "281",
    name: "Amortización acumulada del inmovilizado material",
    level: 2,
    type: "asset" as const,
    parentCode: "28",
  },

  // Grupo 3 - Existencias
  { code: "30", name: "Comerciales", level: 1, type: "asset" as const },
  {
    code: "300",
    name: "Mercaderías",
    level: 2,
    type: "asset" as const,
    parentCode: "30",
  },
  { code: "31", name: "Materias primas", level: 1, type: "asset" as const },
  {
    code: "310",
    name: "Materias primas A",
    level: 2,
    type: "asset" as const,
    parentCode: "31",
  },

  // Grupo 4 - Acreedores y deudores
  { code: "40", name: "Proveedores", level: 1, type: "liability" as const },
  {
    code: "400",
    name: "Proveedores",
    level: 2,
    type: "liability" as const,
    parentCode: "40",
  },
  {
    code: "410",
    name: "Acreedores por prestaciones de servicios",
    level: 2,
    type: "liability" as const,
    parentCode: "40",
  },
  { code: "43", name: "Clientes", level: 1, type: "asset" as const },
  {
    code: "430",
    name: "Clientes",
    level: 2,
    type: "asset" as const,
    parentCode: "43",
  },
  { code: "44", name: "Deudores varios", level: 1, type: "asset" as const },
  {
    code: "440",
    name: "Deudores",
    level: 2,
    type: "asset" as const,
    parentCode: "44",
  },
  {
    code: "47",
    name: "Administraciones públicas",
    level: 1,
    type: "liability" as const,
  },
  {
    code: "472",
    name: "HP IVA soportado",
    level: 2,
    type: "asset" as const,
    parentCode: "47",
  },
  {
    code: "473",
    name: "HP retenciones y pagos a cuenta",
    level: 2,
    type: "asset" as const,
    parentCode: "47",
  },
  {
    code: "475",
    name: "HP acreedora por IVA",
    level: 2,
    type: "liability" as const,
    parentCode: "47",
  },
  {
    code: "476",
    name: "Organismos de la Seguridad Social acreedores",
    level: 2,
    type: "liability" as const,
    parentCode: "47",
  },

  // Grupo 5 - Cuentas financieras
  {
    code: "52",
    name: "Deudas a corto plazo",
    level: 1,
    type: "liability" as const,
  },
  {
    code: "520",
    name: "Deudas a corto plazo con entidades de crédito",
    level: 2,
    type: "liability" as const,
    parentCode: "52",
  },
  { code: "57", name: "Tesorería", level: 1, type: "asset" as const },
  {
    code: "570",
    name: "Caja",
    level: 2,
    type: "asset" as const,
    parentCode: "57",
  },
  {
    code: "572",
    name: "Bancos c/c",
    level: 2,
    type: "asset" as const,
    parentCode: "57",
  },

  // Grupo 6 - Compras y gastos
  { code: "60", name: "Compras", level: 1, type: "expense" as const },
  {
    code: "600",
    name: "Compras de mercaderías",
    level: 2,
    type: "expense" as const,
    parentCode: "60",
  },
  {
    code: "601",
    name: "Compras de materias primas",
    level: 2,
    type: "expense" as const,
    parentCode: "60",
  },
  {
    code: "62",
    name: "Servicios exteriores",
    level: 1,
    type: "expense" as const,
  },
  {
    code: "621",
    name: "Arrendamientos y cánones",
    level: 2,
    type: "expense" as const,
    parentCode: "62",
  },
  {
    code: "622",
    name: "Reparaciones y conservación",
    level: 2,
    type: "expense" as const,
    parentCode: "62",
  },
  {
    code: "623",
    name: "Servicios de profesionales independientes",
    level: 2,
    type: "expense" as const,
    parentCode: "62",
  },
  {
    code: "625",
    name: "Primas de seguros",
    level: 2,
    type: "expense" as const,
    parentCode: "62",
  },
  {
    code: "626",
    name: "Servicios bancarios",
    level: 2,
    type: "expense" as const,
    parentCode: "62",
  },
  {
    code: "627",
    name: "Publicidad, propaganda y relaciones públicas",
    level: 2,
    type: "expense" as const,
    parentCode: "62",
  },
  {
    code: "628",
    name: "Suministros",
    level: 2,
    type: "expense" as const,
    parentCode: "62",
  },
  {
    code: "629",
    name: "Otros servicios",
    level: 2,
    type: "expense" as const,
    parentCode: "62",
  },
  {
    code: "64",
    name: "Gastos de personal",
    level: 1,
    type: "expense" as const,
  },
  {
    code: "640",
    name: "Sueldos y salarios",
    level: 2,
    type: "expense" as const,
    parentCode: "64",
  },
  {
    code: "642",
    name: "Seguridad Social a cargo de la empresa",
    level: 2,
    type: "expense" as const,
    parentCode: "64",
  },
  {
    code: "68",
    name: "Dotaciones para amortizaciones",
    level: 1,
    type: "expense" as const,
  },
  {
    code: "681",
    name: "Amortización del inmovilizado material",
    level: 2,
    type: "expense" as const,
    parentCode: "68",
  },

  // Grupo 7 - Ventas e ingresos
  {
    code: "70",
    name: "Ventas de mercaderías y producción",
    level: 1,
    type: "income" as const,
  },
  {
    code: "700",
    name: "Ventas de mercaderías",
    level: 2,
    type: "income" as const,
    parentCode: "70",
  },
  {
    code: "705",
    name: "Prestaciones de servicios",
    level: 2,
    type: "income" as const,
    parentCode: "70",
  },
  {
    code: "75",
    name: "Otros ingresos de gestión",
    level: 1,
    type: "income" as const,
  },
  {
    code: "752",
    name: "Ingresos por arrendamientos",
    level: 2,
    type: "income" as const,
    parentCode: "75",
  },
  {
    code: "759",
    name: "Ingresos por servicios diversos",
    level: 2,
    type: "income" as const,
    parentCode: "75",
  },
  {
    code: "76",
    name: "Ingresos financieros",
    level: 1,
    type: "income" as const,
  },
  {
    code: "769",
    name: "Otros ingresos financieros",
    level: 2,
    type: "income" as const,
    parentCode: "76",
  },
];

export default function ChartOfAccountsClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [filterType, setFilterType] = useState<string>("all");
  const deferredFilterType = useDeferredValue(filterType);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Form state
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newLevel, setNewLevel] = useState("2");
  const [newType, setNewType] = useState<string>("asset");
  const [newParentCode, setNewParentCode] = useState("");

  // Queries
  const {
    data: accounts,
    isLoading,
    refetch,
  } = useQuery(
    trpc.accounting.getChartOfAccounts.queryOptions({
      search: deferredSearchTerm,
      type:
        deferredFilterType !== "all"
          ? (deferredFilterType as
              | "asset"
              | "liability"
              | "equity"
              | "income"
              | "expense")
          : undefined,
    }),
  );

  // Mutations
  const createAccount = useMutation(
    trpc.accounting.createChartAccount.mutationOptions({
      onSuccess: () => {
        toast.success("Cuenta creada correctamente");
        setIsAddDialogOpen(false);
        resetForm();
        refetch();
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }),
  );

  const bulkCreate = useMutation(
    trpc.accounting.bulkCreateChartAccounts.mutationOptions({
      onSuccess: (data) => {
        toast.success(`${data.length} cuentas creadas correctamente`);
        refetch();
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }),
  );

  const resetForm = () => {
    setNewCode("");
    setNewName("");
    setNewDescription("");
    setNewLevel("2");
    setNewType("asset");
    setNewParentCode("");
  };

  const handleCreateAccount = () => {
    if (!newCode.trim() || !newName.trim()) {
      toast.error("Código y nombre son obligatorios");
      return;
    }

    createAccount.mutate({
      code: newCode.trim(),
      name: newName.trim(),
      description: newDescription.trim() || undefined,
      level: parseInt(newLevel),
      type: newType as "asset" | "liability" | "equity" | "income" | "expense",
      parentCode: newParentCode.trim() || undefined,
    });
  };

  const handleLoadDefaultChart = () => {
    bulkCreate.mutate(defaultChartOfAccounts);
  };

  const getTypeInfo = (type: string) => {
    return accountTypes.find((t) => t.value === type) || accountTypes[0];
  };

  type Account = NonNullable<typeof accounts>[number];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/accounting" prefetch={false}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Plan Contable</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona el plan contable interno de la consultoría
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {(!accounts || accounts.length === 0) && (
            <Button
              variant="outline"
              onClick={handleLoadDefaultChart}
              disabled={bulkCreate.isPending}
            >
              {bulkCreate.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Cargar PGC Español
            </Button>
          )}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Cuenta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Cuenta</DialogTitle>
                <DialogDescription>
                  Añade una nueva cuenta al plan contable
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Código *</Label>
                    <Input
                      id="code"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      placeholder="217"
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Nivel</Label>
                    <Select value={newLevel} onValueChange={setNewLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Nivel 1 (Grupo)</SelectItem>
                        <SelectItem value="2">Nivel 2 (Subgrupo)</SelectItem>
                        <SelectItem value="3">Nivel 3 (Cuenta)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Equipos para procesos de información"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Cuenta *</Label>
                  <Select value={newType} onValueChange={setNewType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentCode">Código Padre</Label>
                  <Input
                    id="parentCode"
                    value={newParentCode}
                    onChange={(e) => setNewParentCode(e.target.value)}
                    placeholder="21"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Descripción de la cuenta..."
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateAccount}
                  disabled={createAccount.isPending}
                >
                  {createAccount.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear Cuenta"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {accountTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cuentas del Plan Contable</CardTitle>
          <CardDescription>
            {accounts?.length || 0} cuentas en total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : accounts && accounts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Código Padre</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account: Account) => {
                  const typeInfo = getTypeInfo(account.type);
                  return (
                    <TableRow key={account.id}>
                      <TableCell className="font-mono font-medium">
                        {account.code}
                      </TableCell>
                      <TableCell
                        style={{
                          paddingLeft: `${(account.level - 1) * 16 + 16}px`,
                        }}
                      >
                        {account.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${typeInfo.color} text-white`}
                        >
                          {typeInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{account.level}</TableCell>
                      <TableCell className="font-mono text-muted-foreground">
                        {account.parentCode || "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No hay cuentas</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Carga el plan contable español o crea cuentas manualmente
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleLoadDefaultChart}
                  disabled={bulkCreate.isPending}
                >
                  {bulkCreate.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Cargar PGC Español
                </Button>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Cuenta
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
