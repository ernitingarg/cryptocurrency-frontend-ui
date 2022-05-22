import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

interface TableProps {
  columns: SoteriaTableColumnData[];
}

interface SoteriaTableColumnData {
  name: string;
  widthRatio: number;
}

const useStyles = makeStyles((theme) => ({
  tableHeadContent: () => ({
    fontSize: theme.typography.h3.fontSize,
    color: theme.typography.h3.color,
    padding: '4px 0',
  }),
  tableCell: () => ({
    paddingLeft: '0',
    paddingRight: '0',
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxSizing: 'border-box',
    '& *': {
      verticalAlign: 'middle',
    },
  }),
  tableRow: () => ({
    borderBottom: `0px solid ${theme.palette.divider}`,
    '&:last-child th, &:last-child td': {
      borderBottom: 0,
    },
  }),
}));

const SoteriaTableCell = ({ ...props }) => {
  const classes = useStyles();
  return <TableCell className={[props.className, classes.tableCell].join(' ')} {...props} />;
};

const SoteriaTableRow = ({ ...props }) => {
  const classes = useStyles();
  return <TableRow className={[props.className, classes.tableRow].join(' ')} {...props} />;
};

const SoteriaTable: React.FC<TableProps> = ({ columns, children }) => {
  const classes = useStyles();
  return (
    <TableContainer>
      <Table aria-label="simple table" style={{ borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow className={classes.tableRow}>
            {columns.map((column, index) => (
              <TableCell
                key={index}
                width={`${column.widthRatio}%`}
                className={[classes.tableHeadContent, classes.tableCell].join(' ')}
              >
                {column.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};

export type { SoteriaTableColumnData };
export { SoteriaTableCell, SoteriaTableRow, SoteriaTable };
