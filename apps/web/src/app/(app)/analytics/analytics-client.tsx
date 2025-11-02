"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { productionSalesData } from "@/lib/dummy-data";

export default function AnalyticsPage() {
  // Filters state
  const [selectedFinca, setSelectedFinca] = useState<string>("all");
  const [selectedTipoProducto, setSelectedTipoProducto] =
    useState<string>("all");
  const [selectedProducto, setSelectedProducto] = useState<string>("all");

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const fincas = new Set<string>();
    const tiposProducto = new Set<string>();
    const productos = new Set<string>();

    productionSalesData.forEach((record) => {
      if (record.finca) fincas.add(record.finca);
      if (record.tipoProducto) tiposProducto.add(record.tipoProducto);
      if (record.producto) productos.add(record.producto);
    });

    return {
      fincas: Array.from(fincas).sort(),
      tiposProducto: Array.from(tiposProducto).sort(),
      productos: Array.from(productos).sort(),
    };
  }, []);

  // Filter data based on selections
  const filteredData = useMemo(() => {
    return productionSalesData.filter((record) => {
      if (selectedFinca !== "all" && record.finca !== selectedFinca)
        return false;
      if (
        selectedTipoProducto !== "all" &&
        record.tipoProducto !== selectedTipoProducto
      )
        return false;
      if (selectedProducto !== "all" && record.producto !== selectedProducto)
        return false;
      return true;
    });
  }, [selectedFinca, selectedTipoProducto, selectedProducto]);
  // Calculate average price per product per month
  const priceEvolution = useMemo(() => {
    const grouped = new Map<
      string,
      Map<string, { totalPrice: number; count: number }>
    >();

    filteredData.forEach((record) => {
      const month = new Date(record.fechaAlbaran).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
      });

      if (!grouped.has(record.producto)) {
        grouped.set(record.producto, new Map());
      }

      const productData = grouped.get(record.producto)!;
      if (!productData.has(month)) {
        productData.set(month, { totalPrice: 0, count: 0 });
      }

      const monthData = productData.get(month)!;
      monthData.totalPrice += record.precio;
      monthData.count += 1;
    });

    // Convert to array format for display
    const result: Array<{
      producto: string;
      data: Array<{ month: string; avgPrice: number }>;
    }> = [];

    grouped.forEach((months, producto) => {
      const data: Array<{ month: string; avgPrice: number }> = [];
      months.forEach((values, month) => {
        data.push({
          month,
          avgPrice: values.totalPrice / values.count,
        });
      });
      // Sort by date
      data.sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });
      result.push({ producto, data });
    });

    return result;
  }, [filteredData]);

  // Get unique months for table headers
  const allMonths = useMemo(() => {
    const months = new Set<string>();
    priceEvolution.forEach((product) => {
      product.data.forEach((d) => months.add(d.month));
    });
    return Array.from(months).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });
  }, [priceEvolution]);

  // Prepare data for Recharts bar chart
  const chartData = useMemo(() => {
    return allMonths.map((month) => {
      const monthData: Record<string, any> = { month };

      priceEvolution.forEach((product) => {
        const productMonthData = product.data.find((d) => d.month === month);
        if (productMonthData) {
          monthData[product.producto] = productMonthData.avgPrice;
        }
      });

      return monthData;
    });
  }, [allMonths, priceEvolution]);

  // Calculate total volume and revenue per product
  const productStats = useMemo(() => {
    const stats = new Map<
      string,
      {
        totalKgs: number;
        totalRevenue: number;
        avgPrice: number;
        count: number;
      }
    >();

    filteredData.forEach((record) => {
      if (!stats.has(record.producto)) {
        stats.set(record.producto, {
          totalKgs: 0,
          totalRevenue: 0,
          avgPrice: 0,
          count: 0,
        });
      }
      const s = stats.get(record.producto)!;
      s.totalKgs += record.kgs;
      s.totalRevenue += record.facturacionNeta;
      s.avgPrice += record.precio;
      s.count += 1;
    });

    const result: Array<{
      producto: string;
      totalKgs: number;
      totalRevenue: number;
      avgPrice: number;
    }> = [];

    stats.forEach((values, producto) => {
      result.push({
        producto,
        totalKgs: values.totalKgs,
        totalRevenue: values.totalRevenue,
        avgPrice: values.avgPrice / values.count,
      });
    });

    return result.sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [filteredData]);

  // Calculate production and revenue by month and product
  const monthlyProductionRevenue = useMemo(() => {
    const grouped = new Map<
      string,
      Map<string, { totalKgs: number; totalRevenue: number }>
    >();

    filteredData.forEach((record) => {
      const month = new Date(record.fechaAlbaran).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
      });

      if (!grouped.has(month)) {
        grouped.set(month, new Map());
      }

      const monthData = grouped.get(month)!;
      if (!monthData.has(record.producto)) {
        monthData.set(record.producto, { totalKgs: 0, totalRevenue: 0 });
      }

      const productData = monthData.get(record.producto)!;
      productData.totalKgs += record.kgs;
      productData.totalRevenue += record.facturacionNeta;
    });

    // Convert to array format
    const result: Array<{
      month: string;
      products: Array<{
        producto: string;
        totalKgs: number;
        totalRevenue: number;
      }>;
      monthTotalKgs: number;
      monthTotalRevenue: number;
    }> = [];

    grouped.forEach((products, month) => {
      const productArray: Array<{
        producto: string;
        totalKgs: number;
        totalRevenue: number;
      }> = [];
      let monthTotalKgs = 0;
      let monthTotalRevenue = 0;

      products.forEach((data, producto) => {
        productArray.push({
          producto,
          totalKgs: data.totalKgs,
          totalRevenue: data.totalRevenue,
        });
        monthTotalKgs += data.totalKgs;
        monthTotalRevenue += data.totalRevenue;
      });

      result.push({
        month,
        products: productArray.sort((a, b) => b.totalKgs - a.totalKgs),
        monthTotalKgs,
        monthTotalRevenue,
      });
    });

    // Sort by date
    return result.sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });
  }, [filteredData]);

  // Find max values for scaling charts
  const maxKgs = Math.max(
    ...monthlyProductionRevenue.map((m) => m.monthTotalKgs),
  );
  const maxRevenue = Math.max(
    ...monthlyProductionRevenue.map((m) => m.monthTotalRevenue),
  );

  // Calculate production breakdown by product type, farm, and month
  const productionBreakdown = useMemo(() => {
    const result: Array<{
      producto: string;
      totalKgs: number;
      byType: Array<{ tipo: string; kgs: number; percentage: number }>;
      byFinca: Array<{ finca: string; kgs: number; percentage: number }>;
      byMonth: Array<{
        month: string;
        byType: Array<{ tipo: string; kgs: number; percentage: number }>;
        byFinca: Array<{ finca: string; kgs: number; percentage: number }>;
      }>;
    }> = [];

    // Group by product
    const byProduct = new Map<string, typeof filteredData>();
    filteredData.forEach((record) => {
      if (!byProduct.has(record.producto)) {
        byProduct.set(record.producto, []);
      }
      byProduct.get(record.producto)!.push(record);
    });

    byProduct.forEach((records, producto) => {
      const totalKgs = records.reduce((sum, r) => sum + r.kgs, 0);

      // By type
      const typeMap = new Map<string, number>();
      records.forEach((r) => {
        const tipo = r.tipoProducto || "Sin especificar";
        typeMap.set(tipo, (typeMap.get(tipo) || 0) + r.kgs);
      });
      const byType = Array.from(typeMap.entries())
        .map(([tipo, kgs]) => ({
          tipo,
          kgs,
          percentage: (kgs / totalKgs) * 100,
        }))
        .sort((a, b) => b.kgs - a.kgs);

      // By finca
      const fincaMap = new Map<string, number>();
      records.forEach((r) => {
        const finca = r.finca || "Sin especificar";
        fincaMap.set(finca, (fincaMap.get(finca) || 0) + r.kgs);
      });
      const byFinca = Array.from(fincaMap.entries())
        .map(([finca, kgs]) => ({
          finca,
          kgs,
          percentage: (kgs / totalKgs) * 100,
        }))
        .sort((a, b) => b.kgs - a.kgs);

      // By month
      const monthMap = new Map<string, typeof productionSalesData>();
      records.forEach((r) => {
        const month = new Date(r.fechaAlbaran).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
        });
        if (!monthMap.has(month)) {
          monthMap.set(month, []);
        }
        monthMap.get(month)!.push(r);
      });

      const byMonth: Array<{
        month: string;
        byType: Array<{ tipo: string; kgs: number; percentage: number }>;
        byFinca: Array<{ finca: string; kgs: number; percentage: number }>;
      }> = [];

      monthMap.forEach((monthRecords, month) => {
        const monthTotal = monthRecords.reduce((sum, r) => sum + r.kgs, 0);

        // By type in month
        const monthTypeMap = new Map<string, number>();
        monthRecords.forEach((r) => {
          const tipo = r.tipoProducto || "Sin especificar";
          monthTypeMap.set(tipo, (monthTypeMap.get(tipo) || 0) + r.kgs);
        });
        const monthByType = Array.from(monthTypeMap.entries())
          .map(([tipo, kgs]) => ({
            tipo,
            kgs,
            percentage: (kgs / monthTotal) * 100,
          }))
          .sort((a, b) => b.kgs - a.kgs);

        // By finca in month
        const monthFincaMap = new Map<string, number>();
        monthRecords.forEach((r) => {
          const finca = r.finca || "Sin especificar";
          monthFincaMap.set(finca, (monthFincaMap.get(finca) || 0) + r.kgs);
        });
        const monthByFinca = Array.from(monthFincaMap.entries())
          .map(([finca, kgs]) => ({
            finca,
            kgs,
            percentage: (kgs / monthTotal) * 100,
          }))
          .sort((a, b) => b.kgs - a.kgs);

        byMonth.push({
          month,
          byType: monthByType,
          byFinca: monthByFinca,
        });
      });

      // Sort months
      byMonth.sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });

      result.push({
        producto,
        totalKgs,
        byType,
        byFinca,
        byMonth,
      });
    });

    return result.sort((a, b) => b.totalKgs - a.totalKgs);
  }, [filteredData]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Análisis de Producción</h1>
        <p className="text-muted-foreground mt-2">
          Análisis de ventas y evolución de precios por producto
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtrar datos por finca, tipo de producto y producto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="filter-finca">Finca</Label>
              <select
                id="filter-finca"
                value={selectedFinca}
                onChange={(e) => setSelectedFinca(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">Todas las Fincas</option>
                {filterOptions.fincas.map((finca) => (
                  <option key={finca} value={finca}>
                    Finca {finca}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-tipo">Tipo de Producto</Label>
              <select
                id="filter-tipo"
                value={selectedTipoProducto}
                onChange={(e) => setSelectedTipoProducto(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">Todos los Tipos</option>
                {filterOptions.tiposProducto.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-producto">Producto</Label>
              <select
                id="filter-producto"
                value={selectedProducto}
                onChange={(e) => setSelectedProducto(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">Todos los Productos</option>
                {filterOptions.productos.map((producto) => (
                  <option key={producto} value={producto}>
                    {producto}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {(selectedFinca !== "all" ||
            selectedTipoProducto !== "all" ||
            selectedProducto !== "all") && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Filtros activos: {filteredData.length} de{" "}
                {productionSalesData.length} registros
              </span>
              <button
                onClick={() => {
                  setSelectedFinca("all");
                  setSelectedTipoProducto("all");
                  setSelectedProducto("all");
                }}
                className="text-sm text-primary hover:underline"
              >
                Limpiar todo
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Volumen Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredData.reduce((sum, r) => sum + r.kgs, 0).toLocaleString()}{" "}
              kg
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedFinca !== "all" ||
              selectedTipoProducto !== "all" ||
              selectedProducto !== "all"
                ? "Datos filtrados"
                : "Todos los productos"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Facturación Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €
              {filteredData
                .reduce((sum, r) => sum + r.facturacionNeta, 0)
                .toLocaleString("es-ES", { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Importe neto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(filteredData.map((r) => r.producto)).size}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tipos diferentes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Volumen de Producción por Mes</CardTitle>
            <CardDescription>
              Total de kilogramos producidos por mes y producto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {monthlyProductionRevenue.map((monthData, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-semibold">
                      {monthData.month}
                    </span>
                    <span className="text-sm font-mono text-muted-foreground">
                      {monthData.monthTotalKgs.toLocaleString()} kg
                    </span>
                  </div>
                  <div className="space-y-2">
                    {monthData.products.map((product, pIdx) => (
                      <div key={pIdx}>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{product.producto}</span>
                          <span className="font-mono">
                            {product.totalKgs} kg
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{
                              width: `${(product.totalKgs / maxKgs) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Facturación por Mes</CardTitle>
            <CardDescription>
              Facturación total por mes y producto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {monthlyProductionRevenue.map((monthData, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-semibold">
                      {monthData.month}
                    </span>
                    <span className="text-sm font-mono text-muted-foreground">
                      €
                      {monthData.monthTotalRevenue.toLocaleString("es-ES", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {monthData.products.map((product, pIdx) => (
                      <div key={pIdx}>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{product.producto}</span>
                          <span className="font-mono">
                            €
                            {product.totalRevenue.toLocaleString("es-ES", {
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{
                              width: `${(product.totalRevenue / maxRevenue) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Precio Medio por Producto y Mes</CardTitle>
          <CardDescription>
            Precio medio por kg de cada producto a lo largo del tiempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  label={{
                    value: "Precio (€/kg)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                  domain={[0, "auto"]}
                />
                <Tooltip
                  formatter={(value: number) => [`€${value.toFixed(2)}/kg`, ""]}
                  labelStyle={{ color: "#000" }}
                />
                <Legend />
                {priceEvolution.map((product, idx) => {
                  const colors = ["#3b82f6", "#10b981", "#a855f7", "#f97316"];
                  return (
                    <Bar
                      key={idx}
                      dataKey={product.producto}
                      fill={colors[idx % colors.length]}
                      name={product.producto}
                    />
                  );
                })}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No hay datos disponibles para los filtros seleccionados
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de Rendimiento por Producto</CardTitle>
          <CardDescription>
            Volumen total, facturación y precio medio por producto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">
                    Producto
                  </th>
                  <th className="text-right py-3 px-4 font-semibold">
                    Volumen Total (kg)
                  </th>
                  <th className="text-right py-3 px-4 font-semibold">
                    Facturación Total
                  </th>
                  <th className="text-right py-3 px-4 font-semibold">
                    Precio Medio/kg
                  </th>
                </tr>
              </thead>
              <tbody>
                {productStats.map((stat, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{stat.producto}</td>
                    <td className="text-right py-3 px-4 font-mono">
                      {stat.totalKgs.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 font-mono">
                      €
                      {stat.totalRevenue.toLocaleString("es-ES", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-right py-3 px-4 font-mono">
                      €{stat.avgPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">
          Desglose de Calidad y Origen de Producción
        </h2>
        <p className="text-muted-foreground mb-6">
          Distribución porcentual por tipo de producto y finca
        </p>

        <div className="space-y-6">
          {productionBreakdown.map((product, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{product.producto}</CardTitle>
                <CardDescription>
                  Producción total: {product.totalKgs.toLocaleString()} kg
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 mb-6">
                  <div>
                    <h4 className="font-semibold mb-3">Por Tipo de Producto</h4>
                    <div className="space-y-3">
                      {product.byType.map((type, tIdx) => (
                        <div key={tIdx}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{type.tipo}</span>
                            <span className="font-mono text-muted-foreground">
                              {type.kgs} kg ({type.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-blue-500 h-2.5 rounded-full transition-all"
                              style={{ width: `${type.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Por Finca</h4>
                    <div className="space-y-3">
                      {product.byFinca.map((finca, fIdx) => (
                        <div key={fIdx}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">
                              Finca {finca.finca}
                            </span>
                            <span className="font-mono text-muted-foreground">
                              {finca.kgs} kg ({finca.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-orange-500 h-2.5 rounded-full transition-all"
                              style={{ width: `${finca.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Desglose Mensual</h4>
                  <div className="space-y-4">
                    {product.byMonth.map((month, mIdx) => (
                      <div key={mIdx} className="border rounded-lg p-4">
                        <h5 className="font-medium mb-3">{month.month}</h5>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <div className="text-xs text-muted-foreground mb-2">
                              Por Tipo
                            </div>
                            <div className="space-y-2">
                              {month.byType.map((type, tIdx) => (
                                <div
                                  key={tIdx}
                                  className="flex justify-between text-sm"
                                >
                                  <span>{type.tipo}</span>
                                  <span className="font-mono">
                                    {type.kgs} kg ({type.percentage.toFixed(1)}
                                    %)
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-2">
                              Por Finca
                            </div>
                            <div className="space-y-2">
                              {month.byFinca.map((finca, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="flex justify-between text-sm"
                                >
                                  <span>Finca {finca.finca}</span>
                                  <span className="font-mono">
                                    {finca.kgs} kg (
                                    {finca.percentage.toFixed(1)}%)
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
