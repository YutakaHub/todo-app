export const getTodo = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
    .then((res) => res.json())
    .then((data) => resolve(data));
  })

}
export const postTodo = (url,data) => {
  return new Promise((resolve, reject) => {
    fetch(url,{
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

export const putTodo = (url,data) => {
  return new Promise((resolve, reject) => {
    fetch(url,{
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