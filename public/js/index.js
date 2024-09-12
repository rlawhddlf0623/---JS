const TodoForm = document.querySelector("#login-form");
const TodoInput = TodoForm.querySelector(".Todo-input");
const CreateButton = TodoForm.querySelector("#Todo-create-button");
const RemoveButton = document.querySelector(".Todo-remove-button");
const Todo_Group = document.querySelector("#group");
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

let currentTodo = 0;
let AccessTokenSave = 0;

// Calendar

const monthYearElement = document.getElementById("month-year");
const calendarDatesElement = document.getElementById("calendar-dates");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");

let currentYear = new Date().getFullYear();
let CalendarMonth = new Date().getMonth();
const { day } = formatDate();

// localStorage에서 기존 toDos 배열이 없으면 빈 배열로 초기화
const storedToDos = localStorage.getItem(TODOS_KEY);
let toDos = storedToDos ? JSON.parse(storedToDos) : [monthDay()];

//localStorage에 초기값 세팅
function initialValue() {
  async function syncDataRun() {
    try {
      StatusPendingYesterday();
      await syncData();

      let monthArray = localStorage.getItem("monthCompletionRate");
      console.log("monthArray :", monthArray);
      if (!monthArray) {
        let monthArraySave = arrayInitialization();
        localStorage.setItem(
          "monthCompletionRate",
          JSON.stringify(monthArraySave)
        );
      }

      // localStorage에 todos 값이 있으면 화면에 출력
      const saveToDo = localStorage.getItem(TODOS_KEY);
      let index = 0;

      if (saveToDo) {
        const paresdToDos = JSON.parse(saveToDo);
        console.log(paresdToDos);
        let paresdToDo = paresdToDos.slice(1);
        // paresdToDo.forEach(createToDo);
        const intervalId = setInterval(() => {
          if (index >= paresdToDo.length) {
            clearInterval(intervalId);

            return;
          }
          createToDo(paresdToDo[index]);

          index++;
        }, 150);
      }

      // 페이지 로드 시 로컬 저장소에서 input이 focus되었는지 확인하는값 불러오기
      let inputfocus = localStorage.getItem("inputFocus");
      if (inputfocus === null) {
        inputfocus = 0; // 값이 저장되어 있지 않으면 기본값 0으로 설정
      }

      TodoInput.addEventListener("focus", function () {
        if (inputfocus === 0) {
          inputfocus++;
          localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
          localStorage.setItem("inputFocus", inputfocus);
          localStorage.setItem(INDEX_KEY, JSON.stringify([0]));

          let completionRate = localStorage.getItem("completionRate");
          if (completionRate) {
          }
          localStorage.setItem(
            "completionRate",
            JSON.stringify(getDaysFromDayOfWeekToSunday(dayOfWeek))
          );
        }
      });
    } catch (error) {
      console.error("DB와 localStorage 동기화중 에러:", error);
    }
  }

  syncDataRun();
}
initialValue();

function renderCalendar(year, month) {
  calendarDatesElement.innerHTML = "";

  // 월의 첫날이 무슨요일인지
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  let currentMonth = new Date().getMonth();

  let calendarHTML = "";
  console.log("month", month);
  console.log("currentMonth", currentMonth);

  for (let i = 0; i < firstDay; i++) {
    calendarHTML += `<div></div>`;
  }

  const monthCompletionRate = JSON.parse(
    localStorage.getItem("monthCompletionRate")
  );
  console.log("배열", monthCompletionRate);

  for (let days = 1; days <= lastDate; days++) {
    // if (day == days && month == currentMonth) {
    //   calendarHTML += `<div>
    //                           <span class="calendar-today">
    //                           ${days}
    //                           </span>
    //                      </div>`;
    // } else {
    if (80 <= monthCompletionRate[days - 1]) {
      calendarHTML += `<div id="calendar-color-1">${days}</div>`;
    } else if (40 <= monthCompletionRate[days - 1]) {
      calendarHTML += `<div id="calendar-color-2">${days}</div>`;
    } else if (1 <= monthCompletionRate[days - 1]) {
      calendarHTML += `<div id="calendar-color-3">${days}</div>`;
    } else {
      calendarHTML += `<div>${days}</div>`;
    }
    // }
  }

  calendarDatesElement.innerHTML = calendarHTML;

  monthYearElement.textContent = `${year}년 ${month + 1}월`;
}

function changeMonth(delta) {
  CalendarMonth += delta;
  if (CalendarMonth > 11) {
    CalendarMonth = 0;
    currentYear++;
  } else if (CalendarMonth < 0) {
    CalendarMonth = 11;
    currentYear--;
  }
  renderCalendar(currentYear, CalendarMonth);
}

prevMonthButton.addEventListener("click", () => changeMonth(-1));
nextMonthButton.addEventListener("click", () => changeMonth(1));

// Initial render
renderCalendar(currentYear, CalendarMonth);

// 현재 날짜 출력
function formatDate() {
  const date = new Date();
  const month = date.getMonth(); // 월은 0부터 시작하므로 실제 월보다 1 작은 값이 반환됩니다.
  const day = date.getDate();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = days[date.getDay()];

  return { date, month, day, days, dayOfWeek };
}
function monthDayDayOfWeek() {
  const { month, day, dayOfWeek } = formatDate();
  const todayDate = `${month + 1}/${day}(${dayOfWeek})`;
  Todo_date.innerText = todayDate;
  return todayDate;
}
monthDayDayOfWeek();

function monthDay() {
  const { month, day } = formatDate();
  const monthDay = {
    month: month + 1,
    day: day,
  };

  return monthDay;
}
monthDay();

function currentMonthDays() {
  //날짜 동적으로 생성
  const monthSave = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const { month } = formatDate();
  // 현재 월의 총일수
  let currentMonthDay = monthSave[month] + 1;
  return currentMonthDay;
}

function handleSubmit(e) {
  inputCheck();
  saveIndexPostData(e);
}

// input 유효성검사(공백)
function inputCheck() {
  const todoInput = TodoInput.value;
  if (todoInput == "") {
    alert("공백");
  }
}
TodoForm.addEventListener("submit", handleSubmit);

function saveIndex(todoIndex) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(todoIndex));
}

// submit되면 객체만들어서 배열에 저장 + 화면출력
function saveIndexPostData(e) {
  e.preventDefault();

  const todoInput = TodoInput.value;
  const TodoIndex = JSON.parse(localStorage.getItem(INDEX_KEY));

  TodoIndex[0] = TodoIndex[0] + 1;

  const newTodoObj = {
    todo: todoInput,
    id: TodoIndex[0],
  };

  saveIndex(TodoIndex);
  postData(newTodoObj, AccessTokenSave);
}

// localStorage의 날짜와 현재날짜를 비교해서 다르면 초기화
function dateComparison(newTodo) {
  const localDate = JSON.parse(localStorage.getItem(TODOS_KEY));
  try {
    if (!Array.isArray(localDate) || localDate.length === 0 || !localDate) {
      throw new Error("Invalid localDate format");
    }
    const currentDate = monthDay();

    if (
      localDate[0].month !== currentDate.month ||
      localDate[0].day !== currentDate.day
    ) {
      console.log("초기화 배열:", [monthDay(), newTodo]);

      document.querySelectorAll(".Todo-box ").forEach((container) => {
        container.remove();
      });
      if (!newTodo) {
        localStorage.setItem(TODOS_KEY, JSON.stringify([monthDay()]));
      } else {
        localStorage.setItem(TODOS_KEY, JSON.stringify([monthDay(), newTodo]));
        console.log("입력한 todo", newTodo);
        createToDo(newTodo);
      }

      console.log("localStorage의 todo배열을 초기화");
    }
  } catch (error) {
    console.error("Error parsing localDate or invalid data format:", error);
    console.log("Invalid data, localStorage의 todo배열을 초기화");
    localStorage.removeItem(TODOS_KEY);
    localStorage.setItem(TODOS_KEY, JSON.stringify([monthDay()]));
  }
}
dateComparison();
setInterval(dateComparison, 600000);

let todosToProcess = []; // 처리해야 할 Todo 목록 저장

document.addEventListener("DOMContentLoaded", () => {
  const calendarDatesElement = document.getElementById("calendar-dates");
  calendarDatesElement.addEventListener("click", async (e) => {
    const TodoDate = document.querySelector(".Todo-date");

    const monthYearElement = document.querySelector("#month-year");
    clickYearMonth = monthYearElement.innerText;

    const [year, month] = clickYearMonth.match(/\d+/g);
    const formattedMonth = String(month).padStart(2, "0");
    const calendarClickValue = e.target.innerText;
    const clickDay = calendarClickValue.padStart(2, "0");

    const formattedDate = new Date(`${year}-${formattedMonth}-${clickDay}`);
    // console.log("formattedDate : ", formattedDate);
    let clickDateTodos = await showTodo(formattedDate);
    // console.log("clickDateTodos : ", clickDateTodos);

    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = days[new Date(formattedDate).getDay()];

    // console.log("dayOfWeek", dayOfWeek);

    TodoDate.innerText = `${month}/${calendarClickValue}(${dayOfWeek})`;

    if (clickDateTodos && clickDateTodos.length === 0) {
      alert(`${formattedDate}의 todo가 없습니다.`);
      document.querySelectorAll(".Todo-box ").forEach((container) => {
        container.remove();
      });

      let newTodo = `
          <div style="opacity: 0;height: 0.1px;" class="Todo-box item" >
              <div class="Todo-container" >
                  <div class="Todo-CheckBox Todo-CheckBox-color"></div>
                  <h6 class="Todo-text line-through">무쉰 내용이고~</h6>
                
                  <span class="Todo-remove-button">X</span>
              </div>
              <h6 type="text" class="input" > </h6>   
          </div>
        
              `;
      Todo_Group.innerHTML += newTodo;
    } else if (clickDateTodos === null || clickDateTodos === undefined) {
      alert("배열이 null 또는 undefined입니다.");
    } else {
      document.querySelectorAll(".Todo-box ").forEach((container) => {
        container.remove();
      });

      let newTodo = `
          <div style="opacity: 0;height: 0.1px;" class="Todo-box item" >
              <div class="Todo-container" >
                  <div class="Todo-CheckBox Todo-CheckBox-color"></div>
                  <h6 class="Todo-text line-through">무쉰 내용이고~</h6>
                
                  <span class="Todo-remove-button">X</span>
              </div>
              <h6 type="text" class="input" > </h6>   
          </div>
        
              `;
      Todo_Group.innerHTML += newTodo;

      let index = 0;
      const delay = 100;
      const intervalId = setInterval(() => {
        if (index >= clickDateTodos.length) {
          clearInterval(intervalId); // 모든 요소가 처리되면 인터벌을 클리어
          return;
        }

        createToDo(clickDateTodos[index]);

        index++;
      }, delay);
      console.log("todosToProcess값 보자 : ", todosToProcess);
      const opacity = setInterval(() => {
        if (index >= todosToProcess.length) {
          clearInterval(opacity); // 모든 Todo 처리가 완료되면 인터벌 종료
          return;
        }

        // 순차적으로 opacity 변경
        todosToProcess[index].style.opacity = "1";
        index++;
      }, 100); // 100ms 간격으로 하나씩 처리
    }
  });
});

async function showTodo(clickDate) {
  console.log(clickDate);
  try {
    const response = await fetch(`/showTodo/`, {
      method: "POST",
      body: JSON.stringify({
        clickDate,
      }),
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
      credentials: "include", // 쿠키를 포함한 요청
    });

    if (response.ok) {
      const todos = await response.json();
      // console.log(`${clickDate}일의 todo : ${todos} `);
      return todos;
    } else {
      throw new Error("Failed to delete todo.");
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

// 서버에서 Access token 가져오기
async function AccessToken() {
  try {
    const response = await fetch(`/AccessToken/`, {
      method: "GET",
    });
    if (response.ok) {
      const AccessToken = await response.json();
      console.log(AccessToken);
      AccessTokenSave = AccessToken;
      console.log(`${AccessTokenSave} AccessTokenSave successfully.`);
    } else {
      throw new Error("Failed to delete todo.");
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

// AccessToken();
let index = 0;
// Create
function postData(newTodoObj, AccessTokenSave) {
  console.log(newTodoObj, AccessTokenSave);
  fetch("http://localhost:3000/register", {
    method: "POST",
    body: JSON.stringify({
      ...newTodoObj, // 기존의 newTodoObj 내용 추가
      AccessTokenSave, // AccessTokenSave 추가
    }),
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
    credentials: "include", // 쿠키를 포함한 요청
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json(); // JSON 응답을 처리
    })
    .then((data) => {
      const { newTodo, count, AccessToken } = data;
      // 서버에서 반환된 JSON 데이터 처리
      console.log("AccessToken", AccessToken);
      AccessTokenSave = AccessToken;

      toDos.push(newTodo);
      localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
      console.log("Data saved to localStorage and DB successfully", newTodo);

      createToDo(newTodo);
      dateComparison(newTodo);

      console.log(count);
      currentTodo = count;
      completionRate(currentTodo);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
// Create UI
function createToDo(newTodoObj) {
  if (!newTodoObj || !newTodoObj.id) {
    console.error("Invalid todo object:", newTodoObj);
    return;
  }
  let newTodo;
  if (newTodoObj.status == "completed") {
    //  <div class="Todo-box item" style="order: ${1000 - newTodoObj.id};">
    //  <span class="Todo-important-button">☆</span>
    newTodo = `
                      <div class="Todo-box item">
                          <div class="Todo-container" id="${newTodoObj.id}" data-value="${newTodoObj._id}">
                              <div class="Todo-CheckBox Todo-CheckBox-color"></div>
                              <h6 class="Todo-text line-through">${newTodoObj.todo}</h6>
                             
                              <span class="Todo-remove-button">X</span>
                          </div>
                          <h6 type="text" class="input" > </h6>   
                      </div>
                     
                          `;
  } else {
    // <div class="Todo-box item"  style="order: ${newTodoObj.id};">
    newTodo = `
    <div class="Todo-box item" >
        <div class="Todo-container" id="${newTodoObj.id}" data-value="${newTodoObj._id}">
            <div class="Todo-CheckBox down"></div>
            <h6 class="Todo-text">${newTodoObj.todo}</h6>
          
            <span class="Todo-remove-button">X</span>
        </div>
        <h6 type="text" class="input" > </h6>   
    </div>
   
        `;
  }
  Todo_Group.insertAdjacentHTML("beforeend", newTodo);

  // 새로 추가된 요소를 배열에 저장 (추후 opacity 변경에 사용)
  const addedTodo = Todo_Group.querySelector(".Todo-box:last-child");
  // todosToProcess.push(addedTodo); // 새로 추가된 Todo 요소 저장

  setTimeout(() => {
    addedTodo.style.opacity = "1";
  }, 300);

  TodoInput.value = "";
}

function processTodos() {
  let index = 0;
  console.log("todosToProcess", todosToProcess);
  console.log("todosToProcess", todosToProcess.length);

  const intervalId = setInterval(() => {
    console.log("todosToProcess[index] : ", todosToProcess[index], index);

    if (index >= todosToProcess.length) {
      clearInterval(intervalId); // 모든 Todo 처리가 완료되면 인터벌 종료
      return;
    }
    // 순차적으로 opacity 변경
    todosToProcess[index].style.opacity = "1";
    index++;
  }, 100); // 100ms 간격으로 하나씩 처리
}

// // 모든 Todo를 추가한 후 순차적으로 opacity 변경 실행
// processTodos();

// Delete
async function DeleteData(todoId, AccessTokenSave) {
  console.log("todoId", todoId);
  console.log("AccessTokenSave", AccessTokenSave);
  try {
    const response = await fetch(`/register/${todoId}`, {
      method: "DELETE",
      body: JSON.stringify({ todoId, AccessTokenSave }),
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
      credentials: "include", // 쿠키를 포함한 요청
    });

    if (response.ok) {
      const data = await response.json();
      // console.log("data", data);
      const { count, AccessToken } = data;
      // console.log("count, AccessToken", count, AccessToken);

      currentTodo = count;
      AccessTokenSave = AccessToken;
      completionRate(count);
      console.log(`Todo with ID ${todoId} deleted successfully.`);
    } else {
      throw new Error("Failed to delete todo.");
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

// todo 제거
function TodoRemoveButton(e) {
  if (e.target.classList.contains("Todo-remove-button")) {
    const todoContainer = e.target.closest(".Todo-container");
    const todoBox = e.target.closest(".Todo-box");
    if (todoContainer) {
      //화면
      todoBox.remove();

      // localStorage
      let toDosGet = JSON.parse(localStorage.getItem(TODOS_KEY));
      toDos = toDosGet.filter((toDo) => toDo.id !== todoContainer.id);
      localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));

      // DB
      const todoId = todoContainer.dataset.value;
      DeleteData(todoId, AccessTokenSave);
      // localStorage의 날짜 비교
    }
  }
}
function handleClick(e) {
  TodoRemoveButton(e);
  handleTodoToggle(e);
}
Todo_List.addEventListener("click", handleClick);

//Update
async function updateTodo(todoId, update, AccessTokenSave) {
  console.log("AccessTokenSave", AccessTokenSave);
  if (!todoId || !update) {
    alert("Please provide both Todo ID and new value and AccessTokenSave");
    return;
  }
  console.log(
    "todoId ,update,AccessTokenSave",
    todoId,
    update,
    AccessTokenSave
  );
  try {
    const response = await fetch("/Update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todoId, update, AccessTokenSave }),
    });

    const data = await response.json();
    console.log(data);

    if (data) {
      AccessTokenSave = data;
      console.log(`newAccessToken : ${AccessTokenSave}`);

      Todo_date.addEventListener("click", function () {
        console.log("AccessTokenSave", AccessTokenSave);
      });
    } else {
      console.log("Failed to update todo: " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Update localStorage
function updatelocalStorage(todoId, update) {
  // localStorage
  let localTodos = JSON.parse(localStorage.getItem(TODOS_KEY));
  if (localTodos) {
    console.log(localTodos);
    // 2. 배열을 순회하며 해당 객체의 값을 변경
    localTodos = localTodos.map((toDo) => {
      if (toDo._id === todoId) {
        return { ...toDo, todo: update }; // 새로운 값을 반영하여 객체를 반환
      }
      return toDo; // 다른 객체는 그대로 반환
    });

    localStorage.setItem(TODOS_KEY, JSON.stringify(localTodos));
  }
}

// todo update UI
// 1.<h6> 아래로 내려오는 애니메이션
function toggle(e) {
  console.log("toggle");

  const TodoContainer = e.target.closest(".Todo-container");
  if (!TodoContainer) return;
  const todoId = TodoContainer.getAttribute("data-value");
  if (!todoId) return;
  const todoText = TodoContainer.querySelector(".Todo-text");
  if (!todoText) return;

  if (todoText && e.target == todoText) {
    const h6 = TodoContainer.nextElementSibling;
    h6.className = "hidden-input";

    // Toggle
    if (h6.classList.contains("hidden-input")) {
      h6.classList.remove("hidden-input");
      h6.classList.add("visible-input");
      setTimeout(() => executeAfterDelay(h6, todoText, todoId), 500);
      console.log("toggle down");
    } else {
      h6.classList.remove("visible-input");
      h6.classList.add("hidden-input");
      console.log("toggle up");
    }
  }
}
Todo_List.addEventListener("click", toggle);

// 2.input을 생성해서 h6위치를 넣고 h6숨기고 그 자리에 input 삽입
function executeAfterDelay(h6, todoText, todoId) {
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

  // h6 요소를 숨기고 그 자리에 input 요소 삽입
  h6.parentNode.appendChild(input);

  input.focus();
  setupEventListeners(input, todoText, h6, todoId);
}

// 3.blur,click,change,Enter 발생시 handleUpdate 호출
function setupEventListeners(input, todoText, h6, todoId) {
  console.log("input", input);
  const handleBlur = () => {
    handleUpdate("blur", input, todoText, h6, todoId);
    // blur가 발생하면 click 이벤트 리스너를 제거
    Todo_List.removeEventListener("click", toggle);
    setTimeout(() => {
      Todo_List.addEventListener("click", toggle);
    }, 100);
  };

  const handleClick = () => {
    handleUpdate("click", input, todoText, h6, todoId);
    // click이 발생하면 blur 이벤트 리스너를 제거
    input.removeEventListener("blur", handleBlur);
  };

  const handleChange = () => {
    handleUpdate("change", input, todoText, h6, todoId);
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

// 4.input제거 h6올리기
let isUpdating = false;
function handleUpdate(click, input, todoText, h6, todoId) {
  if (isUpdating) return; // 중복 호출 방지
  isUpdating = true;
  let update = input.value;
  console.log("updateTodo : ", update, "todoId : ", todoId);
  updateTodo(todoId, update, AccessTokenSave);
  updatelocalStorage(todoId, update);
  // 입력 필드의 값을 todoText에 설정
  todoText.textContent = update;
  console.log("발생한 이벤트 : ", click);
  input.remove();

  h6.classList.remove("visible-input");
  h6.classList.add("hidden-input");

  console.log(isUpdating);
  setTimeout(() => {
    isUpdating = false;
  }, 0);
}

// DB와 localStorage 그날의 todo동기화
async function syncData() {
  try {
    const response = await fetch("/syncData");
    const serverData = await response.json();

    // console.log(serverData);
    if (!serverData || serverData.length === 0) {
      console.log("작성된 todo가 없습니다.");
      return;
    }
    serverData.unshift(monthDay());
    localStorage.setItem(TODOS_KEY, JSON.stringify(serverData));
    console.log(serverData);

    document.querySelectorAll(".Todo-box ").forEach((container) => {
      container.remove();
    });
    // let index = 0;
    // let paresdToDo = serverData.slice(1);

    // const intervalId = setInterval(() => {
    //   if (index >= paresdToDo.length) {
    //     clearInterval(intervalId);

    //     return;
    //   }
    //   createToDo(paresdToDo[index]);

    //   index++;
    // }, 150);

    // serverData.shift();
    // console.log(serverData);

    console.log("localStorage와 DB 동기화 완료");

    return serverData;
  } catch (error) {
    console.error("동기화 실패:", error);
  }
}
setInterval(syncData, 3600000);
// syncData();

// State Update ( Completed )
async function updateStatusCompleted(id) {
  try {
    console.log("Completed");
    console.log(id);
    const response = await fetch(
      `http://localhost:3000/updateStatusCompleted/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ AccessTokenSave }),
      }
    );

    if (response.ok) {
      const { updatedTodo, newAccessToken } = await response.json();
      AccessTokenSave = newAccessToken;
      console.log("AccessTokenSave", AccessTokenSave);
      console.log("Status updated:", updatedTodo);
    } else if (response.status === 404) {
      // 404 오류에 대한 별도 처리
      console.error("Todo not found");
    } else if (response.status === 400) {
      console.error("Invalid ID");
    } else {
      // 기타 오류 처리
      throw new Error(`Failed to update status: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
// State Update ( Pending )
async function updateStatusPending(id) {
  try {
    console.log("Pending");
    console.log(id);
    const response = await fetch(
      `http://localhost:3000/updateStatusPending/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ AccessTokenSave }),
      }
    );

    if (response.ok) {
      const { updatedTodo, newAccessToken } = await response.json();
      AccessTokenSave = newAccessToken;
      console.log("AccessTokenSave", AccessTokenSave);
      console.log("Status updated:", updatedTodo);
    } else {
      throw new Error("Failed to update status");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// 어제 완료되지 못한 todo 가져오기
async function StatusPendingYesterday() {
  try {
    const response = await fetch(
      `http://localhost:3000/StatusPendingYesterday/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ AccessTokenSave }),
      }
    );

    if (response.ok) {
      const { newAccessToken } = await response.json();
      AccessTokenSave = newAccessToken;
      console.log("AccessTokenSave", AccessTokenSave);

      // local저장

      // 화면 출력
    } else {
      throw new Error("Failed to update status");
    }
  } catch (error) {
    console.error(error);
  }
}

// Read (오늘 todo수 반환)
async function getCurrentTodo() {
  try {
    const response = await fetch("http://localhost:3000/getCurrentTodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (response.ok) {
      const data = await response.json();

      console.log("오늘 총 todo 개수 : ", data);
      currentTodo = data;
      completionRate(data);
    } else {
      throw new Error("Failed to load data from DB");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
// 오늘 KST -> UTC
function getTodayKST() {
  // 현재 날짜를 기준으로 할 때, 날짜를 문자열로 변환
  const now = new Date();
  // KST 자정을 UTC로 변환 (당일 00:00 KST)
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );
  // console.log("startOfDay", startOfDay);
  const startOfDayUTC = new Date(startOfDay.getTime() - 9 * 60 * 60 * 1000);
  // startOfDayUTC.setHours(startOfDayUTC.getHours() - 9); // UTC로 변환
  console.log("startOfDayUTC", startOfDayUTC);
  // KST 다음날 자정 직전 UTC로 변환 (당일 23:59:59 KST)
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );
  // console.log("endOfDay;", endOfDay);
  // endOfDayUTC.setHours(endOfDayUTC.getHours() - 9); // UTC로 변환
  const endOfDayUTC = new Date(endOfDay.getTime() - 9 * 60 * 60 * 1000);
  console.log("endOfDayUTC;", endOfDayUTC);

  return { startOfDayUTC, endOfDayUTC };
}
getTodayKST();

// 완료한 todo 개수 가져오기
async function getDoneTodo() {
  try {
    const response = await fetch("http://localhost:3000/getDoneTodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("오늘 완료한 todo 개수 : ", data.completedCount);
      return data.completedCount;
    } else {
      throw new Error("Failed to load data from DB");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// DoneTodo UI
function handleTodoToggle(e) {
  const targetTodo = e.target.closest(".Todo-container");

  if (!targetTodo) {
    console.error("Target Todo not found");
    return;
  }
  let Objectid = targetTodo.dataset.value;
  if (!Objectid) {
    console.error("Target Todo not found");
    return;
  }
  const newTodoObjId = targetTodo.id;

  if (!newTodoObjId) {
    console.error("Target Todo has no valid ID");
    return;
  }
  const todoText = targetTodo.querySelector(".Todo-text");
  const UserText = todoText.textContent;
  if (!UserText) {
    console.error("No valid text content found in Todo-text");
    return;
  }
  if (e.target.classList.contains("Todo-CheckBox")) {
    console.log("targetTodo.id", newTodoObjId);
    console.log("e.target", e.target);

    const newTodo = document.createElement("div");
    newTodo.classList.add("opacity");
    newTodo.classList.add("Todo-box");
    newTodo.classList.add("item");

    // newTodo.style.order = e.target.classList.contains("down")
    //   ? 1000 - newTodoObjId
    //   : newTodoObjId;

    newTodo.innerHTML = `
                          <div  class="Todo-container" id="${newTodoObjId}" data-value="${Objectid}">
                              <div class="Todo-CheckBox"></div>
                              <h6 class="Todo-text">${UserText}</h6>
                              
                              <span class="Todo-remove-button">X</span>
                          </div>
                          <h6 type="text" class="input" > </h6>
      `;

    const newTodoText = newTodo.querySelector(".Todo-text");
    const newTodoCheck = newTodo.querySelector(".Todo-CheckBox");

    if (e.target.classList.contains("down")) {
      newTodoText.classList.add("line-through");
      newTodoCheck.classList.add("Todo-CheckBox-color");
      newTodoCheck.classList.remove("down");
      updateStatusCompleted(Objectid);
      updateTodoStatusById(newTodoObjId, "completed");
    } else {
      newTodoText.classList.remove("line-through");
      newTodoCheck.classList.remove("Todo-CheckBox-color");
      newTodoCheck.classList.add("down");
      updateStatusPending(Objectid);
      updateTodoStatusById(newTodoObjId, "Pending");
    }
    Todo_Group.appendChild(newTodo);

    e.target.remove();

    const parentTodoBox = targetTodo.closest(".Todo-box");
    parentTodoBox.remove();
    getCurrentTodo();
    // completionRate(currentTodo);
  }
}
function updateTodoStatusById(targetId, newStatus) {
  const saveToDo = localStorage.getItem(TODOS_KEY);
  const todos = JSON.parse(saveToDo);
  console.log("targetId, newStatus : ", targetId, newStatus);
  console.log("todos : ", todos);
  // 대상 객체를 찾기 위해 배열을 탐색
  for (let todo of todos) {
    if (todo.id === targetId) {
      // 객체의 status를 변경
      todo.status = newStatus;
      localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
      console.log("status update");
      break;
    } else {
      console.log(`일치하는 todo를 찾기 위해 배열 돌리는중`);
    }
  }
}

// 외부 라이브러리
// 1.Sortable :Drag & Drop 이동
new Sortable(group, {
  animation: 150,
  // onEnd: function (evt) {
  //   window.requestAnimationFrame(() => {
  //     const sortedItems = evt.from.children;
  //     Array.from(sortedItems).forEach((item, index) => {
  //       item.style.order = index + 1;
  //     });
  //   });
  // },
});

// function initializeOrder() {
//   const items = Array.from(container.children);
//   items.sort((a, b) => parseInt(a.style.order) - parseInt(b.style.order));
//   items.forEach((item, index) => {
//     container.appendChild(item); // Append in the correct order
//   });
// }

// initializeOrder(); //

function arrayInitialization() {
  let currentMonthDay = currentMonthDays();
  const completionRateArray = Array(currentMonthDay - 1).fill(0);
  return completionRateArray;
}

// 매일 호출하고 월이 변경된 경우 배열초기화
setInterval(() => {
  const now = new Date();
  const lastMonth = JSON.parse(localStorage.getItem(TODOS_KEY))[0].month;
  const currentMonth = now.getMonth();

  if (lastMonth !== currentMonth) {
    arrayInitialization();
  }
}, 24 * 60 * 60 * 1000);

// 주단위로 배열에 잘라서 넣어줌
const chartArray = [];
function getDaysFromDayOfWeekToSunday(dayOfWeek) {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  console.log("이번달 1일의 요일:", days[dayOfWeek]);

  const completionRateArray = arrayInitialization();
  let FirstWeek = [];
  let secondWeek = [];
  let thirdWeek = [];
  let fourthWeek = [];
  let fifthWeek = [];
  let sixthWeek = [];

  if (dayOfWeek == 0) {
    console.log("첫째주 배열에 담길 index개수", 7 - dayOfWeek);
  } else {
    console.log("첫째주 배열에 담길 index개수", 8 - dayOfWeek);
  }

  FirstWeek = completionRateArray.slice(0, 8 - dayOfWeek);
  secondWeek = completionRateArray.slice(8 - dayOfWeek, 15 - dayOfWeek);
  thirdWeek = completionRateArray.slice(15 - dayOfWeek, 22 - dayOfWeek);
  fourthWeek = completionRateArray.slice(22 - dayOfWeek, 29 - dayOfWeek);
  fifthWeek = completionRateArray.slice(29 - dayOfWeek, 36 - dayOfWeek);
  sixthWeek = completionRateArray.slice(36 - dayOfWeek, 43 - dayOfWeek);

  chartArray.push(
    FirstWeek,
    secondWeek,
    thirdWeek,
    fourthWeek,
    fifthWeek,
    sixthWeek
  );

  console.log(chartArray);

  return chartArray;
}

function getFirstDayOfMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  return firstDay.getDay();
}

const dayOfWeek = getFirstDayOfMonth();
// const daysArray = getDaysFromDayOfWeekToSunday(dayOfWeek);

function completionRateSaveDB(weeksArray) {
  console.log(weeksArray, AccessTokenSave);
  fetch("http://localhost:3000/completionRateSaveDB", {
    method: "POST",
    body: JSON.stringify({ weeksArray, AccessTokenSave }),
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
      AccessTokenSave = data.newAccessToken;
      console.log(
        `completionRate :${data.completionRate},AccessTokenSave:${data.newAccessToken}`
      );
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// 현재 몇째주인지 index를 반환(index +1)
function currentWeekIndex() {
  const today = new Date();
  const currentWeekIndexNumber = Math.floor(
    (today.getDate() +
      new Date(today.getFullYear(), today.getMonth(), 1).getDay() -
      1) /
      7
  );
  console.log(`이번주는 ${currentWeekIndexNumber}째주 입니다.`);
  return currentWeekIndexNumber;
}

// %를 이번 주 배열에 오늘 날짜에 맞게 local저장
function updateTodayValue(value) {
  const today = new Date();
  const currentWeekIndexNumber = currentWeekIndex();
  const dayOfWeek = today.getDay(); // 오늘의 요일 (0=일요일, 6=토요일)
  const weeksArray = JSON.parse(localStorage.getItem("completionRate"));

  // 오늘 날짜에 해당하는 배열 요소 업데이트
  if (dayOfWeek == 0) {
    weeksArray[currentWeekIndexNumber][dayOfWeek + 6] = value;
  } else {
    weeksArray[currentWeekIndexNumber][dayOfWeek - 1] = value;
  }

  localStorage.setItem("completionRate", JSON.stringify(weeksArray));
  // DB에 weeksArray저장
  completionRateSaveDB(weeksArray);
  console.log(weeksArray[currentWeekIndexNumber]);
  return weeksArray[currentWeekIndexNumber];
}

function a() {
  const weeksArray = JSON.parse(localStorage.getItem("completionRate"));
  const tmpArray = [
    [13, 35, 89, 34, 12, 55, 200],
    [13, 35, 89, 34, 12, 55, 200],
    [13, 35, 89, 34, 12, 55, 200],
    [13, 35, 89, 34, 12, 55, 200],
    [13, 35, 89, 34, 12, 55, 200],
    [13, 35, 89, 34, 12, 55, 200],
  ];
  if (weeksArray) {
    console.log(weeksArray);
    return weeksArray;
  } else {
    // DB에서 completionRate데이터 가져오기
    console.log(tmpArray);
    return tmpArray;
  }
}
const weeksArray = a();

const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["월", "화", "수", "목", "금", "토", "일"],
    datasets: [
      {
        label: "완료한 Todo",
        data: weeksArray[currentWeekIndex()],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  },
});

// if % change chart update
function completionRate(currentTodo) {
  console.log("currentTodo : ", currentTodo);

  getDoneTodo().then((completedCount) => {
    console.log("Completed Todo Count :", completedCount);

    // const completionRateArray = JSON.parse(
    //   localStorage.getItem("completionRate")
    // );
    // if (Array.isArray(completionRateArray)) {
    let completionRateTodo = Math.floor(100 * (completedCount / currentTodo));
    console.log(completionRateTodo);

    let monthArray = JSON.parse(localStorage.getItem("monthCompletionRate"));
    console.log("monthArray :", monthArray);
    let dayofWeek = new Date().getDate();
    monthArray[dayofWeek - 1] = completionRateTodo;
    localStorage.setItem("monthCompletionRate", JSON.stringify(monthArray));
    // 한달단위로 저장
    // const { day } = formatDate();
    const dayArray = updateTodayValue(completionRateTodo);
    // 현재 날짜(day)에 해당하는 인덱스에 값을 설정
    // if (day >= 0 && day < completionRateArray.length) {
    //   completionRateArray[day - 1] = completionRateTodo;
    // } else {
    //   console.error("Invalid day value:", day);
    // }

    // localStorage.setItem("completionRate", JSON.stringify(completionRateArray));

    // const todaysDay = new Date().getDay();
    // // console.log(todaysDay)
    // if (todaysDay != 0) {
    //   daysArray[3][todaysDay - 1] = completionRateTodo;
    // }
    // daysArray[3][todaysDay + 6] = completionRateTodo;
    // } else {
    //   console.error("Retrieved data is not an array:", completionRateArray);
    // }

    // 차트 데이터를 업데이트
    // myChart.data.datasets[0].data = chartData;
    // myChart.data.datasets[0].data = daysArray[weekOfMonth - 1];
    myChart.data.datasets[0].data = dayArray;
    // 차트를 다시 그림
    myChart.update();

    // let currentYear = new Date().getFullYear();
    // let CalendarMonth = new Date().getMonth();
    renderCalendar(currentYear, CalendarMonth);
  });
}
