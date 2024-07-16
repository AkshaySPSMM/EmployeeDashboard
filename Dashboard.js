document.addEventListener('DOMContentLoaded', () => {
    const fetchDataButton = document.getElementById('fetchDataButton');
    const addEmployeeButton = document.getElementById('addEmployeeButton');
    const modalCloseButton = document.getElementById('modalCloseButton');
  
    fetchDataButton.addEventListener('click', toggleFetchData);
    addEmployeeButton.addEventListener('click', () => openModal());
    modalCloseButton.addEventListener('click', closeModal);
  });
  
  let isDataFetched = false;
  
  function toggleFetchData() {
    const employeeContainer = document.getElementById('employeeContainer');
    if (isDataFetched) {
        employeeContainer.classList.add('hidden');
        employeeContainer.innerHTML = '';
    } else {
        fetchEmployees();
        employeeContainer.classList.remove('hidden');
    }
    isDataFetched = !isDataFetched;
  }
  
  function fetchEmployees() {
    fetch('https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee')
        .then(response => response.json())
        .then(employees => displayEmployees(employees))
        .catch(error => console.error('Error fetching employees:', error));
  }
  
  function displayEmployees(employees) {
    const container = document.getElementById('employeeContainer');
    container.innerHTML = '';
  
    const template = document.getElementById('employeeCardTemplate');
  
    employees.forEach(emp => {
        const clone = document.importNode(template.content, true);
  
        const nameField = clone.querySelector('.emp-name');
        nameField.value = emp.name;
  
        const designationField = clone.querySelector('.emp-designation');
        designationField.value = emp.designation;
  
        const dobField = clone.querySelector('.emp-dob');
        dobField.value = new Date(emp.dob).toLocaleDateString();
  
        const editButton = clone.querySelector('.edit-button');
        editButton.onclick = () => openModal(emp);
  
        const deleteButton = clone.querySelector('.delete-button');
        deleteButton.onclick = () => deleteEmployee(emp.id);
  
        container.appendChild(clone);
    });
  }
  
  function openModal(employee = null) {
    const modal = document.getElementById('modal');
    const form = document.getElementById('employeeForm');
  
    if (employee) {
        form.empName.value = employee.name;
        form.empDesignation.value = employee.designation;
        form.empDob.value = new Date(employee.dob).toISOString().substring(0, 10);
        form.onsubmit = (event) => updateEmployee(event, employee.id);
    } else {
        form.reset();
        form.onsubmit = handleFormSubmit;
    }
  
    modal.classList.remove('hidden');
  }
  
  function closeModal() {
    document.getElementById('modal').classList.add('hidden');
  }
  
  function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const newEmployee = {
        name: form.empName.value,
        designation: form.empDesignation.value,
        dob: form.empDob.value
    };
  
    fetch('https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEmployee)
    })
    .then(() => {
        fetchEmployees();
        closeModal();
    })
    .catch(error => console.error('Error adding employee:', error));
  }
  
  function updateEmployee(event, id) {
    event.preventDefault();
    const form = event.target;
    const updatedEmployee = {
        name: form.empName.value,
        designation: form.empDesignation.value,
        dob: form.empDob.value
    };
  
    fetch(`https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedEmployee)
    })
    .then(() => {
        fetchEmployees();
        closeModal();
    })
    .catch(error => console.error('Error updating employee:', error));
  }
  
  function deleteEmployee(id) {
    fetch(`https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchEmployees())
    .catch(error => console.error('Error deleting employee:', error));
  }