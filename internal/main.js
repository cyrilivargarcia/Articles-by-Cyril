var blockNum = -1;
var elementBody = $("#elementbody");
var previewBody = $("#previewbody");
var thread = {};

var firebaseConfig = {
  apiKey: "AIzaSyC7ppADXgTCbapJWJho57NZpukEfVUvha4",
  authDomain: "articles-by-cyril.firebaseapp.com",
  databaseURL: "https://articles-by-cyril.firebaseio.com",
  projectId: "articles-by-cyril",
  storageBucket: "articles-by-cyril.appspot.com",
  messagingSenderId: "228302831585",
  appId: "1:228302831585:web:f643e53f43a24cf5b75ca0",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
var database = firebase.database();

function init() {
  // authenticate();
}

function authenticate() {
  //   prettier-ignore
  firebase.auth().signInWithEmailAndPassword("admin@admin.com", "123321").then(function(succ) {
    $("#toolbar").show();
    console.log(succ)
  }).catch(function (err) {
    $("#toolbar").hide();
    console.log(err)
  });
}

function addHeader() {
  blockNum += 1;
  //   prettier-ignore
  elementBody.append("<input class='element' id='header-" + blockNum + "' placeholder='Header'></input>");
}

function addBody() {
  blockNum += 1;
  //   prettier-ignore
  elementBody.append("<textarea class='element' id='body-" + blockNum + "' placeholder='Body'></textarea>");
}

function addCode() {
  blockNum += 1;
  //   prettier-ignore
  elementBody.append("<textarea class='element' id='code-" + blockNum + "' placeholder='Code'></textarea>");
}

var firstBody = "";
function preview() {
  var content = "";
  thread = {};

  document.getElementById("previewbody").innerHTML = "";
  // prettier-ignore
  let elements = document.getElementById("elementbody").querySelectorAll("input, textarea");
  console.log(elements.length);
  for (var i = 0; i < elements.length; i++) {
    var value = elements[i].value;
    let id = elements[i].id;
    let type = id.split("-")[0];

    if (type == "body") {
      content += "<p>" + value + "</p>";
    } else if (type == "code") {
      content += "<pre><code>" + value + "</code></pre>";
    } else if (type == "header") {
      content += "<h3>" + value + "</h3>";
    }
  }

  var articleTitle = document.getElementById("title").value;
  var subtitle = document.getElementById("subtitle").value;
  var firstBody = document.getElementById("body-0").value;
  let title = createTitle(articleTitle, subtitle);
  let category = document.getElementById("category").value;

  let preview = createHomePagePreview(articleTitle, firstBody, subtitle);
  var ts = Math.round(new Date().getTime() / 1000);
  content = title + content;

  thread = {
    content: content,
    title: articleTitle,
    preview: preview,
    timestamp: ts,
    category: category,
  };
}

function timestamp() {
  // prettier-ignore
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = months[today.getMonth()];
  var yyyy = today.getFullYear();

  let t = yyyy + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + dd;
  let todayStr = mm + " " + dd + ", " + yyyy;

  return [todayStr, t, today];
}

function post() {
  preview();
  if (confirm("Confirm to Post!")) {
    let value = document.getElementById("title").value;
    database.ref(dash(value)).set(thread);
  }
}

function createFooter(articleId) {
  return `<footer><ul class='actions'><li><a href='view.html?${articleId}' class='button large'>Continue Reading</a></li></ul></footer>`;
}

function createHomePagePreview(title, body, subtitle) {
  var preview = "<article class='post'>";
  let articleTitle = createTitle(title, subtitle);
  let footer = createFooter(dash(title)) + "</article>";

  preview = articleTitle + "<p>" + body + "</p>" + footer;

  return preview;
}

function dash(value) {
  var articleTitle = "";
  for (var x in value) {
    let c = value.charAt(x);
    if (c == " ") {
      articleTitle += "-";
    } else {
      articleTitle += c;
    }
  }
  return articleTitle;
}

init();
