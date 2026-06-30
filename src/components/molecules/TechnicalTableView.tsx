"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEFAULT_PAGE_SIZE = 15;

export interface TechnicalTableViewProps {
  title: string;
  tableTitle?: string;
  headers: string[];
  rows: string[][];
  pageSize?: number;
  labels?: {
    page: string;
    previous: string;
    next: string;
  };
}

export function TechnicalTableView({
  title,
  tableTitle,
  headers,
  rows,
  pageSize = DEFAULT_PAGE_SIZE,
  labels = {
    page: "Sayfa",
    previous: "Önceki",
    next: "Sonraki",
  },
}: TechnicalTableViewProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const visibleRows = rows.slice(startIndex, startIndex + pageSize);
  const showPagination = rows.length > pageSize;

  useEffect(() => {
    setPage(1);
  }, [rows]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

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
            {visibleRows.map((row, rowIndex) => (
              <TableRow key={`row-${startIndex + rowIndex}`}>
                {headers.map((_, cellIndex) => (
                  <TableCell
                    key={`cell-${startIndex + rowIndex}-${cellIndex}`}
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

      {showPagination ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-widest text-navy-800/70">
            {labels.page} {safePage} / {totalPages}
            <span className="mx-2 text-navy-800/30">·</span>
            {startIndex + 1}–{Math.min(startIndex + pageSize, rows.length)} /{" "}
            {rows.length}
          </p>
          <div className="flex flex-wrap items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="font-mono text-[10px] uppercase tracking-widest"
            >
              {labels.previous}
            </Button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <Button
                  key={pageNumber}
                  type="button"
                  variant={pageNumber === safePage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNumber)}
                  className={cn(
                    "min-w-9 font-mono text-[10px] uppercase tracking-widest",
                    pageNumber === safePage && "bg-navy-950 text-gold-300",
                  )}
                >
                  {pageNumber}
                </Button>
              ),
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safePage >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className="font-mono text-[10px] uppercase tracking-widest"
            >
              {labels.next}
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
