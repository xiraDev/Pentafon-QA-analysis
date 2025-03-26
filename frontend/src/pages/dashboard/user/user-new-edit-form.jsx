import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect,  } from 'react';

// import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';
import { PATH_DASHBOARD } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useDispatch } from 'src/redux/store';

// import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

export default function UserNewEditForm({ currentUser, campaigns }) {
  const { t } = useTranslate('common');
  const dispatch = useDispatch();
  const router = useRouter();

  const [campaignOptions, setCampaignOptions] = useState([]);

  const NewUserSchema = zod.object({
    name: zod.string().min(1, { message: t('form.errors.name') }),
    email: zod.string().email({ message: t('form.errors.email') }),
    password: zod.string().min(6, { message: t('form.errors.password') }),
    campaigns: zod.array(zod.string()).nonempty({ message: t('form.errors.campaign') }),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      password: '',
      campaigns: currentUser?.campaigns || [],
    }),
    [currentUser]
  );


  useEffect(() => {
    async function fetchData() {
      setCampaignOptions(campaigns);
    }
    fetchData();
  }, [campaigns]);

  const methods = useForm({
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
        // TODO añadir lógica de crear usuario 
      reset();
      router.push(PATH_DASHBOARD.users.root);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit} aria-label="user-new-edit-form">
      <Stack spacing={3} sx={{ mx: 'auto', maxWidth: 600 }}>
        <Card>
          <CardHeader title={t('user.details')} subheader={t('user.details_subheader')} />
          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Field.Text name="name" label={t('user.name_label')} />
            <Field.Text name="email" label={t('user.email_label')} />
            <Field.Text name="password" label={t('user.password_label')} type="password" />
            <Field.Select name="campaigns" label={t('user.campaign_label')} multiple>
              {campaignOptions.map((campaign) => (
                <MenuItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </MenuItem>
              ))}
            </Field.Select>
          </Stack>
        </Card>

        <Stack direction="row" justifyContent="flex-end">
          <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
            {currentUser ? t('save_changes') : t('user.create_submit')}
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
