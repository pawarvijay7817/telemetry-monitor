vi.mock('xlsx', () => ({
  utils: {
    aoa_to_sheet: vi.fn((rows: unknown[][]) => ({ rows })),
    book_append_sheet: vi.fn(
      (
        workbook: { SheetNames: string[]; Sheets: Record<string, unknown> },
        worksheet: unknown,
        name: string,
      ) => {
        workbook.SheetNames.push(name);
        workbook.Sheets[name] = worksheet;
      },
    ),
    book_new: vi.fn(() => ({ SheetNames: [], Sheets: {} })),
  },
  writeFile: vi.fn(),
}));

import * as XLSX from 'xlsx';

import { ExportService } from './export.service';

describe('ExportService', () => {
  let service: ExportService;
  let anchor: HTMLAnchorElement;
  let createObjectUrl: ReturnType<typeof vi.fn>;
  let revokeObjectUrl: ReturnType<typeof vi.fn>;

  const rows = [
    {
      Timestamp: '2026-09-22T10:00:00.000Z',
      Value: 'value, with "quotes"',
      Count: 3,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ExportService();
    anchor = document.createElement('a');
    anchor.click = vi.fn();
    vi.spyOn(document, 'createElement').mockReturnValue(anchor);

    createObjectUrl = vi.fn(() => 'blob:test');
    revokeObjectUrl = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectUrl,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectUrl,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exports CSV data with escaped values and a download link', async () => {
    service.exportCsv(rows);

    expect(createObjectUrl).toHaveBeenCalledOnce();
    const blob = createObjectUrl.mock.calls[0][0] as Blob;
    expect(await blob.text()).toBe(
      '"Timestamp","Value","Count"\n"2026-09-22T10:00:00.000Z","value, with ""quotes""","3"',
    );
    expect(anchor.download).toMatch(/^telemetry-\d+\.csv$/);
    expect(anchor.href).toContain('blob:test');
    expect(anchor.click).toHaveBeenCalledOnce();
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:test');
  });

  it('writes Excel data to a telemetry workbook', () => {
    const writeFile = vi.mocked(XLSX.writeFile);

    service.exportExcel(rows);

    expect(writeFile).toHaveBeenCalledOnce();
    expect(writeFile.mock.calls[0][0].SheetNames).toEqual(['Telemetry']);
    expect(writeFile.mock.calls[0][1]).toMatch(/^telemetry-\d+\.xlsx$/);
  });
});
