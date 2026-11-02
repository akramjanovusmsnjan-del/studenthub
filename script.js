
const loginForm = document.getElementById("loginForm");
const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");

const logoutBtn = document.getElementById("logoutBtn");

let students = [];

// 500 ta o'quvchi ro'yxatini yuklash
async function loadStudents() {
    try {
        const response = await fetch("students.csv");

        if (!response.ok) {
            throw new Error("students.csv fayli topilmadi!");
        }

        const csvText = await response.text();

        const lines = csvText.trim().split(/\r?\n/);

        students = lines.slice(1).map(line => {
            const columns = line.split(",");

            return {
                number: columns[0]?.trim(),
                name: columns[1]?.trim(),
                gender: columns[2]?.trim(),
                group: columns[3]?.trim(),
                login: columns[4]?.trim(),
                password: columns[5]?.trim()
            };
        }).filter(student =>
            student.name &&
            student.login &&
            student.password
        );

        console.log("O'quvchilar soni:", students.length);

        if (students.length !== 500) {
            errorMessage.textContent =
                `Ro'yxatda ${students.length} ta o'quvchi topildi. 500 ta bo'lishi kerak.`;
        }

    } catch (error) {
        console.error(error);
        errorMessage.textContent =
            "O'quvchilar ro'yxatini yuklab bo'lmadi. CSV faylini tekshiring.";
    }
}

// Tizimga kirish
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = usernameInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();

    const student = students.find(item =>
        item.login.toLowerCase() === username &&
        item.password === password
    );

    if (!student) {
        errorMessage.textContent = students.length
            ? "Login yoki parol noto'g'ri!"
            : "O'quvchilar ro'yxati hali yuklanmagan!";
        return;
    }

    errorMessage.textContent = "";

    document.getElementById("studentName").textContent = student.name;
    document.getElementById("nameInfo").textContent = student.name;
    document.getElementById("groupInfo").textContent = student.group;
    document.getElementById("groupInfo2").textContent = student.group;
    document.getElementById("genderInfo").textContent = student.gender;
    document.getElementById("numberInfo").textContent = student.number;

    loginScreen.style.display = "none";
    dashboard.style.display = "block";
});

// Tizimdan chiqish
logoutBtn.addEventListener("click", function() {
    dashboard.style.display = "none";
    loginScreen.style.display = "block";

    usernameInput.value = "";
    passwordInput.value = "";
    errorMessage.textContent = "";
});

// Dasturni ishga tushirish
loadStudents();
