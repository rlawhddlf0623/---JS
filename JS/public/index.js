const TodoForm = document.querySelector("#login-form");
const TodoInput = TodoForm.querySelector(".Todo-input");
const CreateButton = TodoForm.querySelector("#Todo-create-button");
const RemoveButton = document.querySelector(".Todo-remove-button");
const Todo_List = document.querySelector(".Todo-List");
const Todo_CheckBox = document.querySelectorAll(".Todo-CheckBox");
const Todo_container = document.querySelector(".Todo-container");
const Todo_done_container = document.querySelector(".Todo-done-container");
const Todo_date = document.querySelector(".Todo-date");
const LocalStorageClear = document.querySelector("#LocalStorageClear");
const current_month = document.querySelector(".current-month");

const Week = document.querySelector(".Week");

const FirstWeek = document.querySelector(".FirstWeek");
const SecondWeek = document.querySelector(".SecondWeek");
const ThirdWeek = document.querySelector(".ThirdWeek");
const FourthWeek = document.querySelector(".FourthWeek");
const FifthWeek = document.querySelector(".FifthWeek");

const TODOS_KEY = "todos";
const INDEX_KEY = "index";

async function updateTodo() {
  const todoId = document.getElementById("1").getAttribute("data-value");
  const newTodoText = document.getElementById("todo").value;

  if (!newTodoText) {
    alert("Todo text cannot be empty.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/todos/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo: newTodoText }),
    });

    if (response.ok) {
      const updatedTodo = await response.json();
      console.log("Success:", updatedTodo);
    } else {
      throw new Error("Failed to update todo.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// 현재 날짜 출력
function getClock() {
  const date = new Date();
  const month = date.getMonth(); // 월은 0부터 시작하므로 실제 월보다 1 작은 값이 반환됩니다.
  const day = date.getDate();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = days[date.getDay()];

  return { month, day, dayOfWeek };
}
function yearMonth() {
  const { month, day, dayOfWeek } = getClock();
  const todayDate = `${month + 1}/${day}(${dayOfWeek})`;
  Todo_date.innerText = todayDate;
  return todayDate;
}
yearMonth();
function Month() {
  const { month } = getClock();
  const todayDate = `${month + 1}월`;
  current_month.innerText = todayDate;
  return todayDate;
}
Month();

// input 유효성검사(공백)
function inputCheck() {
  const todoInput = TodoInput.value;
  if (todoInput == "") {
    alert("공백");
  } else if (todoInput.length > 21) {
    alert("15글자 까지 입력가능합니다.");
  }
}
TodoForm.addEventListener("submit", inputCheck);

// todo localStorage에 저장(처음 저장시에 + local초기화시 )

function saveIndex(todoIndex) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(todoIndex));
}

// localStorage에서 기존 toDos 배열을 검색합니다.
const storedToDos = localStorage.getItem(TODOS_KEY);
let toDos = storedToDos ? JSON.parse(storedToDos) : []; // 데이터를 찾지 못하면 빈 배열로 초기화합니다.

// localStorage에 todos 값이 있으면 출력하기
const saveToDo = localStorage.getItem(TODOS_KEY);
if (saveToDo) {
  const paresdToDos = JSON.parse(saveToDo);
  paresdToDos.forEach(createToDo);
}

// 페이지 로드 시 로컬 저장소에서 input이 focus되었는지 확인하는값 불러오기
let inputfocus = localStorage.getItem("inputFocus");
if (inputfocus === null) {
  inputfocus = 0; // 값이 저장되어 있지 않으면 기본값 0으로 설정
}
//local에 초기값 세팅
TodoInput.addEventListener("focus", function () {
  if (inputfocus == 0) {
    inputfocus++;
    localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
    localStorage.setItem("inputFocus", inputfocus);
    localStorage.setItem(INDEX_KEY, JSON.stringify([0]));
  }
});

// todo 생성
function createToDo(newTodoObj) {
  if (!newTodoObj || !newTodoObj.id) {
    console.error("Invalid todo object:", newTodoObj);
    return;
  }
  let newTodo = `
                      <div class="Todo-box" style="order: ${newTodoObj.id};">
                          <div class="Todo-container" id="${newTodoObj.id}" data-value="${newTodoObj._id}">
                              <div class="Todo-CheckBox down"></div>
                              <h6 class="Todo-text">${newTodoObj.todo}</h6>
                              <span class="Todo-important-button">☆</span>
                              <span class="Todo-remove-button">X</span>
                          </div>
                          <h6 type="text" class="input" > </h6>   
                      </div>
                     
                          `;
  Todo_List.innerHTML += newTodo;
  TodoInput.value = "";
}
//  <input type="text" class="TodoUpdate">
// submit되면 객체만들어서 배열에 저장 + 화면출력
TodoForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const todoInput = TodoInput.value;
  const TodoIndex = JSON.parse(localStorage.getItem(INDEX_KEY));

  TodoIndex[0] = TodoIndex[0] + 1;

  const newTodoObj = {
    todo: todoInput,
    id: TodoIndex[0],
  };

  saveIndex(TodoIndex);
  postData(newTodoObj);
});

// 서버에 데이터 전송
function postData(newTodoObj) {
  console.log(newTodoObj);
  fetch("http://localhost:3000/register", {
    method: "POST",
    body: JSON.stringify(newTodoObj),
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json(); // JSON 응답을 처리
    })
    .then((data) => {
      // 서버에서 반환된 JSON 데이터 처리
      toDos.push(data);
      localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
      console.log("Data saved to localStorage and DB successfully", data);
      createToDo(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// 데이터 불러오기 함수
async function loadDataFromDB() {
  try {
    const response = await fetch("http://localhost:3000/getData");

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("data", JSON.stringify(data));
      console.log("Data loaded from DB and saved to localStorage");
    } else {
      throw new Error("Failed to load data from DB");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// todo 제거
Todo_List.addEventListener("click", TodoRemoveButton);
function TodoRemoveButton(e) {
  if (e.target.classList.contains("Todo-remove-button")) {
    const todoContainer = e.target.closest(".Todo-container");
    if (todoContainer) {
      //화면
      todoContainer.remove();

      // localStorage
      let toDosGet = JSON.parse(localStorage.getItem(TODOS_KEY));
      toDos = toDosGet.filter((toDo) => toDo.id !== todoContainer.id);
      localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));

      // DB
      const todoId = todoContainer.dataset.value;
      DeleteData(todoId);
    }
  }
}

async function DeleteData(todoId) {
  try {
    const response = await fetch(`/register/${todoId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log(`Todo with ID ${todoId} deleted successfully.`);
    } else {
      throw new Error("Failed to delete todo.");
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

// 버블링 사용
// todo클릭시 변화 (줄그어지기 + 색변화 + 아래로 이동 )
// Todo_List.addEventListener("click", function (e) {
//   console.log("아래로 이동");
//   // 클릭된 요소에 가장 가까운 Todo-container 요소를 찾음
//   const targetTodo = e.target.closest(".Todo-container");

//   if (e.target.classList.contains("Todo-CheckBox")) {
//     const todoText = targetTodo.querySelector(".Todo-text");

//     //아래로 이동
//     const UserText = todoText.textContent;
//     // 새로운 요소생성
//     const newTodo = document.createElement("div");

//     const TodoIndex = JSON.parse(localStorage.getItem(INDEX_KEY));

//     newTodo.classList.add("Todo-container");
//     newTodo.style.order = `${TodoIndex[0]}`;

//     newTodo.innerHTML = `
//                             <div class="Todo-CheckBox"></div>
//                             <h6 class="Todo-text">${UserText}</h6>
//                             <span class="Todo-important-button">☆</span>
//                             <span class="Todo-remove-button">X</span>
//                         `;
//     // newTodo안에 요소 찾아서 변수에 넣기
//     const newTodoText = newTodo.querySelector(".Todo-text");
//     const newTodoCheck = newTodo.querySelector(".Todo-CheckBox");
//     // 줄 그어지기
//     newTodoText.classList.add("line-through");
//     // 색변화
//     newTodoCheck.classList.add("Todo-CheckBox-color");
//     //이동
//     // Todo_done_container.appendChild(newTodo);
//     // class추가

//     Todo_List.appendChild(newTodo);

//     //기존 요소제거
//     targetTodo.remove();
//   }
// });

// // todoDone의 checkbox클릭시 다시 위로 이동
// Todo_List.addEventListener("click", function (e) {
//   console.log("위로 이동");
//   // 클릭된 요소에 가장 가까운 Todo-container 요소를 찾음
//   const targetTodo = e.target.closest(".Todo-container");

//   if (e.target.classList.contains("Todo-CheckBox")) {
//     const todoText = targetTodo.querySelector(".Todo-text");

//     const UserText = todoText.textContent;
//     // 새로운 요소생성
//     const newTodo = document.createElement("div");
//     newTodo.classList.add("Todo-container");
//     const TodoIndex = JSON.parse(localStorage.getItem(INDEX_KEY));

//     newTodo.style.order = `${50 - TodoIndex[0]}`;
//     newTodo.innerHTML = `
//                              <div class="Todo-CheckBox"></div>
//                              <h6 class="Todo-text">${UserText}</h6>
//                              <span class="Todo-important-button">☆</span>
//                              <span class="Todo-remove-button">X</span>
//                          `;
//     // 클래스 추가
//     const newTodoText = newTodo.querySelector(".Todo-text");
//     const newTodoCheck = newTodo.querySelector(".Todo-CheckBox");
//     // 줄 그어지기
//     newTodoText.classList.remove("line-through");
//     // 색변화
//     newTodoCheck.classList.remove("Todo-CheckBox-color");
//     //이동
//     Todo_List.appendChild(newTodo);
//     //기존 요소제거
//     // newTodo.remove();
//     targetTodo.remove();
//   }
// });

function handleTodoToggle(e) {
  const targetTodo = e.target.closest(".Todo-container");
  const newTodoObjId = targetTodo.id;
  const todoText = targetTodo.querySelector(".Todo-text");
  const UserText = todoText.textContent;
  if (!targetTodo) {
    console.error("Target Todo not found");
    return;
  }
  if (!newTodoObjId) {
    console.error("Target Todo has no valid ID");
    return;
  }
  if (!UserText) {
    console.error("No valid text content found in Todo-text");
    return;
  }
  if (e.target.classList.contains("Todo-CheckBox")) {
    console.log("targetTodo.id", newTodoObjId);
    console.log("e.target", e.target);

    const newTodo = document.createElement("div");
    newTodo.classList.add("Todo-box");
    newTodo.style.order = e.target.classList.contains("down")
      ? 1000 - newTodoObjId
      : newTodoObjId;

    newTodo.innerHTML = `
                          <div class="Todo-container" id="${newTodoObjId}">
                              <div class="Todo-CheckBox"></div>
                              <h6 class="Todo-text">${UserText}</h6>
                              <span class="Todo-important-button">☆</span>
                              <span class="Todo-remove-button">X</span>
                          </div>
                          <h6 type="text" class="input" > </h6>
      `;

    const newTodoText = newTodo.querySelector(".Todo-text");
    const newTodoCheck = newTodo.querySelector(".Todo-CheckBox");
    if (e.target.classList.contains("down")) {
      console.log("아래로 이동");
      newTodoText.classList.add("line-through");
      newTodoCheck.classList.add("Todo-CheckBox-color");
      newTodoCheck.classList.remove("down");
    } else {
      console.log("위로 이동");
      newTodoText.classList.remove("line-through");
      newTodoCheck.classList.remove("Todo-CheckBox-color");
      newTodoCheck.classList.add("down");
    }
    Todo_List.appendChild(newTodo);

    e.target.remove();
    // 부모 요소 제거

    // targetTodo.parentNode.remove();
    const parentTodoBox = targetTodo.closest(".Todo-box");
    parentTodoBox.remove();
  }
}
Todo_List.addEventListener("click", handleTodoToggle);

// todo update
function toggle(e) {
  console.log("toggle");
  console.log(e.target);
  const TodoContainer = e.target.closest(".Todo-container");
  // console.log(TodoContainer);

  if (!TodoContainer) return;
  const todoText = TodoContainer.querySelector(".Todo-text");
  console.log(todoText);
  console.log(e.target);

  if (todoText && e.target == todoText) {
    const h6 = TodoContainer.nextElementSibling;
    // console.log(h6);
    h6.className = "hidden-input";

    // Toggle
    if (h6.classList.contains("hidden-input")) {
      h6.classList.remove("hidden-input");
      h6.classList.add("visible-input");
      setTimeout(() => executeAfterDelay(h6, todoText, e), 500);
      console.log("toggle down");
    } else {
      h6.classList.remove("visible-input");
      h6.classList.add("hidden-input");
      console.log("toggle up");
    }
  }
}
Todo_List.addEventListener("click", toggle);

function executeAfterDelay(h6, todoText, e) {
  // console.log("<h6>생성해서 input형제요소로 넣기");
  const rect = h6.getBoundingClientRect();
  const parentRect = h6.parentNode.getBoundingClientRect();

  //  input생성
  const input = document.createElement("input");
  input.type = "text";
  input.value = todoText.textContent;
  input.className = "input-style";

  // input 을 h6 위치에 놓기
  input.style.position = "absolute";
  input.style.top = `${rect.top - parentRect.top}px`;
  input.style.left = `${rect.left - parentRect.left}px`;
  input.style.height = `${rect.height}px`;
  // input.style.width = `${rect.width}px`;
  // h6 요소를 숨기고 그 자리에 input 요소 삽입
  h6.parentNode.appendChild(input);
  // h6.style.opacity = "0";
  // h6.style.height = "0";
  // h6.style.display = "none";

  input.focus();
  setupEventListeners(input, todoText, h6);
  // let click = "click";
  // let blur = "blur";
  // let change = "change";
  // todoText.addEventListener(
  //   "click",
  //   () => {
  //     if (!isUpdating) {
  //       handleUpdate("click", input, todoText, h6);
  //     }
  //   },
  //   { once: true }
  // );

  // input.addEventListener(
  //   "blur",
  //   () => {
  //     if (!isUpdating) {
  //       handleUpdate("blur", input, todoText, h6);
  //     }
  //   },
  //   { once: true }
  // );

  // input.addEventListener(
  //   "change",
  //   () => {
  //     if (!isUpdating) {
  //       handleUpdate("change", input, todoText, h6);
  //     }
  //   },
  //   { once: true }
  // );

  // input.addEventListener(
  //   "keydown",
  //   (event) => {
  //     if (event.key === "Enter" && !isUpdating) {
  //       input.blur();
  //     }
  //   },
  //   { once: true }
  // );
}

function setupEventListeners(input, todoText, h6) {
  const handleBlur = () => {
    handleUpdate("blur", input, todoText, h6);
    // blur가 발생하면 click 이벤트 리스너를 제거
    Todo_List.removeEventListener("click", toggle);
    setTimeout(() => {
      Todo_List.addEventListener("click", toggle);
    }, 100);
  };

  const handleClick = () => {
    handleUpdate("click", input, todoText, h6);
    // click이 발생하면 blur 이벤트 리스너를 제거
    input.removeEventListener("blur", handleBlur);
  };

  const handleChange = () => {
    handleUpdate("change", input, todoText, h6);
  };

  // 이벤트 리스너 등록
  todoText.addEventListener("click", handleClick, { once: true });
  input.addEventListener("blur", handleBlur, { once: true });
  input.addEventListener("change", handleChange, { once: true });

  input.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Enter") {
        input.blur();
      }
    },
    { once: true }
  );
}

let isUpdating = false;
function handleUpdate(click, input, todoText, h6) {
  console.log("input제거 h6올리기");

  if (isUpdating) return; // 중복 호출 방지
  isUpdating = true;
  console.log(click);
  // 입력 필드의 값을 todoText에 설정
  todoText.textContent = input.value;
  input.remove();

  h6.classList.remove("visible-input");
  h6.classList.add("hidden-input");
  // if (h6.classList.contains("hidden-input")) {
  //   h6.classList.remove("hidden-input");
  //   h6.classList.add("visible-input");
  // } else {
  //   h6.classList.remove("visible-input");
  //   h6.classList.add("hidden-input");
  // }
  console.log("isUpdating");
  console.log(isUpdating);
  setTimeout(() => {
    isUpdating = false;
  }, 0);
}

// localStorage 비우기
function Clear() {
  localStorage.clear();
}
LocalStorageClear.addEventListener("click", Clear);

//날짜 동적으로 생성
const monthSave = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const { month } = getClock();
// 현재 월의 총일수
let currentMonthDay = monthSave[month] + 1;

for (let i = 0; i < currentMonthDay; i++) {
  let newTodo = `
                        <div class="days">
                            <i class="fa-regular fa-circle-check"></i>
                            <span>${i}</span>
                        </div>
                        `;

  if (i < 7) {
    FirstWeek.innerHTML += newTodo;
  } else if (i < 14) {
    SecondWeek.innerHTML += newTodo;
  } else if (i < 21) {
    ThirdWeek.innerHTML += newTodo;
  } else if (i < 28) {
    FourthWeek.innerHTML += newTodo;
  } else {
    FifthWeek.innerHTML += newTodo;
  }
}
