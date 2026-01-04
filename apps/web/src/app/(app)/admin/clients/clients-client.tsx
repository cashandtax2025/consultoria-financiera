"use client";

import {
  Edit,
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/utils/trpc";

export function ClientsClient() {
  // Query for fetching clients
  const { data: clientsData, isLoading, refetch: refetchClients } = useQuery(
    trpc.accounting.getClients.queryOptions(),
  );

  // Client type inferred from the query result
  type Client = NonNullable<typeof clientsData>[number];

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Create client dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState<{
    name: string;
    taxId: string;
    groupTaxId: string;
    email: string;
    phone: string;
    address: string;
    sector: string;
    companyType: string;
    notes: string;
  }>({
    name: "",
    taxId: "",
    groupTaxId: "",
    email: "",
    phone: "",
    address: "",
    sector: "",
    companyType: "",
    notes: "",
  });

  // Edit client dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    taxId: "",
    groupTaxId: "",
    email: "",
    phone: "",
    address: "",
    sector: "",
    companyType: "",
    notes: "",
  });

  // Mutation for creating clients
  const createClientMutation = useMutation(
    trpc.accounting.createClient.mutationOptions({
      onSuccess: () => {
        toast.success("Cliente creado exitosamente");
        setCreateDialogOpen(false);
        setCreateForm({
          name: "",
          taxId: "",
          groupTaxId: "",
          email: "",
          phone: "",
          address: "",
          sector: "",
          companyType: "",
          notes: "",
        });
        refetchClients();
      },
      onError: (error) => {
        toast.error(`Error al crear cliente: ${error.message}`);
      },
    }),
  );

  // Validación del formulario de creación
  const validateCreateForm = () => {
    if (!createForm.name.trim()) {
      toast.error("El nombre del cliente es obligatorio");
      return false;
    }

    // Validar email si se proporciona
    if (createForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email)) {
      toast.error("El correo electrónico no tiene un formato válido");
      return false;
    }

    // Validar teléfono si se proporciona (formato español básico)
    if (createForm.phone && !/^(\+34|0034|34)?[6-9][0-9]{8}$/.test(createForm.phone.replace(/\s+/g, ''))) {
      toast.error("El teléfono debe tener un formato válido (ej: +34 600 000 000)");
      return false;
    }

    return true;
  };

  const handleCreateClient = () => {
    if (!validateCreateForm()) return;

    createClientMutation.mutate({
      name: createForm.name.trim(),
      taxId: createForm.taxId.trim() || undefined,
      groupTaxId: createForm.groupTaxId.trim() || undefined,
      email: createForm.email.trim() || undefined,
      phone: createForm.phone.trim() || undefined,
      address: createForm.address.trim() || undefined,
      sector: createForm.sector.trim() || undefined,
      companyType: createForm.companyType.trim() || undefined,
      notes: createForm.notes.trim() || undefined,
    });
  };

  // Mutation for updating clients
  const updateClientMutation = useMutation(
    trpc.accounting.updateClient.mutationOptions({
      onSuccess: () => {
        toast.success("Cliente actualizado exitosamente");
        setEditDialogOpen(false);
        setSelectedClient(null);
        refetchClients();
      },
      onError: (error) => {
        toast.error(`Error al actualizar cliente: ${error.message}`);
      },
    }),
  );

  // Validación del formulario de edición
  const validateEditForm = () => {
    if (!editForm.name.trim()) {
      toast.error("El nombre del cliente es obligatorio");
      return false;
    }

    // Validar email si se proporciona
    if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      toast.error("El correo electrónico no tiene un formato válido");
      return false;
    }

    // Validar teléfono si se proporciona (formato español básico)
    if (editForm.phone && !/^(\+34|0034|34)?[6-9][0-9]{8}$/.test(editForm.phone.replace(/\s+/g, ''))) {
      toast.error("El teléfono debe tener un formato válido (ej: +34 600 000 000)");
      return false;
    }

    return true;
  };

  const handleEditClient = () => {
    if (!selectedClient) return;

    if (!validateEditForm()) return;

    updateClientMutation.mutate({
      clientId: selectedClient.id as string,
      data: {
        name: editForm.name.trim() || undefined,
        taxId: editForm.taxId.trim() || undefined,
        groupTaxId: editForm.groupTaxId.trim() || undefined,
        email: editForm.email.trim() || undefined,
        phone: editForm.phone.trim() || undefined,
        address: editForm.address.trim() || undefined,
        sector: editForm.sector.trim() || undefined,
        companyType: editForm.companyType.trim() || undefined,
        notes: editForm.notes.trim() || undefined,
      },
    });
  };

  // Mutation for deleting clients
  const deleteClientMutation = useMutation(
    trpc.accounting.deleteClient.mutationOptions({
      onSuccess: () => {
        toast.success("Cliente eliminado exitosamente");
        refetchClients();
      },
      onError: (error) => {
        toast.error(`Error al eliminar cliente: ${error.message}`);
      },
    }),
  );

  const handleDeleteClient = async (clientId: string) => {
    deleteClientMutation.mutate({ clientId });
  };

  if (isLoading) {
    return <div className="text-center py-10">Cargando clientes...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Create Client Button */}
      <div className="flex justify-end">
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Crear Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Agregar un nuevo cliente al sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label htmlFor="create-name">Nombre *</Label>
                <Input
                  id="create-name"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                  placeholder="Nombre del cliente"
                />
              </div>
              <div>
                <Label htmlFor="create-taxId">CIF/NIF</Label>
                <Input
                  id="create-taxId"
                  value={createForm.taxId}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, taxId: e.target.value })
                  }
                  placeholder="B12345678"
                />
              </div>
              <div>
                <Label htmlFor="create-groupTaxId">CIF Grupo</Label>
                <Input
                  id="create-groupTaxId"
                  value={createForm.groupTaxId}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, groupTaxId: e.target.value })
                  }
                  placeholder="CIF del grupo empresarial"
                />
              </div>
              <div>
                <Label htmlFor="create-sector">Sector</Label>
                <Input
                  id="create-sector"
                  value={createForm.sector}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, sector: e.target.value })
                  }
                  placeholder="Ej: Tecnología, Manufactura, Servicios..."
                />
              </div>
              <div>
                <Label htmlFor="create-companyType">Tipo Empresa</Label>
                <Input
                  id="create-companyType"
                  value={createForm.companyType}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, companyType: e.target.value })
                  }
                  placeholder="Ej: SL, SA, Sociedad Limitada..."
                />
              </div>
              <div>
                <Label htmlFor="create-email">Correo electrónico</Label>
                <Input
                  id="create-email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, email: e.target.value })
                  }
                  placeholder="cliente@empresa.com"
                />
              </div>
              <div>
                <Label htmlFor="create-phone">Teléfono</Label>
                <Input
                  id="create-phone"
                  value={createForm.phone}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, phone: e.target.value })
                  }
                  placeholder="+34 600 000 000"
                />
              </div>
              <div>
                <Label htmlFor="create-address">Dirección</Label>
                <Textarea
                  id="create-address"
                  value={createForm.address}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, address: e.target.value })
                  }
                  placeholder="Dirección completa"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="create-notes">Notas</Label>
                <Textarea
                  id="create-notes"
                  value={createForm.notes}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, notes: e.target.value })
                  }
                  placeholder="Notas adicionales"
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateClient} disabled={createClientMutation.isPending}>
                {createClientMutation.isPending ? "Creando..." : "Crear"}
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
              <TableHead>Nombre</TableHead>
              <TableHead>CIF/NIF</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Tipo Empresa</TableHead>
              <TableHead>Correo electrónico</TableHead>
              <TableHead>Onboarding</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(clientsData || []).map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.taxId || "-"}</TableCell>
                <TableCell>{client.sector || "-"}</TableCell>
                <TableCell>{client.companyType || "-"}</TableCell>
                <TableCell>{client.email || "-"}</TableCell>
                <TableCell>
                  {client.onboardingCompleted ? (
                    <Badge variant="default">Completado</Badge>
                  ) : (
                    <Badge variant="secondary">Pendiente</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(client.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* Edit Client */}
                    <Dialog
                      open={editDialogOpen && selectedClient?.id === client.id}
                      onOpenChange={(open) => {
                        setEditDialogOpen(open);
                        if (open) {
                          setSelectedClient(client);
                          setEditForm({
                            name: client.name,
                            taxId: client.taxId || "",
                            groupTaxId: client.groupTaxId || "",
                            email: client.email || "",
                            phone: client.phone || "",
                            address: client.address || "",
                            sector: client.sector || "",
                            companyType: client.companyType || "",
                            notes: client.notes || "",
                          });
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Editar Cliente</DialogTitle>
                          <DialogDescription>
                            Actualizar información del cliente
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          <div>
                            <Label htmlFor="edit-name">Nombre *</Label>
                            <Input
                              id="edit-name"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Nombre del cliente"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-taxId">CIF/NIF</Label>
                            <Input
                              id="edit-taxId"
                              value={editForm.taxId}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  taxId: e.target.value,
                                })
                              }
                              placeholder="B12345678"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-groupTaxId">CIF Grupo</Label>
                            <Input
                              id="edit-groupTaxId"
                              value={editForm.groupTaxId}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  groupTaxId: e.target.value,
                                })
                              }
                              placeholder="CIF del grupo empresarial"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-sector">Sector</Label>
                            <Input
                              id="edit-sector"
                              value={editForm.sector}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  sector: e.target.value,
                                })
                              }
                              placeholder="Ej: Tecnología, Manufactura, Servicios..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-companyType">Tipo Empresa</Label>
                            <Input
                              id="edit-companyType"
                              value={editForm.companyType}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  companyType: e.target.value,
                                })
                              }
                              placeholder="Ej: SL, SA, Sociedad Limitada..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-email">Correo electrónico</Label>
                            <Input
                              id="edit-email"
                              type="email"
                              value={editForm.email}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  email: e.target.value,
                                })
                              }
                              placeholder="cliente@empresa.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-phone">Teléfono</Label>
                            <Input
                              id="edit-phone"
                              value={editForm.phone}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  phone: e.target.value,
                                })
                              }
                              placeholder="+34 600 000 000"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-address">Dirección</Label>
                            <Textarea
                              id="edit-address"
                              value={editForm.address}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  address: e.target.value,
                                })
                              }
                              placeholder="Dirección completa"
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-notes">Notas</Label>
                            <Textarea
                              id="edit-notes"
                              value={editForm.notes}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  notes: e.target.value,
                                })
                              }
                              placeholder="Notas adicionales"
                              rows={2}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setEditDialogOpen(false)}
                          >
                            Cancelar
                          </Button>
                          <Button onClick={handleEditClient} disabled={updateClientMutation.isPending}>
                            {updateClientMutation.isPending ? "Guardando..." : "Guardar"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Delete Client */}
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
                            Esta acción no se puede deshacer. Esto eliminará permanentemente
                            al cliente {client.name} y todos los datos asociados.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteClient(client.id)}
                            disabled={deleteClientMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deleteClientMutation.isPending ? "Eliminando..." : "Eliminar"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {(!clientsData || clientsData.length === 0) && (
        <div className="text-center py-10 text-muted-foreground">
          No hay clientes registrados aún. Crea el primer cliente usando el botón "Crear Cliente".
        </div>
      )}
    </div>
  );
}
