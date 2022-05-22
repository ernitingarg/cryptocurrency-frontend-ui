import TextField, { TextFieldProps } from '@material-ui/core/TextField';

type Props = TextFieldProps & {
  ref?: TextFieldProps['ref'] | ((e: any) => void);
};

const TextInput = ({ ...props }: Props) => {
  return <TextField {...props} />;
};

export default TextInput;
