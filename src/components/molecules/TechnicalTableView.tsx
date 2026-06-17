import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface TechnicalTableViewProps {
  title: string;
  tableTitle?: string;
  headers: string[];
  rows: string[][];
}

export function TechnicalTableView({
  title,
  tableTitle,
  headers,
  rows,
}: TechnicalTableViewProps) {
  if (headers.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-navy-800">
        {tableTitle || title}
      </h2>
      <div className="overflow-x-auto border border-navy-800/30">
        <Table>
          <TableHeader>
            <TableRow className="bg-navy-950 hover:bg-navy-950">
              {headers.map((header, index) => (
                <TableHead
                  key={`${header}-${index}`}
                  className="font-mono text-[10px] uppercase tracking-widest text-gold-300"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={`row-${rowIndex}`}>
                {headers.map((_, cellIndex) => (
                  <TableCell
                    key={`cell-${rowIndex}-${cellIndex}`}
                    className="font-sans text-sm text-navy-950"
                  >
                    {row[cellIndex] ?? "—"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
