let studentRecords = [];

document.addEventListener('DOMContentLoaded', () => {
    loadStoredData();
    loadStoredTheme();
    document.getElementById('studentForm').addEventListener('submit', addStudent);
});

/**
 * 2-Theme Toggle (Royal Blue & Forest Green)
 */
function toggleTheme() {
    document.body.classList.toggle('green-theme');
    const isGreen = document.body.classList.contains('green-theme');
    const themeBtn = document.getElementById('themeToggleBtn');
    
    if (themeBtn) {
        themeBtn.innerHTML = isGreen 
            ? '<span class="theme-icon">💙</span> Switch to Blue Theme' 
            : '<span class="theme-icon">🌿</span> Switch to Green Theme';
    }

    localStorage.setItem('selectedTheme', isGreen ? 'green' : 'blue');
}

function loadStoredTheme() {
    const savedTheme = localStorage.getItem('selectedTheme');
    const themeBtn = document.getElementById('themeToggleBtn');

    if (savedTheme === 'green') {
        document.body.classList.add('green-theme');
        if (themeBtn) themeBtn.innerHTML = '<span class="theme-icon">💙</span> Switch to Blue Theme';
    }
}

/**
 * Calculations & Functions
 */
function validateForm(studentName, regNo, programming, maths, english, database, networks) {
    if (!studentName || !regNo || isNaN(programming) || isNaN(maths) || isNaN(english) || isNaN(database) || isNaN(networks)) {
        alert("Please fill in all required fields.");
        return false;
    }

    const marks = [programming, maths, english, database, networks];
    for (let mark of marks) {
        if (mark < 0 || mark > 100) {
            alert("Error: Marks must be between 0 and 100.");
            return false;
        }
    }

    const exists = studentRecords.some(r => r.regNo.toLowerCase() === regNo.toLowerCase());
    if (exists) {
        alert(`Error: Registration Number '${regNo}' already exists.`);
        return false;
    }

    return true;
}

function calculateTotal(p, m, e, d, n) {
    return p + m + e + d + n;
}

function calculatePercentage(total) {
    return parseFloat(((total / 500) * 100).toFixed(2));
}

function calculateGrade(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
}

function checkStatus(p, m, e, d, n) {
    return (p < 40 || m < 40 || e < 40 || d < 40 || n < 40) ? 'Fail' : 'Pass';
}

function addStudent(event) {
    event.preventDefault();

    const studentName = document.getElementById('studentName').value.trim();
    const regNo = document.getElementById('regNo').value.trim();
    const programming = parseFloat(document.getElementById('programming').value);
    const maths = parseFloat(document.getElementById('maths').value);
    const english = parseFloat(document.getElementById('english').value);
    const database = parseFloat(document.getElementById('database').value);
    const networks = parseFloat(document.getElementById('networks').value);

    if (!validateForm(studentName, regNo, programming, maths, english, database, networks)) return;

    const total = calculateTotal(programming, maths, english, database, networks);
    const percentage = calculatePercentage(total);
    const grade = calculateGrade(percentage);
    const status = checkStatus(programming, maths, english, database, networks);

    studentRecords.push({ regNo, studentName, programming, maths, english, database, networks, total, percentage, grade, status });
    saveToLocalStorage();
    renderTable(studentRecords);
    updateDashboardStats();

    document.getElementById('studentForm').reset();
}

function calculateClassAverage() {
    if (studentRecords.length === 0) return 0;
    const sum = studentRecords.reduce((acc, s) => acc + s.percentage, 0);
    return (sum / studentRecords.length).toFixed(1);
}

function renderTable(records) {
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = '';

    if (records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" style="text-align: center; color: var(--text-muted);">No records available.</td></tr>`;
        return;
    }

    records.forEach(s => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${s.regNo}</strong></td>
            <td>${s.studentName}</td>
            <td>${s.programming}</td>
            <td>${s.maths}</td>
            <td>${s.english}</td>
            <td>${s.database}</td>
            <td>${s.networks}</td>
            <td><strong>${s.total}</strong></td>
            <td>${s.percentage}%</td>
            <td><span class="badge badge-grade-${s.grade}">${s.grade}</span></td>
            <td><span class="badge badge-status-${s.status}">${s.status}</span></td>
            <td><button class="btn btn-delete" onclick="deleteStudent('${s.regNo}')">Delete</button></td>
        `;
        tbody.appendChild(row);
    });
}

function deleteStudent(regNo) {
    if (confirm(`Delete student record '${regNo}'?`)) {
        studentRecords = studentRecords.filter(s => s.regNo !== regNo);
        saveToLocalStorage();
        renderTable(studentRecords);
        updateDashboardStats();
    }
}

function updateDashboardStats() {
    document.getElementById('totalStudents').innerText = studentRecords.length;
    document.getElementById('classAverage').innerText = `${calculateClassAverage()}%`;
    
    const topScorerEl = document.getElementById('topScorer');
    if (studentRecords.length === 0) {
        topScorerEl.innerText = 'N/A';
    } else {
        const top = studentRecords.reduce((max, s) => s.percentage > max.percentage ? s : max);
        topScorerEl.innerText = `${top.studentName} (${top.percentage}%)`;
    }
}

function searchStudents() {
    const q = document.getElementById('searchInput').value.trim().toLowerCase();
    renderTable(studentRecords.filter(s => s.regNo.toLowerCase().includes(q)));
}

function sortStudentsByPercentage() {
    studentRecords.sort((a, b) => b.percentage - a.percentage);
    saveToLocalStorage();
    renderTable(studentRecords);
}

function clearAllStudents() {
    if (studentRecords.length === 0) return;
    if (confirm("Clear all student records?")) {
        studentRecords = [];
        localStorage.removeItem('studentRecords');
        renderTable(studentRecords);
        updateDashboardStats();
    }
}

function saveToLocalStorage() {
    localStorage.setItem('studentRecords', JSON.stringify(studentRecords));
}

function loadStoredData() {
    const data = localStorage.getItem('studentRecords');
    if (data) studentRecords = JSON.parse(data);
    renderTable(studentRecords);
    updateDashboardStats();
}