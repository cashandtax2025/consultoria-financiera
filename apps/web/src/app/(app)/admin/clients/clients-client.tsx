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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    cifCliente: string;
    nombreCliente: string;
    sectorCliente: string;
    tipoEmpresaCliente: string;
    cifGrupoCliente: string;
    emailCliente: string;
    telefonoCliente: string;
    direccionCliente: string;
  }>({
    cifCliente: "",
    nombreCliente: "",
    sectorCliente: "",
    tipoEmpresaCliente: "",
    cifGrupoCliente: "",
    emailCliente: "",
    telefonoCliente: "",
    direccionCliente: "",
  });

  // Edit client dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    cifCliente: "",
    nombreCliente: "",
    sectorCliente: "",
    tipoEmpresaCliente: "",
    cifGrupoCliente: "",
    emailCliente: "",
    telefonoCliente: "",
    direccionCliente: "",
  });

  // Mutation for creating clients
  const createClientMutation = useMutation(
    trpc.accounting.createClient.mutationOptions({
      onSuccess: () => {
        toast.success("Cliente creado exitosamente");
        setCreateDialogOpen(false);
        setCreateForm({
          cifCliente: "",
          nombreCliente: "",
          sectorCliente: "",
          tipoEmpresaCliente: "",
          cifGrupoCliente: "",
          emailCliente: "",
          telefonoCliente: "",
          direccionCliente: "",
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
    if (!createForm.nombreCliente.trim()) {
      toast.error("El nombre del cliente es obligatorio");
      return false;
    }

    if (!createForm.cifCliente.trim()) {
      toast.error("El CIF del cliente es obligatorio");
      return false;
    }

    if (!createForm.sectorCliente) {
      toast.error("El sector del cliente es obligatorio");
      return false;
    }

    if (!createForm.tipoEmpresaCliente) {
      toast.error("El tipo de empresa del cliente es obligatorio");
      return false;
    }

    if (!createForm.emailCliente.trim()) {
      toast.error("El email del cliente es obligatorio");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.emailCliente)) {
      toast.error("El correo electrónico no tiene un formato válido");
      return false;
    }

    if (!createForm.telefonoCliente.trim()) {
      toast.error("El teléfono del cliente es obligatorio");
      return false;
    }

    // Validar teléfono (formato español básico)
    if (!/^(\+34|0034|34)?[6-9][0-9]{8}$/.test(createForm.telefonoCliente.replace(/\s+/g, ''))) {
      toast.error("El teléfono debe tener un formato válido (ej: +34 600 000 000)");
      return false;
    }

    return true;
  };

  const handleCreateClient = () => {
    if (!validateCreateForm()) return;

    createClientMutation.mutate({
      cifCliente: createForm.cifCliente.trim(),
      nombreCliente: createForm.nombreCliente.trim(),
      sectorCliente: createForm.sectorCliente,
      tipoEmpresaCliente: createForm.tipoEmpresaCliente,
      cifGrupoCliente: createForm.cifGrupoCliente.trim() || undefined,
      emailCliente: createForm.emailCliente.trim(),
      telefonoCliente: createForm.telefonoCliente.trim(),
      direccionCliente: createForm.direccionCliente.trim() || undefined,
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
    if (!editForm.nombreCliente.trim()) {
      toast.error("El nombre del cliente es obligatorio");
      return false;
    }

    if (!editForm.cifCliente.trim()) {
      toast.error("El CIF del cliente es obligatorio");
      return false;
    }

    if (!editForm.sectorCliente) {
      toast.error("El sector del cliente es obligatorio");
      return false;
    }

    if (!editForm.tipoEmpresaCliente) {
      toast.error("El tipo de empresa del cliente es obligatorio");
      return false;
    }

    if (!editForm.emailCliente.trim()) {
      toast.error("El email del cliente es obligatorio");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.emailCliente)) {
      toast.error("El correo electrónico no tiene un formato válido");
      return false;
    }

    if (!editForm.telefonoCliente.trim()) {
      toast.error("El teléfono del cliente es obligatorio");
      return false;
    }

    // Validar teléfono (formato español básico)
    if (!/^(\+34|0034|34)?[6-9][0-9]{8}$/.test(editForm.telefonoCliente.replace(/\s+/g, ''))) {
      toast.error("El teléfono debe tener un formato válido (ej: +34 600 000 000)");
      return false;
    }

    return true;
  };

  const handleEditClient = () => {
    if (!selectedClient) return;

    if (!validateEditForm()) return;

    updateClientMutation.mutate({
      clientId: selectedClient.idCliente as string,
      data: {
        cifCliente: editForm.cifCliente.trim(),
        nombreCliente: editForm.nombreCliente.trim(),
        sectorCliente: editForm.sectorCliente,
        tipoEmpresaCliente: editForm.tipoEmpresaCliente,
        cifGrupoCliente: editForm.cifGrupoCliente.trim() || undefined,
        emailCliente: editForm.emailCliente.trim(),
        telefonoCliente: editForm.telefonoCliente.trim(),
        direccionCliente: editForm.direccionCliente.trim() || undefined,
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
                <Label htmlFor="create-nombreCliente">Nombre del Cliente *</Label>
                <Input
                  id="create-nombreCliente"
                  value={createForm.nombreCliente}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, nombreCliente: e.target.value })
                  }
                  placeholder="Nombre del cliente"
                />
              </div>
              <div>
                <Label htmlFor="create-cifCliente">CIF del Cliente *</Label>
                <Input
                  id="create-cifCliente"
                  value={createForm.cifCliente}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, cifCliente: e.target.value })
                  }
                  placeholder="B12345678"
                />
              </div>
              <div>
                <Label htmlFor="create-sectorCliente">Sector del Cliente *</Label>
                <Select
                  value={createForm.sectorCliente}
                  onValueChange={(value) =>
                    setCreateForm({ ...createForm, sectorCliente: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectorClienteEnum.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="create-tipoEmpresaCliente">Tipo de Empresa del Cliente *</Label>
                <Select
                  value={createForm.tipoEmpresaCliente}
                  onValueChange={(value) =>
                    setCreateForm({ ...createForm, tipoEmpresaCliente: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo de empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoEmpresaClienteEnum.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="create-cifGrupoCliente">CIF del Grupo Empresarial</Label>
                <Input
                  id="create-cifGrupoCliente"
                  value={createForm.cifGrupoCliente}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, cifGrupoCliente: e.target.value })
                  }
                  placeholder="CIF del grupo empresarial"
                />
              </div>
              <div>
                <Label htmlFor="create-emailCliente">Correo Electrónico del Cliente *</Label>
                <Input
                  id="create-emailCliente"
                  type="email"
                  value={createForm.emailCliente}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, emailCliente: e.target.value })
                  }
                  placeholder="cliente@empresa.com"
                />
              </div>
              <div>
                <Label htmlFor="create-telefonoCliente">Teléfono del Cliente *</Label>
                <Input
                  id="create-telefonoCliente"
                  value={createForm.telefonoCliente}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, telefonoCliente: e.target.value })
                  }
                  placeholder="+34 600 000 000"
                />
              </div>
              <div>
                <Label htmlFor="create-direccionCliente">Dirección Postal del Cliente</Label>
                <Textarea
                  id="create-direccionCliente"
                  value={createForm.direccionCliente}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, direccionCliente: e.target.value })
                  }
                  placeholder="Dirección completa"
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
              <TableHead>CIF</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Tipo Empresa</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(clientsData || []).map((client) => (
              <TableRow key={client.idCliente}>
                <TableCell className="font-medium">{client.nombreCliente}</TableCell>
                <TableCell>{client.cifCliente}</TableCell>
                <TableCell>{client.sectorCliente}</TableCell>
                <TableCell>{client.tipoEmpresaCliente}</TableCell>
                <TableCell>{client.emailCliente}</TableCell>
                <TableCell>{client.telefonoCliente}</TableCell>
                <TableCell>
                  {new Date(client.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* Edit Client */}
                    <Dialog
                      open={editDialogOpen && selectedClient?.idCliente === client.idCliente}
                      onOpenChange={(open) => {
                        setEditDialogOpen(open);
                        if (open) {
                          setSelectedClient(client);
                          setEditForm({
                            cifCliente: client.cifCliente,
                            nombreCliente: client.nombreCliente,
                            sectorCliente: client.sectorCliente,
                            tipoEmpresaCliente: client.tipoEmpresaCliente,
                            cifGrupoCliente: client.cifGrupoCliente || "",
                            emailCliente: client.emailCliente,
                            telefonoCliente: client.telefonoCliente,
                            direccionCliente: client.direccionCliente || "",
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
                            <Label htmlFor="edit-nombreCliente">Nombre del Cliente *</Label>
                            <Input
                              id="edit-nombreCliente"
                              value={editForm.nombreCliente}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  nombreCliente: e.target.value,
                                })
                              }
                              placeholder="Nombre del cliente"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-cifCliente">CIF del Cliente *</Label>
                            <Input
                              id="edit-cifCliente"
                              value={editForm.cifCliente}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  cifCliente: e.target.value,
                                })
                              }
                              placeholder="B12345678"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-sectorCliente">Sector del Cliente *</Label>
                            <Select
                              value={editForm.sectorCliente}
                              onValueChange={(value) =>
                                setEditForm({ ...editForm, sectorCliente: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un sector" />
                              </SelectTrigger>
                              <SelectContent>
                                {sectorClienteEnum.map((sector) => (
                                  <SelectItem key={sector} value={sector}>
                                    {sector}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="edit-tipoEmpresaCliente">Tipo de Empresa del Cliente *</Label>
                            <Select
                              value={editForm.tipoEmpresaCliente}
                              onValueChange={(value) =>
                                setEditForm({ ...editForm, tipoEmpresaCliente: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo de empresa" />
                              </SelectTrigger>
                              <SelectContent>
                                {tipoEmpresaClienteEnum.map((tipo) => (
                                  <SelectItem key={tipo} value={tipo}>
                                    {tipo}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="edit-cifGrupoCliente">CIF del Grupo Empresarial</Label>
                            <Input
                              id="edit-cifGrupoCliente"
                              value={editForm.cifGrupoCliente}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  cifGrupoCliente: e.target.value,
                                })
                              }
                              placeholder="CIF del grupo empresarial"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-emailCliente">Correo Electrónico del Cliente *</Label>
                            <Input
                              id="edit-emailCliente"
                              type="email"
                              value={editForm.emailCliente}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  emailCliente: e.target.value,
                                })
                              }
                              placeholder="cliente@empresa.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-telefonoCliente">Teléfono del Cliente *</Label>
                            <Input
                              id="edit-telefonoCliente"
                              value={editForm.telefonoCliente}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  telefonoCliente: e.target.value,
                                })
                              }
                              placeholder="+34 600 000 000"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-direccionCliente">Dirección Postal del Cliente</Label>
                            <Textarea
                              id="edit-direccionCliente"
                              value={editForm.direccionCliente}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  direccionCliente: e.target.value,
                                })
                              }
                              placeholder="Dirección completa"
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
                            onClick={() => handleDeleteClient(client.idCliente)}
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
