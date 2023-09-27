import React from 'react'

const Post = ({todo}) => {
  const date = new Date(todo.completionDate);
  const date2 = new Date(todo.completeDateTime);
  return (
  <div className='card'>
      <div className='cardText'>{todo.todoText}</div>

      <div className='cardDate'>
        <p className='date'>完了予定日:  {date.toLocaleDateString('ja-JP')} </p>
        <p className='date'>完了日:  {date2.toLocaleDateString('ja-JP')} </p>
      </div>
    </div>
  )
}
export default Post;
