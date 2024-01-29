export const getTodoTest = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => resolve(res))
      .catch((res) => {
        console.log(res);
        reject(res);
      })
  })
}
export const getTodo = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => resolve(data));
  })
}

export const postTodo = (url, data) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => resolve(data));
  })
}

export const putTodo = (url, data) => {
  console.log(data)
  return new Promise((resolve, reject) => {
    fetch(url + '/' + data.id, {
      method: "PUT",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(resolve)
  })
}


export const delTodo = (url, id) => {
  return new Promise((resolve, reject) => {
    fetch(url + '/' + id, {
      method: "DELETE",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(resolve)
  })
}