document.addEventListener("DOMContentLoaded", () => {
  const addEmployeeButton = document.getElementById("addEmployeeButton");
  const modalCloseButton = document.getElementById("modalCloseButton");
  const employeeForm = document.getElementById("employeeForm");
  const deleteCancelButton = document.getElementById("deleteCancelButton");

  addEmployeeButton.addEventListener("click", () => openModal());
  modalCloseButton.addEventListener("click", closeModal);
  deleteCancelButton.addEventListener("click", () =>
    document.getElementById("deleteModal").classList.add("hidden")
  );

  employeeForm.addEventListener("submit", function (event) {
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
      dob: dob,
    };

    if (this.hasAttribute("data-employee-id")) {
      const employeeId = this.getAttribute("data-employee-id");
      updateEmployee(formData, employeeId)
        .then(() => {
          console.log("Employee updated successfully");
        })
        .catch((error) => {
          console.error("Error updating employee:", error);
        });
    } else {
      addEmployee(formData)
        .then(() => {
          console.log("Employee added successfully");
        })
        .catch((error) => {
          console.error("Error adding employee:", error);
        });
    }
  });

  // Fetch employees initially when the page loads
  fetchEmployees()
    .then(() => {
      document.getElementById("employeeContainer").classList.remove("hidden");
    })
    .catch((error) => {
      console.error("Error fetching employees initially:", error);
    });

  function fetchEmployees() {
    return new Promise((resolve, reject) => {
      console.log("Fetching employees");
      fetch("https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error fetching employees");
          }
          return response.json();
        })
        .then((employees) => {
          console.log("Employees fetched:", employees);
          displayEmployees(employees);
          resolve(employees);
        })
        .catch((error) => {
          console.error("Error fetching employees:", error);
          reject(error);
        });
    });
  }

  function displayEmployees(employees) {
    const container = document.getElementById("employeeContainer");
    container.innerHTML = "";

    employees.forEach((emp) => {
      const card = createEmployeeCard(emp);
      container.appendChild(card);
    });
  }

  function createEmployeeCard(employee) {
    const card = document.createElement("div");
    card.classList.add("employee-card");

    const detailsContainer = document.createElement("div");
    detailsContainer.classList.add("employee-details");

    const nameContainer = document.createElement("div");
    nameContainer.classList.add("employee-detail");
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Name:";
    const nameField = document.createElement("input");
    nameField.classList.add("emp-name");
    nameField.type = "text";
    nameField.value = employee.name;
    nameField.disabled = true;
    nameContainer.appendChild(nameLabel);
    nameContainer.appendChild(nameField);
    detailsContainer.appendChild(nameContainer);

    const designationContainer = document.createElement("div");
    designationContainer.classList.add("employee-detail");
    const designationLabel = document.createElement("label");
    designationLabel.textContent = "Designation:";
    const designationField = document.createElement("input");
    designationField.classList.add("emp-designation");
    designationField.type = "text";
    designationField.value = employee.designation;
    designationField.disabled = true;
    designationContainer.appendChild(designationLabel);
    designationContainer.appendChild(designationField);
    detailsContainer.appendChild(designationContainer);

    const dobContainer = document.createElement("div");
    dobContainer.classList.add("employee-detail");
    const dobLabel = document.createElement("label");
    dobLabel.textContent = "Date of Birth:";
    const dobField = document.createElement("input");
    dobField.classList.add("emp-dob");
    dobField.type = "text";
    dobField.value = new Date(employee.dob).toLocaleDateString("en-GB");
    dobField.disabled = true;
    dobContainer.appendChild(dobLabel);
    dobContainer.appendChild(dobField);
    detailsContainer.appendChild(dobContainer);

    card.appendChild(detailsContainer);

    const actions = document.createElement("div");
    actions.classList.add("card-actions");

    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.textContent = "Edit";
    editButton.onclick = () => openModal(employee);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => openDeleteModal(employee.id);

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    card.appendChild(actions);

    return card;
  }

  function openModal(employee = null) {
    const modal = document.getElementById("modal");
    const form = document.getElementById("employeeForm");
    const designationSelect = form.elements.empDesignation;

    if (employee) {
      form.elements.empName.value = employee.name;

      const designationOptions = [
        "Software Engineer",
        "Software Developer",
        "Software Tester",
        "Software Architect",
        "Software Analyst",
      ];
      designationSelect.innerHTML = "";
      designationOptions.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.textContent = option;
        optionElement.value = option;
        designationSelect.appendChild(optionElement);
      });

      designationSelect.value = employee.designation;
      form.elements.empDob.value = new Date(employee.dob)
        .toISOString()
        .substring(0, 10);
      form.setAttribute("data-employee-id", employee.id);
    } else {
      form.reset();

      const designationOptions = [
        "Software Engineer",
        "Software Developer",
        "Software Tester",
        "Software Architect",
        "Software Analyst",
      ];
      designationSelect.innerHTML = "";
      designationOptions.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.textContent = option;
        optionElement.value = option;
        designationSelect.appendChild(optionElement);
      });

      form.removeAttribute("data-employee-id");
    }

    modal.classList.remove("hidden");
  }

  function closeModal() {
    document.getElementById("modal").classList.add("hidden");
  }

  function validateField(value) {
    const re = /^(?!\s*$)[a-zA-Z\s]+$/;
    return re.test(value);
  }

  function validateName(name) {
    if (!validateField(name)) {
      alert("Invalid Name Entry.");
      return false;
    }
    return true;
  }

  function validateDesignation(designation) {
    if (!validateField(designation)) {
      alert("Invalid Designation Entry.");
      return false;
    }
    return true;
  }

  function addEmployee(formData) {
    return new Promise((resolve, reject) => {
      fetch("https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error adding employee");
          }
          return response.json();
        })
        .then((data) => {
          fetchEmployees();
          closeModal();
          resolve(data);
        })
        .catch((error) => {
          console.error("Error adding employee:", error);
          reject(error);
        });
    });
  }

  function updateEmployee(formData, id) {
    return new Promise((resolve, reject) => {
      fetch(
        `https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error updating employee");
          }
          return response.json();
        })
        .then((data) => {
          fetchEmployees();
          closeModal();
          resolve(data);
        })
        .catch((error) => {
          console.error("Error updating employee:", error);
          reject(error);
        });
    });
  }

  function openDeleteModal(id) {
    const deleteModal = document.getElementById("deleteModal");
    deleteModal.classList.remove("hidden");

    const deleteConfirmButton = document.getElementById("deleteConfirmButton");
    deleteConfirmButton.onclick = () => {
      deleteEmployee(id)
        .then(() => {
          console.log("Employee deleted successfully");
          deleteModal.classList.add("hidden");
        })
        .catch((error) => {
          console.error("Error deleting employee:", error);
        });
    };
  }

  function deleteEmployee(id) {
    return new Promise((resolve, reject) => {
      fetch(
        `https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee/${id}`,
        {
          method: "DELETE",
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error deleting employee");
          }
          resolve();
          fetchEmployees();
        })
        .catch((error) => {
          console.error("Error deleting employee:", error);
          reject(error);
        });
    });
  }
});