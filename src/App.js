import { useEffect, useLayoutEffect, useState } from 'react';
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
  const [connecting, setConnecting] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [todoData, setTodoData] = useState([{ id: null, todoText: "", completionDate: null, completeFlg: null, completeDateTime: null }]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);
  const [todoItem, setTodoItem] = useState({ id: null, todoText: "", completionDate: null, completeFlg: null, completeDateTime: null });


  useLayoutEffect(() => {
    setErrorMessage("読み込み中です...");
  }, [])

  useEffect(() => {
    getTodoTestData();
    console.log(todoData)
  }, [])


  useEffect(() => {
    getTodoData();
  }, [filter])

  const getTodoTestData = async () => {
    try {
      let res = await getTodoTest(`${initialURL}/test`);
    } catch {
      setConnecting(false);
      setErrorMessage("サーバーとの接続に失敗しました。");
    }
  };

  //データ取得処理
  const getTodoData = async () => {
    setErrorMessage(null);
    let res = await getTodo(`${initialURL}?filter=${filter}`);
    //Todoごとの詳細のデータを取得。
    setLoading(false);

    const status = res.status;
    if (status) {
      setConnecting(false);
      setErrorMessage("データが取得できませんでした。");
    } else {
      let value = res.map((x) => {
        return {
          ...x,
          completionDate: x.completionDate ? new Date(x.completionDate) : null,
          completeDateTime: x.completeDateTime ? new Date(x.completeDateTime) : null
        }
      })
      console.log(value)
      setTodoData(value)
    }
  };


  //Todo完了登録ボタン
  const checkTodoData = async (e, todo) => {
    e.stopPropagation();
    let params = {
      id: todo.id,
      completionDate: todoItem.completionDate,
      todoText: todo.todoText,
      completeFlg: true,
      completeDateTime: new Date(),
    }

    let res = await putTodo(initialURL, params);
    //エラーの場合のみStatusが設定される。
    const status = res.status;
    const id = res.id;
    if (status != 204) {
      console.log(res);
      setErrorMessage("入力内容が正しくありません。");
    } else {
      setTodoData(todoData.map((map) => {
        if (map.id === todo.id) {
          return {
            id: todo.id,
            completionDate: todo.completionDate,
            todoText: todo.todoText,
            completeFlg: true,
            completeDateTime: new Date()
          };
        } else {
          return map;
        }
      }));
    }
  };

  //新規作成画面表示
  const ShowModal = () => {
    setShowModal(!showModal);
    setTodoItem({ id: null, todoText: "", completionDate: null, completeFlg: null, completeDateTime: null })
    setErrorMessage(null);
  };

  //Todo変更画面表示
  const selectTodo = (todo) => {
    setErrorMessage(null);
    setId(todo.id);
    setTodoItem({
      id: todo.id,
      todoText: todo.todoText,
      completionDate: todo.completionDate,
      completeFlg: todo.completeFlg,
      completeDateTime: todo.completeDateTime
    })
  };

  //Todo変更
  const putTodoData = async () => {
    setErrorMessage(null)
    if (todoItem.todoText.length <= 100) {
      let params = {
        id: todoItem.id,
        completionDate: todoItem.completionDate,
        todoText: todoItem.todoText,
        completeFlg: todoItem.completeFlg,
        completeDateTime: todoItem.completeDateTime,
      }
      let res = await putTodo(initialURL, params);
      //エラーの場合のみStatusが設定される。
      const status = res.status;
      const id = res.id;
      if (status != 204) {
        console.log(res);
        setErrorMessage("入力内容が正しくありません。");
      } else {
        setTodoData(todoData.map((todo) => {
          if (todo.id === todoItem.id) {
            return {
              id: todoItem.id,
              completionDate: todoItem.completionDate,
              todoText: todoItem.todoText,
              completeFlg: todoItem.completeFlg,
              completeDateTime: todoItem.completeDateTime
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
    setId(null);;
  };

  //データ登録
  const postTodoData = async () => {
    setErrorMessage(null)
    if (todoItem.todoText.length <= 100) {
      let params = {
        id: 0,
        completionDate: todoItem.completionDate,
        todoText: todoItem.todoText,
        completeFlg: false,
        completeDateTime: null,
      }
      let res = await postTodo(initialURL, params)
      //エラーの場合のみStatusが設定される。
      const status = res.status;
      const id = res.id;
      if (status) {
        setErrorMessage("入力内容が正しくありません。");
      } else {
        ShowModal();
        setTodoData([
          {
            id: id,
            completionDate: todoItem.completionDate,
            todoText: todoItem.todoText,
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
    e.stopPropagation();
    let res = await delTodo(initialURL, id)
    console.log(res);
    setTodoData(
      todoData.filter(todo =>
        todo.id !== id
      )
    );
  };

  //フィルター機能
  const selectFilter = (select) => {
    setFilter(select);
  };


  return (
    <div className="App" lang='ja'>
      {loading == true || connecting == false ? (
        <h1>{errorMessage}</h1>
      ) :
        <>

          <div className='todoPost' onClick={ShowModal}>
            <h5 className='todoPostText'>Todo作成</h5>
            <h1><AiOutlinePlusCircle /></h1>
          </div>
          <Modal
            showFlag={showModal}
            setShowModal={setShowModal}
            todoItem={todoItem}
            setTodoItem={setTodoItem}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            postTodoData={postTodoData}
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
                      setTodoItem={setTodoItem}
                      todoItem={todoItem}
                      errorMessage={errorMessage}
                      setErrorMessage={setErrorMessage}
                      putTodoData={putTodoData}
                    />
                    <div className='card' key={todo.id} onClick={() => selectTodo(todo)}>
                      <Card
                        todo={todo}
                      />
                      {!todo.completeFlg ? (
                        <div className='checkButton' onClick={(event) => checkTodoData(event, todo)}>
                          <AiOutlineCheckCircle />
                        </div>
                      ) : (<></>)}
                      <div className='delButton' onClick={(event) => delTodoData(event, todo.id)}>
                        <MdDeleteOutline />
                      </div>
                    </div>
                  </>
                )
              })}
          </div>
          <br />
        </>
      }
    </div >
  );
}

export default App;
