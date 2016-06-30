window.onload = function() {
  var calculator = document.querySelector("#calculator");
  calculator.addEventListener("click", handleClick, false);
};

function handleClick(e) {

  var input = document.querySelector('#input');
  var btnVal = e.target.innerHTML;

  switch (btnVal) {
    case "C":
      input.value = "";
      break;
    case "=":
      input.value = eval(input.value);
      break;
    case "%":
      input.value = input.value / 100;
      break;
    default:
      input.value += btnVal;
      break;
  }
}
