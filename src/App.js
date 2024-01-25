import { useEffect, useState} from 'react';
import './App.css';
import {getTodo,postTodo,delTodo,getTodoTest} from './utils/todo'
import React from 'react';
import Card from './components/Card/Card';
import { AiOutlinePlusCircle } from "react-icons/ai"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { MdDeleteOutline } from "react-icons/md";

function App() {
  const initialURL = `${process.env.REACT_APP_API_DOMAIN}api/TodoItems`;
  const Today = new Date();

  const [loading, setLoading] = useState(true);
  const [errorMessage,setErrorMessage] = useState(null);
  const [todoData, setTodoData] = useState();
  const [completionDate, setCompletionDate] = useState(null);
  const [todoText, setTodoText] = useState('');
  const [createMode, setCreateMode] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getTodoTestData();
    },[])
  
    
    useEffect(() => {
  getTodoData();
  },[filter])

  const getTodoTestData = async() => {
    let res = await getTodoTest(`${initialURL}/test`);  
    console.log(res);
  };
  
  const getTodoData = async() => {
    console.log(filter);  
    setErrorMessage(null);
    let res = await getTodo(`${initialURL}?filter=${filter}`);  
    //Todoごとの詳細のデータを取得。
    setLoading(false);

    const status = res.status;
    if (status) {
      setErrorMessage("データが取得できませんでした。");
    }else{
      setTodoData(res)
    }
  };

  //作成モード
  const handleTodoCreate = () => {
    setCreateMode(!createMode);
    setTodoText('');
    setCompletionDate(null);
  };

  const postTodoData = async() => {
    setErrorMessage(null)
    if(todoText.length<=100){
    let res = await postTodo(initialURL,{
      id: 0,
      completionDate: completionDate,
      todoText: todoText,
      completeFlg: false,
      completeDateTime: null,
    })
    //エラーの場合のみStatusが設定される。
    const status = res.status;
    const id = res.id;
    if (status) {
      setErrorMessage("入力内容が正しくありません。");
    }else{
      console.log(id);
      handleTodoCreate();
      setTodoData([
        ...todoData,{
          id:id,
          completionDate: completionDate,
          todoText: todoText,
          completeFlg: false
        }
      ]);
    }
  }else{
      setErrorMessage("100文字以内に修正してください。");
      return;
    };
  };

  const delTodoData = async (e,id) => {
    setErrorMessage(null)
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
  <option value="uncomplete">未完了</option>
</select>

{errorMessage !== null ? <div>{errorMessage}</div>:<></>}

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
