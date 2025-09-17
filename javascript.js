document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const userForm = document.getElementById('userForm');
    const userTableBody = document.getElementById('userTableBody');
    const noUsersMessage = document.getElementById('noUsersMessage');
    const userCount = document.getElementById('userCount');
    
    let editingId = null;
    
    // Initialize the application
    loadUsers();
    
    // Form submission handler
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        
        if (editingId) {
            // Update existing user
            updateUser(editingId, name, email, phone);
            editingId = null;
        } else {
            // Create new user
            addUser(name, email, phone);
        }
        
        // Reset the form
        userForm.reset();
    });
    
    // Load users from localStorage
    function loadUsers() {
        const users = getUsers();
        displayUsers(users);
    }
    
    // Get users from localStorage
    function getUsers() {
        const usersJSON = localStorage.getItem('crudUsers');
        return usersJSON ? JSON.parse(usersJSON) : [];
    }
    
    // Save users to localStorage
    function saveUsers(users) {
        localStorage.setItem('crudUsers', JSON.stringify(users));
    }
    
    // Add a new user
    function addUser(name, email, phone) {
        const users = getUsers();
        const newUser = {
            id: Date.now(), // Unique ID
            name,
            email,
            phone
        };
        
        users.push(newUser);
        saveUsers(users);
        displayUsers(users);
        
        // Show success message
        alert('User added successfully!');
    }
    
    // Update an existing user
    function updateUser(id, name, email, phone) {
        const users = getUsers();
        const index = users.findIndex(user => user.id === id);
        
        if (index !== -1) {
            users[index] = { id, name, email, phone };
            saveUsers(users);
            displayUsers(users);
            
            // Show success message
            alert('User updated successfully!');
        }
    }
    
    // Delete a user
    function deleteUser(id) {
        if (confirm('Are you sure you want to delete this user?')) {
            const users = getUsers();
            const filteredUsers = users.filter(user => user.id !== id);
            saveUsers(filteredUsers);
            displayUsers(filteredUsers);
            
            // Show success message
            alert('User deleted successfully!');
        }
    }
    
    // Edit a user
    function editUser(id) {
        const users = getUsers();
        const user = users.find(user => user.id === id);
        
        if (user) {
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('phone').value = user.phone;
            
            editingId = id;
            
            // Scroll to form
            document.getElementById('userForm').scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
    
    // Display users in the table
    function displayUsers(users) {
        userTableBody.innerHTML = '';
        
        if (users.length === 0) {
            noUsersMessage.style.display = 'block';
            userCount.textContent = '0 Users';
        } else {
            noUsersMessage.style.display = 'none';
            userCount.textContent = `${users.length} Users`;
            
            users.forEach(user => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone || 'N/A'}</td>
                    <td class="action-buttons">
                        <button class="btn btn-sm btn-warning" onclick="editUser(${user.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                `;
                
                userTableBody.appendChild(row);
            });
        }
    }
    
    // Make functions global for onclick attributes
    window.editUser = editUser;
    window.deleteUser = deleteUser;
});