import React from 'react'
import './Card.css'
import { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css"

const Card = (props) => {
  const date = new Date(props.completionDate);
  const date2 = new Date(props.completeDateTime);

  return (
    <div>
      <div className='cardText'>{props.todoText}</div>
      <div className='cardDate'>
        {Number(date) ? (
          <div className='date'>完了予定日:  {date.toLocaleDateString('ja-JP')} </div>
        ) : (<div />)}
        {props.completeFlg ? (
          <div className='date'>完了日:  {date2.toLocaleDateString('ja-JP')} </div>
        ) : (<div />)}
      </div>
    </div>
  )
}

export default Card;
