import { makeStyles } from '@material-ui/core/styles';
import Header from './Header';
import { Grid, Typography } from '@material-ui/core';

interface Props {
  children: React.ReactNode;
}

const useStyles = makeStyles((theme) => ({
  main: { ...theme.mixins.toolbar },
}));

const Layout = ({ children }: Props) => {
  const classes = useStyles();

  return (
    <div>
      <Header />
      <main className={classes.main}>{children}</main>
      <Grid container direction="row" justifyContent="center" mb={7} mt={15}>
        <Grid item>
          <Typography fontSize={12} color="grey.500">
            © 2020 by Soteria Technologies ltd. Incorporated in B.V.I.
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default Layout;
