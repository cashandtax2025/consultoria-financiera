# Guía de Despliegue a Producción

Esta guía te ayudará a desplegar la aplicación Consultoría Financiera a producción.

## Opción 1: Despliegue en Vercel (Recomendado)

Vercel es la plataforma recomendada para aplicaciones Next.js y ofrece integración perfecta con monorepos.

### Prerrequisitos

1. Cuenta en [Vercel](https://vercel.com)
2. Base de datos PostgreSQL (Neon, Supabase, o cualquier proveedor)
3. Repositorio Git (GitHub, GitLab, o Bitbucket)

### Pasos de Despliegue

#### 1. Preparar el Repositorio

Asegúrate de que tu código esté en un repositorio Git:

```bash
git add .
git commit -m "Preparar para producción"
git push origin main
```

#### 2. Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en "Add New Project"
3. Importa tu repositorio de Git
4. Vercel detectará automáticamente que es un monorepo Next.js

#### 3. Configurar el Proyecto en Vercel

**Configuración del Proyecto:**
- **Framework Preset**: Next.js
- **Root Directory**: `apps/web`
- **Build Command**: `pnpm build` (o dejar el predeterminado)
- **Output Directory**: `.next` (predeterminado)
- **Install Command**: `pnpm install`

**Variables de Entorno:**

Añade las siguientes variables de entorno en la configuración del proyecto:

```
DATABASE_URL=postgresql://user:password@host:port/database
DATABASE_URL_POOLER=postgresql://user:password@host:port/database?pgbouncer=true
BETTER_AUTH_SECRET=tu-secret-key-seguro-aqui-minimo-32-caracteres
BETTER_AUTH_URL=https://tu-dominio.vercel.app
CORS_ORIGIN=https://tu-dominio.vercel.app
GOOGLE_GENERATIVE_AI_API_KEY=tu-api-key-de-google-ai
```

**Generar BETTER_AUTH_SECRET:**

```bash
openssl rand -base64 32
```

#### 4. Desplegar

1. Haz clic en "Deploy"
2. Vercel construirá y desplegará tu aplicación automáticamente
3. Una vez completado, recibirás una URL de producción

#### 5. Configurar Base de Datos

Después del primer despliegue, aplica las migraciones de base de datos:

```bash
# Opción 1: Desde tu máquina local (conectado a la BD de producción)
pnpm db:push

# Opción 2: Usar Vercel CLI para ejecutar comandos
vercel env pull .env.production
pnpm db:push
```

#### 6. Configurar Dominio Personalizado (Opcional)

1. Ve a la configuración del proyecto en Vercel
2. Navega a "Domains"
3. Añade tu dominio personalizado
4. Sigue las instrucciones para configurar los DNS

**Importante:** Actualiza `BETTER_AUTH_URL` y `CORS_ORIGIN` con tu dominio personalizado.

## Opción 2: Despliegue Manual (Docker)

### Prerrequisitos

- Docker y Docker Compose instalados
- Servidor con Docker habilitado

### Pasos

1. **Crear Dockerfile** (ya incluido si existe)
2. **Construir la imagen:**
   ```bash
   docker build -t consultoria-financiera .
   ```
3. **Ejecutar el contenedor:**
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL=... \
     -e BETTER_AUTH_SECRET=... \
     -e BETTER_AUTH_URL=... \
     consultoria-financiera
   ```

## Verificación Post-Despliegue

### Checklist

- [ ] La aplicación carga correctamente
- [ ] El login funciona
- [ ] La base de datos está conectada
- [ ] Las migraciones están aplicadas
- [ ] Las variables de entorno están configuradas
- [ ] El dominio personalizado está configurado (si aplica)
- [ ] HTTPS está habilitado
- [ ] Los logs no muestran errores críticos

### Comandos de Verificación

```bash
# Verificar build local
pnpm build

# Verificar tipos
pnpm check-types

# Verificar conexión a BD
pnpm db:studio
```

## Mantenimiento

### Actualizar la Aplicación

1. Haz push de tus cambios al repositorio
2. Vercel desplegará automáticamente (si tienes auto-deploy habilitado)
3. O despliega manualmente desde el dashboard de Vercel

### Aplicar Migraciones de Base de Datos

```bash
# Conectar a la BD de producción
export DATABASE_URL="tu-url-de-produccion"
pnpm db:push
```

### Monitoreo

- Revisa los logs en el dashboard de Vercel
- Configura alertas para errores críticos
- Monitorea el uso de recursos de la base de datos

## Solución de Problemas

### Error: "Module not found"

Asegúrate de que `transpilePackages` en `next.config.ts` incluya todos los paquetes del workspace.

### Error: "Database connection failed"

Verifica que:
- `DATABASE_URL` esté correctamente configurada
- La base de datos permita conexiones desde la IP de Vercel
- Las credenciales sean correctas

### Error: "Authentication failed"

Verifica que:
- `BETTER_AUTH_SECRET` esté configurado
- `BETTER_AUTH_URL` coincida con tu dominio de producción
- `CORS_ORIGIN` esté configurado correctamente

## Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Drizzle ORM](https://orm.drizzle.team/docs)
- [Documentación de Better-Auth](https://www.better-auth.com/docs)

