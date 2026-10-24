const API_URL = "https://szig0qfkk0.execute-api.ap-south-1.amazonaws.com/prod";

const POST_URL = API_URL + "/post";
const GET_URL = API_URL + "/get";

document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("savestudent");
    const loadButton = document.getElementById("getstudents");
    const tableBody = document.getElementById("studentTableBody");
    const messageBox = document.getElementById("message");
    const countBox = document.getElementById("studentCount");

    function showMessage(message, isError) {
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.style.display = "block";
            messageBox.style.color = isError ? "red" : "green";
        } else {
            alert(message);
        }
    }

    function getResponseData(data) {
        if (typeof data === "string") {
            data = JSON.parse(data);
        }

        if (data && typeof data.body === "string") {
            data = JSON.parse(data.body);
        } else if (data && data.body && typeof data.body === "object") {
            data = data.body;
        }

        return data;
    }

    if (saveButton) {
        saveButton.addEventListener("click", async function (event) {
            event.preventDefault();

            const studentId = document.getElementById("studentid").value.trim();
            const name = document.getElementById("name").value.trim();
            const studentClass = document.getElementById("class").value.trim();
            const age = Number(document.getElementById("age").value);

            if (!studentId || !name || !studentClass || !Number.isInteger(age) || age <= 0) {
                showMessage("Enter a valid Student ID, Name, Class and Age.", true);
                return;
            }

            saveButton.disabled = true;

            try {
                const response = await fetch(POST_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        student_id: studentId,
                        name: name,
                        class: studentClass,
                        age: age
                    })
                });

                const text = await response.text();
                let data;

                try {
                    data = getResponseData(text);
                } catch (error) {
                    throw new Error("Invalid API response. Check the POST Lambda logs.");
                }

                if (!response.ok || data.error) {
                    throw new Error(data.error || data.message || "HTTP " + response.status);
                }

                showMessage(data.message || "Student saved successfully.", false);

                document.getElementById("studentid").value = "";
                document.getElementById("name").value = "";
                document.getElementById("class").value = "";
                document.getElementById("age").value = "";

                if (loadButton) {
                    loadButton.click();
                }
            } catch (error) {
                console.error("Save error:", error);
                showMessage("Unable to save student: " + error.message, true);
            } finally {
                saveButton.disabled = false;
            }
        });
    }

    if (loadButton) {
        loadButton.addEventListener("click", async function (event) {
            event.preventDefault();

            loadButton.disabled = true;

            if (tableBody) {
                tableBody.textContent = "";
                const row = document.createElement("tr");
                const cell = document.createElement("td");
                cell.colSpan = 4;
                cell.textContent = "Loading students...";
                row.appendChild(cell);
                tableBody.appendChild(row);
            }

            try {
                const response = await fetch(GET_URL, {
                    method: "GET"
                });

                const text = await response.text();
                let data;

                try {
                    data = getResponseData(text);
                } catch (error) {
                    throw new Error("Invalid API response. Check the GET Lambda logs.");
                }

                if (!response.ok || data.error) {
                    throw new Error(data.error || data.message || "HTTP " + response.status);
                }

                const students = Array.isArray(data)
                    ? data
                    : (data.students || data.Items || data.items);

                if (!Array.isArray(students)) {
                    throw new Error("GET Lambda must return an array of students or an object containing students.");
                }

                if (tableBody) {
                    tableBody.textContent = "";

                    if (students.length === 0) {
                        const row = document.createElement("tr");
                        const cell = document.createElement("td");
                        cell.colSpan = 4;
                        cell.textContent = "No students found.";
                        row.appendChild(cell);
                        tableBody.appendChild(row);
                    } else {
                        students.forEach(function (student) {
                            const row = document.createElement("tr");

                            ["student_id", "name", "class", "age"].forEach(function (key) {
                                const cell = document.createElement("td");
                                cell.textContent = student[key] == null ? "" : String(student[key]);
                                row.appendChild(cell);
                            });

                            tableBody.appendChild(row);
                        });
                    }
                }

                if (countBox) {
                    countBox.textContent = String(students.length);
                }

                showMessage("Student list loaded successfully.", false);
            } catch (error) {
                console.error("Load error:", error);

                if (tableBody) {
                    tableBody.textContent = "";
                }

                showMessage("Unable to load students: " + error.message, true);
            } finally {
                loadButton.disabled = false;
            }
        });
    }
});