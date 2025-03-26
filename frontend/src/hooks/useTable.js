import { useState } from 'react';

// ----------------------------------------------------------------------

/**
 * It returns an object with all the state and functions you need to create a table
 * @param props - The props passed to the component.
 * @returns An object with the following properties:
 */
export default function useTable(props) {
  const [dense, setDense] = useState(props?.defaultDense || false);

  const [orderBy, setOrderBy] = useState(props?.defaultOrderBy || 'name');

  const [order, setOrder] = useState(props?.defaultOrder || 'asc');

  const [page, setPage] = useState(props?.defaultCurrentPage || 0);

  const [rowsPerPage, setRowsPerPage] = useState(props?.defaultRowsPerPage || 5);

  const [selected, setSelected] = useState(props?.defaultSelected || []);

  const onSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const onSelectRow = (id) => {
    const selectedIndex = selected.indexOf(id);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const onSelectAllRows = (checked, newSelecteds) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const onChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const onChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onChangeDense = (event) => {
    setDense(event.target.checked);
  };

  // filter

  return {
    dense,
    order,
    page,
    setPage,
    orderBy,
    rowsPerPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangePage,
    onChangeDense,
    onChangeRowsPerPage,
  };
}

// ----------------------------------------------------------------------

/**
 * If the value of the property in the first object is less than the value of the property in the
 * second object, return -1. If the value of the property in the first object is greater than the value
 * of the property in the second object, return 1. Otherwise, return 0
 * @param a - The first item to compare.
 * @param b - The second item to compare.
 * @param orderBy - The name of the property to sort by.
 * @returns A function that compares two values and returns a number based on the comparison.
 */
export function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

/**
 * If the order is descending, return a function that compares two rows and returns a number less than
 * 0 if the first row is greater than the second row, 0 if they're equal, and a number greater than 0
 * if the first row is less than the second row. Otherwise, return a function that does the opposite
 * @param order - 'asc' or 'desc'
 * @param orderBy - The column name that we want to sort by.
 * @returns A function that takes two arguments, a and b, and returns a value.
 */
export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

/**
 * It returns the number of empty rows that should be displayed in the table
 * @param page - The current page number
 * @param rowsPerPage - The number of rows per page.
 * @param arrayLength - The length of the array that you're using to populate the table.
 * @returns The number of empty rows in the table.
 */
export function emptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}
