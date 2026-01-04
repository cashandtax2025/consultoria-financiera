import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({
  path: join(__dirname, "../../apps/web/.env"),
});

const neonSql = neon(process.env.DATABASE_URL || "");
const db = drizzle(neonSql);

console.log("Insertando datos de ejemplo...\n");

// Datos del ejemplo proporcionado
const clientes = [
  {
    cifCliente: "B12345678",
    nombreCliente: "Consultoría Digital S.L.",
    sectorCliente: "Consultoría IT", // Mapeado desde "Consultoría"
    tipoEmpresaCliente: "Servicios",
    idGrupoCliente: null,
    cifGrupoCliente: null,
    emailCliente: "x@gmail.com",
    telefonoCliente: "12345698",
    direccionCliente: "Av. Libertad, s/n.",
  },
  {
    cifCliente: "A87654321",
    nombreCliente: "Bazar Rápido S.A.",
    sectorCliente: "Comercio retail", // Mapeado desde "Retail"
    tipoEmpresaCliente: "Comercializador con stock",
    idGrupoCliente: null, // Se establecerá después de insertar el cliente 1
    cifGrupoCliente: "A87654321",
    emailCliente: "a@bazarrapido.com",
    telefonoCliente: "345435364",
    direccionCliente: "Av. Constitución, s/n.",
  },
  {
    cifCliente: "G11111111",
    nombreCliente: "El Agricultor SAT",
    sectorCliente: "Agricultura",
    tipoEmpresaCliente: "Productor",
    idGrupoCliente: null,
    cifGrupoCliente: null,
    emailCliente: "b@hotmail.com",
    telefonoCliente: "34534353",
    direccionCliente: "Av. Freedom, s/n.",
  },
  {
    cifCliente: "X9999999Z",
    nombreCliente: "Ana López Arquitecta",
    sectorCliente: "Otros servicios profesionales", // Mapeado desde "Servicios Profesionales"
    tipoEmpresaCliente: "Servicios",
    idGrupoCliente: null,
    cifGrupoCliente: null,
    emailCliente: "xxx@gmail.com",
    telefonoCliente: "45654646",
    direccionCliente: "Av. Libertad, 18",
  },
  {
    cifCliente: "B22222222",
    nombreCliente: "Logística Veloz S.L.",
    sectorCliente: "Transporte",
    tipoEmpresaCliente: "Servicios",
    idGrupoCliente: null, // Se establecerá después, referencia al grupo con CIF A87654321
    cifGrupoCliente: "A87654321",
    emailCliente: "bbb@hotmail.com",
    telefonoCliente: "5688768",
    direccionCliente: "Calle Libre, s/n.",
  },
];

try {
  // Insertar clientes uno por uno
  for (let i = 0; i < clientes.length; i++) {
    const cliente = clientes[i];
    
    console.log(`Insertando cliente ${i + 1}/5: ${cliente.nombreCliente}...`);
    
    const result = await db.execute(sql`
      INSERT INTO "clients" (
        "cif_cliente",
        "nombre_cliente",
        "sector_cliente",
        "tipo_empresa_cliente",
        "id_grupo_cliente",
        "cif_grupo_cliente",
        "email_cliente",
        "telefono_cliente",
        "direccion_cliente"
      ) VALUES (
        ${cliente.cifCliente},
        ${cliente.nombreCliente},
        ${cliente.sectorCliente}::sector_cliente,
        ${cliente.tipoEmpresaCliente}::tipo_empresa_cliente,
        ${cliente.idGrupoCliente},
        ${cliente.cifGrupoCliente},
        ${cliente.emailCliente},
        ${cliente.telefonoCliente},
        ${cliente.direccionCliente}
      )
      RETURNING "id_cliente"
    `);
    
    const insertedId = result[0]?.id_cliente;
    console.log(`  ✓ Cliente insertado con ID: ${insertedId}`);
    
    // Si este cliente tiene CIF_Grupo_Cliente, actualizar los clientes que pertenecen a ese grupo
    if (cliente.cifGrupoCliente) {
      // Buscar si hay otros clientes con el mismo CIF_Grupo_Cliente y actualizar su id_grupo_cliente
      // Primero, verificar si este cliente ES el grupo (su CIF coincide con su CIF_Grupo)
      if (cliente.cifCliente === cliente.cifGrupoCliente) {
        // Este cliente es el grupo principal, actualizar otros clientes que tengan este CIF como grupo
        await db.execute(sql`
          UPDATE "clients"
          SET "id_grupo_cliente" = ${insertedId}
          WHERE "cif_grupo_cliente" = ${cliente.cifGrupoCliente}
            AND "id_cliente" != ${insertedId}
        `);
        console.log(`  ✓ Actualizados clientes del grupo con CIF ${cliente.cifGrupoCliente}`);
      } else {
        // Este cliente pertenece a un grupo, buscar el ID del cliente que tiene ese CIF como su CIF_Cliente
        const grupoResult = await db.execute(sql`
          SELECT "id_cliente" FROM "clients"
          WHERE "cif_cliente" = ${cliente.cifGrupoCliente}
          LIMIT 1
        `);
        
        if (grupoResult.length > 0) {
          const grupoId = grupoResult[0].id_cliente;
          await db.execute(sql`
            UPDATE "clients"
            SET "id_grupo_cliente" = ${grupoId}
            WHERE "id_cliente" = ${insertedId}
          `);
          console.log(`  ✓ Cliente asignado al grupo con ID: ${grupoId}`);
        }
      }
    }
  }
  
  // Actualizar relaciones de grupo para el cliente 2 y 5 que comparten el mismo CIF_Grupo
  // El cliente 2 (Bazar Rápido) es el grupo principal (CIF = CIF_Grupo)
  const grupoPrincipal = await db.execute(sql`
    SELECT "id_cliente" FROM "clients"
    WHERE "cif_cliente" = 'A87654321'
    LIMIT 1
  `);
  
  if (grupoPrincipal.length > 0) {
    const grupoId = grupoPrincipal[0].id_cliente;
    
    // Actualizar el cliente 5 (Logística Veloz) para que apunte al grupo
    await db.execute(sql`
      UPDATE "clients"
      SET "id_grupo_cliente" = ${grupoId}
      WHERE "cif_grupo_cliente" = 'A87654321'
        AND "cif_cliente" != 'A87654321'
    `);
    console.log(`\n✓ Relaciones de grupo actualizadas`);
  }
  
  console.log("\n✅ Todos los datos de ejemplo insertados correctamente!");
  
  // Mostrar resumen
  const allClients = await db.execute(sql`
    SELECT 
      "id_cliente",
      "cif_cliente",
      "nombre_cliente",
      "sector_cliente",
      "tipo_empresa_cliente",
      "id_grupo_cliente",
      "cif_grupo_cliente",
      "email_cliente",
      "telefono_cliente",
      "direccion_cliente"
    FROM "clients"
    ORDER BY "id_cliente"
  `);
  
  console.log("\n📊 Resumen de clientes insertados:");
  console.log("─".repeat(100));
  allClients.forEach((cliente) => {
    console.log(`ID: ${cliente.id_cliente} | CIF: ${cliente.cif_cliente} | Nombre: ${cliente.nombre_cliente}`);
    console.log(`  Sector: ${cliente.sector_cliente} | Tipo: ${cliente.tipo_empresa_cliente}`);
    if (cliente.id_grupo_cliente) {
      console.log(`  Grupo: ID ${cliente.id_grupo_cliente} (CIF: ${cliente.cif_grupo_cliente})`);
    }
    console.log("");
  });
  
} catch (error) {
  console.error("❌ Error al insertar datos:", error.message);
  console.error(error);
  process.exit(1);
}

