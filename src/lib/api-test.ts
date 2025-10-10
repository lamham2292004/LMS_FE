// // API Test utility for debugging
// import { apiClient } from "./api";

// export const testApiEndpoints = async () => {
//   console.log("=== API Testing Started ===");
  
//   // Test if we have a token
//   const token = apiClient.getToken();
//   console.log("Current token:", token ? "Present" : "Not present");
  
//   if (!token) {
//     console.log("No token available. Please login first.");
//     return;
//   }

//   try {
//     // Test lecturer profile endpoint
//     console.log("\n--- Testing Lecturer Profile ---");
//     try {
//       const lecturerResponse = await apiClient.getProfile("lecturer");
//       console.log("Lecturer profile response:", lecturerResponse);
//     } catch (error) {
//       console.error("Lecturer profile error:", error);
//     }

//     // Test student profile endpoint
//     console.log("\n--- Testing Student Profile ---");
//     try {
//       const studentResponse = await apiClient.getProfile("student");
//       console.log("Student profile response:", studentResponse);
//     } catch (error) {
//       console.error("Student profile error:", error);
//     }

//     // Test profile without user type (fallback)
//     console.log("\n--- Testing Profile Fallback ---");
//     try {
//       const fallbackResponse = await apiClient.getProfile();
//       console.log("Fallback profile response:", fallbackResponse);
//     } catch (error) {
//       console.error("Fallback profile error:", error);
//     }

//   } catch (error) {
//     console.error("API test failed:", error);
//   }
  
//   console.log("\n=== API Testing Completed ===");
// };

// // Make it available globally for console testing
// if (typeof window !== "undefined") {
//   (window as any).testApiEndpoints = testApiEndpoints;
// }
