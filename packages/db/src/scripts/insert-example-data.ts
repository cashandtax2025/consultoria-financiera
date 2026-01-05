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
  path: join(__dirname, "../../../../apps/web/.env"),
});

const neonSql = neon(process.env.DATABASE_URL || "");
const db = drizzle(neonSql);

interface ClientData {
  taxId: string;
  name: string;
  sector: string;
  companyType: string;
  groupId: string | null;
  groupTaxId: string | null;
  email: string;
  phone: string;
  address: string;
}

interface ClientRow extends Record<string, unknown> {
  id: string;
  tax_id: string;
  name: string;
  sector: string;
  company_type: string;
  group_id: string | null;
  group_tax_id: string | null;
  email: string;
  phone: string;
  address: string;
}

async function main() {
  console.log("Insertando datos de ejemplo...\n");

  const clientes: ClientData[] = [
    {
      taxId: "B12345678",
      name: "Consultoría Digital S.L.",
      sector: "Consultoría IT",
      companyType: "Servicios",
      groupId: null,
      groupTaxId: null,
      email: "x@gmail.com",
      phone: "12345698",
      address: "Av. Libertad, s/n.",
    },
    {
      taxId: "A87654321",
      name: "Bazar Rápido S.A.",
      sector: "Comercio retail",
      companyType: "Comercializador con stock",
      groupId: null,
      groupTaxId: "A87654321",
      email: "a@bazarrapido.com",
      phone: "345435364",
      address: "Av. Constitución, s/n.",
    },
    {
      taxId: "G11111111",
      name: "El Agricultor SAT",
      sector: "Agricultura",
      companyType: "Productor",
      groupId: null,
      groupTaxId: null,
      email: "b@hotmail.com",
      phone: "34534353",
      address: "Av. Freedom, s/n.",
    },
    {
      taxId: "X9999999Z",
      name: "Ana López Arquitecta",
      sector: "Otros servicios profesionales",
      companyType: "Servicios",
      groupId: null,
      groupTaxId: null,
      email: "xxx@gmail.com",
      phone: "45654646",
      address: "Av. Libertad, 18",
    },
    {
      taxId: "B22222222",
      name: "Logística Veloz S.L.",
      sector: "Transporte",
      companyType: "Servicios",
      groupId: null,
      groupTaxId: "A87654321",
      email: "bbb@hotmail.com",
      phone: "5688768",
      address: "Calle Libre, s/n.",
    },
  ];

  try {
    // Insertar clientes uno por uno
    for (let i = 0; i < clientes.length; i++) {
      const cliente = clientes[i];
      if (!cliente) continue;

      console.log(`Insertando cliente ${i + 1}/5: ${cliente.name}...`);

      const result = await db.execute<{ id: string }>(sql`
        INSERT INTO "clients" (
          "tax_id",
          "name",
          "sector",
          "company_type",
          "group_id",
          "group_tax_id",
          "email",
          "phone",
          "address"
        ) VALUES (
          ${cliente.taxId},
          ${cliente.name},
          ${cliente.sector}::client_sector,
          ${cliente.companyType}::client_company_type,
          ${cliente.groupId},
          ${cliente.groupTaxId},
          ${cliente.email},
          ${cliente.phone},
          ${cliente.address}
        )
        RETURNING "id"
      `);

      const insertedId = result.rows[0]?.id;
      console.log(`  ✓ Cliente insertado con ID: ${insertedId}`);

      // Si este cliente tiene groupTaxId, actualizar los clientes que pertenecen a ese grupo
      if (cliente.groupTaxId) {
        // Verificar si este cliente ES el grupo (su taxId coincide con su groupTaxId)
        if (cliente.taxId === cliente.groupTaxId) {
          // Este cliente es el grupo principal, actualizar otros clientes que tengan este taxId como grupo
          await db.execute(sql`
            UPDATE "clients"
            SET "group_id" = ${insertedId}
            WHERE "group_tax_id" = ${cliente.groupTaxId}
              AND "id" != ${insertedId}
          `);
          console.log(
            `  ✓ Actualizados clientes del grupo con CIF ${cliente.groupTaxId}`,
          );
        } else {
          // Este cliente pertenece a un grupo, buscar el ID del cliente que tiene ese taxId
          const grupoResult = await db.execute<{ id: string }>(sql`
            SELECT "id" FROM "clients"
            WHERE "tax_id" = ${cliente.groupTaxId}
            LIMIT 1
          `);

          if (grupoResult.rows.length > 0) {
            const grupoId = grupoResult.rows[0]?.id;
            await db.execute(sql`
              UPDATE "clients"
              SET "group_id" = ${grupoId}
              WHERE "id" = ${insertedId}
            `);
            console.log(`  ✓ Cliente asignado al grupo con ID: ${grupoId}`);
          }
        }
      }
    }

    // Actualizar relaciones de grupo para el cliente 2 y 5 que comparten el mismo groupTaxId
    // El cliente 2 (Bazar Rápido) es el grupo principal (taxId = groupTaxId)
    const grupoPrincipal = await db.execute<{ id: string }>(sql`
      SELECT "id" FROM "clients"
      WHERE "tax_id" = 'A87654321'
      LIMIT 1
    `);

    if (grupoPrincipal.rows.length > 0) {
      const grupoId = grupoPrincipal.rows[0]?.id;

      // Actualizar el cliente 5 (Logística Veloz) para que apunte al grupo
      await db.execute(sql`
        UPDATE "clients"
        SET "group_id" = ${grupoId}
        WHERE "group_tax_id" = 'A87654321'
          AND "tax_id" != 'A87654321'
      `);
      console.log(`\n✓ Relaciones de grupo actualizadas`);
    }

    console.log("\n✅ Todos los datos de ejemplo insertados correctamente!");

    // Mostrar resumen
    const allClients = await db.execute<ClientRow>(sql`
      SELECT 
        "id",
        "tax_id",
        "name",
        "sector",
        "company_type",
        "group_id",
        "group_tax_id",
        "email",
        "phone",
        "address"
      FROM "clients"
      ORDER BY "id"
    `);

    console.log("\n📊 Resumen de clientes insertados:");
    console.log("─".repeat(100));
    allClients.rows.forEach((cliente) => {
      console.log(
        `ID: ${cliente.id} | CIF: ${cliente.tax_id} | Nombre: ${cliente.name}`,
      );
      console.log(
        `  Sector: ${cliente.sector} | Tipo: ${cliente.company_type}`,
      );
      if (cliente.group_id) {
        console.log(
          `  Grupo: ID ${cliente.group_id} (CIF: ${cliente.group_tax_id})`,
        );
      }
      console.log("");
    });
  } catch (error) {
    console.error(
      "❌ Error al insertar datos:",
      error instanceof Error ? error.message : error,
    );
    console.error(error);
    process.exit(1);
  }
}

main();
