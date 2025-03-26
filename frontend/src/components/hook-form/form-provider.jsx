import { FormProvider as RHFForm } from 'react-hook-form';

// ----------------------------------------------------------------------

export function Form({ children, onSubmit, methods, ...other }) {
  return (
    <RHFForm {...methods}>
      <form onSubmit={onSubmit} noValidate autoComplete="off" {...other}>
        {children}
      </form>
    </RHFForm>
  );
}
