import type { NextPage } from 'next';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';

import Sidebar from 'components/toolbar/Sidebar';
import useSocket from 'contexts/socket/useSocket';
import { AppBar, Toolbar, IconButton, Typography, Paper } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from 'react';
import { ICRPCalendar } from 'services/types';
import { useRouter } from 'next/router';

const CrpCalendar: NextPage = () => {
  const { store } = useSocket();
  const router = useRouter();

  const locales = {
    'en-US': enUS,
  };

  useEffect(() => {
    console.log(store);
  }, [store]);

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const handleDrawerChange = (open: boolean) => {
    setOpenDrawer(open);
  };

  const handleSelectEvent = (event: ICRPCalendar) => {
    router.push({ pathname: '/crp-table', query: { dateToLoad: event.start } });
  };

  return (
    <div>
      <Paper>
        <div>
          <AppBar position="sticky">
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => handleDrawerChange(!openDrawer)}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6">
                Client Retention Program Leads Calendar
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
        <Sidebar open={openDrawer} handleDrawerChange={handleDrawerChange} />
        <div style={{ height: '90vh', margin: '10px' }}>
          <Calendar
            localizer={localizer}
            events={store.crpCalendar ?? undefined}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      </Paper>
    </div>
  );
};

export default CrpCalendar;
