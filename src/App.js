import { useEffect, useState } from 'react';
import './App.css';
import {getTodo,postTodo,delTodo} from './utils/todo'
import React from 'react';
import Card from './components/Card/Card';
import Post from './components/Cors/PostTodo';
import { AiOutlinePlusCircle } from "react-icons/ai"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { MdDeleteOutline } from "react-icons/md";

function App() {
  const initialURL = "http://localhost:5273/api/TodoItems";
  const Today = new Date();
  const initialData = {
    completionDate: Today,
    todoText: null,
    completeDateTime: null,
    completeFlg: false,
  }

  const [loading, setLoading] = useState(true);
  const [todoData, setTodoData] = useState();
  const [completionDate, setCompletionDate] = useState(null);
  const [todoText, setTodoText] = useState('');
  const [createMode, setCreateMode] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const getTodoData = async() => {
      //全てのtodoリストを取得
      let res = await getTodo(initialURL);
      //Todoごとの詳細のデータを取得。
      setLoading(false);

      switch (filter) {
        case "complete":
        setTodoData(
          res.filter((todo) => {return todo.completeFlg})
        );
        console.log(res);
        break;
        case "incomplete":
        setTodoData(
          res.filter((todo) => {return !todo.completeFlg})
        );
        console.log(todoData);
          break;
        default:
          setTodoData(res);

      }

    };
    getTodoData();
  },[filter])

  //作成モード
  const handleTodoCreate = () => {
    setCreateMode(!createMode);
    setTodoText('');
    setCompletionDate(null);
  };

  const postTodoData = async() => {
    let res = await postTodo(initialURL,{
      id: 0,
      completionDate: completionDate,
      todoText: todoText,
      completeFlg: false,
      completeDateTime: null,
    });
    console.log(res);
    handleTodoCreate();
    //TODO： エラーの場合は追加しないように変更する必要あり。
    setTodoData([
      ...todoData,{
        completionDate: completionDate,
        todoText: todoText,
        completeFlg: false
      }
    ])
  };

  const delTodoData = async (e,id) => {
    let res = await delTodo(initialURL,id)
    console.log(res);
    setTodoData(
      todoData.filter(todo =>
        todo.id !== id
      )
    );
    console.log(todoData);
  };

  const selectFilter= (select) => {
setFilter(select);
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
          <DatePicker
           dateFormat="yyyy/MM/dd"
           minDate={Today}
           selected={completionDate}
            onChange={selectedDate => {setCompletionDate(selectedDate || Today)}}
          />
          完了予定日
        </div>
        <textarea
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
        <button onClick={postTodoData}>作成</button>
        <button onClick={handleTodoCreate}>キャンセル</button>
      </div>
     )
    }

<select
value={filter}
onChange={(e) => selectFilter(e.target.value)}
>
  <option value="all">なし</option>
  <option value="complete">完了</option>
  <option value="incomplete">未完了</option>
</select>

        <div className='todoCardContainer'>

          {
          todoData.map((todo) => {
            return (
            <div className='card' key={todo.id}>
              <Card key={todo.id} todo={todo}/>
              <div className='delButton' onClick={(event)=>delTodoData(event,todo.id)}>
                <MdDeleteOutline />
              </div>
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
