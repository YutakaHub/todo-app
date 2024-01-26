import { useEffect, useState } from 'react';
import './App.css';
import { getTodo, postTodo, delTodo, getTodoTest, putTodo } from './utils/todo'
import React from 'react';
import Card from './components/Card/Card';
import { AiOutlinePlusCircle } from "react-icons/ai"
import "react-datepicker/dist/react-datepicker.css"
import { MdDeleteOutline } from "react-icons/md";
import Modal from './components/Card/Modal';
import { AiOutlineCheckCircle } from "react-icons/ai"
import ModalDetaile from './components/Card/ModalDetaile';

function App() {
  const initialURL = `${process.env.REACT_APP_API_DOMAIN}api/TodoItems`;
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [todoData, setTodoData] = useState();
  const [completionDate, setCompletionDate] = useState(null);
  const [todoText, setTodoText] = useState('');
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [completeDateTime, setCompleteDateTime] = useState(null);
  const [completeFlg, setCompleteFlg] = useState();
  const [id, setId] = useState(null)

  const Today = new Date();

  useEffect(() => {
    getTodoTestData();
  }, [])


  useEffect(() => {
    getTodoData();
  }, [filter])

  const getTodoTestData = async () => {
    let res = await getTodoTest(`${initialURL}/test`);
    console.log(res);
  };

  //データ取得処理
  const getTodoData = async () => {
    console.log(filter);
    setErrorMessage(null);
    let res = await getTodo(`${initialURL}?filter=${filter}`);
    //Todoごとの詳細のデータを取得。
    setLoading(false);

    const status = res.status;
    if (status) {
      setErrorMessage("データが取得できませんでした。");
    } else {
      setTodoData(res)
    }
  };

  //Todo完了登録ボタン
  const checkTodoData = async (e, id) => {
    setCompleteDateTime(new Date());
    setCompleteFlg(true);
    e.stopPropagation();
    console.log(id);
    let res = await putTodo(initialURL, {
      id: id,
      completionDate: completionDate,
      todoText: todoText,
      completeFlg: true,
      completeDateTime: Today,
    });
    console.log(res);
  };


  //新規作成画面表示
  const ShowModal = () => {
    setShowModal(!showModal);
    setTodoText('');
    setCompletionDate(null);
  };

  //Todo変更画面表示
  const selectTodo = (id, todoText, completionDate, completeFlg) => {
    setId(id);
    setTodoText(todoText);
    setCompletionDate(completionDate);
    setCompleteFlg(completeFlg);
  };

  //Todo変更
  const putTodoData = async (todoId) => {
    setErrorMessage(null)
    if (todoText.length <= 100) {
      let res = await putTodo(initialURL, {
        id: todoId,
        completionDate: completionDate,
        todoText: todoText,
        completeFlg: completeFlg,
        completeDateTime: null
      });
      //エラーの場合のみStatusが設定される。
      const status = res.status;
      const id = res.id;
      if (status) {
        console.log(res);
        setErrorMessage("入力内容が正しくありません。");
      } else {
        console.log(id);
        ShowModal();
        setTodoData(todoData.map((todo, id) => {
          if (todo.id === id) {
            return {
              id: todo.id,
              completionDate: completionDate,
              todoText: todoText,
              completeFlg: completeFlg,
              completeDateTime: completeDateTime
            };
          } else {
            return todo;
          }
        }));
      }
    } else {
      setErrorMessage("100文字以内に修正してください。");
      return;
    };
    console.log(id);
    setShowModal(false);
  };

  //データ登録
  const postTodoData = async () => {
    setErrorMessage(null)
    if (todoText.length <= 100) {
      let res = await postTodo(initialURL, {
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
      } else {
        console.log(id);
        ShowModal();
        setTodoData([
          {
            id: id,
            completionDate: completionDate,
            todoText: todoText,
            completeFlg: false
          }, ...todoData
        ]);
      }
    } else {
      setErrorMessage("100文字以内に修正してください。");
      return;
    };
  };

  //データ削除
  const delTodoData = async (e, id) => {
    setErrorMessage(null)
    let res = await delTodo(initialURL, id)
    console.log(res);
    setTodoData(
      todoData.filter(todo =>
        todo.id !== id
      )
    );
    console.log(todoData);
  };

  //フィルター機能
  const selectFilter = (select) => {
    setFilter(select);
  };


  return (
    <div className="App">
      {loading ? (
        <h1>読み込み中・・・</h1>
      ) :
        <>

          <div className='todoPost' onClick={ShowModal}>
            <h5 className='todoPostText'>Todo作成</h5>
            <h1><AiOutlinePlusCircle /></h1>
          </div>
          <Modal
            showFlag={showModal}
            setShowModal={setShowModal}
            id={id}
            setCompletionDate={setCompletionDate}
            completionDate={new Date(completionDate)}
            setTodoText={setTodoText}
            todoText={todoText}
            errorMessage={errorMessage}
            postTodoData={postTodoData}
            putTodoData={putTodoData}
          />

          <select
            value={filter}
            onChange={(e) => selectFilter(e.target.value)}
          >
            <option value="all">なし</option>
            <option value="complete">完了</option>
            <option value="uncomplete">未完了</option>
          </select>

          <div className='todoCardContainer'>
            {
              todoData.map((todo) => {
                return (
                  <>
                    <ModalDetaile
                      id={id}
                      setId={setId}
                      todoId={todo.id}
                      setCompletionDate={setCompletionDate}
                      completionDate={new Date(completionDate)}
                      setTodoText={setTodoText}
                      todoText={todoText}
                      errorMessage={errorMessage}
                      putTodoData={putTodoData}
                    />
                    <div className='card' key={todo.id} onClick={() => selectTodo(todo.id, todo.todoText, todo.completionDate, todo.completeFlg)}>
                      <Card
                        id={todo.id}
                        todo={todo}
                        setShowModal={setShowModal}
                        todoText={todo.todoText}
                        completionDate={todo.completionDate}
                        completeDateTime={todo.completeDateTime}
                        completeFlg={todo.completeFlg}
                      />
                      <div className='checkButton' onClick={(event) => checkTodoData(event, todo.id)}>
                        <AiOutlineCheckCircle />
                      </div>
                      <div className='delButton' onClick={(event) => delTodoData(event, todo.id)}>
                        <MdDeleteOutline />
                      </div>
                    </div>
                  </>
                )
              })}
          </div>
        </>
      }
    </div >
  );
}

export default App;
