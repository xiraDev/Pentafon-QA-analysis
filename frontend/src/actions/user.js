// utils
import axios from '../utils/axios';

// ----------------------------------------------------------------------

export const startUpdateUser = (data, uid, toast, currentLang) => async () => {
  try {
    const response = await axios.put(`/api/v1/users/${uid}`, data);
    const body = response.data;

    if (body.status.toString() === 'success') {
      toast.success(body.message?.[currentLang.value] || "User updated successfully");
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message?.[currentLang.value] || "Something went wrong");
  }
};

export const startCreateUser = async (data, toast, currentLang) => {
  try {
    const response = await axios.post('/api/v1/users', {
      username: data.username,
      email: data.email,
      password: data.password,
      roleId: parseInt(data.role, 10),
      isActive: data.isActive ? 1 : 0,
      emailVerified: 1,
    });
    const body = response.data;

    if (body.status.toString() === 'success') {
      toast.success(body.message?.[currentLang.value] || "User created successfully");
    } else {
      toast.error(body.message?.[currentLang.lang], { variant: body.status });
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message?.[currentLang.lang] || "Something went wrong");
  }
};
