import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import "./App.css";

function DialogComponent({
  openState,
  closeEvent,
  title,
  description,
  secondDescription,
  textFieldData,
  buttonOnClick,
  buttonText,
}) {
  return (
    <Dialog
      open={openState}
      onClose={closeEvent}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        {secondDescription && secondDescription.length ? (
          <DialogContentText>{secondDescription}</DialogContentText>
        ) : (
          ""
        )}
        {typeof textFieldData !== "undefined" ? (
          <TextField
            autoFocus
            margin="dense"
            id={textFieldData.id}
            label={textFieldData.label}
            fullWidth
            value={textFieldData.value}
            onChange={textFieldData.textOnChange}
            helperText={textFieldData.error ? "Неверный ввод" : ""}
            error={textFieldData.error}
          />
        ) : (
          ""
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={buttonOnClick} color="primary">
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogComponent;
