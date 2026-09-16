// Employee management system

// Application data
const API_URL = "https://dummyjson.com/users";

let employees = [];
let displayedEmployees = [];
let selectedDepartment = "All";

const employeeContainer = document.getElementById("employeeContainer");
const employeeCount = document.getElementById("employeeCount");
const totalSalary = document.getElementById("totalSalary");
const averageSalary = document.getElementById("averageSalary");
const highestSalary = document.getElementById("highestSalary");
const highestEmployee = document.getElementById("highestEmployee");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const status = document.getElementById("status");
const employeeForm = document.getElementById("employeeForm");
const sortSelect = document.getElementById("sortSelect");

// Date and time display
const displayDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.toLocaleString("en-US", { month: "long" });
    const date = now.getDate();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    let ampm = "AM";

    if (hours >= 12) {
        ampm = "PM";
    }

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    document.getElementById("today").innerHTML = `Today: ${date} ${month} ${year}`;
    document.getElementById("time").innerHTML = `Time: ${hours}:${formattedMinutes} ${ampm}`;
};

displayDateTime();
setInterval(displayDateTime, 1000);

// Load employees from the API
const fetchEmployees = () => {
    status.innerHTML = "Loading employees...";

    fetch(API_URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error("API request failed");
            }

            return response.json();
        })
        .then((data) => {
            employees = data.users.map((user) => ({
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                age: user.age,
                email: user.email,
                phone: user.phone,
                department: getDepartment(user.company.department),
                image: user.image,
                salary: 30000 + user.id * 2000,
            }));

            status.innerHTML = "Employee data loaded successfully.";
            displayEmployees(employees);
        })
        .catch((error) => {
            console.log(error);
            status.innerHTML = "Unable to load employee data. Please try again.";
        })
        .finally(() => {
            console.log("API process completed");
        });
};

    // Convert API departments into application departments
const getDepartment = (department) => {
    const value = department.toLowerCase();

    if (value.includes("engineer")) {
        return "IT";
    }

    if (value.includes("human")) {
        return "HR";
    }

    if (value.includes("finance")) {
        return "Finance";
    }

    if (value.includes("marketing")) {
        return "Marketing";
    }

    return "IT";
};

// Render employee cards
const displayEmployees = (employeeArray) => {
    employeeContainer.innerHTML = "";
    displayedEmployees = employeeArray;

    if (employeeArray.length === 0) {
        employeeContainer.innerHTML = "<p>No employees found.</p>";
        updateEmployeeCount(employeeArray);
        calculateSalary(employeeArray);
        return;
    }

    employeeArray.forEach((employee) => {
        const card = document.createElement("div");
        card.className = "employee-card";

        card.innerHTML = `
            <img src="${employee.image || "https://via.placeholder.com/100"}" alt="${employee.name}">
            <h3>${employee.name}</h3>

            <p><strong>Age:</strong> ${employee.age}</p>
            <p><strong>Email:</strong> ${employee.email}</p>
            <p><strong>Phone:</strong> ${employee.phone || "Not available"}</p>
            <p>
                <strong>Department:</strong>
                <span class="department">${employee.department}</span>
            </p>
            <p><strong>Salary:</strong> ₹${employee.salary.toLocaleString("en-IN")}</p>

            <button class="delete-btn" onclick="deleteEmployee(${employee.id})">Delete</button>
        `;

        employeeContainer.appendChild(card);
    });

    updateEmployeeCount(employeeArray);
    calculateSalary(employeeArray);
};

// Search and filter employees
const searchEmployees = () => {
    const searchValue = searchInput.value.toLowerCase().trim();
    let filteredEmployees = employees;

    if (searchValue !== "") {
        filteredEmployees = employees.filter((employee) =>
            employee.name.toLowerCase().includes(searchValue)
        );
    }

    if (selectedDepartment !== "All") {
        filteredEmployees = filteredEmployees.filter(
            (employee) => employee.department === selectedDepartment
        );
    }

    displayEmployees(filteredEmployees);
};

searchBtn.addEventListener("click", searchEmployees);
searchInput.addEventListener("input", searchEmployees);

// Filter employees by department
const filterDepartment = (department) => {
    selectedDepartment = department;
    searchEmployees();
};

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const department = button.getAttribute("data-department");
        filterDepartment(department);
    });
});

// Update employee count
const updateEmployeeCount = (employeeArray) => {
    employeeCount.innerHTML = employeeArray.length;
};

// Calculate salary statistics
const calculateSalary = (employeeArray) => {
    const total = employeeArray.reduce((sum, employee) => sum + employee.salary, 0);
    let average = 0;

    if (employeeArray.length > 0) {
        average = total / employeeArray.length;
    }

    let highest = null;

    if (employeeArray.length > 0) {
        highest = employeeArray.reduce((max, employee) => {
            if (employee.salary > max.salary) {
                return employee;
            }
            return max;
        });
    }

    totalSalary.innerHTML = `₹${total.toLocaleString("en-IN")}`;
    averageSalary.innerHTML = `₹${Math.round(average).toLocaleString("en-IN")}`;

    if (highest) {
        highestSalary.innerHTML = `₹${highest.salary.toLocaleString("en-IN")}`;
        highestEmployee.innerHTML = `
            <p><strong>Name:</strong> ${highest.name}</p>
            <p><strong>Department:</strong> ${highest.department}</p>
            <p><strong>Salary:</strong> ₹${highest.salary.toLocaleString("en-IN")}</p>
        `;
    } else {
        highestSalary.innerHTML = "₹0";
        highestEmployee.innerHTML = "No employee available";
    }
};

// Add a new employee
const addEmployee = () => {
    const name = document.getElementById("name").value.trim();
    const age = Number(document.getElementById("age").value);
    const email = document.getElementById("email").value.trim();
    const department = document.getElementById("department").value;
    const salary = Number(document.getElementById("salary").value);

    const isValid = validateEmployee(name, age, email, department, salary);

    if (!isValid) {
        return;
    }

    const newEmployee = {
        id: Date.now(),
        name: name,
        age: age,
        email: email,
        phone: "Not available",
        department: department,
        salary: salary,
        image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    };

    employees = [...employees, newEmployee];

    selectedDepartment = "All";
    filterButtons.forEach((button) => button.classList.remove("active"));
    filterButtons[0].classList.add("active");

    displayEmployees(employees);
    clearForm();
};

employeeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addEmployee();
});

// Validate employee form data
const validateEmployee = (name, age, email, department, salary) => {
    let valid = true;

    document.getElementById("nameError").innerHTML = "";
    document.getElementById("ageError").innerHTML = "";
    document.getElementById("emailError").innerHTML = "";
    document.getElementById("departmentError").innerHTML = "";
    document.getElementById("salaryError").innerHTML = "";

    if (name === "") {
        document.getElementById("nameError").innerHTML = "Please enter employee name";
        valid = false;
    }

    if (age <= 18 || isNaN(age)) {
        document.getElementById("ageError").innerHTML = "Age must be greater than 18";
        valid = false;
    }

    if (email === "") {
        document.getElementById("emailError").innerHTML = "Please enter email";
        valid = false;
    }

    if (department === "") {
        document.getElementById("departmentError").innerHTML = "Please select department";
        valid = false;
    }

    if (salary <= 0 || isNaN(salary)) {
        document.getElementById("salaryError").innerHTML = "Please enter valid salary";
        valid = false;
    }

    return valid;
};

// Reset the employee form
const clearForm = () => {
    employeeForm.reset();
};

// Delete an employee
const deleteEmployee = (id) => {
    employees = employees.filter((employee) => employee.id !== id);
    searchEmployees();
};

// Sort the displayed employees
const sortEmployees = (sortType) => {
    let sortedEmployees = [...displayedEmployees];

    if (sortType === "nameAsc") {
        sortedEmployees.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortType === "nameDesc") {
        sortedEmployees.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (sortType === "ageAsc") {
        sortedEmployees.sort((a, b) => a.age - b.age);
    }

    if (sortType === "ageDesc") {
        sortedEmployees.sort((a, b) => b.age - a.age);
    }

    if (sortType === "salaryAsc") {
        sortedEmployees.sort((a, b) => a.salary - b.salary);
    }

    if (sortType === "salaryDesc") {
        sortedEmployees.sort((a, b) => b.salary - a.salary);
    }

    displayEmployees(sortedEmployees);
};

sortSelect.addEventListener("change", () => {
    sortEmployees(sortSelect.value);
});

// Employee helper functions
const findEmployee = (id) => {
    return employees.find((employee) => employee.id === id);
};

const checkDuplicateEmail = (email) => {
    return employees.some((employee) => employee.email === email);
};

const checkAllEmployeesAdults = () => {
    return employees.every((employee) => employee.age > 18);
};

// Start the application
fetchEmployees();