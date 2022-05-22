import { useCallback, useState } from 'react';
import Sidebar from '../../components/organisms/Sidebar/Sidebar';

interface Param {
  initToggled: boolean;
  initCollapsed: boolean;
}

interface Value {
  toggled: boolean;
  setToggled: (toggled: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

/**
 * TBD
 */
export const useSidebar = (params?: Param): [Value, () => JSX.Element] => {
  const [toggled, setToggled] = useState(params?.initToggled || false);
  const [collapsed, setCollapsed] = useState(params?.initCollapsed || false);

  const renderSidebar = useCallback(
    () => <Sidebar toggled={toggled || collapsed} collapsed={collapsed} onToggle={setToggled} />,
    [collapsed, toggled],
  );

  return [{ toggled, setToggled, collapsed, setCollapsed }, renderSidebar];
};
