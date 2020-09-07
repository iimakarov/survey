import React from "react";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import RadioButtonComponent from "./RadioButtonComponent.js";
import TitleComponent from "./TitleComponent.js";
import DialogComponent from "./DialogComponent.js";
import TextFieldComponent from "./TextFieldComponent.js";
import RatingComponent from "./RatingComponent.js";

import "./App.css";
import { decode } from "he";
import { post } from "axios";

const survey = JSON.parse(decode(window.survey));

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      items: [],
      openNotFinished: false,
      openLoginPage: true,
      user: "",
    };

    this.onRadioRatingChange = this.onRadioRatingChange.bind(this); // radiobutton value changed
    this.onSubmit = this.onSubmit.bind(this); // submit button is clicked
    this.setClose = this.setClose.bind(this); // popup window to be closed
    this.onUpdateUser = this.onUpdateUser.bind(this); // the user login is entered
    this.onUserClick = this.onUserClick.bind(this); // the user enter popup window button is clicked
    this.onCommentChange = this.onCommentChange.bind(this); // the comment is entered
    this.onCheckBoxChange = this.onCheckBoxChange.bind(this); // checkBox is checked
  }

  onUpdateUser = (e) => {
    // if the input value has changed - update the state value
    this.setState({ user: e.target.value });
  };

  onUserClick = () => {
    // create default items (with empty answers and comments)
    let initialItems = [];
    for (let item of survey.items)
      initialItems.push({
        id: item.id,
        answer: null,
        comment: "",
        type: item.type,
        isFinished: item.type === "text",
        checkBoxChecked: false,
      });

    // if the entered login is OK -> update state.items and close the popup window
    if (this.state.user.length > 0)
      this.setState({ openLoginPage: false, items: initialItems });
  };

  onRadioRatingChange = (e) => {
    // create new object as copy of items in current state
    let currentState = Object.assign([], this.state.items);

    // find the item that is now changed
    const itemIndex = currentState.findIndex((elem) => {
      return elem.id === e.target.name;
    });

    // update the answer and isFinished values for a given item
    currentState[itemIndex].answer = e.target.value;
    currentState[itemIndex].isFinished = true;

    // update state
    this.setState({
      items: currentState,
    });
  };

  onCommentChange = (e) => {
    // create new object as copy of items in current state
    let currentState = Object.assign([], this.state.items);

    // find the item that is now changed
    const itemIndex = currentState.findIndex((elem) => {
      return elem.id === e.target.name;
    });

    // update the answer value for a given item
    currentState[itemIndex].comment = e.target.value;

    // update state
    this.setState({
      items: currentState,
    });
  };

  onCheckBoxChange = (e) => {
    // create new object as copy of items in current state
    let currentState = Object.assign([], this.state.items);

    // find the item that is now changed
    const itemIndex = currentState.findIndex((elem) => {
      return elem.id === e.target.name;
    });

    // update the answer value for a given item
    currentState[itemIndex].checkBoxChecked = e.target.checked;

    // update state
    this.setState({
      items: currentState,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    // if all questions are finished - post data to server
    if (
      this.state.items.every((i) => {
        return i.isFinished || i.checkBoxChecked;
      })
    ) {
      const url = "/id=" + survey.id;
      const headers = {
        "content-type": "application/json",
      };
      const data = {
        surveyId: survey.id,
        items: this.state.items,
        user: this.state.user,
        isFinished: true,
      };
      post(url, data, { headers: headers })
        .then((response) => {
          console.log(response.data);
          window.location = "/answer";
        })
        .catch((error) => {
          console.log(error);
        }); // otherwise - open popup window
    } else this.setState({ openNotFinished: true });
  };

  setClose = () => {
    // close the popup window
    this.setState({ openNotFinished: false });
  };

  render() {
    // main array to store questions (items) data
    let items = [];

    // main loop to fill in the items array
    for (let item of survey.items) {
      // in case of single/multiple choice questions - answer options are proceeded
      const answerOpts =
        item.type === "single-choice" ? item.choiceOpts.split("; ") : [];

      // add elements for answer options - if none are given, no elements will be added
      let radioOpts = [];
      for (let opt of answerOpts)
        radioOpts.push(
          <FormControlLabel value={opt} control={<Radio />} label={opt} />
        );

      // process "single-choice" question type
      if (item.type === "single-choice" && answerOpts.length > 0)
        items.push(
          <RadioButtonComponent
            title={item.id + ") " + item.name}
            description={item.description}
            questionId={item.id}
            questionValueExpr={
              this.state.items.map((c) => c.id).includes(item.id)
                ? this.state.items.filter((c) => {
                    return c.id === item.id;
                  })[0].answer
                : undefined
            }
            onChangeEvent={this.onRadioRatingChange}
            radioOpts={radioOpts}
            textInput={{
              hasTextInput: item.addTextBox,
              saveComment: this.onCommentChange,
            }}
            checkBoxData={{
              addCheckBox: item.addCheckBox,
              isChecked: this.state.items.map((c) => c.id).includes(item.id)
                ? this.state.items.filter((c) => {
                    return c.id === item.id;
                  })[0].checkBoxChecked
                : undefined,
              onChange: this.onCheckBoxChange,
            }}
          ></RadioButtonComponent>
        );

      // process "text" question type
      if (item.type === "text")
        items.push(
          <TextFieldComponent
            title={item.id + ") " + item.name}
            description={item.description}
            id={item.id}
            onCommentChange={this.onCommentChange}
          />
        );

      // process "rating" question type
      if (item.type === "rating")
        items.push(
          <RatingComponent
            title={item.id + ") " + item.name}
            description={item.description}
            questionId={item.id}
            currentValue={
              this.state.items.map((c) => c.id).includes(item.id)
                ? this.state.items.filter((c) => {
                    return c.id === item.id;
                  })[0].answer
                : undefined
            }
            onChangeEvent={this.onRadioRatingChange}
            textInput={{
              hasTextInput: item.addTextBox,
              saveComment: this.onCommentChange,
            }}
            checkBoxData={{
              addCheckBox: item.addCheckBox,
              isChecked: this.state.items.map((c) => c.id).includes(item.id)
                ? this.state.items.filter((c) => {
                    return c.id === item.id;
                  })[0].checkBoxChecked
                : undefined,
              onChange: this.onCheckBoxChange,
            }}
          ></RatingComponent>
        );
    }

    return (
      <div className="App" align="center">
        <DialogComponent
          openState={this.state.openLoginPage}
          closeEvent={this.onUserClick}
          title={"Авторизация"}
          description={
            "Укажите, пожалуйста, Ваш логин. Данный логин будет сохранен вместе с Вашими ответами."
          }
          secondDescription={""}
          textFieldData={{
            id: "login",
            label: "Логин",
            value: this.state.user,
            textOnChange: this.onUpdateUser,
            error: this.state.user.length === 0,
          }}
          buttonOnClick={this.onUserClick}
          buttonText={"Сохранить"}
        ></DialogComponent>

        <br></br>
        <TitleComponent
          title={survey.name}
          description={survey.description}
        ></TitleComponent>
        <br></br>
        <div>{items}</div>
        <Button
          className="Margin"
          variant="contained"
          onClick={this.onSubmit}
          color="primary"
          size="large"
        >
          Завершить опрос
        </Button>
        <br></br>

        <DialogComponent
          openState={this.state.openNotFinished}
          closeEvent={this.setClose}
          title={"Опрос не завершен!"}
          description={
            this.state.items.length !== survey.items.length ||
            this.state.items.findIndex((c) => {
              return c.answer === null;
            }) !== -1
              ? "Вы не ответили на вопросы: " +
                this.state.items
                  .filter((c) => {
                    return !c.isFinished && !c.checkBoxChecked;
                  })
                  .map((i) => i.id)
                  .join(", ")
              : ""
          }
          secondDescription={
            this.state.user.length === 0 ? "Логин не указан" : ""
          }
          textFieldData={undefined}
          buttonOnClick={this.setClose}
          buttonText={"Закрыть"}
        ></DialogComponent>
      </div>
    );
  }
}

export default App;
