// 로그인 시스템 대신 임시방편
let username = prompt("아이디를 입력하세요");
let roomNum = prompt("채팅방 번호를 입력하세요");
document.querySelector("#username").innerHTML = username;

// SSE 연결하기
const eventSource = new EventSource(
  `http://localhost:8080/chat/roomNum/${roomNum}`
);
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.sender === username) {
    // 로그인한 유저가 보낸 메세지
    // 파란박스 (오른쪽)
    initMyMessage(data);
  } else {
    // 회색박스 (왼쪽)
    initYourMessage(data);
  }
};

// 파란박스 만들기
function getSendMsgBox(data) {
  let md = data.createAt.substring(5, 10);
  let tm = data.createAt.substring(11, 16);
  convertTime = tm + "|" + md;
  return `<div class="sent_msg">
        <p>${data.msg}</p>
        <span class="time_date"> ${convertTime} / ${data.sender}</span>
    </div>`;
}

// 회색박스 만들기
function getReceiveMsgBox(data) {
  let md = data.createAt.substring(5, 10);
  let tm = data.createAt.substring(11, 16);
  convertTime = tm + "|" + md;
  return `<div class="received_withd_msg">
  <p>${data.msg}</p>
  <span class="time_date"> ${convertTime} / ${data.sender}</span>
</div>`;
}

// 최초 초기화될 때 1번방 3건 있으면 3건 다가져옴
// addMessage() 호출 되면 DB에 insert 되고 그 데이터가 자동으로 흘러들어옴(SSE)
function initMyMessage(data) {
  let chatBox = document.querySelector("#chat-box");
  // let msgInput = document.querySelector("#chat-outgoing-msg");
  let sendBox = document.createElement("div");
  sendBox.className = "outgoing_msg";
  sendBox.innerHTML = getSendMsgBox(data);
  chatBox.append(sendBox);
  // msgInput.value = "";
  // 메세지 박스 추가될때마다 스크롤 내려주기
  document.documentElement.scrollTop = document.body.scrollHeight;
}
function initYourMessage(data) {
  let chatBox = document.querySelector("#chat-box");
  let receivedBox = document.createElement("div");
  receivedBox.className = "received_msg";
  receivedBox.innerHTML = getReceiveMsgBox(data);
  chatBox.append(receivedBox);
  document.documentElement.scrollTop = document.body.scrollHeight;
}
// init message 에서 append 해주기 때문에 chat박스 필요 x
// date format 필요 x
// fetch 후 응답 받을 필요 x
// 결국 db에 insert 만 하면 됨
// AJAX 채팅 메시지 전송
async function addMessage() {
  // let chatBox = document.querySelector("#chat-box");
  let msgInput = document.querySelector("#chat-outgoing-msg");
  // let chatOutgoingBox = document.createElement("div");
  // chatOutgoingBox.className = "outgoing_msg";
  // let date = new Date();
  // let now =
  //   date.getHours() +
  //   ":" +
  //   date.getMinutes() +
  //   " | " +
  //   date.getMonth() +
  //   "/" +
  //   date.getDate();

  let chat = {
    sender: username,
    roomNum: roomNum,
    msg: msgInput.value,
  };
  // let response = await fetch("http://localhost:8080/chat", {
  //   method: "post",
  //   body: JSON.stringify(chat), // JS -> JSON
  //   headers: {
  //     "Content-Type": "application/json; charset=utf-8",
  //   },
  // });
  await fetch("http://localhost:8080/chat", {
    method: "post",
    body: JSON.stringify(chat), // JS -> JSON
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  // console.log(response);

  // let parseResponse = await response.json();

  // console.log(parseResponse);

  // chatOutgoingBox.innerHTML = getSendMsgBox(msgInput.value, now);
  // chatBox.append(chatOutgoingBox);
  msgInput.value = "";
}

document
  .querySelector("#chat-outgoing-button")
  .addEventListener("click", () => {
    // alert("클릭됨");
    addMessage();
  });

document
  .querySelector("#chat-outgoing-msg")
  .addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
      addMessage();
    }
  });
