"use client";

import { useState, useMemo, useDeferredValue } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileUp,
  ArrowRight,
  Lightbulb,
  Upload,
} from "lucide-react";
import Link from "next/link";

interface ClientMappingClientProps {
  clientId: string;
}

export default function ClientMappingClient({
  clientId,
}: ClientMappingClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [isAddMappingOpen, setIsAddMappingOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkImportText, setBulkImportText] = useState("");

  // Form state for new mapping
  const [newClientCode, setNewClientCode] = useState("");
  const deferredClientCode = useDeferredValue(newClientCode);
  const [newClientName, setNewClientName] = useState("");
  const [selectedInternalAccount, setSelectedInternalAccount] = useState("");
  const [mappingNotes, setMappingNotes] = useState("");

  // Queries
  const { data: client, isLoading: loadingClient } = useQuery(
    trpc.accounting.getClientById.queryOptions({ clientId }),
  );

  const {
    data: mappings,
    isLoading: loadingMappings,
    refetch: refetchMappings,
  } = useQuery(
    trpc.accounting.getClientMappings.queryOptions({
      clientId,
      search: deferredSearchTerm,
    }),
  );

  const { data: unmappedAccounts, refetch: refetchUnmapped } = useQuery(
    trpc.accounting.getUnmappedAccounts.queryOptions({ clientId }),
  );

  const { data: chartOfAccounts } = useQuery(
    trpc.accounting.getChartOfAccounts.queryOptions({}),
  );

  const { data: suggestions } = useQuery({
    ...trpc.accounting.suggestMapping.queryOptions({
      clientAccountCode: deferredClientCode,
    }),
    enabled: deferredClientCode.length >= 2,
  });

  // Mutations
  const createMapping = useMutation(
    trpc.accounting.createMapping.mutationOptions({
      onSuccess: () => {
        toast.success("Mapeo creado correctamente");
        setIsAddMappingOpen(false);
        resetForm();
        refetchMappings();
        refetchUnmapped();
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }),
  );

  const bulkCreateMappings = useMutation(
    trpc.accounting.bulkCreateMappings.mutationOptions({
      onSuccess: (data) => {
        toast.success(`${data.length} mapeos creados correctamente`);
        setIsBulkImportOpen(false);
        setBulkImportText("");
        refetchMappings();
        refetchUnmapped();
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }),
  );

  const deleteMapping = useMutation(
    trpc.accounting.deleteMapping.mutationOptions({
      onSuccess: () => {
        toast.success("Mapeo eliminado");
        refetchMappings();
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }),
  );

  const completeOnboarding = useMutation(
    trpc.accounting.completeOnboarding.mutationOptions({
      onSuccess: () => {
        toast.success("Onboarding completado");
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }),
  );

  const resetForm = () => {
    setNewClientCode("");
    setNewClientName("");
    setSelectedInternalAccount("");
    setMappingNotes("");
  };

  const handleCreateMapping = () => {
    if (!newClientCode.trim() || !selectedInternalAccount) {
      toast.error("Código de cuenta y cuenta interna son obligatorios");
      return;
    }

    createMapping.mutate({
      clientId,
      clientAccountCode: newClientCode.trim(),
      clientAccountName: newClientName.trim() || undefined,
      internalAccountId: selectedInternalAccount,
      notes: mappingNotes.trim() || undefined,
    });
  };

  type ChartAccount = NonNullable<typeof chartOfAccounts>[number];

  const handleBulkImport = () => {
    // Parse bulk import text (format: clientCode;clientName;internalCode)
    const lines = bulkImportText.trim().split("\n").filter(Boolean);
    const mappingsToCreate: Array<{
      clientAccountCode: string;
      clientAccountName?: string;
      internalAccountId: string;
    }> = [];

    for (const line of lines) {
      const parts = line.split(";").map((p) => p.trim());
      if (parts.length < 2) continue;

      const clientCode = parts[0];
      const internalCode = parts.length === 2 ? parts[1] : parts[2];
      const clientName = parts.length === 3 ? parts[1] : undefined;

      if (!clientCode || !internalCode) continue;

      // Find internal account by code
      const internalAccount = chartOfAccounts?.find(
        (acc: ChartAccount) => acc.code === internalCode,
      );
      if (!internalAccount) {
        toast.error(`Cuenta interna ${internalCode} no encontrada`);
        return;
      }

      mappingsToCreate.push({
        clientAccountCode: clientCode,
        clientAccountName: clientName,
        internalAccountId: internalAccount.id,
      });
    }

    if (mappingsToCreate.length === 0) {
      toast.error("No se encontraron mapeos válidos");
      return;
    }

    bulkCreateMappings.mutate({
      clientId,
      mappings: mappingsToCreate,
    });
  };

  const handleMapUnmapped = (
    accountCode: string,
    accountName?: string | null,
  ) => {
    setNewClientCode(accountCode);
    setNewClientName(accountName || "");
    setIsAddMappingOpen(true);
  };

  // Group accounts by type for select
  const groupedAccounts = useMemo(() => {
    if (!chartOfAccounts) return {} as Record<string, ChartAccount[]>;
    return chartOfAccounts.reduce(
      (acc: Record<string, ChartAccount[]>, account: ChartAccount) => {
        const type = account.type;
        if (!acc[type]) acc[type] = [];
        acc[type].push(account);
        return acc;
      },
      {} as Record<string, ChartAccount[]>,
    );
  }, [chartOfAccounts]);

  const typeLabels: Record<string, string> = {
    asset: "Activo",
    liability: "Pasivo",
    equity: "Patrimonio",
    income: "Ingresos",
    expense: "Gastos",
  };

  type UnmappedAccount = NonNullable<typeof unmappedAccounts>[number];
  type Mapping = NonNullable<typeof mappings>[number];
  type Suggestion = NonNullable<typeof suggestions>[number];

  if (loadingClient) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Cliente no encontrado</h2>
        <Button asChild className="mt-4">
          <Link href="/accounting" prefetch={false}>
            Volver
          </Link>
        </Button>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
            <p className="text-muted-foreground mt-1">
              {client.taxId && (
                <span className="mr-4">CIF: {client.taxId}</span>
              )}
              {client.onboardingCompleted ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Onboarding Completado
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Onboarding Pendiente
                </Badge>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!client.onboardingCompleted && (
            <Button
              variant="default"
              onClick={() => completeOnboarding.mutate({ clientId })}
              disabled={completeOnboarding.isPending}
            >
              {completeOnboarding.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              Completar Onboarding
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Cuentas Mapeadas
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {client.mappedAccountsCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pendientes de Mapear
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {client.unmappedAccountsCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unmapped Accounts Alert */}
      {unmappedAccounts && unmappedAccounts.length > 0 && (
        <Card className="border-orange-500/50 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="text-orange-700 dark:text-orange-400 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Cuentas Pendientes de Mapear
            </CardTitle>
            <CardDescription>
              Estas cuentas han aparecido en documentos importados y necesitan
              ser mapeadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {unmappedAccounts.slice(0, 10).map((account: UnmappedAccount) => (
                <Button
                  key={account.id}
                  variant="outline"
                  size="sm"
                  className="border-orange-500/50"
                  onClick={() =>
                    handleMapUnmapped(account.accountCode, account.accountName)
                  }
                >
                  <span className="font-mono">{account.accountCode}</span>
                  {account.accountName && (
                    <span className="ml-2 text-muted-foreground">
                      {account.accountName}
                    </span>
                  )}
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              ))}
              {unmappedAccounts.length > 10 && (
                <Badge variant="secondary">
                  +{unmappedAccounts.length - 10} más
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar mapeos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Dialog open={isBulkImportOpen} onOpenChange={setIsBulkImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importar Masivo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Importación Masiva de Mapeos</DialogTitle>
                <DialogDescription>
                  Pega los mapeos en formato:
                  código_cliente;nombre_cuenta;código_interno
                  <br />
                  El nombre de cuenta es opcional: código_cliente;código_interno
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Textarea
                  value={bulkImportText}
                  onChange={(e) => setBulkImportText(e.target.value)}
                  placeholder={`2171;Ordenadores;217\n2172;Ratones;217\n2173;Impresoras;217`}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsBulkImportOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleBulkImport}
                  disabled={bulkCreateMappings.isPending}
                >
                  {bulkCreateMappings.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    "Importar"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddMappingOpen} onOpenChange={setIsAddMappingOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Mapeo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Mapeo de Cuenta</DialogTitle>
                <DialogDescription>
                  Asocia una cuenta del cliente con una cuenta de nuestro plan
                  contable
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="clientCode">Código Cuenta Cliente *</Label>
                  <Input
                    id="clientCode"
                    value={newClientCode}
                    onChange={(e) => setNewClientCode(e.target.value)}
                    placeholder="2171"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientAccountName">
                    Nombre Cuenta Cliente
                  </Label>
                  <Input
                    id="clientAccountName"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Ordenadores"
                  />
                </div>

                {/* Suggestions */}
                {suggestions && suggestions.length > 0 && (
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
                      <Lightbulb className="h-4 w-4" />
                      Sugerencias basadas en el código
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion: Suggestion) => (
                        <Button
                          key={suggestion.id}
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedInternalAccount(suggestion.id)
                          }
                          className={
                            selectedInternalAccount === suggestion.id
                              ? "border-blue-500 bg-blue-50"
                              : ""
                          }
                        >
                          <span className="font-mono">{suggestion.code}</span>
                          <span className="ml-2">{suggestion.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="internalAccount">Cuenta Interna *</Label>
                  <Select
                    value={selectedInternalAccount}
                    onValueChange={setSelectedInternalAccount}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una cuenta" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {Object.entries(groupedAccounts).map(
                        ([type, accounts]) => (
                          <div key={type}>
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                              {typeLabels[type] || type}
                            </div>
                            {(accounts as ChartAccount[]).map(
                              (account: ChartAccount) => (
                                <SelectItem key={account.id} value={account.id}>
                                  <span className="font-mono mr-2">
                                    {account.code}
                                  </span>
                                  {account.name}
                                </SelectItem>
                              ),
                            )}
                          </div>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    value={mappingNotes}
                    onChange={(e) => setMappingNotes(e.target.value)}
                    placeholder="Notas adicionales sobre este mapeo..."
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddMappingOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateMapping}
                  disabled={createMapping.isPending}
                >
                  {createMapping.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear Mapeo"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Mappings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mapeos de Cuentas</CardTitle>
          <CardDescription>
            Relación entre las cuentas del cliente y nuestro plan contable
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingMappings ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : mappings && mappings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código Cliente</TableHead>
                  <TableHead>Nombre Cliente</TableHead>
                  <TableHead className="text-center">→</TableHead>
                  <TableHead>Código Interno</TableHead>
                  <TableHead>Nombre Interno</TableHead>
                  <TableHead>Notas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.map((mapping: Mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell className="font-mono font-medium">
                      {mapping.clientAccountCode}
                    </TableCell>
                    <TableCell>{mapping.clientAccountName || "-"}</TableCell>
                    <TableCell className="text-center">
                      <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" />
                    </TableCell>
                    <TableCell className="font-mono">
                      {mapping.internalAccountCode}
                    </TableCell>
                    <TableCell>{mapping.internalAccountName}</TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                      {mapping.notes || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              ¿Eliminar mapeo?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Se eliminará el mapeo de la cuenta{" "}
                              <strong>{mapping.clientAccountCode}</strong>. Esta
                              acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                deleteMapping.mutate({ mappingId: mapping.id })
                              }
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileUp className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No hay mapeos</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Comienza añadiendo mapeos de cuentas contables
              </p>
              <Button onClick={() => setIsAddMappingOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Mapeo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
