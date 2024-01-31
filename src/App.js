import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { getTodo, postTodo, delTodo, getTodoTest, putTodo } from './utils/todo.js'
import React from 'react';
//import Card from './components/Card/Card.js';
import { AiOutlinePlusCircle } from "react-icons/ai"
import "react-datepicker/dist/react-datepicker.css"
import { MdDeleteOutline } from "react-icons/md";
import Modal from './components/Modal/Modal.js';
import { AiOutlineCheckCircle } from "react-icons/ai"
import ModalDetaile from './components/Modal/ModalDetaile.js';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Card from './components/Card/Card.js';

function App() {
  const initialURL = `${process.env.REACT_APP_API_DOMAIN}api/TodoItems`;
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(true);
  const [errorMessage, setErrorMessage] = useState("読み込み中・・・");
  const [todoData, setTodoData] = useState();
  const [completionDate, setCompletionDate] = useState(null);
  const [todoText, setTodoText] = useState('');
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null)
  const [startDragId, setStartDragId] = useState([])
  const [todoItem, setTodoItem] = useState({ id: null, todoText: "", completionDate: null, completeFlg: null, completeDateTime: null, sortKey: null })

  const Today = new Date();

  useEffect(() => {
    getTodoTestData();
  }, [])


  useEffect(() => {
    getTodoData();
  }, [filter])

  const getTodoTestData = async () => {
    try {
      let res = await getTodoTest(`${initialURL}/test`);
      console.log(res);
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
      setTodoData(res)
    }
  };

  //Todo完了登録ボタン
  const checkTodoData = async (e, todo) => {
    e.stopPropagation();
    let res = await putTodo(initialURL, {
      id: todo.id,
      completionDate: new Date(todo.completionDate),
      todoText: todo.todoText,
      completeFlg: true,
      completeDateTime: new Date(),
      sortKey: todo.sortKey
    });
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
    setTodoText('');
    setCompletionDate(null);
  };

  //Todo変更画面表示
  const selectTodo = (todo) => {
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
    if (todoText.length <= 100) {
      let res = await putTodo(initialURL, {
        id: todoItem.id,
        completionDate: new Date(todoItem.completionDate),
        todoText: todoItem.todoText,
        completeFlg: todoItem.completeFlg,
        completeDateTime: todoItem.completeDateTime,
      });
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
    if (todoText.length <= 100) {
      let res = await postTodo(initialURL, {
        id: 0,
        completionDate: completionDate,
        todoText: todoText,
        completeFlg: false,
        completeDateTime: null,
        position: null,
      })
      //エラーの場合のみStatusが設定される。
      const status = res.status;
      if (status) {
        setErrorMessage("入力内容が正しくありません。");
      } else {
        console.log(id);
        ShowModal();
        setTodoData([
          {
            id: res.id,
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
    e.stopPropagation();
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

  //ドロップ時にIDを採番して配列を並び替える。
  const moveTodoItems = async (dragId, hoverId) => {
    let count = 0;
    let nextCount = 0;
    const targetItems = todoData.map((x) => {
      count = nextCount;
      //ドラッグした要素を下の要素にホバーした場合
      if (dragId >= x.id && x.id >= hoverId) {
        nextCount = count + 1;
        if (x.id === dragId) {
          x.id = hoverId;
        } else {
          x.id = dragId - count + 1;
        }
        //ドラッグした要素を上の要素にホバーした場合
      } else if (dragId <= x.id && x.id <= hoverId) {
        nextCount = count + 1;
        if (x.id === dragId) {
          x.id = hoverId;
        } else {
          x.id = dragId - count;
        }
      }
      return x;
    })
    //ソート処理
    const sortItems = targetItems.sort((a, b) => {
      if (a.id > b.id) {
        return -1;
      } else {
        return 1;
      }
    })
    setTodoData(sortItems);
  };

  //ドラッグ開始時にドラッグID保持
  const backupData = (id) => {
    setStartDragId(id);
    console.log(id);
  }

  //ドロップ時にドラッグIDとホバーIDから更新するアイテムを算出。
  const putMoveTodos = async (id) => {
    if (startDragId === id) return;
    const result = todoData.filter((todo) => {
      if (startDragId > id) {//ホバー先が下の要素
        return todo.id >= id && todo.id <= startDragId
      } else {//ホバー先が上の要素
        return todo.id <= id && todo.id >= startDragId
      }
    })
    console.log(result);
    /*
    await result.map((todo) => {
      let res = putTodo(initialURL, {
        id: todo.id,
        completionDate: new Date(todo.completionDate),
        todoText: todo.todoText,
        completeFlg: todo.completeFlg,
        completeDateTime: todo.completeDateTime,
      });
      console.log(res);
  })*/
  }

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

          <div className='todoCardContainer' >
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
                      setCompletionDate={setCompletionDate}
                      completionDate={new Date(completionDate)}
                      setTodoText={setTodoText}
                      todoText={todoText}
                      errorMessage={errorMessage}
                      putTodoData={putTodoData}
                    />
                    <DndProvider backend={HTML5Backend}>
                      <ul className='card' key={todo.id} onClick={() => { selectTodo(todo); setId(todo.id) }}>
                        <Card
                          id={todo.id}
                          todo={todo}
                          setShowModal={setShowModal}
                          todoText={todo.todoText}
                          completionDate={todo.completionDate}
                          completeDateTime={todo.completeDateTime}
                          completeFlg={todo.completeFlg}
                          moveTodoItems={(dragId, hoverId) => moveTodoItems(dragId, hoverId)}
                          putMoveTodos={putMoveTodos}
                          backupData={backupData}
                        />
                        {!todo.completeFlg ? (
                          <div className='checkButton' onClick={(event) => checkTodoData(event, todo)}>
                            <AiOutlineCheckCircle />
                          </div>
                        ) : (<></>)}
                        <div className='delButton' onClick={(event) => delTodoData(event, todo.id)}>
                          <MdDeleteOutline />
                        </div>
                      </ul >
                    </DndProvider>
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
