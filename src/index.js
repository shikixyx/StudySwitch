const ipcRenderer = window.ipcRenderer;
const app = window.app;


const button = document.querySelector('.btn-circle-3d');

button.addEventListener('click', function (clickEvent) {
    ipcRenderer.send("click", "click");
})