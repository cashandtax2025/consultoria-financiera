# Guía de Importación de Datos

## Descripción General

La funcionalidad de importación permite cargar datos financieros desde archivos Excel (.xlsx, .xls) o CSV directamente a la base de datos. Los datos se asocian a un cliente específico y se validan según el tipo de documento seleccionado.

## Tipos de Documentos Soportados

### 1. Producción y Ventas (`production_sales`)
Diseñado para datos agrícolas de producción y ventas. Incluye información de albaranes, facturas y pagos.

**Campos principales:**
- `fechaAlbaran` - Fecha del albarán (formato: dd/MM/yyyy)
- `numeroAlbaran` - Número del albarán
- `producto` - Nombre del producto
- `kgs` - Kilogramos producidos/vendidos
- `precio` - Precio por kg
- `facturacionNeta` - Facturación neta

**Mapeo de campos alternativos:**
- `fechaAlbarán`, `nAlbaran`, `numeroAlbaran` → `numeroAlbaran`
- `kg`, `kilos` → `kgs`
- `desc` → `descuento`
- `iva` → `ivaPercent`

### 2. Facturas (`invoices`)
Para facturas emitidas a clientes.

**Campos principales:**
- `date` o `fecha` - Fecha de la factura
- `invoiceNumber` o `numeroFactura` - Número de factura
- `clientName` o `cliente` - Nombre del cliente
- `amount` o `importe` - Importe neto
- `totalAmount` o `total` - Importe total

### 3. Gastos (`expenses`)
Para gastos y facturas de proveedores.

**Campos principales:**
- `date` o `fecha` - Fecha del gasto
- `category` o `categoria` - Categoría del gasto
- `description` o `descripcion` - Descripción
- `supplier` o `proveedor` - Proveedor
- `amount` o `importe` - Importe

### 4. Extractos Bancarios (`bank_statements`)
Para movimientos bancarios.

**Campos principales:**
- `date` o `fecha` - Fecha de la transacción
- `description` o `descripcion` - Descripción
- `amount` o `importe` - Importe
- `transactionType` o `tipo` - Tipo (debit/credit)
- `balance` o `saldo` - Saldo

### 5. Flujo de Caja (`cash_flow`)
Para datos de flujo de caja periódico.

**Campos principales:**
- `period` - Período (ej: 2024-01)
- `startDate` - Fecha de inicio
- `endDate` - Fecha de fin
- `income` - Ingresos totales
- `expenses` - Gastos totales
- `netFlow` - Flujo neto

## Cómo Usar

### Desde la Interfaz Web

1. **Navega a la página de importación**
   - Ve a `/import` o usa el menú "Importar"

2. **Selecciona el tipo de documento**
   - Elige el tipo que corresponda a tus datos
   - Se mostrará el esquema de campos esperados

3. **Introduce el nombre del cliente**
   - Los datos se asociarán a este cliente

4. **Selecciona el archivo**
   - Formatos soportados: .xlsx, .xls, .csv
   - Tamaño máximo: depende de configuración del servidor

5. **Vista previa (opcional)**
   - Haz clic en "Vista Previa" para verificar los datos
   - Se mostrarán los primeros 20 registros

6. **Importar**
   - Haz clic en "Importar" para guardar los datos en la BD
   - Recibirás confirmación del número de registros importados

7. **Ver historial**
   - Haz clic en "Historial" para ver todas tus importaciones

### Formato de Archivos

#### Excel (.xlsx, .xls)
- La primera fila debe contener los nombres de las columnas
- Los datos deben empezar en la segunda fila
- Se leerá la primera hoja del archivo

#### CSV
- La primera línea debe contener los nombres de las columnas
- Usar comas (,) como separador
- Usar punto (.) para decimales en números

### Ejemplos de Archivos

#### Ejemplo: Producción y Ventas

```csv
finca,fechaAlbaran,numeroAlbaran,producto,kgs,precio,facturacionNeta
Finca 1,15/08/2024,P24 - 24661,Berenjena Violeta,500,1.50,750.00
Finca 1,16/08/2024,P24 - 24662,Judia Larga Verde,300,2.00,600.00
```

#### Ejemplo: Facturas

```csv
fecha,numeroFactura,cliente,descripcion,importe,iva,total
01/01/2024,F-2024-001,Cliente A,Servicios consultoría,1000,210,1210
02/01/2024,F-2024-002,Cliente B,Servicios asesoría,500,105,605
```

#### Ejemplo: Gastos

```csv
fecha,categoria,descripcion,proveedor,importe
01/01/2024,Oficina,Material de oficina,Proveedor A,150
02/01/2024,Servicios,Internet,Proveedor B,50
```

#### Ejemplo: Flujo de Caja

```csv
periodo,fechaInicio,fechaFin,ingresos,gastos,flujoNeto,saldoInicial,saldoFinal
Enero 2024,01/01/2024,31/01/2024,15000,8500,6500,10000,16500
Febrero 2024,01/02/2024,29/02/2024,18000,9200,8800,16500,25300
```

## Normalización de Datos

El sistema automáticamente:

1. **Normaliza nombres de columnas**
   - Elimina espacios y caracteres especiales
   - Convierte a camelCase
   - Ejemplo: "Fecha Albarán" → "fechaAlbaran"

2. **Mapea campos según el tipo de documento**
   - Ver sección "Tipos de Documentos" para mapeos específicos

3. **Convierte valores**
   - Fechas: acepta dd/MM/yyyy y formatos ISO
   - Números: acepta comas o puntos como decimales
   - Importes: se almacenan en céntimos internamente

## Validación

- Los campos marcados como "requeridos" deben tener valor
- Las fechas deben tener formato válido
- Los números deben ser valores numéricos válidos
- Los campos enum solo aceptan valores específicos

## Estructura en Base de Datos

Los datos importados se almacenan en tres tablas:

1. **`uploads`** - Registro de la importación
   - Metadata del archivo
   - Cliente asociado
   - Estado de procesamiento

2. **`extracted_data`** - Datos extraídos sin procesar
   - Array JSON con todos los registros
   - Referencia al upload

3. **`financial_records`** - Registros financieros normalizados
   - Un registro por cada fila del archivo
   - Campos normalizados según el tipo
   - Cantidades en céntimos para evitar errores de redondeo

## API Endpoint

### POST /api/upload

**Body (FormData):**
```
file: File
clientName: string
documentType: string
saveToDb: boolean (opcional, default: true)
```

**Response (success):**
```json
{
  "success": true,
  "uploadId": "uuid",
  "extractedDataId": "uuid",
  "recordCount": 123,
  "fileName": "datos.xlsx",
  "fileSize": 12345,
  "fileType": "xlsx",
  "clientName": "Cliente A",
  "documentType": "production_sales",
  "message": "Data imported successfully"
}
```

**Response (preview):**
```json
{
  "success": true,
  "data": [...],
  "fileName": "datos.xlsx",
  "fileSize": 12345,
  "fileType": "xlsx",
  "recordCount": 123,
  "clientName": "Cliente A",
  "documentType": "production_sales"
}
```

## Solución de Problemas

### El archivo no se procesa
- Verifica que el formato sea .xlsx, .xls o .csv
- Asegúrate de que la primera fila contiene nombres de columnas
- Verifica que hay datos (no solo headers)

### Errores de validación
- Revisa que los campos requeridos tienen valor
- Verifica el formato de las fechas (dd/MM/yyyy)
- Asegúrate de que los números usan el formato correcto

### Datos no aparecen
- Verifica en el historial de importaciones
- Comprueba el estado de la importación
- Revisa los logs del servidor para errores

## Futuras Mejoras

- [ ] Soporte para archivos PDF con OCR
- [ ] Validación avanzada con reglas de negocio
- [ ] Detección automática del tipo de documento
- [ ] Mapeo personalizado de columnas
- [ ] Importación en lote de múltiples archivos
- [ ] Exportación de datos importados
- [ ] Estadísticas de importación

