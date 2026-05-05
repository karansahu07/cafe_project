const roles = [
    { id: 1, role: "super_admin" },
    { id: 2, role: "admin" },
    { id: 3, role: "vendor" },
    { id: 4, role: "rider" },
    { id: 5, role: "customer" }
  ];
  
  // Function to get role info by role number
 export function getRolebyid(roleNumber) {
    return roles.find(role => role.id == roleNumber)?.role || "guest";
  }