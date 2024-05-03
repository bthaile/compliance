import { Box, IconButton, Menu, TextField, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { Field } from 'shared/types/filters';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';

interface FieldQueryProps {
  fields: Field[];
  handleSearchQuery: () => void;
}

const FieldQuery: FC<FieldQueryProps> = ({ fields, handleSearchQuery }) => {
  const [fieldList, setFieldList] = useState<Field[] | never[]>([]);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [queryColumnsAnchor, setQueryColumnsAnchor] =
    useState<null | HTMLElement>(null);

  useEffect(() => {
    const activeFields = fields.filter((field) => field.active);
    setFieldList(activeFields);
  }, [fields]);

  useEffect(() => {
    if (!openFilter) {
      setQueryColumnsAnchor(null);
    }
  }, [openFilter]);

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    field: Field,
  ) => {
    const currentSearchTerm = event.target.value;
    field.setValue(currentSearchTerm);
  };

  const handleOpenFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenFilter(!openFilter);
    setQueryColumnsAnchor(event.currentTarget);
  };

  const handleSearch = () => {
    handleSearchQuery();
  };

  return (
    <div>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleOpenFilter}
        edge="start"
        style={{ marginRight: '20px' }}
      >
        <FilterListIcon />
      </IconButton>
      <Menu anchorEl={queryColumnsAnchor} open={openFilter}>
        {fieldList &&
          fieldList.map((field: Field, index) => {
            return (
              <Box
                key={index}
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '30ch' },
                  display: 'flex',
                  flexDirection: 'column',
                }}
                noValidate
                autoComplete="off"
              >
                <label style={{ margin: '10px' }}>{field.name}</label>
                <TextField
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={field.value}
                  onChange={(event) => handleSearchChange(event, field)}
                />
              </Box>
            );
          })}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '10px',
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleSearch}
          >
            <SearchIcon />
            <Typography>Search</Typography>
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleOpenFilter}
          >
            <CancelIcon />
            <Typography>Cancel</Typography>
          </IconButton>
        </div>
      </Menu>
    </div>
  );
};

export default FieldQuery;
