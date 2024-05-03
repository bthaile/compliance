import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FC } from 'react';

export interface ISupportDialog {
  onClose: () => void;
  isOpen: boolean;
}

export const SupportDialog: FC<ISupportDialog> = ({ onClose, isOpen }) => {
  const mailto = 'mailto:support@terravalue.com';
  const label = 'support@terravalue.com';

  return (
    <Dialog open={isOpen}>
      <DialogTitle>
        <IconButton
          classes={{ root: 'support-close-icon-button' }}
          onClick={onClose}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          classes={{ root: 'support-dialog-content' }}
        >
          Please email all support requests to
        </DialogContentText>
        <Link
          href="#"
          onClick={(e) => {
            window.location.href = mailto;
            e.preventDefault();
          }}
        >
          {label}
        </Link>
      </DialogContent>
    </Dialog>
  );
};

export default SupportDialog;
