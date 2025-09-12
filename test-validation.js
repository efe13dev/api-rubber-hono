// Script para probar la validación de Zod en la API
const API_BASE = "http://localhost:3000";

async function testValidation() {
  console.log("🧪 Probando validación de la API...\n");

  // Test 1: Datos válidos (debería funcionar)
  console.log("✅ Test 1: Datos válidos");
  try {
    const response = await fetch(`${API_BASE}/formulas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "formula-test",
        ingredients: [
          { name: "color-rojo", quantity: 10 },
          { name: "color-azul", quantity: 5 },
        ],
      }),
    });

    console.log(`Status: ${response.status}`);
    const result = await response.json();
    console.log("Response:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.log("Error:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 2: Nombre vacío (debería fallar)
  console.log("❌ Test 2: Nombre vacío (debería fallar)");
  try {
    const response = await fetch(`${API_BASE}/formulas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "",
        ingredients: [{ name: "color", quantity: 5 }],
      }),
    });

    console.log(`Status: ${response.status}`);
    const result = await response.json();
    console.log("Response:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.log("Error:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 3: Ingredientes no es array (debería fallar)
  console.log("❌ Test 3: Ingredientes no es array (debería fallar)");
  try {
    const response = await fetch(`${API_BASE}/formulas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "test-formula",
        ingredients: "not-an-array",
      }),
    });

    console.log(`Status: ${response.status}`);
    const result = await response.json();
    console.log("Response:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.log("Error:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 4: Cantidad negativa (debería fallar)
  console.log("❌ Test 4: Cantidad negativa (debería fallar)");
  try {
    const response = await fetch(`${API_BASE}/formulas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "test-formula",
        ingredients: [{ name: "color", quantity: -5 }],
      }),
    });

    console.log(`Status: ${response.status}`);
    const result = await response.json();
    console.log("Response:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.log("Error:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 5: Campo faltante (debería fallar)
  console.log("❌ Test 5: Campo faltante (debería fallar)");
  try {
    const response = await fetch(`${API_BASE}/formulas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "test-formula",
        // ingredients faltante
      }),
    });

    console.log(`Status: ${response.status}`);
    const result = await response.json();
    console.log("Response:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.log("Error:", error.message);
  }
}

// Ejecutar si se llama directamente
if (typeof window === "undefined") {
  testValidation().catch(console.error);
}
