import React, { useRef } from 'react'
import './Card.css'
import "react-datepicker/dist/react-datepicker.css"
import { useDrag, useDrop } from 'react-dnd';

const CardDnd = ({ id, todoText, completionDate, completeDateTime, completeFlg, moveTodoItems, putMoveTodos, backupData }) => {
  const date = new Date(completionDate);
  const date2 = new Date(completeDateTime);
  const ref = useRef(null);

  const [{ isDragging, canDrag }, drag] = useDrag({
    type: 'item',
    item: { id },//, todoText, completionDate, completeFlg, completeDateTime },
    isDragging: monitor => monitor.getItem().id === id,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      canDrag: monitor.canDrag(),
    })
  })
  const [, drop] = useDrop({
    accept: 'item',
    hover: (item, monitor) => {
      const dragId = item.id
      const hoverId = id
      if (dragId === hoverId) return;
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      if (hoverBoundingRect === undefined) return;
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const getClientOffset = monitor.getClientOffset()?.y
      if (getClientOffset === undefined) return;
      const hoverActualY = getClientOffset - hoverBoundingRect.top

      if (dragId < hoverId && hoverActualY < hoverMiddleY) return
      if (dragId > hoverId && hoverActualY > hoverMiddleY) return

      moveTodoItems(dragId, hoverId)
      item.id = hoverId
    },
    drop: () => putMoveTodos(id),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  })
  drag(drop(ref))

  return (
    <div ref={ref}
      style={{
        opacity: isDragging ? 0.4 : 1,
        cursor: canDrag ? 'move' : 'default',
      }}
      onDragStart={() => backupData(id)}
    >
      {!isDragging && (
        <div className='cardText'>{todoText}{isDragging}</div>
      )}
      {isDragging && (
        <div className='cardText'>{todoText}{isDragging && '😱'}</div>
      )}
      <div className='cardDate'>
        {Number(date) ? (
          <div className='date'>完了予定日:  {date.toLocaleDateString('ja-JP')} </div>
        ) : (<div />)}
        {completeFlg ? (
          <div className='date'>完了日:  {date2.toLocaleDateString('ja-JP')} </div>
        ) : (<div />)}
      </div>
    </div>
  )
}

export default CardDnd;
