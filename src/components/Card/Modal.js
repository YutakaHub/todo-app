import React from "react";
import DatePicker from "react-datepicker";
import './Modal.css'

const Today = new Date();
const completionDate = null;

const Modal = (props) => {
  return (
    <>
      {props.showFlag ? ( // showFlagがtrueだったらModalを表示する
        <div id="overlay">
          <div id="modalContent">
            <h4 id="content">Todo新規作成</h4>
            <div id="datePicker">
              完了予定日
              {Number(props.completionDate) === 0 ? (
                <DatePicker
                  dateFormat="yyyy/MM/dd"
                  minDate={Today}
                  selected={null}
                  onChange={selectedDate => { props.setCompletionDate(selectedDate || Today) }}
                />
              ) : (
                <DatePicker
                  dateFormat="yyyy/MM/dd"
                  minDate={Today}
                  selected={props.completionDate}
                  onChange={selectedDate => { props.setCompletionDate(selectedDate || Today) }}
                />
              )}
            </div>
            <textarea id="textarea"
              value={props.todoText}
              onChange={(e) => props.setTodoText(e.target.value)}
            />
            <br />
            {props.errorMessage !== null ? <div>{props.errorMessage}</div> : <br />}
            <button onClick={() => props.postTodoData()}>登録</button>
            <button onClick={() => props.setShowModal(false)}>キャンセル</button>
          </div>
        </div >
      ) : (
        <></>// showFlagがfalseの場合はModalは表示しない
      )}
    </>
  );
};

export default Modal;