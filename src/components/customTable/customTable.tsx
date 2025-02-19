import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  SxProps,
  Theme,
} from "@mui/material";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  Row,
} from "@tanstack/react-table";

/* ------------------------- */
/*     Types and Interfaces  */
/* ------------------------- */

export interface CustomTableProps<DataType extends object> {
  /**
   * The column definitions used by react-table.
   */
  columns: ColumnDef<DataType>[];

  /**
   * The data array to be displayed in the table.
   */
  data: DataType[];

  /**
   * MUI sx prop for overriding or extending styles on the TableContainer.
   */
  sx?: SxProps<Theme>;

  /**
   * Optional render function for the action button.
   * Receives the current row as an argument.
   */
  renderButton?: (row: Row<DataType>) => React.ReactNode;

}

/* ------------------------- */
/*         Style Objects     */
/* ------------------------- */

const tableStyles = {
  // Allows spacing between rows
  borderCollapse: "separate",
  borderSpacing: "0 15px", // 8px vertical gap

  // Header styling
  "& thead th": {
    backgroundColor: "transparent", // Remove gray header background
    borderBottom: "none", // Remove bottom border in header
    fontWeight: 600,
  },

  // Row styling
  "& tbody tr": {
    backgroundColor: "#F4F1F1", // Example row background color
    borderRadius: 2, // Rounded corners
    // boxShadow: '0 1px 4px rgba(0,0,0,0.1)', // (Optional) card-like shadow
  },

  // Remove the default cell border from MUI if you prefer
  "& tbody td": {
    border: "none",
  },

  // Example: control padding & font size for cells
  "& .MuiTableCell-root": {
    py: 1.5,
    fontSize: "1rem",
  },
};

/* ------------------------- */
/*       CustomTable         */
/* ------------------------- */

export function CustomTable<DataType extends object>({
  columns,
  data,
  sx,
  renderButton,
}: CustomTableProps<DataType>) {
  // Memoize columns and data to avoid unnecessary re-renders
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

  // Create the table instance from TanStack React Table
  const table = useReactTable({
    columns: memoizedColumns,
    data: memoizedData,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableContainer
      sx={{
        boxShadow: "none",
        overflowX: "auto",
        ...sx,
      }}
    >
      <Table sx={tableStyles}>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableCell>
              ))}
              {/* Empty header cell for the action column */}
              <TableCell />
            </TableRow>
          ))}
        </TableHead>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
              <TableCell align="right">
                {renderButton ? (
                  renderButton(row)
                ) : (
                  <Button variant="contained" color="warning">
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
