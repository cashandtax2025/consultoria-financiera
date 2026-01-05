"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
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

// Tipos de sector y empresa
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

type ClientFormData = {
  taxId: string;
  name: string;
  sector: (typeof SECTORES)[number];
  companyType: (typeof TIPOS_EMPRESA)[number];
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
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);

  const clients = useQuery(trpc.clients.getAll.queryOptions());
  const allClients = useQuery(trpc.clients.getAll.queryOptions()); // Para buscar grupos

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

  const selectedClient = clients.data?.find((c) => c.id === selectedClientId);

  const handleCreate = () => {
    createClient.mutate({
      taxId: formData.taxId,
      name: formData.name,
      sector: formData.sector,
      companyType: formData.companyType,
      groupTaxId: formData.groupTaxId || undefined,
      email: formData.email,
      phone: formData.phone,
      address: formData.address || undefined,
    });
  };

  const handleEdit = () => {
    if (!selectedClientId) return;
    updateClient.mutate({
      id: selectedClientId,
      taxId: formData.taxId,
      name: formData.name,
      sector: formData.sector,
      companyType: formData.companyType,
      groupTaxId: formData.groupTaxId || undefined,
      email: formData.email,
      phone: formData.phone,
      address: formData.address || undefined,
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
      sector: client.sector as (typeof SECTORES)[number],
      companyType: client.companyType as (typeof TIPOS_EMPRESA)[number],
      groupTaxId: client.groupTaxId || "",
      email: client.email,
      phone: client.phone,
      address: client.address || "",
    });
    setEditDialogOpen(true);
  };

  if (clients.isLoading) {
    return <div className="text-center py-10">Cargando clientes...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Create Client Button */}
      <div className="flex justify-end">
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Completa los datos para dar de alta un nuevo cliente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create-cif">CIF *</Label>
                  <Input
                    id="create-cif"
                    value={formData.taxId}
                    onChange={(e) =>
                      setFormData({ ...formData, taxId: e.target.value })
                    }
                    placeholder="B12345678"
                  />
                </div>
                <div>
                  <Label htmlFor="create-nombre">Nombre *</Label>
                  <Input
                    id="create-nombre"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    placeholder="Nombre del cliente"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create-sector">Sector *</Label>
                  <Select
                    value={formData.sector}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        sector: value as (typeof SECTORES)[number],
                      })
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
                <div>
                  <Label htmlFor="create-tipo">Tipo de Empresa *</Label>
                  <Select
                    value={formData.companyType}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        companyType: value as (typeof TIPOS_EMPRESA)[number],
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

              <div>
                <Label htmlFor="create-cif-grupo">CIF Grupo (opcional)</Label>
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
                    {allClients.data
                      ?.filter((c) => c.taxId !== formData.taxId)
                      .map((client) => (
                        <SelectItem key={client.id} value={client.taxId}>
                          {client.taxId} - {client.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create-email">Email *</Label>
                  <Input
                    id="create-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@ejemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="create-telefono">Teléfono *</Label>
                  <Input
                    id="create-telefono"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                    placeholder="123456789"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="create-direccion">Dirección (opcional)</Label>
                <Textarea
                  id="create-direccion"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value,
                    })
                  }
                  placeholder="Av. Libertad, s/n."
                />
              </div>
            </div>
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
                {createClient.isPending ? "Creando..." : "Crear Cliente"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Clients Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>CIF</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.data && clients.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">
                  No hay clientes registrados
                </TableCell>
              </TableRow>
            ) : (
              clients.data?.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.id}</TableCell>
                  <TableCell>{client.taxId}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{client.sector}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{client.companyType}</Badge>
                  </TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>
                    {client.groupTaxId ? (
                      <Badge variant="outline">{client.groupTaxId}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(client)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará
                              permanentemente el cliente {client.name} y todos
                              los datos asociados.
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Actualiza la información del cliente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-cif">CIF *</Label>
                <Input
                  id="edit-cif"
                  value={formData.taxId}
                  onChange={(e) =>
                    setFormData({ ...formData, taxId: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-nombre">Nombre *</Label>
                <Input
                  id="edit-nombre"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-sector">Sector *</Label>
                <Select
                  value={formData.sector}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      sector: value as (typeof SECTORES)[number],
                    })
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
              <div>
                <Label htmlFor="edit-tipo">Tipo de Empresa *</Label>
                <Select
                  value={formData.companyType}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      companyType: value as (typeof TIPOS_EMPRESA)[number],
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

            <div>
              <Label htmlFor="edit-cif-grupo">CIF Grupo (opcional)</Label>
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
                  {allClients.data
                    ?.filter(
                      (c) =>
                        c.taxId !== formData.taxId && c.id !== selectedClientId,
                    )
                    .map((client) => (
                      <SelectItem key={client.id} value={client.taxId}>
                        {client.taxId} - {client.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-telefono">Teléfono *</Label>
                <Input
                  id="edit-telefono"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-direccion">Dirección (opcional)</Label>
              <Textarea
                id="edit-direccion"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
          </div>
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
              {updateClient.isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
