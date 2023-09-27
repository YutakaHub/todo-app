import { useEffect, useState } from 'react';
import './App.css';
import {getTodo,postTodo} from './utils/todo'
import React from 'react';
import Card from './components/Card/Card';
import Post from './components/Cors/PostTodo';
import { AiOutlinePlusCircle } from "react-icons/ai"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

function App() {
  const initialURL = "http://localhost:5273/api/TodoItems";
  const Today = new Date();
  const initialData = {
    completionDate: Today,
    todoText: ' ',
    completeDateTime: null,
    completeFlg: false,
  }

  const [loading, setLoading] = useState(true);
  const [todoData, setTodoData] = useState();
  const [completionDate, setCompletionDate] = useState(null);
  const [todoText, setTodoText] = useState('');
  const [createMode, setCreateMode] = useState(true);
  const [newTodoData, setNewTodoData] = useState({initialData});

  useEffect(() => {
    const getTodoData = async() => {
      //全てのtodoリストを取得
      let res = await getTodo(initialURL);
      //Todoごとの詳細のデータを取得。
      //loadTodo(res);
      setTodoData(res);
      setLoading(false);
    };
    getTodoData();
  },[])

  //作成モード
  const handleTodoCreate = () => {
    setCreateMode(!createMode);
  };

  const postTodoData = async() => {
    let res = await postTodo(initialURL,{
      id: 0,
      completionDate: completionDate,
      todoText: todoText,
      completeFlg: false
    });
    console.log(res);
    handleTodoCreate();
    //TODO： エラーの場合は追加しない。
    setTodoData([
      ...todoData,{
        completionDate: completionDate,
        todoText: todoText,
        completeFlg: false
      }
    ])
    setNewTodoData(initialData)
  };

  return (
    <div className="App">
      {loading ? (
        <h1>読み込み中・・・</h1>
      ):
      <>
    {createMode ? (
      <div className='todoPost' onClick={handleTodoCreate}>
        <h5 className='todoPostText'>Todo作成</h5>
        <h1><AiOutlinePlusCircle /></h1>
      </div>
     ):(
      <div className='todoEdit'>
        <div>
          完了予定日
          <DatePicker
           dateFormat="yyyy/MM/dd"
           selected={completionDate}
            onChange={selectedDate => {setCompletionDate(selectedDate || Today)}}
          />
        </div>
        <textarea
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
        <button onClick={postTodoData}>作成</button>
      </div>
     )
    }
        <div className='todoCardContainer'>
          {todoData.map((todo, i) => {
            return (
            <div>
              <Card key={i} todo={todo}/>
            </div>
            )
          })}
        </div>
      </>
    }
    </div>
  );
}

export default App;
