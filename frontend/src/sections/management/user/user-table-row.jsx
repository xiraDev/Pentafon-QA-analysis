import { useState } from 'react';
import PropTypes from 'prop-types';

// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, TableRow, MenuItem, TableCell, Typography } from '@mui/material';

// hooks
import { useTranslate } from 'src/locales';

// components
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { TableMoreMenu } from 'src/components/table';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.oneOfType([PropTypes.object]),
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function UserTableRow({ row, selected, campaignSlugs, onDeleteRow: onDisableRow , onEditRow: onMoveToEdit}) {
  const { t } = useTranslate('common');
  const theme = useTheme();

  const { username, avatarUrl, email, role, emailVerified, isActive } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={username} src={avatarUrl} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {username}
        </Typography>
      </TableCell>

      <TableCell align="left">{email}</TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {role?.role}
      </TableCell>
      <TableCell align="left">{campaignSlugs}</TableCell>
      <TableCell align="center">
        <Iconify
          icon={emailVerified ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
          sx={{
            width: 20,
            height: 20,
            color: 'success.main',
            ...(!emailVerified && { color: 'warning.main' }),
          }}
        />
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(!isActive && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {isActive ? t('column_enabled') : t('column_disabled')}
        </Label>
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onDisableRow();
                  handleCloseMenu();
                }}
                sx={{ color: isActive ? 'error.main' : 'success.main' }}
              >
                <Iconify icon={isActive ? 'grommet-icons:disabled-outline' : 'eva:checkmark-circle-2-outline'} />
                {isActive ? t('disable') : t('enable')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onMoveToEdit();
                  handleCloseMenu();
                }}
              >
                <Iconify icon='eva:edit-fill' />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
