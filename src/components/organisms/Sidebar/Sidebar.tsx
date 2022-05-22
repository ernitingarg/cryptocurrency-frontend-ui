import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Menu, MenuItem, ProSidebar, SidebarContent, SidebarHeader, SubMenu } from 'react-pro-sidebar';
import { Props as ProSidebarProps } from 'react-pro-sidebar/dist/ProSidebar/ProSidebar';

const useStyles = makeStyles(() => ({
  sidebar: {
    height: '100vh',
  },
}));

type Props = ProSidebarProps;

/**
 * TBD
 */
const Sidebar = ({ className, ...props }: Props) => {
  const classes = useStyles();
  return (
    <ProSidebar className={clsx(classes.sidebar, className)} {...props}>
      <SidebarHeader>
        <div
          // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
          style={{
            padding: '0 24px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: 14,
            letterSpacing: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          SOTERIA
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Menu iconShape="square">
          <MenuItem>Dashboard</MenuItem>
          <SubMenu title="Components">
            <MenuItem>Component 1</MenuItem>
            <MenuItem>Component 2</MenuItem>
          </SubMenu>
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
};

export default Sidebar;
