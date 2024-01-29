import React from "react";
import DatePicker from "react-datepicker";

const Today = new Date();

const ModalDetaile = (props) => {
  return (
    <>
      {props.id === props.todoId ? ( // Idが一緒だったらModalを表示する
        <div id="overlay" style={overlay}>
          <div id="modalContent" style={modalContent}>
            <h4 style={content}>Todo変更</h4>
            <div style={datePicker}>
              完了予定日
              {Number(props.todoItem.completionDate) === 0 ? (
                <DatePicker
                  dateFormat="yyyy/MM/dd"
                  minDate={Today}
                  selected={null}
                  onChange={selectedDate => { props.setTodoItem({ ...props.todoItem, completionDate: (selectedDate || Today) }) }}
                />
              ) : (
                <DatePicker
                  dateFormat="yyyy/MM/dd"
                  minDate={Today}
                  selected={new Date(props.todoItem.completionDate)}
                  onChange={selectedDate => { props.setTodoItem({ ...props.todoItem, completionDate: (selectedDate || Today) }) }}
                />
              )}
            </div>
            <textarea style={textarea}
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
const content = {
  margin: 0,
  paddind: 0,
  textAlign: "left",
}
const datePicker = {
  textAlign: "left",
  paddind: 10,
  margin: 10,
}

const textarea = {
  background: "white",
  width: "50vh",
  height: "30vh",
  resize: "none",
  marginLeft: 0,
}

const modalContent = {
  backgroundColor: "rgb(215, 242, 255)",
  padding: "10px",
  borderRadius: "3px",
  zIndex: 1,
  width: "55vh",
  height: "44vh",
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
};

export default ModalDetaile;