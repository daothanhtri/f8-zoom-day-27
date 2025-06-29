const editor = document.getElementById("code-editor");
const preview = document.getElementById("preview");
const contextMenu = document.getElementById("custom-context-menu");
const clearCodeButton = document.getElementById("clear-code");

function updatePreview() {
  preview.srcdoc = editor.value;
}

editor.addEventListener("input", updatePreview);

editor.value = `<!DOCTYPE html>
<html>
<head>
    <title>Preview</title>
    <style>
        body {
            font-family: sans-serif;
            padding: 20px;
            background-color: #f0f0f0;
        }
        h1 {
            color: teal;
        }
        p {
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <h1>Chào mừng đến với Live Editor!</h1>
    <p>Nhập code HTML, CSS, hoặc JS vào ô bên trái.</p>
    <p>Thử đổi màu chữ của H1 thành 'blue'!</p>
</body>
</html>`;

updatePreview();

window.addEventListener("beforeunload", function (e) {
  if (editor.value.trim() !== "") {
    e.preventDefault();
    e.returnValue = "";
  }
});

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  showContextMenu(e.clientX, e.clientY);
});

document.addEventListener("click", function (e) {
  if (contextMenu.style.display === "block") {
    if ((e.button === 0 || e.button === 1) && !contextMenu.contains(e.target)) {
      hideContextMenu();
    }
  }
});

document.addEventListener("scroll", function () {
  if (contextMenu.style.display === "block") {
    hideContextMenu();
  }
});

function showContextMenu(x, y) {
  contextMenu.style.display = "block";

  const menuWidth = contextMenu.offsetWidth;
  const menuHeight = contextMenu.offsetHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let finalX = x;
  let finalY = y;

  if (x + menuWidth > viewportWidth) {
    finalX = x - menuWidth;
  }
  finalX = Math.max(0, finalX);

  if (y + menuHeight > viewportHeight) {
    finalY = y - menuHeight;
  }
  finalY = Math.max(0, finalY);

  contextMenu.style.left = `${finalX}px`;
  contextMenu.style.top = `${finalY}px`;
}

function hideContextMenu() {
  contextMenu.style.display = "none";
}

clearCodeButton.addEventListener("click", function () {
  editor.value = "";
  updatePreview();
  hideContextMenu();
});
