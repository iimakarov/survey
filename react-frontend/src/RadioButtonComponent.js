import React from "react";
import RadioGroup from "@material-ui/core/RadioGroup";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import "./App.css";

function RadioButtonComponent({
  title,
  description,
  questionId,
  questionValueExpr,
  onChangeEvent,
  radioOpts,
  textInput = undefined,
  checkBoxData = undefined,
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
          {typeof checkBoxData !== undefined && checkBoxData.addCheckBox ? (
            <div align="left">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkBoxData.isChecked}
                    onChange={checkBoxData.onChange}
                    name={questionId}
                    color="primary"
                  />
                }
                label="Пропустить данный вопрос"
              />
              <br></br>
            </div>
          ) : (
            ""
          )}
          <label>
            <RadioGroup
              aria-label="radio"
              name={questionId}
              value={questionValueExpr}
              onChange={onChangeEvent}
            >
              {radioOpts}
            </RadioGroup>
          </label>
          {typeof textInput !== undefined && textInput.hasTextInput ? (
            <TextField
              name={questionId}
              label="Комментарий"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={textInput.saveComment}
            />
          ) : (
            ""
          )}
        </Box>
      </Container>
      <br></br>
    </div>
  );
}

export default RadioButtonComponent;
