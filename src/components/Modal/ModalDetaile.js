import React from "react";
import DatePicker from "react-datepicker";
import './Modal.css'

const Today = new Date();

const ModalDetaile = (props) => {
  return (
    <>
      {props.id === props.todoId ? ( // Idが一緒だったらModalを表示する
        <div id="overlay">
          <div id="modalContent">
            <h4 id="content">Todo変更</h4>
            <div id="date">
              完了予定日
              {Number(props.todoItem.completionDate) === 0 ? (
                <DatePicker
                  id="datePicker"
                  dateFormat="yyyy/MM/dd"
                  minDate={Today}
                  selected={null}
                  onChange={selectedDate => { props.setTodoItem({ ...props.todoItem, completionDate: (selectedDate || Today) }) }}
                />
              ) : (
                <DatePicker
                  id="datePicker"
                  dateFormat="yyyy/MM/dd"
                  minDate={Today}
                  selected={new Date(props.todoItem.completionDate)}
                  onChange={selectedDate => { props.setTodoItem({ ...props.todoItem, completionDate: (selectedDate || Today) }) }}
                />
              )}
            </div>
            <textarea id="textarea"
              value={props.todoItem.todoText}
              onChange={(e) => props.setTodoItem({ ...props.todoItem, todoText: e.target.value })}
            />
            <br />
            {props.errorMessage !== null ? <div>{props.errorMessage}</div> : <br />}
            <button onClick={() => props.putTodoData(props.todoId)}>変更</button>
            <button onClick={() => props.setId(null)}>キャンセル</button>

          </div>
        </div >
      ) : (
        <></>// showFlagがfalseの場合はModalは表示しない
      )}
    </>
  );
};

export default ModalDetaile;