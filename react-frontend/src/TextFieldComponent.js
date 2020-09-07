import React from "react";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import "./App.css";

function TextFieldComponent({
  title,
  description,
  id,
  onCommentChange
}) {
  return (
    <div>
      <Container component={Box}>
        <Box p={2} component={Paper}>
          <Typography variant="h4" align="left">
            {title}
          </Typography>
          <Typography variant="h5" align="left">
            {description}
          </Typography>
          <TextField
            name={id}
            label="Комментарий"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={onCommentChange}
          />
        </Box>
      </Container>
      <br></br>
    </div>
  );
};

export default TextFieldComponent;
