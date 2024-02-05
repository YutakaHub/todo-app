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
            <div id="date">
              完了予定日
              {Number(props.completionDate) === 0 ? (
                <DatePicker
                  wrapperClassName="datePicker"
                  dateFormat="yyyy/MM/dd"
                  minDate={Today}
                  selected={null}
                  onChange={selectedDate => { props.setCompletionDate(selectedDate || Today) }}
                />
              ) : (
                <DatePicker
                  wrapperClassName="datePicker"
                  dateFormat="yyyy/MM/dd"
                  minDate={Today}
                  selected={props.completionDate}
                  onChange={selectedDate => { props.setCompletionDate(selectedDate || Today) }}
                />
              )}
            </div>
            <textarea id="textarea"
              value={props.todoText}
              onChange={(e) => {
                if (e.target.value.length > 100) { props.setErrorMessage("100文字以内に修正してください。") }
                else { props.setErrorMessage(null) }
                props.setTodoText(e.target.value)
              }}
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