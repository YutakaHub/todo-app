import React from "react";
import DatePicker from "react-datepicker";
import './Modal.css'

const Today = new Date();

const ModalDetaile = ({
  id,
  setId,
  todoId,
  setTodoItem,
  todoItem,
  errorMessage,
  setErrorMessage,
  putTodoData
}) => {
  return (
    <>
      {id === todoId ? ( // Idが一緒だったらModalを表示する
        <div id="overlay">
          <div id="modalContent">
            <h4 id="content">Todo変更</h4>
            <div id="date">
              完了予定日
              {todoItem.completionDate === null ? (
                <DatePicker
                  id="datePicker"
                  dateFormat="yyyy/MM/dd"
                  minDate={Today}
                  selected={null}
                  onChange={selectedDate => { setTodoItem({ ...todoItem, completionDate: (selectedDate || Today) }) }}
                />
              ) : (
                <DatePicker
                  id="datePicker"
                  dateFormat="yyyy/MM/dd"
                  minDate={Today}
                  selected={todoItem.completionDate}
                  onChange={selectedDate => { setTodoItem({ ...todoItem, completionDate: (selectedDate || Today) }) }}
                />
              )}
            </div>
            <textarea id="textarea"
              value={todoItem.todoText}
              onChange={(e) => {
                if (e.target.value.length > 100) { setErrorMessage("100文字以内に修正してください。") }
                else { setErrorMessage(null) }
                setTodoItem({ ...todoItem, todoText: e.target.value })
              }}
            />
            <br />
            {errorMessage !== null ? <div>{errorMessage}</div> : <br />}
            <button onClick={() => putTodoData(todoId)}>変更</button>
            <button onClick={() => setId(null)}>キャンセル</button>

          </div>
        </div >
      ) : (
        <></>// showFlagがfalseの場合はModalは表示しない
      )}
    </>
  );
};

export default ModalDetaile;