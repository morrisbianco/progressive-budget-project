let db;

const request = window.indexedDB.open("TransactionDB", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  
  const TransactionStore = db.createObjectStore("TransactionStore", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkData();
  }
};

request.onerror = function (event) {
  console.log(error);
};

function saveRecord(record) {
  const db = request.result;
  const transaction = db.transaction(["TransactionStore"], "readwrite");
  const TransactionStore = transaction.objectStore("TransactionStore");

  TransactionStore.add(record);
  console.log(record);
};

function checkData() {
  const db = request.result;
  const transaction = db.transaction(["TransactionStore"], "readwrite");
  const TransactionStore = transaction.objectStore("TransactionStore");

  const getData = TransactionStore.getAll();

  getData.onsuccess = function () {
    if (getData.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getData.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then(() => {
        const transaction = db.transaction(["TransactionStore"], "readwrite");
        const TransactionStore = transaction.objectStore("TransactionStore");
        TransactionStore.clear();
      });
    }
  };
};

window.addEventListener("online", checkData);