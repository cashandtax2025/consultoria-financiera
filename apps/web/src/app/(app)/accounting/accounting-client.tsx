"use client";

import { useState, useDeferredValue } from "react";
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
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Building2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default function AccountingClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [newClientName, setNewClientName] = useState("");
  const [newClientTaxId, setNewClientTaxId] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Queries - use deferred search to avoid excessive queries
  const clients = useQuery(
    trpc.accounting.getClients.queryOptions({ search: deferredSearchTerm }),
  );

  const chartOfAccounts = useQuery(
    trpc.accounting.getChartOfAccounts.queryOptions({}),
  );

  // Mutations
  const createClient = useMutation(
    trpc.accounting.createClient.mutationOptions({
      onSuccess: () => {
        toast.success("Cliente creado correctamente");
        setIsCreateDialogOpen(false);
        setNewClientName("");
        setNewClientTaxId("");
        clients.refetch();
      },
      onError: (error) => {
        toast.error(`Error al crear cliente: ${error.message}`);
      },
    }),
  );

  const handleCreateClient = () => {
    if (!newClientName.trim()) {
      toast.error("El nombre del cliente es obligatorio");
      return;
    }
    createClient.mutate({
      cifCliente: newClientTaxId.trim(),
      nombreCliente: newClientName.trim(),
      sectorCliente: "Otros servicios profesionales", // Valor por defecto
      tipoEmpresaCliente: "Servicios", // Valor por defecto
      emailCliente: "placeholder@email.com", // TODO: Agregar campo de email
      telefonoCliente: "600000000", // TODO: Agregar campo de teléfono
    });
  };

  type Client = {
    idCliente: string;
    cifCliente: string;
    nombreCliente: string;
    sectorCliente: string;
    tipoEmpresaCliente: string;
    idGrupoCliente: string | null;
    cifGrupoCliente: string | null;
    emailCliente: string;
    telefonoCliente: string;
    direccionCliente: string | null;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    onboardingCompleted: boolean;
  };

  const filteredClients = (clients.data as Client[] | undefined)?.filter(
    (client: Client) =>
      client.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.cifCliente?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contabilidad</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona el mapeo de cuentas contables de tus clientes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/accounting/chart" prefetch={false}>
              <BookOpen className="h-4 w-4 mr-2" />
              Plan Contable
            </Link>
          </Button>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Cliente</DialogTitle>
                <DialogDescription>
                  Añade un nuevo cliente para comenzar el proceso de onboarding
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nombre del Cliente *</Label>
                  <Input
                    id="clientName"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Empresa S.L."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientTaxId">CIF/NIF</Label>
                  <Input
                    id="clientTaxId"
                    value={newClientTaxId}
                    onChange={(e) => setNewClientTaxId(e.target.value)}
                    placeholder="B12345678"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateClient}
                  disabled={createClient.isPending}
                >
                  {createClient.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear Cliente"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clientes
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(clients.data as Client[] | undefined)?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Onboarding Completado
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(clients.data as Client[] | undefined)?.filter((c: Client) => c.onboardingCompleted)
                .length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Cuentas en Plan
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {chartOfAccounts.data?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>
            Lista de clientes y estado de su mapeo contable
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clients.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredClients && filteredClients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>CIF/NIF</TableHead>
                  <TableHead>Estado Onboarding</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client: Client) => (
                  <TableRow key={client.idCliente}>
                    <TableCell className="font-medium">{client.nombreCliente}</TableCell>
                    <TableCell>{client.cifCliente}</TableCell>
                    <TableCell>
                      {client.onboardingCompleted ? (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completado
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pendiente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(client.createdAt).toLocaleDateString("es-ES")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/accounting/client/${client.idCliente}`}
                          prefetch={false}
                        >
                          Gestionar
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No hay clientes</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Crea tu primer cliente para comenzar el proceso de onboarding
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Cliente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
