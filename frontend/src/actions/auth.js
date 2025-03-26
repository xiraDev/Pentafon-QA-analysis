import { isEmpty } from 'lodash';

// utils
import axios from '../utils/axios';

// ----------------------------------------------------------------------

export const startCheckingUserVerification = (uid, verificationValues, setVerificationValues) => async (dispatch) => {
  const response = await axios.get(`/api/v1/users/${uid}`);
  const body = response.data;

  if (body.status.toString() === 'error') {
    setVerificationValues({
      ...verificationValues,
      loading: false,
      emailSended: false,
    });
  } else if (!isEmpty(body.meta.token)) {
    dispatch(startSendVerificationEmail(body.meta.id, verificationValues, setVerificationValues));
    setVerificationValues({
      ...verificationValues,
      loading: false,
      isUser: true,
      infoUser: body.meta.email,
      emailSended: true,
    });
  } else {
    setVerificationValues({
      ...verificationValues,
      loading: false,
      emailSended: false,
    });
  }
};

// ----------------------------------------------------------------------

export const startSendVerificationEmail = (uid, verificationValues, setVerificationValues) => async () => {
  setVerificationValues({
    ...verificationValues,
    loading: true,
    emailSended: false,
  });

  const response = await axios.get(`/api/v1/auth/validate-account/resend-email/${uid}`);
  const body = response.data;

  if (body.status.toString() === 'success') {
    setVerificationValues({
      ...verificationValues,
      loading: false,
      isUser: true,
      emailSended: true,
    });
  } else {
    console.log('Error en envío de correo');
    setVerificationValues({
      ...verificationValues,
      loading: false,
      emailSended: false,
    });
  }
};

// ----------------------------------------------------------------------

export const startVerifyEmail = (id, tokenConfirmation, verificationValues, setVerificationValues) => async () => {
  try {
    const response = await axios.put(`/api/v1/auth/validate-account`, {
      id,
      token_confirmation: tokenConfirmation,
    });
    const body = response.data;

    if (body.status.toString() === 'success') {
      setVerificationValues({
        ...verificationValues,
        loading: false,
        validate: true,
      });
    } else {
      setVerificationValues({
        ...verificationValues,
        loading: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// ----------------------------------------------------------------------

export const startSendResetPassEmail = (email) => async () => {
  const response = await axios.put(`/api/v1/auth/reset-password`, { email });
  const body = response.data;

  if (body.status.toString() === 'success') {
    console.log('success');
  } else {
    console.log('Error en envío de correo');
  }
};

// ----------------------------------------------------------------------

export const startResetPassword = (data, setResetPassValues, enqueueSnackbar) => async () => {
  setResetPassValues({
    loading: true,
    confirm: false,
  });
  const response = await axios.put(`/api/v1/auth/set-new-password`, data);
  const body = response.data;

  if (body.status.toString() === 'success') {
    enqueueSnackbar(body.message, { variant: body.status });
    setResetPassValues({
      loading: false,
      confirm: true,
    });
  } else {
    enqueueSnackbar(body.message, { variant: body.status });
    setResetPassValues({
      loading: false,
      confirm: false,
    });
  }
};

// ----------------------------------------------------------------------

export const startRenewPassword = (data, toast, currentLang) => async () => {
  try {
    const response = await axios.put('/api/v1/auth/renew-password', data);
    const body = response.data;

    if (body.status.toString() === 'success') {
      toast.success(body.message?.[currentLang.value] || "password renewed");
    } else {
      toast.error(body.message?.[currentLang.value] || "password not renewed");
    }
  } catch (error) {
    toast.error(error.message?.[currentLang.value] || "Something went wrong");
    console.log(error);
  }
};
