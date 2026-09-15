import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  exportCsv(data: Record<string, string | number>[]): void {
    const headers = Object.keys(data[0] ?? {});
    const rows = data.map((item) => headers.map((header) => item[header]));
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => this.escapeCsvValue(value)).join(','))
      .join('\n');

    this.download(csv, `telemetry-${Date.now()}.csv`, 'text/csv;charset=utf-8;');
  }

  exportExcel(data: Record<string, string | number>[]): void {
    const headers = Object.keys(data[0] ?? {});
    const rows = data.map((item) => headers.map((header) => item[header]));
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Telemetry');
    XLSX.writeFile(workbook, `telemetry-${Date.now()}.xlsx`);
  }

  private escapeCsvValue(value: string | number): string {
    return `"${String(value).replaceAll('"', '""')}"`;
  }

  private download(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
