document.addEventListener('DOMContentLoaded', () => {
  const fetchDataButton = document.getElementById('fetchDataButton');
  const addEmployeeButton = document.getElementById('addEmployeeButton');
  const modalCloseButton = document.getElementById('modalCloseButton');
  const employeeForm = document.getElementById('employeeForm');

  fetchDataButton.addEventListener('click', toggleFetchData);
  addEmployeeButton.addEventListener('click', () => openModal());
  modalCloseButton.addEventListener('click', closeModal);

  employeeForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = this.elements.empName.value;
    const designation = this.elements.empDesignation.value;
    const dob = this.elements.empDob.value;

    if (!validateName(name) || !validateDesignation(designation)) {
      return false;
    }

    const formData = {
      name: name,
      designation: designation,
      dob: dob
    };

    if (this.hasAttribute('data-employee-id')) {
      const employeeId = this.getAttribute('data-employee-id');
      updateEmployee(formData, employeeId);
    } else {
      addEmployee(formData);
    }
  });

  // Toggle fetching data
  function toggleFetchData() {
    const employeeContainer = document.getElementById('employeeContainer');
    if (employeeContainer.classList.contains('hidden')) {
      fetchEmployees();
      employeeContainer.classList.remove('hidden');
    } else {
      employeeContainer.classList.add('hidden');
      employeeContainer.innerHTML = '';
    }
  }

  // Fetch employees
  function fetchEmployees() {
    console.log('Fetching employees');
    fetch('https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee')
      .then(response => response.json())
      .then(employees => {
        console.log('Employees fetched:', employees);
        displayEmployees(employees);
      })
      .catch(error => console.error('Error on fetching employees:', error));
  }

  // Display employees
  function displayEmployees(employees) {
    const container = document.getElementById('employeeContainer');
    container.innerHTML = '';

    employees.forEach(emp => {
      const card = createEmployeeCard(emp);
      container.appendChild(card);
    });
  }

  function createEmployeeCard(employee) {
    const card = document.createElement('div');
    card.classList.add('employee-card');

    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('employee-details');

    // Name field
    const nameContainer = document.createElement('div');
    nameContainer.classList.add('employee-detail');
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name:';
    const nameField = document.createElement('input');
    nameField.classList.add('emp-name');
    nameField.type = 'text';
    nameField.value = employee.name;
    nameField.disabled = true;
    nameContainer.appendChild(nameLabel);
    nameContainer.appendChild(nameField);
    detailsContainer.appendChild(nameContainer);

    // Designation field
    const designationContainer = document.createElement('div');
    designationContainer.classList.add('employee-detail');
    const designationLabel = document.createElement('label');
    designationLabel.textContent = 'Designation:';
    const designationField = document.createElement('input');
    designationField.classList.add('emp-designation');
    designationField.type = 'text';
    designationField.value = employee.designation;
    designationField.disabled = true;
    designationContainer.appendChild(designationLabel);
    designationContainer.appendChild(designationField);
    detailsContainer.appendChild(designationContainer);

    // Dob field
    const dobContainer = document.createElement('div');
    dobContainer.classList.add('employee-detail');
    const dobLabel = document.createElement('label');
    dobLabel.textContent = 'Date of Birth:';
    const dobField = document.createElement('input');
    dobField.classList.add('emp-dob');
    dobField.type = 'text';
    dobField.value = new Date(employee.dob).toLocaleDateString();
    dobField.disabled = true;
    dobContainer.appendChild(dobLabel);
    dobContainer.appendChild(dobField);
    detailsContainer.appendChild(dobContainer);

    card.appendChild(detailsContainer);

    const actions = document.createElement('div');
    actions.classList.add('card-actions');

    const editButton = document.createElement('button');
    editButton.classList.add('edit-button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => openModal(employee);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => {
      if (confirm('Do you want to delete this employee?')) {
        deleteEmployee(employee.id);
      }
    };

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    card.appendChild(actions);

    return card;
  }

  // Open modal
  function openModal(employee = null) {
    const modal = document.getElementById('modal');
    const form = document.getElementById('employeeForm');

    if (employee) {
      form.elements.empName.value = employee.name;
      form.elements.empDesignation.value = employee.designation;
      form.elements.empDob.value = new Date(employee.dob).toISOString().substring(0, 10);
      form.setAttribute('data-employee-id', employee.id);
    } else {
      form.reset();
      form.removeAttribute('data-employee-id');
    }

    modal.classList.remove('hidden');
  }

  // Close modal
  function closeModal() {
    document.getElementById('modal').classList.add('hidden');
  }

  // Validate name and designation
  function validateField(value) {
    const re = /^[a-zA-Z\s]+$/;
    return re.test(value);
  }

  // Validate name
  function validateName(name) {
    if (!validateField(name)) {
      alert('Name must contain only alphabets.');
      return false;
    }
    return true;
  }

  // Validate designation
  function validateDesignation(designation) {
    if (!validateField(designation)) {
      alert('Designation must contain only alphabets.');
      return false;
    }
    return true;
  }

  // Add employee
  function addEmployee(formData) {
    fetch('https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(() => {
        fetchEmployees();
        closeModal();
      })
      .catch(error => console.error('Error on adding employee:', error));
  }

  // Update Employee
  function updateEmployee(formData, id) {
    fetch(`https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(() => {
        fetchEmployees();
        closeModal();
      })
      .catch(error => console.error('Error on updating employee:', error));
  }

  // Delete Employee
  function deleteEmployee(id) {
    fetch(`https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee/${id}`, {
      method: 'DELETE'
    })
      .then(() => fetchEmployees())
      .catch(error => console.error('Error on deleting employee:', error));
  }
});
