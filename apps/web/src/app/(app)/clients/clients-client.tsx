"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Building2,
  Edit,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useDeferredValue, useState } from "react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/utils/trpc";

const SECTORES = [
  "Restaurantes",
  "Hoteles",
  "Agencias de Viajes y Turismo",
  "Asesorías y Bufetes",
  "Agencias Marketing y Publicidad",
  "Promoción e Intermediación Inmobiliaria",
  "Especialistas de construcción",
  "Agricultura",
  "Ganadería",
  "Pesca",
  "Industria Alimentaria",
  "Industria Manufacturera",
  "Ecommerce",
  "Transporte",
  "Agencia Logística",
  "Consultoría IT",
  "Educación",
  "Clínicas",
  "Gimnasios",
  "Comercio retail",
  "Otros servicios profesionales",
  "Peluquerías y Salones de Belleza",
  "Panaderías",
  "Fruterías",
  "Supermercados",
  "Carnicerías",
  "Pescaderías",
  "Estancos",
  "Farmacias",
  "Talleres",
] as const;

const TIPOS_EMPRESA = [
  "Comercializador sin stock",
  "Comercializador con stock",
  "Servicios",
  "Productor",
] as const;

type SectorCliente = (typeof SECTORES)[number];
type TipoEmpresaCliente = (typeof TIPOS_EMPRESA)[number];

type ClientFormData = {
  taxId: string;
  name: string;
  sector: SectorCliente;
  companyType: TipoEmpresaCliente;
  groupTaxId: string;
  email: string;
  phone: string;
  address: string;
};

const initialFormData: ClientFormData = {
  taxId: "",
  name: "",
  sector: "Consultoría IT",
  companyType: "Servicios",
  groupTaxId: "",
  email: "",
  phone: "",
  address: "",
};

export function ClientsClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);

  const clients = useQuery(trpc.clients.getAll.queryOptions());

  const createClient = useMutation(
    trpc.clients.create.mutationOptions({
      onSuccess: () => {
        toast.success("Cliente creado correctamente");
        setCreateDialogOpen(false);
        setFormData(initialFormData);
        clients.refetch();
      },
      onError: (error) => {
        toast.error(error.message || "Error al crear el cliente");
      },
    }),
  );

  const updateClient = useMutation(
    trpc.clients.update.mutationOptions({
      onSuccess: () => {
        toast.success("Cliente actualizado correctamente");
        setEditDialogOpen(false);
        setSelectedClientId(null);
        setFormData(initialFormData);
        clients.refetch();
      },
      onError: (error) => {
        toast.error(error.message || "Error al actualizar el cliente");
      },
    }),
  );

  const deleteClient = useMutation(
    trpc.clients.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Cliente eliminado correctamente");
        clients.refetch();
      },
      onError: (error) => {
        toast.error(error.message || "Error al eliminar el cliente");
      },
    }),
  );

  const filteredClients = clients.data?.filter(
    (client) =>
      client.name.toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
      client.taxId.toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(deferredSearchTerm.toLowerCase()),
  );

  const handleCreate = () => {
    if (!formData.taxId.trim()) {
      toast.error("El CIF es obligatorio");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("El email es obligatorio");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("El teléfono es obligatorio");
      return;
    }

    createClient.mutate({
      taxId: formData.taxId.trim(),
      name: formData.name.trim(),
      sector: formData.sector,
      companyType: formData.companyType,
      groupTaxId: formData.groupTaxId || undefined,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim() || undefined,
    });
  };

  const handleEdit = () => {
    if (!selectedClientId) return;
    updateClient.mutate({
      id: selectedClientId,
      taxId: formData.taxId.trim(),
      name: formData.name.trim(),
      sector: formData.sector,
      companyType: formData.companyType,
      groupTaxId: formData.groupTaxId || undefined,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim() || undefined,
    });
  };

  const handleDelete = (id: string) => {
    deleteClient.mutate({ id });
  };

  const openEditDialog = (client: NonNullable<typeof clients.data>[number]) => {
    setSelectedClientId(client.id);
    setFormData({
      taxId: client.taxId,
      name: client.name,
      sector: client.sector as SectorCliente,
      companyType: client.companyType as TipoEmpresaCliente,
      groupTaxId: client.groupTaxId || "",
      email: client.email,
      phone: client.phone,
      address: client.address || "",
    });
    setEditDialogOpen(true);
  };

  const ClientForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? "edit" : "create"}-cif`}>CIF *</Label>
          <Input
            id={`${isEdit ? "edit" : "create"}-cif`}
            value={formData.taxId}
            onChange={(e) =>
              setFormData({ ...formData, taxId: e.target.value })
            }
            placeholder="B12345678"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? "edit" : "create"}-nombre`}>
            Nombre *
          </Label>
          <Input
            id={`${isEdit ? "edit" : "create"}-nombre`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nombre del cliente"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? "edit" : "create"}-sector`}>
            Sector *
          </Label>
          <Select
            value={formData.sector}
            onValueChange={(value) =>
              setFormData({ ...formData, sector: value as SectorCliente })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SECTORES.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? "edit" : "create"}-tipo`}>
            Tipo de Empresa *
          </Label>
          <Select
            value={formData.companyType}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                companyType: value as TipoEmpresaCliente,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_EMPRESA.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? "edit" : "create"}-email`}>Email *</Label>
          <Input
            id={`${isEdit ? "edit" : "create"}-email`}
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="email@ejemplo.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? "edit" : "create"}-telefono`}>
            Teléfono *
          </Label>
          <Input
            id={`${isEdit ? "edit" : "create"}-telefono`}
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="123456789"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${isEdit ? "edit" : "create"}-cif-grupo`}>
          CIF Grupo (opcional)
        </Label>
        <Select
          value={formData.groupTaxId}
          onValueChange={(value) =>
            setFormData({ ...formData, groupTaxId: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar grupo o dejar vacío" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Sin grupo</SelectItem>
            {clients.data
              ?.filter(
                (c) =>
                  c.taxId !== formData.taxId &&
                  (!isEdit || c.id !== selectedClientId),
              )
              .map((client) => (
                <SelectItem key={client.id} value={client.taxId}>
                  {client.taxId} - {client.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${isEdit ? "edit" : "create"}-direccion`}>
          Dirección (opcional)
        </Label>
        <Textarea
          id={`${isEdit ? "edit" : "create"}-direccion`}
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          placeholder="Av. Libertad, s/n."
          rows={2}
        />
      </div>
    </div>
  );

  if (clients.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">
              Total Clientes
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {clients.data?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">Sectores</CardTitle>
            <Building2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {new Set(clients.data?.map((c) => c.sector)).size || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">Grupos</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {new Set(
                clients.data
                  ?.filter((c) => c.groupTaxId)
                  .map((c) => c.groupTaxId),
              ).size || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Create */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, CIF o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Completa los datos para dar de alta un nuevo cliente
              </DialogDescription>
            </DialogHeader>
            <ClientForm />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setCreateDialogOpen(false);
                  setFormData(initialFormData);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={createClient.isPending}>
                {createClient.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
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

      {/* Clients Grid */}
      {filteredClients && filteredClients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-lg">No hay clientes</h3>
            <p className="mb-4 text-center text-muted-foreground">
              {searchTerm
                ? "No se encontraron clientes con ese criterio de búsqueda"
                : "Empieza creando tu primer cliente"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 size-4" />
                Crear Primer Cliente
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients?.map((client) => (
            <Card key={client.id} className="group relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <CardDescription className="font-mono">
                      {client.taxId}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => openEditDialog(client)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará
                            permanentemente el cliente {client.name} y todos los
                            datos asociados.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(client.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{client.sector}</Badge>
                  <Badge variant="secondary">{client.companyType}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="size-4" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-4" />
                    <span>{client.phone}</span>
                  </div>
                  {client.address && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-4 shrink-0" />
                      <span className="truncate">{client.address}</span>
                    </div>
                  )}
                </div>
                {client.groupTaxId && (
                  <div className="border-t pt-3">
                    <span className="text-muted-foreground text-xs">
                      Grupo: {client.groupTaxId}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Actualiza la información del cliente
            </DialogDescription>
          </DialogHeader>
          <ClientForm isEdit />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setSelectedClientId(null);
                setFormData(initialFormData);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleEdit} disabled={updateClient.isPending}>
              {updateClient.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
