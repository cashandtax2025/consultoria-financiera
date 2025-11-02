"use client";

import {
  Ban,
  Edit,
  KeyRound,
  RefreshCw,
  Shield,
  ShieldOff,
  Trash2,
  UserPlus,
} from "lucide-react";
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
import { authClient } from "@/lib/auth-client";

// Infer the user type from the authClient.admin.listUsers response
type ListUsersResponse = Awaited<ReturnType<typeof authClient.admin.listUsers>>;
type User = NonNullable<ListUsersResponse["data"]>["users"][number];

export function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Create user dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState<{
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
  }>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  // Edit user dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });

  // Ban user dialog state
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banForm, setBanForm] = useState({
    reason: "",
    expiresIn: "",
  });

  // Change password dialog state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
  });

  // Change role dialog state
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [roleForm, setRoleForm] = useState<{
    role: "user" | "admin";
  }>({
    role: "user",
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authClient.admin.listUsers({
        query: {
          limit: 100,
        },
      });

      if (response.data) {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async () => {
    try {
      const response = await authClient.admin.createUser({
        name: createForm.name,
        email: createForm.email,
        password: createForm.password,
        role: createForm.role,
      });

      if (response.error) {
        toast.error(response.error.message || "Failed to create user");
        return;
      }

      toast.success("User created successfully");
      setCreateDialogOpen(false);
      setCreateForm({ name: "", email: "", password: "", role: "user" });
      fetchUsers();
    } catch (error) {
      toast.error("Failed to create user");
      console.error(error);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await authClient.admin.updateUser({
        userId: selectedUser.id,
        data: {
          name: editForm.name,
          email: editForm.email,
        },
      });

      if (response.error) {
        toast.error(response.error.message || "Failed to update user");
        return;
      }

      toast.success("User updated successfully");
      setEditDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user");
      console.error(error);
    }
  };

  const handleBanUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await authClient.admin.banUser({
        userId: selectedUser.id,
        banReason: banForm.reason || "No reason provided",
        banExpiresIn: banForm.expiresIn
          ? parseInt(banForm.expiresIn)
          : undefined,
      });

      if (response.error) {
        toast.error(response.error.message || "Failed to ban user");
        return;
      }

      toast.success("User banned successfully");
      setBanDialogOpen(false);
      setSelectedUser(null);
      setBanForm({ reason: "", expiresIn: "" });
      fetchUsers();
    } catch (error) {
      toast.error("Failed to ban user");
      console.error(error);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      const response = await authClient.admin.unbanUser({
        userId,
      });

      if (response.error) {
        toast.error(response.error.message || "Failed to unban user");
        return;
      }

      toast.success("User unbanned successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to unban user");
      console.error(error);
    }
  };

  const handleChangePassword = async () => {
    if (!selectedUser) return;

    try {
      const response = await authClient.admin.setUserPassword({
        userId: selectedUser.id,
        newPassword: passwordForm.newPassword,
      });

      if (response.error) {
        toast.error(response.error.message || "Failed to change password");
        return;
      }

      toast.success("Password changed successfully");
      setPasswordDialogOpen(false);
      setSelectedUser(null);
      setPasswordForm({ newPassword: "" });
    } catch (error) {
      toast.error("Failed to change password");
      console.error(error);
    }
  };

  const handleChangeRole = async () => {
    if (!selectedUser) return;

    try {
      const response = await authClient.admin.setRole({
        userId: selectedUser.id,
        role: roleForm.role,
      });

      if (response.error) {
        toast.error(response.error.message || "Failed to change role");
        return;
      }

      toast.success("Role changed successfully");
      setRoleDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to change role");
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await authClient.admin.removeUser({
        userId,
      });

      if (response.error) {
        toast.error(response.error.message || "Failed to delete user");
        return;
      }

      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Cargando usuarios...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Create User Button */}
      <div className="flex justify-end">
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Crear Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Agregar un nuevo usuario al sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-name">Nombre</Label>
                <Input
                  id="create-name"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
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
                />
              </div>
              <div>
                <Label htmlFor="create-password">Contraseña</Label>
                <Input
                  id="create-password"
                  type="password"
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, password: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="create-role">Rol</Label>
                <Select
                  value={createForm.role}
                  onValueChange={(value: "user" | "admin") =>
                    setCreateForm({ ...createForm, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuario</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateUser}>Crear</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo electrónico</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.banned ? (
                    <Badge variant="destructive">Bloqueado</Badge>
                  ) : (
                    <Badge variant="outline">Activo</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* Edit User */}
                    <Dialog
                      open={editDialogOpen && selectedUser?.id === user.id}
                      onOpenChange={(open) => {
                        setEditDialogOpen(open);
                        if (open) {
                          setSelectedUser(user);
                          setEditForm({
                            name: user.name,
                            email: user.email,
                          });
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Usuario</DialogTitle>
                          <DialogDescription>
                            Actualizar información del usuario
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-name">Nombre</Label>
                            <Input
                              id="edit-name"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  name: e.target.value,
                                })
                              }
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
                          <Button onClick={handleEditUser}>Guardar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Change Role */}
                    <Dialog
                      open={roleDialogOpen && selectedUser?.id === user.id}
                      onOpenChange={(open) => {
                        setRoleDialogOpen(open);
                        if (open) {
                          setSelectedUser(user);
                          setRoleForm({ role: user.role });
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {user.role === "admin" ? (
                            <ShieldOff className="h-4 w-4" />
                          ) : (
                            <Shield className="h-4 w-4" />
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cambiar Rol</DialogTitle>
                          <DialogDescription>
                            Actualizar rol del usuario
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="role">Rol</Label>
                            <Select
                              value={roleForm.role}
                              onValueChange={(value: "user" | "admin") =>
                                setRoleForm({ role: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">Usuario</SelectItem>
                                <SelectItem value="admin">Administrador</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setRoleDialogOpen(false)}
                          >
                            Cancelar
                          </Button>
                          <Button onClick={handleChangeRole}>
                            Cambiar Rol
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Change Password */}
                    <Dialog
                      open={passwordDialogOpen && selectedUser?.id === user.id}
                      onOpenChange={(open) => {
                        setPasswordDialogOpen(open);
                        if (open) {
                          setSelectedUser(user);
                          setPasswordForm({ newPassword: "" });
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <KeyRound className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cambiar Contraseña</DialogTitle>
                          <DialogDescription>
                            Establecer una nueva contraseña para {user.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="new-password">Nueva Contraseña</Label>
                            <Input
                              id="new-password"
                              type="password"
                              value={passwordForm.newPassword}
                              onChange={(e) =>
                                setPasswordForm({ newPassword: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setPasswordDialogOpen(false)}
                          >
                            Cancelar
                          </Button>
                          <Button onClick={handleChangePassword}>
                            Cambiar Contraseña
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Ban/Unban User */}
                    {user.banned ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnbanUser(user.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Dialog
                        open={banDialogOpen && selectedUser?.id === user.id}
                        onOpenChange={(open) => {
                          setBanDialogOpen(open);
                          if (open) {
                            setSelectedUser(user);
                            setBanForm({ reason: "", expiresIn: "" });
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Ban className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Bloquear Usuario</DialogTitle>
                            <DialogDescription>
                              Bloquear a {user.name} del sistema
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="ban-reason">Razón</Label>
                              <Textarea
                                id="ban-reason"
                                value={banForm.reason}
                                onChange={(e) =>
                                  setBanForm({
                                    ...banForm,
                                    reason: e.target.value,
                                  })
                                }
                                placeholder="Introduce la razón del bloqueo"
                              />
                            </div>
                            <div>
                              <Label htmlFor="ban-expires">
                                Expira en (segundos, dejar vacío para permanente)
                              </Label>
                              <Input
                                id="ban-expires"
                                type="number"
                                value={banForm.expiresIn}
                                onChange={(e) =>
                                  setBanForm({
                                    ...banForm,
                                    expiresIn: e.target.value,
                                  })
                                }
                                placeholder="ej., 86400 para 1 día"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setBanDialogOpen(false)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleBanUser}
                            >
                              Bloquear Usuario
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}

                    {/* Delete User */}
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
                            la cuenta de {user.name} y todos los datos asociados.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.id)}
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
