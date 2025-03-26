import { z as zod } from 'zod';
// form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
// @mui
import { Box, Grid, Card, Stack } from '@mui/material';

import { useTranslate } from 'src/locales';
// redux
import { useDispatch } from 'src/redux/store';
// actions
import { startUpdateUser } from 'src/actions/user';

import { toast } from 'src/components/snackbar';
// components
import { Form, Field } from 'src/components/hook-form';

// hooks
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { t, currentLang } = useTranslate('common');

  const dispatch = useDispatch();

  const { user } = useAuthContext();

  const UpdateUserSchema = zod.object({
    username: zod.string().min(1, { message: 'Name is required!' }),
  });

  const defaultValues = {
    username: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.picture || '',
    role: user?.role.role || '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    // setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch(startUpdateUser(data, user?.id, toast, currentLang));
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 5 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="username" label={t('create_new_user_name_label')} />
              <Field.Text name="email" label={t('email')} disabled />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {t('save_changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
