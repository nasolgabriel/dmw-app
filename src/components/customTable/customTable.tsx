import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Checkbox,
  Box,
  Typography,
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
  columns: ColumnDef<DataType>[];
  data: DataType[];
  sx?: SxProps<Theme>;
  renderButton?: (row: Row<DataType>) => React.ReactNode;
}

/* ------------------------- */
/*         Style Objects     */
/* ------------------------- */

const tableStyles = {
  borderCollapse: "separate",
  borderSpacing: "0 15px",
  "& thead th": {
    backgroundColor: "white",
    borderBottom: "none",
    fontWeight: 600,
    position: "sticky",
    top: 0,
    zIndex: 1,
    
  },
  "& tbody tr": {
    backgroundColor: "#F4F1F1",
  },
  "& tbody td": {
    border: "none",
    verticalAlign: 'middle',
    height: '72px',
  },
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
  const [showButtons, setShowButtons] = useState(false);
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

  const table = useReactTable({
    columns: memoizedColumns,
    data: memoizedData,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableContainer sx={{ boxShadow: "none", overflowX: "auto", ...sx }}>
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
              <TableCell align="right">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Checkbox
                    checked={showButtons}
                    onChange={(e) => setShowButtons(e.target.checked)}
                    size="small"
                  />
                  <Typography variant="body2" sx={{fontWeight:"bold"}}>Choose client</Typography>
                </Box>
              </TableCell>
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
                {showButtons &&
                  (renderButton ? (
                    renderButton(row)
                  ) : (
                    <Button variant="contained" color="warning">
                    </Button>
                  ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}