// hooks
// routes
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';

// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Switch,
  Divider,
  TableBody,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';

import {PATH_DASHBOARD} from "src/routes/paths"

import { useTabs } from 'src/hooks/use-tabs';
import useTable, { emptyRows, getComparator } from 'src/hooks/useTable';

import { paramCase } from 'src/utils/change-case';

import { useTranslate } from 'src/locales';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { getUsers, toggleUserStatus } from 'src/redux/slices/user';

import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableSkeleton, TableEmptyRows, TableHeadCustom } from 'src/components/table';

import UserTableRow from './user-table-row';
import UserTableToolbar from './user-table-toolbar';
// ----------------------------------------------------------------------

const ROLE_OPTIONS = ['all', 'administrator', 'architect', 'reader'];


// ----------------------------------------------------------------------

export default function UserList() {
  const { t, currentLang } = useTranslate('common');

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const dispatch = useDispatch();

  const { users, isLoading } = useSelector((state) => state.user);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const navigate = useNavigate()

  const tabs = useTabs('all');

  const handleFilterName = (nameFilter) => {
    setFilterName(nameFilter);
    setPage(0);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  const handleDisableRow = async (id) => {
    try {
      await dispatch(toggleUserStatus(id));

      setTableData((prevData) =>
        prevData.map((user) => (user.id === id ? { ...user, isActive: user.isActive === 1 ? 0 : 1 } : user))
      );
    } catch (error) {
      console.error('Error al deshabilitar/habilitar el usuario:', error);
    }
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus: tabs.value,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!tabs.value) ||
    (!isLoading && !dataFiltered.length);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users?.length) {
      setTableData(users);
    }
  }, [users]);

  const STATUS_OPTIONS = useMemo(
    () => [
      { label: t('all'), value: 'all' },
      { label: t('enabled'), value: 'enbaled' },
      { label: t('disabled'), value: 'disabled' },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLang]
  );

  const TABLE_HEAD = useMemo(
    () => [
      { id: 'username', label: t('user'), align: 'left' },
      { id: 'email', label: t('email'), align: 'left' },
      { id: 'role.role', label: t('column_role'), align: 'left' },
      { id: 'campaignSlug', label: t('column_campaign_slug'), align: 'left' },
      { id: 'emailVerified', label: t('column_verified'), align: 'center' },
      { id: 'isActive', label: t('status'), align: 'left' },
      { id: '' },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLang]
  );

  return (
    <Card>
      <Tabs
        allowScrollButtonsMobile
        variant="scrollable"
        scrollButtons="auto"
        value={tabs.value}
        onChange={tabs.onChange}
        sx={{ px: 2, bgcolor: 'background.neutral' }}
      >
        {STATUS_OPTIONS.map((tab) => (
          <Tab disableRipple key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

      <Divider />

      <UserTableToolbar
        filterName={filterName}
        filterRole={filterRole}
        onFilterName={handleFilterName}
        onFilterRole={handleFilterRole}
        optionsRole={ROLE_OPTIONS}
      />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
          <Table size={dense ? 'small' : 'medium'}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={selected.length}
              onSort={onSort}
            />

            <TableBody>
              {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) =>
                  row ? (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onDeleteRow={() => handleDisableRow(row.id)}
                      campaignSlugs={row.Campaigns.map(campaign => campaign.campaignSlug).join(', ')} // Agrega los slugs
                    />
                  ) : (
                    !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  )
                )}

              <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />
              <TableNoData isNotFound={isNotFound} />
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Box sx={{ position: 'relative' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataFiltered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />

        <FormControlLabel
          control={<Switch checked={dense} onChange={onChangeDense} />}
          label="Dense"
          sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
        />
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName, filterStatus, filterRole }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.username.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item) => item.isActive === (filterStatus === 'enbaled' ? 1 : 0));
  }

  if (filterRole !== 'all') {
    tableData = tableData.filter((item) => item.role?.role === filterRole);
  }

  return tableData;
}
