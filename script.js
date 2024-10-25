"use strict";
const products = document.querySelectorAll(".product");
const kopa = document.querySelector(".add_kopa");
const toPay = document.querySelector(".total_usd");
const checkout = document.querySelector(".recipt");
const popup = document.querySelector(".popup");
const pay = document.querySelector(".pay");
const mezoman = document.querySelector(".mezoman");
const methods = document.querySelectorAll(".popup_method");
const form = document.querySelector(".form_mezoman");
const deals = document.querySelector(".adddeal");
const totalCalcDay = document.querySelector(".calcday");
const popupDaily = document.querySelector(".daily-trans");
const loginForm = document.querySelector(".login");
const loginBtn = document.querySelector(".login_btn");
const logout_btn = document.querySelector(".logout_btn");
const cashier = document.querySelector(".cashier");
const app = document.querySelector(".app");
const loginName = document.getElementById("user-name");
const password = document.getElementById("password");
const orderMod = document.querySelector(".request");
const done = document.querySelector(".modify-btn");
const modify = document.querySelector(".modify");
kopa.textContent = "";
const data = [];
let id = 0;
let total = 0;
const dailyTrans = [];
let daily = 0;

const users = {
  roee: {
    userName: "roee",
    name: "Roee Marom",
    workingSince: 2015,
    age: 26,
    password: 1234,
  },
  natan: {
    userName: "natan",
    name: "Nathan Shraga",
    workingSince: 2019,
    age: 22,
    password: 5858,
  },
  meir: {
    userName: "meir",
    name: "Meir Shalom",
    workingSince: 2023,
    age: 20,
    password: 2090,
  },
  ronen: {
    userName: "ronen",
    name: "Ronen Alfasi",
    workingSince: 2020,
    age: 24,
    password: 9090,
  },
};

loginBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    loginName.value === users?.[loginName.value]?.userName &&
    password.value == users?.[loginName.value]?.password
  ) {
    app.style.visibility = "visible";
    loginForm.style.visibility = "hidden";
    cashier.style.visibility = "visible";
    cashier.textContent = `Current cashier: ${users[loginName.value].name}`;
  } else {
    alert("invalid username or password");
    loginName.value = "";
    password.value = "";
  }
});

// PRODUCT ADD FUNCTION

const addToKopa = function (product) {
  const name = product.querySelector(".item_name").textContent;
  const price = product.querySelector(".item_price").textContent;
  const markup = `<tr>
  <td class="item_name">${name}</td>
  <td class="item_price">${price}</td>
  <td class='quantity'>
  <button class="btn_qt">-</button>
  <div class="qt">
  1
  </div>
  <button class="btn_qt">+</button>
  </td>
  <td class='subtotal'>${price}</td>
  </tr>`;

  if (data.includes(name)) {
    const subtotal = kopa.children
      .item(data.indexOf(name))
      .querySelector(".subtotal");
    const quantity = kopa.children
      .item(data.indexOf(name))
      .querySelector(".qt");
    quantity.textContent++;
    subtotal.textContent = `$${Number(
      quantity.textContent * price.slice(1, 5)
    ).toFixed(2)}`;
  } else {
    data.push(name);
    kopa.insertAdjacentHTML("beforeend", markup);
  }
  total += Number(price.slice(1, 5));
  toPay.textContent = `$${total.toFixed(2)}`;
};

checkout.addEventListener("click", function (e) {
  if (data.length === 0) {
    e.preventDefault();
  }
});

// PLUS AND MINUS CART

document.addEventListener("click", function (e) {
  if (!e.target.classList.contains("btn_qt")) return;

  const row = e.target.closest("tr");
  const name = row.querySelector(".item_name");
  const quantity = row.querySelector(".qt");
  const price = row.querySelector(".item_price");
  const subtotal = row.querySelector(".subtotal");
  if (e.target.textContent === "+") {
    quantity.textContent++;
    total += Number(price.textContent.slice(1, 5));
    subtotal.textContent = `$${Number(
      quantity.textContent * price.textContent.slice(1, 5)
    ).toFixed(2)}`;
    toPay.textContent = `$${Number(total).toFixed(2)}`;
  }
  if (e.target.textContent === "-" && quantity.textContent != "0") {
    quantity.textContent--;
    total -= Number(price.textContent.slice(1, 5));
    subtotal.textContent = `$${Number(
      quantity.textContent * price.textContent.slice(1, 5)
    ).toFixed(2)}`;
    toPay.textContent = `$${Number(total).toFixed(2)}`;
  }

  if (e.target.textContent === "-" && quantity.textContent === "0") {
    data.splice(
      data.indexOf(name.textContent),
      data.indexOf(name.textContent) + 1
    );
    row.remove();
    if (data.length === 0) {
      toPay.textContent = "";
    }
  }
});

// ADD CART

products.forEach((product) => {
  product.addEventListener("click", function (e) {
    e.preventDefault(); //
    addToKopa(e.target.closest("div"));
  });
});

// CHECKOUT LISTENER

checkout.addEventListener("click", function () {
  mezoman.value = total;
});

pay.addEventListener("click", function (e) {
  const date = new Date();
  const coinsIn = mezoman.value;
  if (!coinsIn || coinsIn === "" || coinsIn < total)
    return alert(
      `The amount to pay is ${toPay.textContent} when you are trying to pay $${coinsIn}`
    );
  alert(`Your change is: ${Number(coinsIn - total).toFixed(2)}`);
  dailyTrans.push({
    id: id + 1,
    date: date,
    amount: total,
    cashier: cashier.textContent.slice(17),
    paymentMethod: document.querySelector(".methodActive").textContent,
  });
  kopa.textContent = "";
  id++;
  data.splice(0, data.length);
  daily += total;
  total = 0;
  toPay.textContent = "";
  mezoman.value = "";
  form.style.visibility = "hidden";
  methods.forEach((method) => {
    method.classList.remove("methodActive");
  });
});

methods.forEach((method) => {
  method.addEventListener("click", function () {
    form.style.visibility = "visible";
    method.classList.add("methodActive");
    const active = method.classList[1].slice(-1);
    const notActive = document.querySelector(
      `.popup_method_${Math.abs(active - 1)}`
    );
    notActive.classList.remove("methodActive");
  });
});

const printDaily = function () {
  for (const trans of dailyTrans) {
    const { date, amount, cashier, id } = trans;
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const sec = date.getSeconds().toString().padStart(2, "0");
    const min = date.getMinutes().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const markup1 = `<tr>
                     <td>${day}, ${month} ${year} ${hour}:${min}:${sec}</td>
                     <td>${id}</td>
                     <td>${cashier}</td>
                     <td>$${amount}</td>
                 </tr>`;
    deals.insertAdjacentHTML("beforeend", markup1);
  }
  const markup2 = `<tfoot>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>Total: $${daily}</td>
                </tr>
            </tfoot>`;
  deals.insertAdjacentHTML("afterend", markup2);
  popupDaily.style.visibility = "visible";
};

totalCalcDay.addEventListener("click", printDaily);

const closeDaily = document.querySelector(".daily-trans .popup_close");
closeDaily.addEventListener("click", function () {
  popupDaily.style.visibility = "hidden";
  deals.textContent = "";
  document.querySelector("tfoot").remove();
});

logout_btn.addEventListener("click", function (e) {
  if (kopa.children.length < 1) {
    loginName.value = "";
    password.value = "";
    cashier.textContent = "";
    cashier.style.visibility = "hidden";
    app.style.visibility = "hidden";
    loginForm.style.visibility = "visible";
  } else {
    alert(`You need to settle the bill with the customer `);
  }
});

orderMod.addEventListener("click", function (e) {
  e.preventDefault();
  modify.style.visibility = "visible";
});

done.addEventListener("click", function (e) {
  modify.style.visibility = "hidden";
});
