import React from 'react'
import './Card.css'
import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { putTodo } from '../../utils/todo';

const Card = ({todo}) => {
  const initialURL = "http://localhost:5273/api/TodoItems";
  const date = new Date(todo.completionDate);
  const [isEditing, setIsEditing] = useState(false);
  const [todoData, setTodoData] = useState(todo);
  const [completionDate, setCompletionDate] = useState(date);
  const [completeFlg, setCompleteFlg] = useState(todo.completeFlg);
  const [todoText, setTodoText] = useState(todo.todoText);

  const putTodoData = async () => {
    setTodoData({
      ...todoData,
      todoText:todoText,
      completionDate:completionDate
    })
    let res = await putTodo(initialURL,todoData);
    setIsEditing(false)
  };


  return (
    <>
    {!isEditing? (
      <div className='card' onClick={() => setIsEditing(true)}>
          <div className='cardText'>{todoText}</div>
          <div className='cardDate'>
            {completionDate!=null? (
              <p className='date'>完了予定日:  {completionDate.toLocaleDateString('ja-JP')} </p>
            ):(
              <></>
            )}
          </div>
      </div>
  ):(
    <div className='card'>
      <div className='cardDate'>
        <textarea className='cardText'
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
        <p>
          完了予定日
          <DatePicker
           dateFormat="yyyy/MM/dd"
           selected={completionDate}
            onChange={selectedDate => {setCompletionDate(selectedDate || date)}}
          />
        </p>
        </div>
      <button onClick={putTodoData}>変更</button>
    </div>
  )}
  </>
  )
}

export default Card;
