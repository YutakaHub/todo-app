import React from 'react'
import './Card.css'
import "react-datepicker/dist/react-datepicker.css"
import dayjs from 'dayjs'

const Card = ({ todo }) => {


  return (
    <div>
      <div className='cardText'>{todo.todoText}</div>
      <div className='cardDate'>
        {todo.completionDate ? (
          <div className='date'>完了予定日:  {dayjs(todo.completionDate).locale('ja').format('YYYY-MM-DD')} </div>
        ) : (<div className='date'>完了予定日:  未設定 </div>)}
        {todo.completeFlg ? (
          <div className='date'>完了日:  {dayjs(todo.completeDateTime).locale('ja').format('YYYY-MM-DD')} </div>
        ) : (<div className='date'>完了日:  未完了</div>)}
      </div>
    </div>
  )
}

export default Card;
