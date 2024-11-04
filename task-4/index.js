
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionList = document.getElementById('transaction-list');
const totalBalance = document.getElementById('total-balance');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const filterOptions = document.querySelectorAll('input[name="filter"]');


let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let editTransactionId = null;


function addTransaction(e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());
  const type = typeInput.value;

  if (description && !isNaN(amount)) {
    if (editTransactionId) {
     
      transactions = transactions.map(transaction =>
        transaction.id === editTransactionId
          ? { ...transaction, description, amount, type }
          : transaction
      );
      editTransactionId = null;
    } else {
     
      const transaction = {
        id: Date.now(),
        description,
        amount,
        type
      };
      transactions.push(transaction);
    }

    updateLocalStorage();
    renderTransactions();
    updateTotals();

  
    descriptionInput.value = '';
    amountInput.value = '';
  }
}


function renderTransactions(filter = 'all') {
  transactionList.innerHTML = '';

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'income') return transaction.type === 'income';
    if (filter === 'expense') return transaction.type === 'expense';
    return true;
  });

  filteredTransactions.forEach(transaction => {
    const li = document.createElement('li');
    li.classList.add('flex', 'justify-between', 'p-2', 'border-b');

    li.innerHTML = `
      <span>${transaction.description} - ${transaction.type}</span>
      <span>${transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}</span>
      <div>
        <button onclick="editTransaction(${transaction.id})" class="p-1 px-2 rounded mr-2 bg-green-500 text-white">Edit
</button>

        <button onclick="deleteTransaction(${transaction.id})" class="bg-red-500 text-white p-1 rounded">Delete</button>
      </div>
    `;
    transactionList.appendChild(li);
  });
}


function updateTotals() {
  const income = transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);
  
  const expenses = transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  totalIncome.textContent = `₹${income.toFixed(2)}`;
  totalExpense.textContent = `₹${expenses.toFixed(2)}`;
  totalBalance.textContent = `₹${(income - expenses).toFixed(2)}`;
}


function deleteTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  renderTransactions();
  updateTotals();
}



function editTransaction(id) {
  const transaction = transactions.find(transaction => transaction.id === id);
  if (transaction) {
    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;
    typeInput.value = transaction.type;
    editTransactionId = transaction.id;
  }
}


function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}


filterOptions.forEach(option => {
  option.addEventListener('change', function () {
    renderTransactions(this.value);
  });
});


renderTransactions();
updateTotals();


form.addEventListener('submit', addTransaction);
