
// Node 22+ has built-in fetch!
async function testRegister() {
    try {
        const response = await fetch('http://localhost:3001/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: "Test User",
                email: "test" + Date.now() + "@test.com",
                password: "password123",
                age: 25,
                weight: 70,
                goal: "mantener"
            })
        });

        // Check if the response is JSON
        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            data = text;
        }

        console.log('Status:', response.status);
        console.log('Body:', typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testRegister();
