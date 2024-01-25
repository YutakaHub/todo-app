import React from 'react'
import './Card.css'
import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { putTodo } from '../../utils/todo';
import { AiOutlineCheckCircle } from "react-icons/ai"

const Card = ({todo}) => {
  const initialURL = "http://localhost:5273/api/TodoItems";
  const Today = new Date();
  const date = new Date(todo.completionDate);
  const date2 = new Date(todo.completeDateTime);
  const [isEditing, setIsEditing] = useState(false);
  const [completionDate, setCompletionDate] = useState(date);
  const [completeDateTime, setCompleteDateTime] = useState(date2);
  const [completeFlg, setCompleteFlg] = useState(todo.completeFlg);
  const [todoText, setTodoText] = useState(todo.todoText);

  const putTodoData = async () => {
    console.log(todo.id);
     let res = await putTodo(initialURL,{
      id: todo.id,
      completionDate: completionDate,
      todoText: todoText,
      completeFlg: completeFlg,
      completeDateTime: null
     });
    console.log(res);
    handleTodoEdit();
  };

  const checkTodoData = async (e) => {
    setCompleteDateTime(new Date())
    setCompleteFlg(true)
    e.stopPropagation();
    console.log(todo.id);
     let res = await putTodo(initialURL,{
      id: todo.id,
      completionDate: completionDate,
      todoText: todoText,
      completeFlg: true,
      completeDateTime: Today,
     });
    console.log(res);
  };

  //編集モード
  const handleTodoEdit = () => {
    setIsEditing(!isEditing);
  };


  return (
    <>
    {!isEditing? (
      <div onClick={() => setIsEditing(true)}>
          <div className='cardText'>{todoText}</div>
          <div className='cardDate'>
            {completionDate!=null? (
              <div className='date'>完了予定日:  {completionDate.toLocaleDateString('ja-JP')} </div>
            ):(
              <></>
            )}
            {completeFlg? (
              <div className='date'>完了日:  {completeDateTime.toLocaleDateString('ja-JP')} </div>
            ):(
              <></>
            )}

          </div>
          {!completeFlg? (
          <div className='checkButton' onClick={(event)=>checkTodoData(event)}>
            <AiOutlineCheckCircle />
          </div>):(<></>)}


      </div>
  ):(
    <div>
      <div className='cardDate'>
        <textarea className='cardText'
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
        <div>
          完了予定日
          <DatePicker
           dateFormat="yyyy/MM/dd"
           selected={completionDate}
           minDate={Today}
            onChange={selectedDate => {setCompletionDate(selectedDate || date)}}
          />
        </div   >
        </div>
      <button onClick={putTodoData}>変更</button>
      <button onClick={handleTodoEdit}>キャンセル</button>
    </div>
  )}

  </>
  )
}

export default Card;
