import * as Yup from 'yup';
import PropTypes from 'prop-types';
// form
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

// routes
import { PATH_DASHBOARD } from 'src/routes/paths';

// _mock
import { USER_ROLES } from 'src/_mock';
// hooks
import { useTranslate } from 'src/locales';
// actions
import { startCreateUser } from 'src/actions/user';

import { toast } from 'src/components/snackbar';
// components
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.oneOfType([PropTypes.object]),
};

export default function UserNewEditForm({ isEdit, currentUser }) {
  const { t, currentLang } = useTranslate('common');

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const NewUserSchema = Yup.object().shape({
    username: Yup.string().required('Nombre de usuario es requerido'),
    email: Yup.string().required('Correo es requerido').email(),
    password: Yup.string().required('Contraseña es requerida').min(6, 'Contraseña debe tener al menos 6 caracteres'),
    role: Yup.string().required('Rol es requerido'),
  });

  const defaultValues = useMemo(
    () => ({
      username: currentUser?.username || '',
      email: currentUser?.email || '',
      password: currentUser?.password || '',
      role: currentUser?.role || '',
      isActive: currentUser?.isActive || true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async (data) => {
    try {
      if (!isEdit) {
        await startCreateUser(data, toast, currentLang);
      } else {
        // await startUpdateUser(data, currentUser.uid, toast);
      }

      reset();
      navigate(PATH_DASHBOARD.user.list);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            {/* {isEdit && (
              <Label
                color={values.status !== 'active' ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            {isEdit && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) => field.onChange(event.target.checked ? 'banned' : 'active')}
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )} */}

            <Field.Switch
              name="isActive"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {t('column_enabled')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('create_new_user_disabled_info')}
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="username" label={t('create_new_user_name_label')} />
              <Field.Text name="email" label={t('email')} />
              <Field.Text
                name="password"
                label={t('password')}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Field.Select
                name="role"
                label={t('column_role')}
                placeholder={t('column_role')}
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="">None</MenuItem>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {USER_ROLES.map((option) => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? t('create_user_submit') : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
