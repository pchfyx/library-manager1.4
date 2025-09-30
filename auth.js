// Simulated user database
const users = JSON.parse(localStorage.getItem('webmailer_users') || '{}');

// Helper to save users
function saveUsers() {
    localStorage.setItem('webmailer_users', JSON.stringify(users));
}

// Generate a fake verification token
function generateToken() {
    return Math.random().toString(36).substr(2, 12);
}

// Modal helpers
function openModal(id) {
    document.getElementById(id).style.display = 'block';
}
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Registration
document.getElementById('registerForm').onsubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const password = document.getElementById('registerPassword').value;
    const errorDiv = document.getElementById('registerError');
    errorDiv.textContent = '';
    if (users[email]) {
        errorDiv.textContent = 'Account already exists.';
        return;
    }
    const token = generateToken();
    users[email] = { password, verified: false, token };
    saveUsers();
    closeModal('registerModal');
    // Simulate sending email by showing the link
    document.getElementById('verificationText').innerHTML =
        `A verification link has been sent to your email.<br>
        <a href="#" onclick="verifyEmail('${email}','${token}');return false;">Click here to verify</a>`;
    openModal('verificationMessage');
};

// Verification
window.verifyEmail = function(email, token) {
    if (users[email] && users[email].token === token) {
        users[email].verified = true;
        saveUsers();
        document.getElementById('verificationText').textContent = 'Email verified! You can now log in.';
        setTimeout(() => {
            closeModal('verificationMessage');
            openModal('loginModal');
        }, 1500);
    } else {
        document.getElementById('verificationText').textContent = 'Invalid verification link.';
    }
};

// Login
document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = '';
    if (!users[email]) {
        errorDiv.textContent = 'Account not found.';
        return;
    }
    if (users[email].password !== password) {
        errorDiv.textContent = 'Password incorrect.';
        return;
    }
    if (!users[email].verified) {
        errorDiv.textContent = 'Email not verified. Please check your email for the verification link.';
        return;
    }
    closeModal('loginModal');
    alert('Login successful!');
};
